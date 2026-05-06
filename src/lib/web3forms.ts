export const ACCESS_KEY = "PLACEHOLDER_REPLACE_ME";

const ENDPOINT = "https://api.web3forms.com/submit";

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
  if (!ACCESS_KEY || ACCESS_KEY === "PLACEHOLDER_REPLACE_ME") {
    return {
      success: false,
      message:
        "מפתח השליחה לא הוגדר. יש להחליף את ACCESS_KEY בקובץ src/lib/web3forms.ts.",
    };
  }

  const body = {
    access_key: ACCESS_KEY,
    redirect: false,
    subject: data.subject || "אבחון התאמה חדש מהאתר",
    from_name: "אתר COR-SYS",
    שם_מלא: data.fullName,
    מייל: data.email,
    טלפון: data.phone,
    שלב_מבוקש: data.stage,
    אתגר_עכשווי: data.challenge,
    חלונות_זמן: data.preferredTimes.join(", "),
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success) {
      return { success: true, message: "הטופס נשלח" };
    }
    return {
      success: false,
      message: json.message || "השליחה נכשלה. נסו שוב בעוד רגע.",
    };
  } catch (err) {
    return {
      success: false,
      message: "תקלת רשת. בדקו חיבור ונסו שוב.",
    };
  }
}
