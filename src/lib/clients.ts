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
  /**
   * One sentence from `quote`, verbatim, shown before the rest is expanded.
   *
   * Only for testimonials long enough that nobody reads them: F-pattern
   * scanning means a twelve-line block is skipped whole, so the strongest
   * sentence in it never lands. This is progressive disclosure, not editing —
   * the full text is always present and one click away, and the rule at the top
   * of this file still holds. Must appear in `quote` character for character;
   * clients.test.ts fails if it does not.
   */
  pullQuote?: string;
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
    // Public LinkedIn recommendation to Erez, 15.11.2026, copied verbatim. Erez chose on 18.11.2026 to show it on the site.
    quote:
      "עברתי עם ארז תהליך של ליווי עסקי במטרה לדייק את השירות שאני נותנת ולהגיע ליותר לקוחות. הליווי היה עבורי משמעותי, מדויק ושונה ממה שהכרתי עד היום. אחד הדברים המרשימים ביותר בעבודה עם ארז הוא היכולת שלו להקשיב לעומק, לזהות את הדברים שנמצאים בין השורות ולשקף אותם בחזרה בצורה שעוזרת לעשות סדר בתובנות, במחשבות ובחוויות האישיות והמקצועיות. באמצעות שיחות על אירועים מהעבר, ארז עזר לי לזהות ולזקק את הערך הייחודי שאני מביאה איתי מבחינה מקצועית ללקוחות שלי- את מה שמבדל אותי מאחרים שמעניקים שירות דומה. הוא יודע לקחת עולם שלם של יכולות, רעיונות ותובנות, ולזקק אותו לשירות אחד ברור, ממוקד ומדויק, שאפשר להסביר ולתקשר החוצה בניסוח פשוט. הוא עוזר להתמקד במה שבאמת מייחד אותך, ולא להתפזר על פני אינספור שירותים ויכולות. דבר נוסף שהיה לי חשוב במיוחד הוא שארז לא ניסה לייצר עבורי מסר שיווקי שנשמע טוב על הנייר, אלא הקפיד שהמסר יהיה באמת שלי, במילים שלי, כזה שאני יכולה לעמוד מאחוריו ולהרגיש איתו שלמה. מעבר למקצועיות, התקשורת והעבודה איתו נעימות מאוד. הוא קשוב, גמיש ומתאים את התהליך לאדם שמולו והליווי מתנהל בשקיפות מלאה. אני ממליצה על הליווי של ארז בחום, במיוחד למי שמרגיש שיש לו הרבה מקצועיות להציע אבל לא מצליח להגיע למכירות.",
    pullQuote:
      "הוא יודע לקחת עולם שלם של יכולות, רעיונות ותובנות, ולזקק אותו לשירות אחד ברור, ממוקד ומדויק, שאפשר להסביר ולתקשר החוצה בניסוח פשוט.",
    attribution: "חרות דרור",
    outcome: "יועצת CRM ו-AI (Microsoft Dynamics 365)",
    linkedin: "https://www.linkedin.com/in/cherut-dror-315a34197/",
  },
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
    pullQuote:
      "ממליץ בחום לכל מי שרוצה תוצאות ולא רק הבטחות",
    attribution: "סמואל די פורטו",
    linkedin: "https://www.linkedin.com/in/samuel-di-porto-83151a369/",
    photo: `${import.meta.env.BASE_URL}clients/samuel-di-porto.webp`,
  },
  {
    // What May wrote to Erez after their work (May to June 2026), as quoted
    // in his post of 26.6 with her permission. She approved it for the site on
    // 3.10.2026: full name and LinkedIn link, no photo.
    quote:
      "פעלתי בשני מישורים במקביל והיה לי קשה לחבר ביניהם ולהסביר בצורה ברורה מה אני באמת מציעה. עזרת לי למצוא את החוט המקשר בין כל מה שאני עושה, לחדד את האסטרטגיה להמשך, ובעיקר להבין איך לתאר את הערך שאני מביאה במדויק. דחפת אותי להעז לתמחר את עצמי לפי מה שאני באמת מאמינה שאני שווה. ויותר מהכול, עזרת לי לחזק את האמון שלי בעצמי.",
    attribution: "מאי מור",
    linkedin: "https://www.linkedin.com/in/may-mor-06721820/",
  },
  {
    // Public LinkedIn recommendation to Erez, 21.7.2026, copied verbatim. Erez chose on 18.11.2026 to show it on the site.
    quote:
      "עבדנו עם ארז בתהליך חידוד הבידול והשיווק שלנו, ומהרגע הראשון היה ברור שהוא לא עובד לפי תבנית קבועה. הוא ידע להבין מי יושב מולו, לקרוא את הדינמיקה בינינו, ולהתאים את הדרך שבה הוא עובד ומתקשר כך שתהיה נכונה לנו. לא פעם הוא שינה את התכנון המקורי שלו תוך כדי התהליך, רק כדי שהעבודה תהיה מדויקת יותר עבורנו ולא להפך. מה שהרשים אותנו במיוחד הוא היכולת שלו לזהות את הסיפורים והחוזקות שכבר היו קיימים אצלנו, ולעזור לנו להוציא אותם החוצה בצורה ברורה ומעשית, בלי לנסות להלביש עלינו מסרים שלא מתאימים לנו. מעבר למקצועיות, הרגשנו שיש מולנו אדם שמקשיב באמת, גמיש כשצריך, ומחויב לכך שהתהליך יתאים ללקוח ולא שהלקוח יתאים לתהליך. ממליצים עליו בחום לכל מי שמחפש לחדד את המסר העסקי שלו בצורה אותנטית ומדויקת.",
    pullQuote:
      "מה שהרשים אותנו במיוחד הוא היכולת שלו לזהות את הסיפורים והחוזקות שכבר היו קיימים אצלנו, ולעזור לנו להוציא אותם החוצה בצורה ברורה ומעשית, בלי לנסות להלביש עלינו מסרים שלא מתאימים לנו.",
    attribution: "שחר פיק",
    outcome: "סמנכ״ל תפעול ושותף מייסד ב-Pick.AI",
    linkedin: "https://www.linkedin.com/in/shachar-pick/",
  },
  {
    // Public LinkedIn recommendation to Erez, 11.8.2026, copied verbatim. Erez chose on 18.11.2026 to show it on the site.
    quote:
      "הייתה לי שיחה מצוינת עם ארז סביב סוגיות עסקיות שונות. זו הייתה שיחה עניינית, רחבה ומדויקת, שבה הוא ידע לשאול את השאלות הנכונות, להקשיב באמת ולהגיב בצורה חדה ונעימה. בלטה לי היכולת שלו להסתכל על נושאים מכמה זוויות, לחבר בין תחומי ידע שונים ולזקק את מה שחשוב בתוך המורכבות. ארז מביא חשיבה עסקית מסודרת, סקרנות אמיתית ודרך תקשורת מאוד נעימה. ממליצה בחום לכל מי שמחפש ייעוץ עסקי שמבוסס על הקשבה, דיוק וראייה רחבה.",
    pullQuote:
      "ממליצה בחום לכל מי שמחפש ייעוץ עסקי שמבוסס על הקשבה, דיוק וראייה רחבה.",
    attribution: "אינה קוגן",
    outcome: "בעלת הסטודיו Studio Bika",
    linkedin: "https://www.linkedin.com/in/inna-kogan-bika/",
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
  /**
   * What Guy says in the video, word for word from its captions
   * (public/media/testimonial-guy.he.vtt), from "ארז הוא בן אדם" on. Until
   * 2026-10-01 this was a smoothed paraphrase ("ארז לא רק נותן פתרון — הוא
   * מנחה אותך…") that the site audit's readers took for chatbot copy. Spoken
   * words carry no dash, so the caption's dash is a comma here.
   */
  quote:
    "ארז הוא בן אדם שלא רק יגיד לכם מה הפתרון, הוא ינחה אתכם לחשוב עמוק יותר מי אתם ומה עברתם בחיים האלה, והוא גם יזהה את זה מאוד מהר. הוא יגרום לכם לתת הצעת ערך שגם תדבר אליכם וגם תדבר לקהל שאתם רוצים לפנות אליו. לי זה עזר המון למקד את הצעת הערך שלי, ואני מרגיש את זה באחוזי ההמרה כמעט כל יום.",
  /** Verbatim substring of `quote`, used beside the price in the hero. */
  pullQuote:
    "לי זה עזר המון למקד את הצעת הערך שלי, ואני מרגיש את זה באחוזי ההמרה כמעט כל יום.",
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
 * (גיא כהן), then the text testimonials — matching the landing.
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
  {
    name: "מאי מור",
    linkedin: "https://www.linkedin.com/in/may-mor-06721820/",
  },  {
    name: "חרות דרור",
    credential: "יועצת CRM ו-AI (Microsoft Dynamics 365)",
    linkedin: "https://www.linkedin.com/in/cherut-dror-315a34197/",
  },
  {
    name: "שחר פיק",
    credential: "סמנכ״ל תפעול ושותף מייסד ב-Pick.AI",
    linkedin: "https://www.linkedin.com/in/shachar-pick/",
  },
  {
    name: "אינה קוגן",
    credential: "בעלת הסטודיו Studio Bika",
    linkedin: "https://www.linkedin.com/in/inna-kogan-bika/",
  },
];
