/**
 * Google Apps Script Web App backing the COR-SYS diagnostic form.
 *
 * Setup:
 *   1. Create a Google Sheet (or reuse one). The form rows land in a tab named
 *      "Leads" if it exists; otherwise the first non-"Config" tab is used, so
 *      an existing sheet keeps working without splitting your data.
 *   2. Extensions → Apps Script. Replace the default Code.gs with this file.
 *   3. Set NOTIFY_EMAIL below (or "" to disable email alerts).
 *   4. Deploy → New deployment → Type: Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *      Authorize when prompted. If you enabled NOTIFY_EMAIL, the first run will
 *      ask for an extra "send email as you" permission — approve it.
 *   5. Copy the /exec URL into VITE_APPS_SCRIPT_URL (GitHub Actions secret) and
 *      keep the SECRET_TOKEN below in sync with VITE_APPS_SCRIPT_SECRET.
 *
 * Live spots-left counter (change the number without redeploying):
 *   - Add a tab named "Config". Cell A1: a label for yourself. Cell B1: the
 *     number of remaining spots. The site reads B1 live via ?action=spots.
 *   - If the Config tab or B1 is missing/blank, the site falls back to its
 *     static "up to 10 clients a month" line, so nothing breaks.
 *   - Cell B2 holds a freshness stamp, written automatically when B1 changes.
 *     The site shows a number only while that stamp is recent; past the window
 *     it shows the static line instead, so an unmaintained cell can never turn
 *     into a false scarcity claim.
 *   - When the count has NOT changed but is still accurate, refresh the stamp
 *     from the "COR-SYS → אישור מספר המקומות" menu. Re-typing the same value
 *     into B1 does nothing: Sheets fires no edit event when the committed value
 *     is unchanged.
 *
 * To redeploy after editing: Deploy → Manage deployments → edit the existing
 * deployment and pick "New version" (otherwise the old code keeps serving).
 */

// Must match VITE_APPS_SCRIPT_SECRET in the frontend. Spam deterrent only —
// the value ships in the frontend bundle, so it is NOT real authentication.
const SECRET_TOKEN = "5e197f8f78d12cdd1e2bb77cc1dd44e9";

// Upper bound on monthly spots — also the fallback when Config!B1 is unset.
const MONTHLY_CAP = 10;

// Where leads are written, and the tab that holds the spots number.
const LEADS_SHEET = "Leads";
const CONFIG_SHEET = "Config";

// Email to notify on every new lead. Set to "" to disable notifications.
const NOTIFY_EMAIL = "Erez2812345@gmail.com";

// Cap on notification emails per day. The form endpoint is public, so a flood
// of submissions must not exhaust the daily MailApp quota and silence real
// alerts. Leads are still written to the sheet regardless of this cap.
const MAX_NOTIFICATIONS_PER_DAY = 50;

// Appending to this list is safe: existing sheets keep their columns and the
// new ones fill from the next submission onward. Do NOT reorder — rows are
// written by mapping this array, so a reorder shifts historical columns.
const HEADERS = [
  "submittedAt",
  "fullName",
  "email",
  "phone",
  "stage",
  "challenge",
  "preferredTimes",
  // Which CTA the visitor came through (hero / mid_cta / sticky / sequence /
  // full_package / wizard). Previously unrecoverable: most leads read
  // "(נקבע בשיחה)" for stage with no way to tell where they entered.
  "source",
  // The stage-recommender answers, which the site collected and then dropped.
  "wizardAnswers",
  "wizardOpenText",
  // "no_active_practice" when the screening question came back negative.
  // Never blocks a submit — it prioritises follow-up.
  "screeningFlag",
];

/**
 * Cell holding the timestamp of the last spots-count edit. Written
 * automatically by onEdit() below; the site stops showing a live count once it
 * goes stale, so an unmaintained number can't turn into a false scarcity
 * claim.
 */
const SPOTS_STAMP_CELL = "B2";

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Normalize a value for a single cell: arrays become a readable list. */
function cell(value) {
  if (Array.isArray(value)) return value.join(" · ");
  return value === undefined || value === null ? "" : value;
}

