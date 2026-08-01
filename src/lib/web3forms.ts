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

/**
 * Which CTA carried the visitor to the form. Recorded separately from `stage`
 * because the three main CTAs (hero, mid-page, sticky) don't select a stage at
 * all — so `stage` alone left most leads reading "(נקבע בשיחה)" with no way to
 * tell where they came from.
 */
export type LeadSource =
  | "hero"
  | "mid_cta"
  // The conversion point after ObjectionsSection. Separate from mid_cta on
  // purpose: the two sit at very different depths and answer different states,
  // and collapsing them would hide which one actually converts.
  | "post_objections"
  | "sticky"
  | "sequence"
  | "full_package"
  | "wizard"
  // The site-wide header CTA. Present on every route, so it also covers
  // visitors who convert from /protocol, /about or an article.
  | "header";

/** Runtime guard for the `?src=` deep-link parameter. */
export function parseLeadSource(value: string | null): LeadSource | null {
  const allowed: LeadSource[] = [
    "hero",
    "mid_cta",
    "post_objections",
    "sticky",
    "sequence",
    "full_package",
    "wizard",
    "header",
  ];
  return allowed.includes(value as LeadSource) ? (value as LeadSource) : null;
}

/** Anti-ICP screening outcome. Never blocks a submit — it prioritises. */
export type ScreeningFlag = "no_active_practice";

export type DiagnosticPayload = {
  fullName: string;
  email: string;
  phone: string;
  stage: string;
  challenge: string;
  preferredTimes: string[];
  subject?: string;
  /** Which CTA the visitor arrived through, or "(לא ידוע)" for a direct hit. */
  source: string;
  /** Wizard answers, pre-formatted for one cell. Empty when unanswered. */
  wizardAnswers: string;
  /** The wizard's free-text "what's most stuck" answer. Empty when skipped. */
  wizardOpenText: string;
  /** Set when the screening question came back negative. */
  screeningFlag?: ScreeningFlag;
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
    source: data.source,
    wizardAnswers: data.wizardAnswers,
    wizardOpenText: data.wizardOpenText,
    screeningFlag: data.screeningFlag || "",
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
