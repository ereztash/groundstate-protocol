import type { DiagnosticPayload } from "./web3forms";

// Web App URL from Apps Script deployment. See apps-script/Code.gs for setup.
export const SHEETS_WEB_APP_URL = "PLACEHOLDER_REPLACE_ME";

export type SheetsResult = {
  success: boolean;
  message: string;
};

export async function submitToSheet(
  data: DiagnosticPayload
): Promise<SheetsResult> {
  if (!SHEETS_WEB_APP_URL || SHEETS_WEB_APP_URL === "PLACEHOLDER_REPLACE_ME") {
    return {
      success: false,
      message: "Sheets URL not configured",
    };
  }

  const body = {
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
