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
    track: "מה שאתה אומר על עצמך",
    tone: "primary",
    items: [
      {
        icon: FileText,
        title: "המשפט שאתה אומר",
        desc: "לא סיסמה. משפט שעובר בארוחת שישי אצל חברים, ואף אחד לא שואל 'רגע, מה זה בעצם?'",
      },
      {
        icon: ScrollText,
        title: "הצהרת ויתור",
        desc: "שלושה סוגי לקוחות שאתה לא לוקח. בלי זה אין בידול — יש רשימת שירותים שכולם מציעים.",
      },
      {
        icon: Gauge,
        title: "המדד שלך",
        desc: "מדד אחד שאתה בודק כל שבוע במייל שקיבלת. לא תחושה — מספר שמראה אם המיצוב עובד.",
      },
    ],
  },
  {
    label: "מסלול B · עסקי",
    track: "ההצעה שאתה שולח",
    tone: "opportunity",
    items: [
      {
        icon: Workflow,
        title: "תהליך החתימה",
        desc: "3–5 שלבים ממוספרים. הלקוח רואה את היום האחרון עוד לפני שהוא חותם על הראשון.",
      },
      {
        icon: Tag,
        title: "המחיר שאתה אומר",
        desc: "מחיר סגור — 10–20% מהערך שהלקוח יקבל. בלי 'בוא נדבר', בלי 'תלוי'.",
      },
    ],
  },
  {
    label: "מסלול Data · דאטה",
    track: "מה שהלקוח באמת אמר",
    tone: "insight",
    items: [
      {
        icon: BookText,
        title: "חמישה משפטים של הלקוח",
        desc: "לא מה שחשבת שכואב לו. מה שהוא עצמו כתב בלינקדאין, בקבוצת פייסבוק, בטריד של חמישה בבוקר.",
      },
      {
        icon: ListChecks,
        title: "רשימת השמות",
        desc: "15 אנשים בשם, עם אות קנייה מ-14 הימים האחרונים. מי קודם, מה כותבים, מתי שולחים.",
      },
    ],
  },
  {
    label: "פגישה 4 · שטח",
    track: "השטח",
    tone: "success",
    items: [
      {
        icon: Send,
        title: "10 פניות שיצאו",
        desc: "ארבע שעות בזום משותף. כל הודעה עוברת את העיניים שלי לפני שליחה. פניות של קולגה — לא של מוכרן.",
      },
      {
        icon: ShieldAlert,
        title: "ההתנגדויות שחוזרות",
        desc: "מחיר, אמון, דחיינות. התשובה מוכנה לפני שהם שולחים — בלי שתתחיל לגמגם באמצע השיחה.",
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
            מה אתה מחזיק ביד ביום ה-30.
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            לא "הבנה עמוקה יותר". לא PDF כללי. שבעה מסמכים שאתה שולח מחר, ועשר פניות ששלחנו יחד כבר באינבוקס של אנשים שיש להם כסף.
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
