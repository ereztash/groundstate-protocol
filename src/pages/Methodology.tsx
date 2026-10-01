import { Link } from "react-router-dom";
import { Reveal, RevealItem, RevealStagger } from "@/components/landing/Reveal";
import CoherenceVisual from "@/components/experiential/CoherenceVisual";
import StageStepper from "@/components/StageStepper";
import StageFieldTrace from "@/components/experiential/StageFieldTrace";
import QuantifiedProof from "@/components/QuantifiedProof";
import ProofStrip from "@/components/ProofStrip";
import GuaranteeBand from "@/components/GuaranteeBand";
import EvidenceSection from "@/components/landing/EvidenceSection";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { outreachCount } from "@/data/sprint-stages";
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
  "01": "אתם מנסחים את המשפט שוב, בעצמכם ובמילים שלכם. כל עוד זה הניסוח שלי, עוד לא סיימנו.",
  "02": "אפשר לחזור על הצעת הערך שלכם במשפט אחד שלא דורש חינוך-שוק, וההצעה כוללת מדד שניתן להמיר לכסף או לזמן.",
  // Was: "מספר יוצא. לא אני נוקב בו — אתה. אני נותן השוואה חיצונית
  // בת-הצלבה, ואתה מחשב." That described a specific pricing mechanism — the
  // client computing the number from an external benchmark — as a certain
  // outcome of the stage. Per operator guidance 2026-07-30 that mechanism is
  // not currently anchored enough to promise. This states what the stage
  // produces instead of who arrives at the number.
  "03": "התמחור מנוסח בכתב, עם הרציונל לצידו, כך שאפשר להגיד אותו בקול בלי להסס, ולהסביר על מה הוא נשען.",
  // Was: "הפנייה הראשונה נשלחת בתוך הפגישה. לא תלוי בתגובה, תלוי בכך שיצאה
  // מהיד." That criterion is 🪦 in the graph: refuted twice on transcript
  // (`מפגש-4 הפעלה`, cross-check 2026-07-04, re-read 2026-07-28). In the field
  // the send slides to homework, to a fifth meeting, or does not happen — in
  // one extraction Erez says so in his own words. Promising it as the exit
  // criterion promises the one thing the transcripts show does not occur.
  // The replacement is what the graph records as actually happening (`S-ACQ`:
  // "הרצה מונחית בחדר") plus the goal `S2 ספרינט-הסנכרון` already holds: the
  // system removes the dependence on willpower to send, not the send itself.
  "04": "עוברים ביחד על הפנייה הראשונה בפגישה, עם ההכנה הכתובה שמאפשרת לה לצאת.",
};

// What goes into each stage — always the previous stage's output, which is
// the "כל שלב בונה את הבא" principle below made concrete and checkable.
const INPUTS: Record<string, string> = {
  "01": "חמישה סיפורים מקצועיים או רגעי שיא שכבר קיימים אצלכם, לא צריך לייצר חומר חדש.",
  "02": "הנרטיב משלב 1, ותגובות אמיתיות של לקוחות למה שהצעתם עד היום.",
  "03": "הצעת הערך ומילון הכאב משלב 2.",
  "04": "תיאור המוצר עם התמחור משלב 3.",
};

// Compact per-stage transformation, rendered right-to-left with left-pointing
// arrows — forward is leftward in RTL, same convention CoherenceVisual uses.
const TRANSFORMATIONS: Record<string, string> = {
  "01": "חמישה סיפורים מהעבודה ← מה שחוזר בהם ← המשפט שלכם",
  "02": "תגובות לקוחות ← מילון כאב ← הצעת ערך",
  "03": "הצעת ערך ← מבנה מוצר ← תיאור עם תמחור",
  "04": `תיאור מוצר ← מיפוי מקבלי החלטות ← ${outreachCount} פניות מתועדות`,
};

