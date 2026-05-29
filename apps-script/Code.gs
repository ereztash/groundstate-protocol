/**
 * Google Apps Script Web App backing the COR-SYS diagnostic form.
 *
 * Setup:
 *   1. Create a new Google Sheet (or reuse one). The first submission writes the header row.
 *   2. Extensions → Apps Script. Replace the default Code.gs with this file.
 *   3. Save, then Deploy → New deployment → Type: Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *      Authorize when prompted.
 *   4. Copy the resulting Web App URL and paste it into SHEETS_WEB_APP_URL
 *      in src/lib/googleSheets.ts.
 *
 * Spots-left counter (change the number without redeploying):
 *   - Add a second tab named "Config".
 *   - Cell A1: a label for yourself (e.g. "מקומות שנותרו"). Cell B1: the number.
 *   - Edit B1 whenever availability changes; the site reads it live.
 *   - If the Config tab or B1 is missing/blank, the site falls back to its
 *     static "up to 10 clients a month" line, so nothing breaks.
 *
 * To redeploy after editing this script: Deploy → Manage deployments → edit
 * the existing deployment and bump the version (otherwise the old code keeps serving).
 */

// Must match SHEETS_SECRET in src/lib/googleSheets.ts. Spam deterrent only —
// the value lives in the frontend bundle, so it is not real authentication.
const SECRET_TOKEN = "5e197f8f78d12cdd1e2bb77cc1dd44e9";

// Upper bound on monthly spots — also the fallback when Config!B1 is unset.
const MONTHLY_CAP = 10;

const HEADERS = [
  "submittedAt",
  "fullName",
  "email",
  "phone",
  "stage",
  "challenge",
  "preferredTimes",
];

/**
 * Reads the remaining-spots number from the "Config" tab, cell B1.
 * Clamped to [0, MONTHLY_CAP]. Returns MONTHLY_CAP if the tab/cell is absent.
 */
function getSpotsLeft() {
  var config = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");
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
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, spotsLeft: getSpotsLeft() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.secret !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: "Unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    sheet.appendRow(HEADERS.map(function (key) { return data[key] || ""; }));

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
