// Google Apps Script Web App endpoint.
// Configure via VITE_APPS_SCRIPT_URL in your .env file
// (https://script.google.com/macros/s/.../exec). See .env.example.
export const APPS_SCRIPT_URL =
  (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined) ?? "";

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
  if (!APPS_SCRIPT_URL) {
    return {
      success: false,
      message:
        "כתובת השליחה לא הוגדרה. יש להגדיר את VITE_APPS_SCRIPT_URL בקובץ .env בכתובת ה-Web App של Google Apps Script.",
    };
  }

  const body = {
    subject: data.subject || "אבחון התאמה חדש מהאתר",
    from_name: "אתר COR-SYS",
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    stage: data.stage,
    challenge: data.challenge,
    preferredTimes: data.preferredTimes,
    submittedAt: new Date().toISOString(),
  };

  try {
    // Use text/plain to avoid a CORS preflight against script.google.com.
    // Apps Script reads the JSON via e.postData.contents in doPost(e).
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    if (!res.ok) {
      return {
        success: false,
        message: "השליחה נכשלה. נסו שוב בעוד רגע.",
      };
    }

    const text = await res.text();
    let ok = true;
    try {
      const json = JSON.parse(text) as {
        success?: boolean;
        result?: string;
        status?: string;
      };
      ok =
        json.success === true ||
        json.result === "success" ||
        json.status === "success" ||
        // Apps Script with no JSON return — treat 2xx as success
        (json.success === undefined &&
          json.result === undefined &&
          json.status === undefined);
    } catch {
      // Non-JSON 2xx response from Apps Script is still considered success.
      ok = true;
    }

    if (ok) {
      return { success: true, message: "הטופס נשלח" };
    }
    return {
      success: false,
      message: "השליחה נכשלה. נסו שוב בעוד רגע.",
    };
  } catch {
    return {
      success: false,
      message: "תקלת רשת. בדקו חיבור ונסו שוב.",
    };
  }
}
