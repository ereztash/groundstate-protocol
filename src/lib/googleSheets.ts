import type { DiagnosticPayload } from "./web3forms";

// Web App URL from Apps Script deployment. See apps-script/Code.gs for setup.
export const SHEETS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxu9YILo5z5h45xZJ0ne7KW9M_xpzu_zfdHlcSnoe9y3Bj0PpdE65_cMcIGL0VLulfh/exec";

// Shared token the Apps Script checks before writing a row. Frontend-visible
// by design — this is a spam deterrent against random bots, not real auth.
export const SHEETS_SECRET = "5e197f8f78d12cdd1e2bb77cc1dd44e9";

export type SheetsResult = {
  success: boolean;
  message: string;
};

export async function submitToSheet(
  data: DiagnosticPayload
): Promise<SheetsResult> {
  const body = {
    secret: SHEETS_SECRET,
    submittedAt: new Date().toISOString(),
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    stage: data.stage,
    challenge: data.challenge,
    preferredTimes: data.preferredTimes.join(", "),
  };

  try {
    // text/plain keeps this a CORS "simple request" so Apps Script accepts it
    // without a preflight. The response is opaque from the browser's POV — the
    // sheet write is the source of truth, not the HTTP status here.
    await fetch(SHEETS_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });
    return { success: true, message: "Submitted to sheet" };
  } catch {
    return { success: false, message: "Sheet submission failed" };
  }
}
