import { ArrowLeft } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Move = {
  order: string;
  label: string;
  body: string;
  accent: "opportunity" | "insight" | "primary";
};

/**
 * Chess / reverse-engineering section.
 *
 * Bridges Methodology (the three parallel tracks) and the Sprint Timeline.
 * The metaphor: we don't walk forward from A hoping to reach B; we stand
 * at B and rewind the moves until the board matches where you are now.
 * Reads right-to-left so the flow mirrors the RTL layout of the page.
 */
const moves: Move[] = [
  {
    order: "B",
    label: "היעד",
    body: "הלקוח הראשון. ההצעה הממוצרת. המחיר שמחזיק.",
    accent: "opportunity",
  },
  {
    order: "03",
    label: "הצעד שלפני",
    body: "אות שוק אמיתי — פנייה שענו עליה, עסקה שזזה.",
    accent: "primary",
  },
  {
    order: "02",
    label: "הצעד שלפני-לפני",
    body: "פנייה מסונתזת שמבוססת על מילון כאב אמיתי.",
    accent: "insight",
  },
  {
    order: "01",
    label: "הצעד הראשון",
    body: "משפט בידול שאפשר לומר בלי למצמץ. זו נקודת A.",
    accent: "opportunity",
  },
  {
    order: "A",
    label: "נקודת המוצא",
    body: "המקום שבו אתה עכשיו — אחרי שהנדסנו אליו אחורה.",
    accent: "primary",
  },
];

const accentMap: Record<Move["accent"], { text: string; border: string; bg: string }> =
  {
    opportunity: {
      text: "text-cor-opportunity",
      border: "border-cor-opportunity/30",
      bg: "bg-cor-opportunity/10",
    },
    insight: {
      text: "text-cor-insight",
      border: "border-cor-insight/30",
      bg: "bg-cor-insight/10",
    },
    primary: {
      text: "text-primary",
      border: "border-primary/30",
      bg: "bg-primary/10",
    },
  };

const ChessSection = () => {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="chess-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-opportunity opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="cor-overline text-cor-opportunity">השחמט · הנדסה לאחור</p>
          <h2 id="chess-title" className="cor-title mt-3 text-foreground">
            מתחילים ב-B. חוזרים אחורה עד שמגיעים ל-A.
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            אנחנו לא הולכים קדימה בתקווה שנגיע ליעד. אנחנו עומדים ביעד, מסתכלים לאחור, וגוזרים את רצף הצעדים שמחבר אותו לנקודה שבה אתה עכשיו.
            <span className="block mt-2 font-mono text-foreground/75">
              רצף הצעדים הזה הוא פקודת המבצע שלך.
            </span>
          </p>
        </Reveal>

        <RevealStagger
          className="relative mt-16 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4"
          as="ol"
        >
          {moves.map(({ order, label, body, accent }, i) => {
            const a = accentMap[accent];
            return (
              <RevealItem
                key={order}
                as="li"
                className={`group relative overflow-hidden rounded-xl border ${a.border} bg-card/50 p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-md border ${a.border} ${a.bg} ${a.text} font-mono text-xs font-bold`}
                  >
                    {order}
                  </span>
                  {i < moves.length - 1 && (
                    <ArrowLeft
                      className={`h-4 w-4 ${a.text} opacity-40 transition-opacity group-hover:opacity-80`}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className={`cor-overline mt-3 ${a.text}`}>{label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </RevealItem>
            );
          })}
        </RevealStagger>

        <Reveal
          delay={0.1}
          className="mx-auto mt-10 max-w-3xl text-center"
        >
          <p className="font-mono text-sm text-muted-foreground">
            B ← 03 ← 02 ← 01 ← A
          </p>
          <p className="mt-2 text-sm text-foreground/75">
            קראו את הרצף מימין לשמאל — כמו שחקן שחמט שמתכנן מט, ואז בוחר את המסע שאליו.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default ChessSection;
