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
 * To redeploy after editing this script: Deploy → Manage deployments → edit
 * the existing deployment and bump the version (otherwise the old code keeps serving).
 */

// Must match SHEETS_SECRET in src/lib/googleSheets.ts. Spam deterrent only —
// the value lives in the frontend bundle, so it is not real authentication.
const SECRET_TOKEN = "5e197f8f78d12cdd1e2bb77cc1dd44e9";

const HEADERS = [
  "submittedAt",
  "fullName",
  "email",
  "phone",
  "stage",
  "challenge",
  "preferredTimes",
];

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
