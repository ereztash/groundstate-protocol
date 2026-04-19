import {
  FileText,
  ScrollText,
  Gauge,
  Workflow,
  Tag,
  BookText,
  ListChecks,
  Send,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Deliverable = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

type Group = {
  label: string;
  track: string;
  tone: "primary" | "opportunity" | "insight" | "success";
  items: Deliverable[];
};

const groups: Group[] = [
  {
    label: "מסלול A · אבחון",
    track: "מפת המיצוב",
    tone: "primary",
    items: [
      {
        icon: FileText,
        title: "Statement Mechanism",
        desc: "משפט בידול מבוסס מנגנון — לא סיסמה. אפשר להדביק לאתר ולומר בשיחת מסדרון.",
      },
      {
        icon: ScrollText,
        title: "הצהרת ויתור",
        desc: "מה אנחנו בכוונה לא עושים. בלי זה אין בידול, יש רק רשימת שירותים.",
      },
      {
        icon: Gauge,
        title: "מדד נגדי",
        desc: "Decision Latency או Explanation Efficiency — מדד אחד שמראה שהמיצוב עובד.",
      },
    ],
  },
  {
    label: "מסלול B · עסקי",
    track: "ההצעה הממוצרת",
    tone: "opportunity",
    items: [
      {
        icon: Workflow,
        title: "Signature Process",
        desc: "3–5 שלבים ממוספרים. הלקוח יודע בדיוק מה מקבל, בסדר הזה, עד המועד הזה.",
      },
      {
        icon: Tag,
        title: "תמחור Fixed Price",
        desc: "מבוסס ערך: 10–20% מה-ROI ללקוח. מחירון שמחזיק ביקורת, לא 'נתאים לך הצעה'.",
      },
    ],
  },
  {
    label: "מסלול Data · דאטה",
    track: "הבסיס להחלטה",
    tone: "insight",
    items: [
      {
        icon: BookText,
        title: "מילון כאב",
        desc: "5 משפטי Verbatim — מילים מדויקות שלקוחות אמיתיים כתבו ברשת או אמרו בשיחה.",
      },
      {
        icon: ListChecks,
        title: "Target List",
        desc: "10–20 לידים חמים מדורגים עם אות קנייה ב-14 הימים האחרונים.",
      },
    ],
  },
  {
    label: "פגישה 4 · שטח",
    track: "הוצאה לפועל",
    tone: "success",
    items: [
      {
        icon: Send,
        title: "10 פניות מסונתזות",
        desc: "נשלחות בזמן אמת, בליווי אישי שלי. QA לפני כל הודעה. פניות של קולגה, לא של מוכרן.",
      },
      {
        icon: ShieldAlert,
        title: "מפת התנגדויות",
        desc: "מחיר / אמון / דחיינות — מענים מוכנים מראש על בסיס המנגנון והדאטה שלך.",
      },
    ],
  },
];

const toneMap: Record<
  Group["tone"],
  { text: string; border: string; bg: string; hover: string }
> = {
  primary: {
    text: "text-primary",
    border: "border-primary/25",
    bg: "bg-primary/[0.04]",
    hover: "hover:border-primary/50 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.35)]",
  },
  opportunity: {
    text: "text-cor-opportunity",
    border: "border-cor-opportunity/25",
    bg: "bg-cor-opportunity/[0.04]",
    hover:
      "hover:border-cor-opportunity/50 hover:shadow-[0_20px_60px_-20px_hsl(var(--cor-opportunity)/0.35)]",
  },
  insight: {
    text: "text-cor-insight",
    border: "border-cor-insight/25",
    bg: "bg-cor-insight/[0.04]",
    hover:
      "hover:border-cor-insight/50 hover:shadow-[0_20px_60px_-20px_hsl(var(--cor-insight)/0.35)]",
  },
  success: {
    text: "text-cor-success",
    border: "border-cor-success/25",
    bg: "bg-cor-success/[0.04]",
    hover:
      "hover:border-cor-success/50 hover:shadow-[0_20px_60px_-20px_hsl(var(--cor-success)/0.35)]",
  },
};

const DeliverablesSection = () => {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-muted/10 py-24 md:py-32"
      aria-labelledby="deliverables-title"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />
      <div className="pointer-events-none absolute inset-0 bg-radial-primary" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="cor-overline text-cor-success">מה יוצא בסוף</p>
          <h2
            id="deliverables-title"
            className="cor-title mt-3 text-foreground"
          >
            תוצרים לפי מסלול — לא תובנות. מסמכים.
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            כל מסלול במנסרה מייצר תוצרים קשיחים. בפגישה הרביעית הכול מתחבר לפניות חיות שיוצאות עם ליווי אישי שלי בשטח.
          </p>
        </Reveal>

        <div className="mt-16 space-y-10">
          {groups.map((group) => {
            const tone = toneMap[group.tone];
            return (
              <Reveal key={group.label}>
                <div className="mb-4 flex flex-wrap items-baseline gap-3">
                  <span
                    className={`cor-overline rounded-full border ${tone.border} ${tone.bg} px-3 py-1 ${tone.text}`}
                  >
                    {group.label}
                  </span>
                  <span className="cor-overline text-muted-foreground">
                    {group.track}
                  </span>
                </div>

                <RevealStagger
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  as="ul"
                >
                  {group.items.map(({ icon: Icon, title, desc }) => (
                    <RevealItem
                      key={title}
                      as="li"
                      className={`group relative overflow-hidden rounded-2xl border ${tone.border} ${tone.bg} p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${tone.hover}`}
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-lg border ${tone.border} bg-background/40 ${tone.text}`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <h3 className="cor-subheading mt-5 text-foreground">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {desc}
                      </p>
                    </RevealItem>
                  ))}
                </RevealStagger>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeliverablesSection;
