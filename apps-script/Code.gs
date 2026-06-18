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

const HEADERS = [
  "submittedAt",
  "fullName",
  "email",
  "phone",
  "stage",
  "challenge",
  "preferredTimes",
];

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
 * GET endpoint. `?action=spots` returns { success, spotsLeft } for the
 * scarcity counter on the landing page.
 */
function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : "";
  if (action === "spots") {
    return jsonOut({ success: true, spotsLeft: getSpotsLeft() });
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
    var subject = "ליד חדש — COR-SYS: " + (row.fullName || "ללא שם");
    var body =
      "התקבלה פנייה חדשה מטופס האבחון:\n\n" +
      "שם: " + cell(row.fullName) + "\n" +
      "טלפון: " + cell(row.phone) + "\n" +
      "מייל: " + cell(row.email) + "\n" +
      "שלב: " + cell(row.stage) + "\n" +
      "חלונות זמן: " + cell(row.preferredTimes) + "\n\n" +
      "התקיעה (במילותיו):\n" + cell(row.challenge) + "\n\n" +
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
