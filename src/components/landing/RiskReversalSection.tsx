import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Reassurance = {
  headline: string;
  body: string;
};

const items: Reassurance[] = [
  {
    headline: "אבחון התאמה לפני, ללא תשלום.",
    body: "שיחה של 20 דקות שבסופה אני אומר ישר אם הרצף מתאים. אם לא, גם זה תשובה. בלי לחץ לקנות.",
  },
  {
    headline: "כל שלב נסגר לחוד.",
    body: "אין הסכמים ארוכי טווח. אם אחרי שלב 1 הנרטיב לא ברור או לא מדויק, לא ממשיכים. אני לא מוכר רצף שמתחיל בכשל.",
  },
  {
    headline: "הרצף שלי, האחריות שלי.",
    body: "כל פגישה מסתיימת בתוצר ביד. אם אחרי פגישה אתם לא מחזיקים תוצר שאפשר להשתמש בו, חזרנו לשולחן השרטוט בלי תוספת תשלום.",
  },
];

const RiskReversalSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="risk-reversal-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-4">
          <p className="cor-overline-he text-muted-foreground">
            הסיכון על שולחן הדיון
          </p>
          <h2
            id="risk-reversal-title"
            className="cor-title text-foreground"
          >
            לא צריך להאמין לי. צריך לראות את שלב 1.
          </h2>
        </Reveal>

        <RevealStagger className="mt-10 space-y-6" as="ul">
          {items.map((it, i) => (
            <RevealItem
              key={i}
              as="li"
              className="border-r-2 border-accent/40 pr-4"
            >
              <p className="text-base font-semibold text-foreground">
                {it.headline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {it.body}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
};

export default RiskReversalSection;
