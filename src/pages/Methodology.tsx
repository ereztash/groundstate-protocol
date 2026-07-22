import { Link } from "react-router-dom";
import { Reveal, RevealItem, RevealStagger } from "@/components/landing/Reveal";
import CoherenceField from "@/components/experiential/CoherenceField";
import ProofStrip from "@/components/ProofStrip";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { stages } from "@/lib/stages";

/**
 * /protocol — the methodology page. The "named process" is the #1 authority
 * driver for high-ticket consulting sites, and section D of the knowledge-graph
 * brief is the deepest, best-corroborated (🌳) material we have. Content here is
 * reader-facing and evidence-grounded: no client names, no unverified metrics.
 */

// The exit criterion for each stage — the observable signal that it's done —
// translated to reader-facing language from the graph brief (section D).
const EXIT_CRITERIA: Record<string, string> = {
  "01": "אתה מנסח בעצמך, במילים שלך, את משפט הייעוד. הסימן: ניסוח חדש שיצא ממך — לא חזרה על ניסוח שלי.",
  "02": "אפשר לחזור על הצעת הערך שלך במשפט אחד שלא דורש חינוך-שוק, וההצעה כוללת מדד שניתן להמיר לכסף או לזמן.",
  "03": "מספר יוצא. לא אני נוקב בו — אתה. אני נותן השוואה חיצונית בת-הצלבה, ואתה מחשב.",
  "04": "הפנייה הראשונה נשלחת בתוך הפגישה. לא תלוי בתגובה — תלוי בכך שיצאה מהיד.",
};

