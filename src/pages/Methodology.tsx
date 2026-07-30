import { Link } from "react-router-dom";
import { Reveal, RevealItem, RevealStagger } from "@/components/landing/Reveal";
import CoherenceVisual from "@/components/experiential/CoherenceVisual";
import StageStepper from "@/components/StageStepper";
import QuantifiedProof from "@/components/QuantifiedProof";
import ProofStrip from "@/components/ProofStrip";
import GuaranteeBand from "@/components/GuaranteeBand";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

/**
 * /protocol — the methodology page. Rhythm: a dark charcoal hero and a dark
 * closing CTA bookend a light body, with a dark "why" section mid-page — so the
 * page reads with weight and contrast instead of one long light scroll. The four
 * stages live in an interactive stepper (StageStepper) to cut reading fatigue.
 *
 * Content from the knowledge-graph brief (section D). Reader-facing and
 * evidence-grounded: no client names, no unverified metrics.
 */

const EXIT_CRITERIA: Record<string, string> = {
  "01": "אתה מנסח בעצמך, במילים שלך, את משפט הייעוד. הסימן: ניסוח חדש שיצא ממך — לא חזרה על ניסוח שלי.",
  "02": "אפשר לחזור על הצעת הערך שלך במשפט אחד שלא דורש חינוך-שוק, וההצעה כוללת מדד שניתן להמיר לכסף או לזמן.",
  "03": "מספר יוצא. לא אני נוקב בו — אתה. אני נותן השוואה חיצונית בת-הצלבה, ואתה מחשב.",
  "04": "הפנייה הראשונה נשלחת בתוך הפגישה. לא תלוי בתגובה — תלוי בכך שיצאה מהיד.",
};

// What goes into each stage — always the previous stage's output, which is
// the "כל שלב בונה את הבא" principle below made concrete and checkable.
const INPUTS: Record<string, string> = {
  "01": "חמישה סיפורים מקצועיים או רגעי שיא שכבר קיימים אצלך — לא צריך לייצר חומר חדש.",
  "02": "הנרטיב משלב 1, ותגובות אמיתיות של לקוחות למה שהצעת עד היום.",
  "03": "הצעת הערך ומילון הכאב משלב 2.",
  "04": "תיאור המוצר עם התמחור משלב 3.",
};

// Compact per-stage transformation, rendered right-to-left with left-pointing
// arrows — forward is leftward in RTL, same convention CoherenceVisual uses.
const TRANSFORMATIONS: Record<string, string> = {
  "01": "חמישה סיפורים מקצועיים ← תבנית חוזרת ← משפט ייעוד",
  "02": "תגובות לקוחות ← מילון כאב ← הצעת ערך",
  "03": "הצעת ערך ← מבנה מוצר ← תיאור עם תמחור",
  "04": "תיאור מוצר ← מיפוי מקבלי החלטות ← 10 פניות מתועדות",
};

const PRINCIPLES = [
  {
    title: "בעלות מרוויחים, לא מקבלים",
    body: "מבנה שנבנה תחת עומס נשאר. מבנה שמוגש מבחוץ מתפוגג. לכן אני מחלץ ממך את הניסוח, לא נותן לך אותו.",
  },
  {
    title: "סדר קבוע. כל שלב בונה את הבא",
    body: "אי-אפשר לתרגם ערך שעוד לא הובלט, ואי-אפשר להבליט נרטיב שעוד לא חולץ.",
  },
  {
    title: "מבנה קודם לתוכן",
    body: "לא עצה. בסוף כל שלב יש תוצר בכתב שאפשר להשתמש בו מחר בבוקר.",
  },
];

const DARK = "bg-[#15191c] text-[hsl(var(--background))]";

