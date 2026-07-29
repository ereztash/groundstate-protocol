import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import { stages } from "@/lib/stages";

/**
 * Each stage produces a written deliverable the visitor walks away with.
 * The Sequence section already names them; this section *shows* them — a
 * stylized mockup of each document so the visitor can picture the outcome
 * before they buy.
 *
 * The visible quote on each card is a realistic snippet of the kind of
 * sentence that survives the stage; the rest of the body is rendered as
 * neutral gray "text lines" (not real content) so it reads as a document
 * preview without claiming ownership of anyone else's words.
 */

type DocSample = {
  docLabel: string;
  /**
   * The companion artefact the client also walks away with. Optional on
   * purpose: only the two that stages.ts actually defines are named here.
   * Stages 1 and 3 previously advertised "מפת אנרגיה" and "מפת הקיפול",
   * which appear nowhere else on the site and in no brief — a coined term
   * with nothing behind it costs more trust than the extra deliverable buys.
   */
  secondaryDoc?: string;
  highlight: string;
  lineCount: number;
};

const samples: Record<string, DocSample> = {
  "stage-1": {
    docLabel: "מסמך נרטיב",
    highlight: "אני עוזר ליועצים להפוך 20 שנות ניסיון למשפט אחד שאומרים בלי לגמגם.",
    lineCount: 8,
  },
  "stage-2": {
    docLabel: "הצעת ערך",
    secondaryDoc: "מילון כאב",
    highlight: "מה לקוח אומר: ״הניסוח שלי תקוע״. מה אני שומע: ״ההצעה לא חתוכה.״",
    lineCount: 7,
  },
  "stage-3": {
    docLabel: "תיאור מוצר",
    highlight: "מסלול 4 פגישות / 30 יום. נכס שעובד גם בעוד שנה.",
    lineCount: 9,
  },
  "stage-4": {
    docLabel: "10 פניות מתועדות",
    secondaryDoc: "יומן אותות קנייה",
    highlight: "Subject: ראיתי מה שכתבת על המשבר ב-Q2. שאלה אחת.",
    lineCount: 10,
  },
};

const DeliverablesPreview = () => {
  return (
    <section
      id="deliverables"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="deliverables-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl">
          <p className="cor-overline-he">תוצר ביד — דוגמה</p>
          {/* Was "זה מה שמקבלים. לא הבטחה." — directly contradicted by the two
              disclaimers below it, which state that nothing shown is a real
              client artefact. The claim and the caveat cancelled each other.
              This says what the section actually does: shows the shape. */}
          <h2
            id="deliverables-title"
            className="cor-title mt-2 text-foreground"
          >
            ככה נראה התוצר שנשאר אצלך.
          </h2>
          <p className="cor-body-lg mt-4 text-foreground/80">
            כל שלב מסתיים במסמך שאתה לוקח הביתה. אפשר לפתוח אותו שוב מחר, בעוד חודש, או להעביר ליועץ אחר כדי לבחון.
          </p>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            הכרטיסים למטה הם דוגמאות להמחשה בלבד — לא תוצרים אמיתיים של לקוחות.
          </p>
        </Reveal>

        <RevealStagger
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          as="ul"
        >
          {stages.map((stage) => {
            const sample = samples[stage.value as keyof typeof samples];
            if (!sample) return null;
            return (
              <RevealItem as="li" key={stage.value} className="block">
                <article
                  aria-label={`דוגמת תוצר עבור ${stage.name}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-5 shadow-[0_2px_6px_-2px_hsl(var(--foreground)/0.06)] transition-shadow hover:shadow-[0_8px_20px_-8px_hsl(var(--foreground)/0.12)]"
                  style={{ minHeight: "260px" }}
                >
                  {/* Document header: label + stage numeral */}
                  <header className="flex items-baseline justify-between border-b border-border/70 pb-3">
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                        {sample.docLabel}
                      </span>
                      <span className="rounded-full bg-foreground/[0.06] px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground">
                        דוגמה
                      </span>
                    </span>
                    <span
                      className="stage-numeral text-xl"
                      aria-hidden="true"
                    >
                      {stage.number}
                    </span>
                  </header>

                  {/* The highlighted quote — the kind of sentence the
                      deliverable produces. Not a real client quote;
                      illustrative. */}
                  <p
                    dir="rtl"
                    className="mt-4 text-xs font-semibold leading-snug text-primary/90"
                  >
                    ״{sample.highlight}״
                  </p>

                  {/* Kept artifact: the second deliverable that signals
                      psycho-social depth, not just a consulting note. */}
                  {sample.secondaryDoc && (
                    <p className="mt-3 inline-flex items-center gap-1 self-start rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 text-[11px] font-semibold text-accent">
                      + {sample.secondaryDoc}
                    </p>
                  )}

                  {/* Stylized body lines (visual placeholder for the
                      rest of the document body — not real content). */}
                  <div
                    className="mt-4 flex-1 space-y-2"
                    aria-hidden="true"
                  >
                    {Array.from({ length: sample.lineCount }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[5px] rounded-full bg-foreground/10"
                        style={{
                          width: `${72 + ((i * 17) % 26)}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Footer shows the stage name only — the prices are
                      deliberately deferred to the SequenceSection ladder that
                      now follows (value-before-price). */}
                  <footer className="mt-4 border-t border-border/70 pt-3">
                    <span className="text-[11px] font-medium text-foreground/70">
                      {stage.name}
                    </span>
                  </footer>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>

        <Reveal
          delay={0.1}
          className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground"
        >
          הציטוטים לעיל הם דוגמאות אופייניות, לא ציטוטים אמיתיים של לקוחות. תוכן אמיתי נשאר בין הלקוח לבין מי שכתב אותו.
        </Reveal>
      </div>
    </section>
  );
};

export default DeliverablesPreview;