const PRINCIPLES = [
  {
    title: "בעלות מרוויחים, לא מקבלים",
    body: "מבנה שנבנה תחת עומס נשאר ומתחזק. מבנה שמוגש מבחוץ מתפוגג. לכן אני לא נותן לך ניסוח — אני מחלץ אותו ממך, כדי שהוא יישאר שלך.",
  },
  {
    title: "סדר קבוע. כל שלב בונה את הבא",
    body: "אי-אפשר לתרגם ערך שעוד לא הובלט, ואי-אפשר להבליט נרטיב שעוד לא חולץ. ארבעה פעלים שלא ניתן לערבב בסדר שלהם.",
  },
  {
    title: "מבנה קודם לתוכן",
    body: "לא עצה, ולא עוד תובנה. בסוף כל שלב יש תוצר בכתב שאפשר להשתמש בו מחר בבוקר — מסמך, ניסוח, פנייה.",
  },
];

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

      {/* Minimal sub-page top bar (the landing Header is anchor-based). */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div
          dir="rtl"
          className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5"
        >
          <Link
            to="/"
            className="text-base font-semibold tracking-wide text-foreground outline-none"
            aria-label="COR-SYS — לעמוד הבית"
          >
            COR-SYS
          </Link>
          <Link
            to="/"
            className="cta-line inline-flex h-9 items-center rounded-md px-3.5 text-xs font-semibold md:px-4 md:text-sm"
          >
            בוא נדבר
          </Link>
        </div>
      </header>

      <main id="protocol-main" dir="rtl" className="divide-y divide-border">
        {/* Hero: the coherence concept, made visible. */}
        <section className="relative overflow-hidden bg-radial-soft pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 md:grid-cols-2 md:gap-12">
            <Reveal>
              <p className="cor-overline-he">המתודולוגיה</p>
              <h1 className="cor-display mt-4 text-foreground">
                וקטורים מפוזרים,
                <br />
                מתלכדים לכיוון אחד
              </h1>
              <p className="cor-body-lg mt-5 max-w-md text-foreground/80">
                זהות, ערך, מוצר ומכירה מיושרים לכיוון אחד. כשהם מיושרים, האנרגיה
                הנדרשת לתנועה קטנה. זה ה־SYS ב־COR-SYS: לא עצה, מבנה.
              </p>
              <div className="mt-8">
                <Link
                  to="/"
                  className="cta-warm-lg inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
                >
                  קבע שיחת התאמה — 20 דקות, בלי לחץ
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <CoherenceField className="mx-auto aspect-[420/290] w-full max-w-md" />
            </Reveal>
          </div>
        </section>

        {/* Stage 0 — the fit gate. */}
        <section className="py-16 md:py-24" aria-labelledby="gate-title">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <p className="cor-overline-he">לפני שמתחילים</p>
              <h2 id="gate-title" className="cor-title mt-2 text-foreground">
                שלב 0 — שיחת התאמה
              </h2>
              <p className="cor-body-lg mt-4 text-foreground/80">
                עשרים דקות, ללא תשלום. שתי שאלות מכריעות: יש לך פרקטיקה פעילה עם
                לקוחות? ויש בידול שכבר קיים אצלך, גם אם עוד לא ניסחת אותו? בלי
                השניים האלה, אין ממה לחלץ — ואני אגיד לך את זה ביושר, במקום לבזבז
                לשנינו את הזמן.
              </p>
            </Reveal>
          </div>
        </section>

        {/* The four stages. */}
        <section className="py-16 md:py-24" aria-labelledby="stages-title">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="mx-auto max-w-2xl">
              <p className="cor-overline-he">הרצף</p>
              <h2 id="stages-title" className="cor-title mt-2 text-foreground">
                ארבעה שלבים. סדר קבוע.
              </h2>
              <p className="mt-4 text-sm font-semibold tracking-wide text-accent">
                חילוץ. הבלטה. תרגום. הפעלה.
              </p>
            </Reveal>

            <RevealStagger className="mt-12 grid gap-8 md:grid-cols-2" as="ol">
              {stages.map((s) => (
                <RevealItem key={s.number} as="li" className="cor-card p-6 md:p-7">
                  <div className="flex items-baseline justify-between border-b border-border pb-3">
                    <span className="stage-numeral">{s.number}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
                      {s.verb}
                    </span>
                  </div>

                  <h3 className="cor-subheading mt-4 text-foreground">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {s.description}
                  </p>

                  <div className="mt-5 border-r-2 border-border pr-3">
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                      תוצר ביד
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                      {s.deliverable}
                    </p>
                  </div>

                  <div className="mt-4 border-r-2 border-primary/40 pr-3">
                    <p className="text-[11px] font-semibold tracking-wide text-primary">
                      הסימן שסיימנו
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                      {EXIT_CRITERIA[s.number]}
                    </p>
                  </div>

                  <p className="mt-5 text-base font-semibold text-foreground">
                    {s.priceLabel}
                  </p>
                </RevealItem>
              ))}
            </RevealStagger>

            <Reveal
              delay={0.1}
              className="mx-auto mt-10 max-w-2xl rounded-lg border border-accent/25 bg-card/60 px-5 py-4 text-center text-sm leading-relaxed text-foreground/80"
            >
              בסוף שלב 4 יש ביד אות התעניינות מתועד מלקוח-קצה אחד לפחות — או החזר
              מלא של שלב 4. הסיכון עליי, לא עליך.
            </Reveal>
          </div>
        </section>

        {/* Why a protocol, not intuition. */}
        <section className="py-16 md:py-24" aria-labelledby="why-title">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal className="mx-auto max-w-2xl">
              <p className="cor-overline-he">למה פרוטוקול</p>
              <h2 id="why-title" className="cor-title mt-2 text-foreground">
                למה מבנה, ולא אינטואיציה
              </h2>
            </Reveal>

            <RevealStagger className="mt-10 grid gap-6 md:grid-cols-3" as="ul">
              {PRINCIPLES.map((p) => (
                <RevealItem key={p.title} as="li" className="flex flex-col">
                  <div className="hairline mb-4" />
                  <h3 className="cor-subheading text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {p.body}
                  </p>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </section>

        {/* Proof — the clients already public on the landing, reused here. */}
        <section className="py-16 md:py-24" aria-labelledby="proof-title">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <h2 id="proof-title" className="sr-only">
                עדויות לקוחות
              </h2>
              <ProofStrip />
            </Reveal>
          </div>
        </section>

        {/* Closing CTA. */}
        <section className="py-16 md:py-24">
          <Reveal className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="cor-title text-foreground">
              לא בטוח מאיפה להתחיל?
            </h2>
            <p className="cor-body-lg mt-4 text-foreground/80">
              בשיחת ההתאמה נחליט ביחד מאיזה שלב מתחילים. רוב הלקוחות מתחילים בשלב 1.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="cta-warm-lg inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
              >
                קבע שיחת התאמה — 20 דקות, בלי לחץ
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div
          dir="rtl"
          className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 text-center text-xs text-muted-foreground"
        >
          <Link to="/" className="text-link">
            חזרה לעמוד הבית
          </Link>
          <p>© ארז טל-שיר — COR-SYS</p>
        </div>
      </footer>
    </div>
  );
};

export default Methodology;
