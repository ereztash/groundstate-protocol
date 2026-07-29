// Google Apps Script Web App endpoint.
// Configure via VITE_APPS_SCRIPT_URL and VITE_APPS_SCRIPT_SECRET in your .env file.
// See .env.example.
// `||` (not `??`) so empty strings — what GitHub Actions injects when a
// repo secret is unset — also fall through to the in-code default. Without
// this, a missing secret produced APPS_SCRIPT_URL = "" and fetch("") was
// resolved against the current page, returning 405 from GitHub Pages.
export const APPS_SCRIPT_URL =
  (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined) ||
  "https://script.google.com/macros/s/AKfycbzzm6oH7_rc1VhJPj8o_lHz3fcho6IkFsqJ0wVOdlVZPOHCQ2F_MajUnBDoxHAdglii/exec";

const SECRET_TOKEN =
  (import.meta.env.VITE_APPS_SCRIPT_SECRET as string | undefined) ||
  "5e197f8f78d12cdd1e2bb77cc1dd44e9";

/**
 * Why a submission failed, for telemetry. The visitor sees `message`; this is
 * what tells the operator whether the endpoint is down, rejecting, or simply
 * unreachable from that network — a distinction that is invisible once the
 * three are collapsed into one "it failed".
 */
export type SubmitFailureReason =
  /** fetch() threw: offline, DNS, CORS, blocked by an extension. */
  | "network"
  /** Reached the endpoint, non-2xx response. */
  | `http_${number}`
  /** 2xx, but the Apps Script did not answer success — bad secret, honeypot,
      sheet write failure. */
  | "rejected"
  /** 2xx with a body that was not the JSON contract. */
  | "malformed";

export type Web3FormsResult = {
  success: boolean;
  message: string;
  reason?: SubmitFailureReason;
};

export type DiagnosticPayload = {
  fullName: string;
  email: string;
  phone: string;
  stage: string;
  challenge: string;
  preferredTimes: string[];
  subject?: string;
  /** Honeypot: real users leave this empty; bots fill it. The Apps Script
      drops any submission where it's non-empty. */
  company?: string;
};

export async function submitForm(
  data: DiagnosticPayload
): Promise<Web3FormsResult> {
  const body = {
    secret: SECRET_TOKEN,
    submittedAt: new Date().toISOString(),
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    stage: data.stage,
    challenge: data.challenge,
    preferredTimes: data.preferredTimes,
    company: data.company || "",
  };

  try {
    // Use text/plain to avoid a CORS preflight against script.google.com.
    // Apps Script reads the JSON via e.postData.contents in doPost(e).
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(body),
    });

    let json: { success?: boolean } | null = null;
    let parseFailed = false;
    try {
      json = (await res.json()) as { success?: boolean };
    } catch {
      parseFailed = true;
    }

    if (res.ok && json?.success === true) {
      return { success: true, message: "הטופס נשלח" };
    }

    return {
      success: false,
      message: "השליחה נכשלה. נסו שוב בעוד רגע.",
      reason: !res.ok
        ? (`http_${res.status}` as SubmitFailureReason)
        : parseFailed
          ? "malformed"
          : "rejected",
    };
  } catch {
    return {
      success: false,
      message: "תקלת רשת. בדקו חיבור ונסו שוב.",
      reason: "network",
    };
  }
}
