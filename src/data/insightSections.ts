/**
 * The /insights library, by the question the reader arrives with (28.11),
 * in place of one list by date. Some readers land on a single article from
 * Google, others come after a recommendation or a booked call; either way the
 * way in is the question that is on their mind.
 *
 * An article joins a section from its own frontmatter ("section: offer",
 * "order: 2"), so a new piece is added to a section without touching this file
 * or the page. The article's title, description and address stay in its own
 * markdown file. An article with no section stays live at its address and in
 * the sitemap, and is not listed here (insightSections.test.ts names the ones
 * left out on purpose, so a new article cannot drop out of the list unseen).
 *
 * The protocol links go to the stages heading. The stage tabs on /protocol
 * open on stage 1 whatever the address says (checked in a browser on 28.11:
 * a stage's tab id exists, its panel stays hidden on a fresh load), so a link
 * that named one stage would promise what the page does not show.
 */
export type InsightSection = {
  /** The anchor, /insights/#<id>. */
  id: string;
  /** The reader's question, in the short row of links under the intro. */
  question: string;
  title: string;
  subtitle: string;
  /** One quiet way on: the section's own question, then the link. */
  more: { question: string; label: string; to: string };
};

const STAGES = "/protocol/#stages-title";

export const insightSections: InsightSection[] = [
  {
    id: "bidul",
    question: "למה בוחרים בי?",
    title: "בידול וניסוח: איך להסביר מה אתם עושים אחרת",
    subtitle: "כשיש ניסיון ולקוחות מרוצים, אבל קשה לנסח במשפט אחד למה בוחרים דווקא בכם.",
    more: {
      question: "רוצים לנסות לנסח את המשפט בעצמכם?",
      label: "לכלי חמש השאלות",
      to: "/bidul/",
    },
  },
  {
    id: "offer",
    question: "מה בדיוק להציע?",
    title: "הצעת ערך ומוצר: מה הלקוח באמת קונה מכם",
    subtitle: "איך לוקחים עבודה שכבר עשיתם ומנסחים מה יקבל הלקוח הבא, במילים שהוא יבין.",
    more: {
      question: "איך הופכים את זה להצעה שאפשר לשלוח?",
      label: "לארבעת שלבי הליווי",
      to: STAGES,
    },
  },
  {
    id: "pricing",
    question: "כמה לגבות?",
    title: "תמחור: איך לקבוע מחיר ולהסביר ללקוח על מה הוא משלם",
    subtitle: "איך קובעים מה כלול במחיר, על מה הוא נשען ומתי לעדכן אותו ללקוחות קיימים.",
    more: {
      question: "איך מחברים בין מה שמקבלים לבין המחיר?",
      label: "לארבעת שלבי הליווי",
      to: STAGES,
    },
  },
  {
    id: "outreach",
    question: "למי לפנות ואיך?",
    title: "לקוחות ופנייה יזומה: איך להגיע ללקוחות שמתאימים לי",
    subtitle:
      "איך לבחור למי לפנות ומה לכתוב, גם כשכבר מגיעות פניות מאנשים שפחות מתאימים לעבודה שלכם.",
    more: {
      question: "איך מכינים חמש פניות עם הצעה שכבר ניסחתם?",
      label: "לארבעת שלבי הליווי",
      to: STAGES,
    },
  },
];