/**
 * Reads the remaining-spots number from the "Config" tab, cell B1.
 * Clamped to [0, MONTHLY_CAP]. Returns MONTHLY_CAP if the tab/cell is absent.
 */
function getSpotsLeft() {
  var config = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_SHEET);
  if (config) {
    var v = config.getRange("B1").getValue();
    if (typeof v === "number" && !isNaN(v)) {
      return Math.max(0, Math.min(MONTHLY_CAP, Math.round(v)));
    }
  }
  return MONTHLY_CAP;
}

/**
 * When the spots count was last edited, as an ISO string, or null if never
 * stamped. The site treats a missing or old stamp as "don't show a number".
 *
 * Note the spreadsheet's own last-modified time is useless here: doPost appends
 * a row on every lead, so it refreshes constantly while B1 goes stale.
 */
function getSpotsUpdatedAt() {
  var config = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_SHEET);
  if (!config) return null;
  var v = config.getRange(SPOTS_STAMP_CELL).getValue();
  if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString();
  if (typeof v === "string" && v) {
    var parsed = new Date(v);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

/** Writes the freshness stamp. Shared by the edit trigger and the menu. */
function stampSpotsCount() {
  var config = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_SHEET);
  if (!config) return null;
  var now = new Date();
  config.getRange(SPOTS_STAMP_CELL).setValue(now);
  return now;
}

/**
 * Simple trigger: stamps SPOTS_STAMP_CELL whenever the spots count (B1) is
 * edited by hand, so freshness is tracked without the operator having to
 * remember a second cell. Simple triggers need no installation.
 *
 * Covers the common case — the number actually changing as spots fill. It does
 * NOT cover re-entering the same value: Sheets fires no edit event when the
 * committed value is identical to what was already there. That is what the
 * custom menu below is for; without it the only way to refresh the stamp on an
 * unchanged count was to change B1 and change it back, which briefly published
 * a wrong number to the live site.
 */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var sheet = e.range.getSheet();
    if (sheet.getName() !== CONFIG_SHEET) return;
    if (e.range.getA1Notation() !== "B1") return;
    stampSpotsCount();
  } catch (err) {
    console.error("onEdit stamp failed: " + err);
  }
}

/**
 * Adds a COR-SYS menu on open. Simple trigger, no installation needed.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("COR-SYS")
    .addItem("אישור מספר המקומות (רענון חותמת)", "confirmSpotsCount")
    .addToUi();
}

/**
 * Menu action: confirms the current spots count is still accurate today,
 * without touching the number itself. Use this when the count has not changed
 * but is still correct — otherwise it goes stale after
 * SPOTS_STALE_AFTER_DAYS (see src/lib/spots.ts) and the site falls back to the
 * static availability line.
 */
function confirmSpotsCount() {
  var ui = SpreadsheetApp.getUi();
  var stamped = stampSpotsCount();
  if (!stamped) {
    ui.alert('לא נמצאה לשונית "' + CONFIG_SHEET + '" — החותמת לא עודכנה.');
    return;
  }
  ui.alert(
    "מספר המקומות אושר.\n\n" +
      "נותרו: " + getSpotsLeft() + "\n" +
      "אושר ב: " + Utilities.formatDate(
        stamped, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm") + "\n\n" +
      "האתר יציג את המספר כל עוד האישור טרי."
  );
}

/**
 * GET endpoint. `?action=spots` returns { success, spotsLeft, spotsUpdatedAt }
 * for the scarcity counter on the landing page. The site decides whether the
 * stamp is fresh enough to show a number — see src/lib/spots.ts.
 */
function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : "";
  if (action === "spots") {
    return jsonOut({
      success: true,
      spotsLeft: getSpotsLeft(),
      spotsUpdatedAt: getSpotsUpdatedAt(),
    });
  }
  return jsonOut({ success: true });
}

