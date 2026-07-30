/**
 * Single source of truth for client proof.
 *
 * These clients are already displayed publicly on the landing page (text +
 * video testimonials) and are approved for reuse across the whole site. Do NOT
 * add clients here who are not already public on the landing page — other names
 * that appear in internal material require separate, explicit consent.
 */

export type Testimonial = {
  quote: string;
  attribution: string;
  /** Optional secondary credential / outcome line under the name. */
  outcome?: string;
  /** Optional LinkedIn URL; renders the name as a verification link. */
  linkedin?: string;
  /** Optional photo path; falls back to initials if absent. */
  photo?: string;
  initials?: string;
};

/** Full text testimonials (rendered on the landing ClientProofSection). */
export const testimonials: Testimonial[] = [
  {
    quote:
      "ארז פשוט מקצוען! כבר בפגישה הראשונה הוא הצליח להעלות תובנות שלא הייתי מגיעה אליהן בלעדיו. ארז רגיש, חכם, מתוחכם ובעל ידע רב ונרחב. מרגישים כמה הוא מסור ומחויב, ובאמת בא להוביל לשינוי והתפתחות של הלקוח. אני ממליצה.",
    attribution: "נועם אורן",
    outcome: "מנהלת הצלחת לקוחות ב-Movement Group",
    linkedin: "https://www.linkedin.com/in/noam-oren-836668395/",
    photo: `${import.meta.env.BASE_URL}clients/noam-oren.webp`,
  },
  {
    quote:
      "הגעתי לארז אחרי תקופה ארוכה של חיפושים מתישים במיוחד, והוא פשוט שינה לי את הפרספקטיבה. במקום להמשיך ״לירות לכל הכיוונים״ עם מאות קורות חיים, הוא עזר לי להתמקד במה שאני באמת חזק בו ולהפוך את זה לכלי עבודה בשטח. ארז יורד לפרטים הכי קטנים, והמתודולוגיה שלו מבוססת על הניסיון המעשי והאקדמי המרשים מאוד שלו. הוא ידע לזהות בדיוק איפה החוזקות שלי ואיפה אני צריך להשתפר, ונתן לי ביטחון בדרך שבה אני מציג את עצמי. הוא עזר לי ״לטרגט״ את משרות היעד שלי, ובפרט את בעלי התפקידים שאיתם אני צריך ליצור חיבור כדי להגיע אליהן. אבל מה שבאמת הכי חימם לי את הלב, מעבר למקצועיות: הוא קודם כל בן אדם שמדבר בגובה העיניים, איש נחמד שמנסה לעזור בכל דרך אפשרית, הוא מחזק מילואימניקים ומקדם אותנו בדרך המאוד מסובכת שלנו בחזרה הביתה, והוא לעולם לא מסתכל על השעון כשהוא מדבר איתך. ממליץ בחום לכל מי שרוצה תוצאות ולא רק הבטחות — ובעיקר למי שרוצה לדבר עם בן אדם ולא עם ארנק שממתין לכסף שלך.",
    attribution: "סמואל די פורטו",
    linkedin: "https://www.linkedin.com/in/samuel-di-porto-83151a369/",
    photo: `${import.meta.env.BASE_URL}clients/samuel-di-porto.webp`,
  },
];

/**
 * The video testimonial's transcript line, moved here from VideoTestimonial so
 * every verbatim client word lives in one file. Nothing in this file is edited
 * for house style: these are other people's sentences, and altering them to fit
 * a rule about punctuation would misquote them. See the exemption in
 * src/lib/noDashes.test.ts.
 */
export const videoTestimonial = {
  quote:
    "ארז לא רק נותן פתרון — הוא מנחה אותך לחשוב עמוק יותר מי אתה ומה עברת, ומזהה את זה מהר מאוד. זה עזר לי למקד את הצעת הערך שלי, ואני מרגיש את זה באחוזי ההמרה כמעט כל יום.",
  attribution: "גיא כהן",
  linkedin: "https://www.linkedin.com/in/guycohen-ai/",
} as const;

export type ClientCredit = {
  name: string;
  /** Short credential line, when one is public. */
  credential?: string;
  linkedin: string;
};

/**
 * Compact attributions for proof strips on any page. Order = video first
 * (גיא כהן), then the two text testimonials — matching the landing.
 */
export const approvedClients: ClientCredit[] = [
  {
    name: "גיא כהן",
    credential: "יועץ AI לעצמאים · מוביל קהילה של 1,500+",
    linkedin: "https://www.linkedin.com/in/guycohen-ai/",
  },
  {
    name: "נועם אורן",
    credential: "מנהלת הצלחת לקוחות ב-Movement Group",
    linkedin: "https://www.linkedin.com/in/noam-oren-836668395/",
  },
  {
    name: "סמואל די פורטו",
    linkedin: "https://www.linkedin.com/in/samuel-di-porto-83151a369/",
  },
];