const PRINCIPLES = [
  {
    title: "אני מבקש מכם לנסח",
    body: "מהניסיון שלי, הדבר הכי גרוע שאני יכול לעשות זה להגיד לכם מה הייחודיות שלכם, כי זה משהו שאחר כך קשה לקחת עליו בעלות.",
  },
  {
    title: "כל שלב נשען על הקודם",
    body: "בשביל שנוכל להגיע למחיר, אני רוצה לוודא קודם שיש הצעה ברורה, וההצעה נבנית מהסיפור שלכם.",
  },
  {
    title: "מה יש לכם ביד",
    body: "בסוף כל שלב יש תוצר בכתב שאפשר להשתמש בו כבר למחרת.",
  },
];

const DARK = "bg-[#1C1C2E] text-[hsl(var(--background))]";

const Methodology = () => {
  useDocumentMeta({
    title: "המתודולוגיה, הפרוטוקול של COR-SYS | ארז טל-שיר",
    description:
      "איך עובד הרצף: שלב סינון ואז ארבעה שלבים בסדר קבוע, חילוץ, הבלטה, תרגום, הפעלה. למה מבנה מנצח אינטואיציה, ומה יוצא ביד בסוף כל שלב.",
    path: "/protocol",
  });

  // `overflow-x-clip` below, not `-hidden`: `hidden` on one axis makes the
  // other compute to `auto`, which turns the root into a scroll container and
  // silently breaks `position: sticky` inside it — which is what StageFieldTrace's
  // figure relies on. `clip` gives the same horizontal guard without creating
  // a scrollport.
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <a href="#protocol-main" className="skip-to-content">
        דילוג לתוכן
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
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D39A62]">
                המתודולוגיה
              </p>
              <h1 className="cor-display mt-4 text-[hsl(var(--background))]">
                כשכל החלקים
                <br />
                מספרים את אותו סיפור
              </h1>
              <p className="cor-body-lg mt-5 max-w-md text-[hsl(var(--background))]/75">
                החלקים הם מי שאתם, מה שאתם מציעים, המוצר והפנייה ללקוח. מה שאני רואה זה שכשהם לא מתחברים, הפוסטים וההצעות הולכים לכל מיני כיוונים.
              </p>
              <div className="mt-8">
                <Link
                  to="/#book"
                  className="cta-warm-lg inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
                >
                  לתיאום שיחת התאמה, 30 דקות, ללא תשלום
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
                שלב 0, שיחת התאמה
              </h2>
              <p className="cor-body-lg mt-4 text-foreground">
                שלושים דקות, ללא תשלום. אני שואל שתי שאלות. יש לכם כבר לקוחות? ויש משהו שאתם עושים אחרת, גם אם עוד לא ניסחתם אותו? בלי השניים האלה אין לנו ממה לעבוד, ואני אגיד לכם את זה בכנות.
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
                ארבעה שלבים, תמיד באותו סדר
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                גללו למטה ותראו איך זה נבנה.
              </p>
            </Reveal>

            {/* The shape first, scroll-linked; the detail second, in the
                stepper. Both read the same four stages from stages.ts. */}
            <StageFieldTrace
              transformations={TRANSFORMATIONS}
              className="mb-16"
            />

            <Reveal delay={0.05}>
              <p className="mb-6 text-sm text-muted-foreground">
                לחצו על כל שלב כדי לראות את הפירוט שלו.
              </p>
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
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D39A62]">
                למה פרוטוקול
              </p>
              <h2
                id="why-title"
                className="cor-title mt-2 text-[hsl(var(--background))]"
              >
                למה אני עובד ככה
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
        {/* Moved here from the landing page in v4 (2026-10-01): what has been
            checked, what has not, and the pre-registration, in full. */}
        <EvidenceSection />

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
              לא בטוחים מאיפה להתחיל?
            </h2>
            <p className="cor-body-lg mt-4 text-[hsl(var(--background))]/75">
              בשיחת ההתאמה נחליט ביחד מאיזה שלב מתחילים.
            </p>
            <div className="mt-8">
              <Link
                to="/#book"
                className="cta-warm-lg inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
              >
                לתיאום שיחת התאמה, 30 דקות, ללא תשלום
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
