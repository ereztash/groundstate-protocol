// Google Apps Script Web App endpoint.
// Configure via VITE_APPS_SCRIPT_URL and VITE_APPS_SCRIPT_SECRET in your .env file.
// See .env.example.
const APPS_SCRIPT_URL =
  (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined) ??
  "https://script.google.com/macros/s/AKfycbxu9YILo5z5h45xZJ0ne7KW9M_xpzu_zfdHlcSnoe9y3Bj0PpdE65_cMcIGL0VLulfh/exec";

const SECRET_TOKEN =
  (import.meta.env.VITE_APPS_SCRIPT_SECRET as string | undefined) ??
  "5e197f8f78d12cdd1e2bb77cc1dd44e9";

export type Web3FormsResult = {
  success: boolean;
  message: string;
};

export type DiagnosticPayload = {
  fullName: string;
  email: string;
  phone: string;
  stage: string;
  challenge: string;
  preferredTimes: string[];
  subject?: string;
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

    const json = await res.json().catch(() => ({} as { success?: boolean }));

    if (res.ok && json.success === true) {
      return { success: true, message: "הטופס נשלח" };
    }

    return {
      success: false,
      message: "השליחה נכשלה. נסו שוב בעוד רגע.",
    };
  } catch (err) {
    return {
      success: false,
      message: "תקלת רשת. בדקו חיבור ונסו שוב.",
    };
  }
}
