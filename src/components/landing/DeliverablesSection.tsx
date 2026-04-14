import {
  FileText,
  Tag,
  Users,
  Send,
  ScrollText,
  Route,
  type LucideIcon,
} from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Deliverable = {
  icon: LucideIcon;
  title: string;
  desc: string;
  span?: "wide" | "default";
};

const deliverables: Deliverable[] = [
  {
    icon: FileText,
    title: "Positioning Memo",
    desc: "עמוד אחד שמגדיר את הבידול שלך בשפה שאפשר לשכפל. גם בעמוד נחיתה, גם בשיחת מסדרון.",
    span: "wide",
  },
  {
    icon: Tag,
    title: "מחירון שמחזיק ביקורת",
    desc: "3 חבילות, היגיון תמחור, תנאי כישלון. לא 'נתאים לך הצעה'.",
  },
  {
    icon: Users,
    title: "פרופיל ICP",
    desc: "לקוח אידיאלי אחד — עם שם, תקציב, התנגדויות, מילון כאב.",
  },
  {
    icon: Send,
    title: "3 פניות ששלחת",
    desc: "מיילים ממוקדים שיצאו החוצה. לא תבניות. פניות אמיתיות לאנשים אמיתיים.",
  },
  {
    icon: ScrollText,
    title: "זכויות Case Study",
    desc: "זכות להשתמש בתהליך כנקודת ייחוס מתועדת מול הלקוח הבא שלך.",
  },
  {
    icon: Route,
    title: "מפת Integration 60",
    desc: "אם אות השוק מגיע — יש מפה ברורה של 60 הימים הבאים, לא התחלה חדשה.",
  },
];

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
            שישה תוצרים שאתה יוצא איתם ביד
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            לא "תחושה טובה". לא "ראיתי את המצב בעיניים חדשות". מסמכים, מיילים, ומספרים שאפשר לפתוח בצד אחד ולמכור בצד השני.
          </p>
        </Reveal>

        <RevealStagger
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          as="ul"
        >
          {deliverables.map(({ icon: Icon, title, desc, span }) => (
            <RevealItem
              key={title}
              as="li"
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.35)] ${
                span === "wide" ? "sm:col-span-2" : ""
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="cor-subheading mt-5 text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {desc}
              </p>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-l from-primary to-cor-success transition-all duration-500 group-hover:w-full" />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
};

export default DeliverablesSection;
