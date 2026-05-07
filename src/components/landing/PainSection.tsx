import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type PainPoint = {
  state: string;
  consequence: string;
};

const points: PainPoint[] = [
  {
    state: "אתם יודעים מה אתם עושים, אבל לא יודעים להגיד את זה במשפט אחד שגורם למישהו לעצור.",
    consequence: "ולכן כל פנייה מתחילה בהסבר, וההסבר עצמו עייף.",
  },
  {
    state: "המוצר שלכם בסדר, אבל הוא נראה דומה למוצר של עוד עשרים אנשים בשוק.",
    consequence: "ולכן הלקוח בוחר לפי מחיר, או דוחה את ההחלטה בכלל.",
  },
  {
    state: "פניתם בעבר ללקוחות, וקיבלתם 'נחמד, נחזור אליך'.",
    consequence: "ולא ידעתם אם הבעיה בהם, בכם, או בניסוח שביניכם.",
  },
  {
    state: "אתם משקיעים בתוכן, ב-AI, בכלים, אבל ההכנסות לא נעות בקצב הזה.",
    consequence: "ולא ברור אם חסר לכם עוד עבודה, או צורה אחרת לעשות אותה.",
  },
];

const PainSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="pain-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-6">
          <p className="cor-overline-he text-muted-foreground">
            אם זה נשמע מוכר
          </p>
          <h2 id="pain-title" className="cor-title text-foreground">
            אתם לא תקועים. אתם זזים בלי כיוון.
          </h2>
          <p className="cor-body-lg text-foreground/80">
            ההבדל בין השניים הוא הצורה שבה אתם חושבים על מה שאתם עושים. לא הכמות. לא המאמץ.
          </p>
        </Reveal>

        <RevealStagger className="mt-12 space-y-6" as="ul">
          {points.map((p, i) => (
            <RevealItem
              key={i}
              as="li"
              className="border-r-2 border-border pr-4 transition-colors hover:border-accent/60"
            >
              <p className="text-base leading-relaxed text-foreground/90">
                {p.state}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.consequence}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal
          delay={0.1}
          className="mt-12 border-t border-border pt-6 text-sm leading-relaxed text-foreground/85"
        >
          אם אתם מזהים את עצמכם בלפחות שניים מהארבעה, ההמשך כתוב בשבילכם.
        </Reveal>
      </div>
    </section>
  );
};

export default PainSection;
