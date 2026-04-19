import { MapPin, Target, Database, type LucideIcon } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Track = {
  icon: LucideIcon;
  label: string;
  question: string;
  detail: string;
  tone: "primary" | "opportunity" | "insight";
};

const tracks: Track[] = [
  {
    icon: MapPin,
    label: "מסלול A · אבחון",
    question: "איפה אתה עכשיו?",
    detail: "לא מה שכתוב לך ב-About. מה שלקוח אמיתי אמר לחבר שלו עליך בקפה. זו נקודת המוצא — כולל הדיסציפלינה שאתה מחזיק ולא מעז לגבות עליה כסף.",
    tone: "primary",
  },
  {
    icon: Target,
    label: "מסלול B · עסקי",
    question: "לאן אתה רוצה להגיע?",
    detail: "לא 'לייצר אימפקט'. שם של לקוח, סכום הצעה, תאריך חתימה. יעד שאפשר לחזור ממנו אחורה — עד הצעד שאתה עושה ביום שני בבוקר.",
    tone: "opportunity",
  },
  {
    icon: Database,
    label: "מסלול Data · דאטה",
    question: "מה מצדיק את ההחלטה?",
    detail: "המילים שהלקוח עצמו כתב בלינקדאין — לא מה שחשבת שכואב לו. 15 שמות ברשימה, עם אות קנייה מ-14 הימים האחרונים, שאפשר לשלוח אליהם ביום שני.",
    tone: "insight",
  },
];

const toneClasses: Record<Track["tone"], string> = {
  primary: "text-primary",
  opportunity: "text-cor-opportunity",
  insight: "text-cor-insight",
};

const ProblemSection = () => {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="problem-title"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          {/* Editorial copy column */}
          <Reveal className="space-y-6">
            <p className="cor-overline text-primary">הפער · מה קורה באמת</p>
            <h2 id="problem-title" className="cor-title text-foreground">
              אף פעם לא שילמו לך על מה שאתה מוכר. <br />
              שילמו לך על משהו אחר.
            </h2>

            <div className="space-y-5 text-foreground/85">
              <p className="cor-body-lg">
                בישראל יש יועצי טכנולוגיה, יש יועצי תרבות, ויש יועצי AI.
                <br />
                אין כמעט שחקן שמחזיק את השלושה — עם מוצר, עם תמחור, ועם פרוטוקול מדוד.
              </p>
              <p className="cor-body-lg">
                אתה — לא אחד מהם. יש דבר אחד שאתה מוכר בפה, ודבר שני שאתה עושה בידיים. הלקוח משלם על השני.
              </p>
              {/* The flip — buyer-side frame. Name what the client already
                  paid for, turn it into the business. */}
              <p className="cor-body-lg text-foreground">
                תיתן לו שם. יש לך עסק.
              </p>
              <p className="cor-body-lg">
                <span className="font-mono text-primary">0 שחקנים ישראלים</span> עשו את ההמרה הזו עם מוצר ותמחור. החלון פתוח 18 חודשים — עד שמישהו שיושב עכשיו וכותב SOP ימצא את זה.
              </p>
              {/* Loss-frame with named antagonist (Kahneman & Tversky 1979). */}
              <p className="cor-body-lg text-foreground/85">
                כל חודש שאתה לא נותן לו שם — מישהו אחר כן, ולקוח שהיה אמור להיות שלך משלם לו.
              </p>
              <p className="cor-body-lg font-mono text-muted-foreground">
                המנסרה — איך מוציאים את הדבר השני החוצה, ונותנים לו שם שהלקוח מוכן לשלם עליו.
              </p>
            </div>
          </Reveal>

          {/* Three parallel tracks */}
          <RevealStagger className="flex flex-col gap-4" as="ul">
            {tracks.map(({ icon: Icon, label, question, detail, tone }) => (
              <RevealItem
                key={label}
                as="li"
                className="cor-card-hover group flex items-start gap-4 rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/60 transition-colors group-hover:border-primary/40 ${toneClasses[tone]}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className={`cor-overline ${toneClasses[tone]}`}>{label}</p>
                  <p className="cor-subheading mt-1 text-foreground">
                    {question}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </RevealItem>
            ))}
            <RevealItem className="pt-2 text-sm text-muted-foreground">
              <span className="font-mono text-primary">+ </span>
              שלושתם נעים יחד בכל פגישה. לא שלב-שלב — מנסרה.
            </RevealItem>
          </RevealStagger>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