const Methodology = () => {
  useDocumentMeta({
    title: "המתודולוגיה — הפרוטוקול של COR-SYS | ארז טל-שיר",
    description:
      "איך עובד הרצף: שלב סינון ואז ארבעה שלבים בסדר קבוע — חילוץ, הבלטה, תרגום, הפעלה. למה מבנה מנצח אינטואיציה, ומה יוצא ביד בסוף כל שלב.",
    path: "/protocol",
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <a href="#protocol-main" className="skip-to-content">
        דלג לתוכן
      </a>

      <SiteHeader />

      <main id="protocol-main">
        {/* Hero — dark. The rods glow; copper CTA pops. */}
        <section
          dir="rtl"
          className={`relative overflow-hidden ${DARK} pt-28 pb-20 md:pt-36 md:pb-28`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(55% 45% at 30% 15%, hsl(var(--accent) / 0.16) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-6 md:grid-cols-2 md:gap-12">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                המתודולוגיה
              </p>
              <h1 className="cor-display mt-4 text-[hsl(var(--background))]">
                וקטורים מפוזרים,
                <br />
                מתלכדים לכיוון אחד
              </h1>
              <p className="cor-body-lg mt-5 max-w-md text-[hsl(var(--background))]/75">
                זהות, ערך, מוצר ומכירה מיושרים לכיוון אחד. כשהם מיושרים, האנרגיה
                הנדרשת לתנועה קטנה. זה ה־SYS ב־COR-SYS: לא עצה, מבנה.
              </p>
              <div className="mt-8">
                <Link
                  to="/#diagnostic-form"
                  className="cta-warm-lg inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
                >
                  קבע שיחת התאמה — 20 דקות, בלי לחץ
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <CoherenceVisual
                variant="dark"
                className="mx-auto aspect-[420/290] w-full max-w-md"
              />
            </Reveal>
          </div>
        </section>

        {/* Stage 0 — light, short. */}
        <section dir="rtl" className="py-16 md:py-20" aria-labelledby="gate-title">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <p className="cor-overline-he">לפני שמתחילים</p>
              <h2 id="gate-title" className="cor-title mt-2 text-foreground">
                שלב 0 — שיחת התאמה
              </h2>
              <p className="cor-body-lg mt-4 text-foreground/80">
                עשרים דקות, ללא תשלום. שתי שאלות: יש לך פרקטיקה פעילה עם לקוחות?
                ויש בידול שכבר קיים אצלך? בלי השניים האלה, אין ממה לחלץ — ואני אגיד
                לך את זה ביושר.
              </p>
            </Reveal>
          </div>
        </section>

        {/* The four stages — interactive stepper (light). */}
        <section dir="rtl" className="py-16 md:py-20" aria-labelledby="stages-title">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal className="mb-8 max-w-2xl">
              <p className="cor-overline-he">הרצף</p>
              <h2 id="stages-title" className="cor-title mt-2 text-foreground">
                ארבעה שלבים. סדר קבוע.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                לחצו בין השלבים — כל אחד בונה את הבא.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <StageStepper
                exitCriteria={EXIT_CRITERIA}
                inputs={INPUTS}
                transformations={TRANSFORMATIONS}
              />
            </Reveal>
          </div>
        </section>

        {/* Why a protocol — dark, mid-page anchor. */}
        <section
          dir="rtl"
          className={`${DARK} py-16 md:py-24`}
          aria-labelledby="why-title"
        >
          <div className="mx-auto max-w-4xl px-6">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                למה פרוטוקול
              </p>
              <h2
                id="why-title"
                className="cor-title mt-2 text-[hsl(var(--background))]"
              >
                למה מבנה, ולא אינטואיציה
              </h2>
            </Reveal>

            <RevealStagger className="mt-10 grid gap-8 md:grid-cols-3" as="ul">
              {PRINCIPLES.map((p) => (
                <RevealItem key={p.title} as="li" className="flex flex-col">
                  <div className="mb-4 h-px w-10 bg-accent" />
                  <h3 className="cor-subheading text-[hsl(var(--background))]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--background))]/70">
                    {p.body}
                  </p>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </section>

        {/* Proof — light. */}
        <section dir="rtl" className="py-16 md:py-20" aria-labelledby="proof-title">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <h2 id="proof-title" className="sr-only">
                הוכחה ועדויות לקוחות
              </h2>
              <QuantifiedProof />
              <ProofStrip className="mt-12" />
            </Reveal>
          </div>
        </section>

        {/* Risk reversal — the guarantee, right before the decision. */}
        <section dir="rtl" className="pb-4 md:pb-8" aria-labelledby="guarantee-title">
          <div className="mx-auto max-w-3xl px-6">
            <h2 id="guarantee-title" className="sr-only">
              האחריות
            </h2>
            <Reveal>
              <GuaranteeBand />
            </Reveal>
          </div>
        </section>

        {/* Closing CTA — dark bookend. */}
        <section dir="rtl" className={`${DARK} py-20 md:py-28`}>
          <Reveal className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="cor-title text-[hsl(var(--background))]">
              לא בטוח מאיפה להתחיל?
            </h2>
            <p className="cor-body-lg mt-4 text-[hsl(var(--background))]/75">
              בשיחת ההתאמה נחליט ביחד מאיזה שלב מתחילים. רוב הלקוחות מתחילים בשלב 1.
            </p>
            <div className="mt-8">
              <Link
                to="/#diagnostic-form"
                className="cta-warm-lg inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
              >
                קבע שיחת התאמה — 20 דקות, בלי לחץ
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Methodology;