/**
 * Resolve the target sheet deterministically (never the "active" tab, which
 * changes as you click around). Prefers a "Leads" tab; otherwise the first
 * non-Config sheet; creates "Leads" only if the spreadsheet is empty. Writes
 * the header row on first use.
 */
function getLeadsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LEADS_SHEET);
  if (!sheet) {
    var all = ss.getSheets();
    for (var i = 0; i < all.length; i++) {
      if (all[i].getName() !== CONFIG_SHEET) {
        sheet = all[i];
        break;
      }
    }
  }
  if (!sheet) {
    sheet = ss.insertSheet(LEADS_SHEET);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

/** Email the owner on a new lead. Never lets a mail failure block the write. */
function notify(row) {
  if (!NOTIFY_EMAIL) return;
  try {
    // Daily cap (runs inside doPost's lock, so the read-increment is safe).
    var props = PropertiesService.getScriptProperties();
    var dayKey = "mailCount_" + Utilities.formatDate(
      new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
    var sentToday = Number(props.getProperty(dayKey) || "0");
    if (sentToday >= MAX_NOTIFICATIONS_PER_DAY) return;
    props.setProperty(dayKey, String(sentToday + 1));

    // Flag the unscreened case in the subject so it's triageable from the
    // inbox list without opening the mail.
    var flagged = row.screeningFlag === "no_active_practice";
    var subject =
      "ליד חדש — COR-SYS: " +
      (row.fullName || "ללא שם") +
      (flagged ? " [אין פרקטיקה פעילה]" : "");
    var body =
      "התקבלה פנייה חדשה מטופס ההתאמה:\n\n" +
      "שם: " + cell(row.fullName) + "\n" +
      "טלפון: " + cell(row.phone) + "\n" +
      "מייל: " + cell(row.email) + "\n" +
      "שלב: " + cell(row.stage) + "\n" +
      "הגיע מ: " + cell(row.source) + "\n" +
      "חלונות זמן: " + cell(row.preferredTimes) + "\n" +
      "פרקטיקה פעילה: " + (flagged ? "לא" : "כן") + "\n\n" +
      "התקיעה (במילותיו):\n" + cell(row.challenge) + "\n\n" +
      "שאלון ההתאמה:\n" +
      "  תשובות: " + cell(row.wizardAnswers) + "\n" +
      "  במילותיו: " + cell(row.wizardOpenText) + "\n\n" +
      "נשלח: " + cell(row.submittedAt);
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
  } catch (err) {
    console.error("notify failed: " + err);
  }
}

function doPost(e) {
  // Serialize writes so two near-simultaneous submits can't collide.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000);
  } catch (err) {
    return jsonOut({ success: false, error: "busy" });
  }

  try {
    var data = JSON.parse(e.postData.contents);

    if (!data.secret || data.secret !== SECRET_TOKEN) {
      return jsonOut({ success: false, error: "unauthorized" });
    }

    // Honeypot: real visitors never fill a hidden "company" field. Pretend to
    // succeed (so bots move on) but write nothing. Harmless until the frontend
    // adds the hidden field.
    if (data.company) {
      return jsonOut({ success: true });
    }

    // Defence in depth — the client also caps these.
    if (
      String(data.challenge || "").length > 2000 ||
      String(data.fullName || "").length > 200
    ) {
      return jsonOut({ success: false, error: "invalid" });
    }

    var row = {
      submittedAt: data.submittedAt || new Date().toISOString(),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      stage: data.stage,
      challenge: data.challenge,
      preferredTimes: data.preferredTimes,
      source: data.source,
      wizardAnswers: data.wizardAnswers,
      wizardOpenText: data.wizardOpenText,
      screeningFlag: data.screeningFlag,
    };

    var sheet = getLeadsSheet();
    sheet.appendRow(HEADERS.map(function (key) { return cell(row[key]); }));

    notify(row);

    return jsonOut({ success: true });
  } catch (err) {
    // Don't leak internals to the client; log for the owner instead.
    console.error("doPost failed: " + err);
    return jsonOut({ success: false, error: "server_error" });
  } finally {
    lock.releaseLock();
  }
}
