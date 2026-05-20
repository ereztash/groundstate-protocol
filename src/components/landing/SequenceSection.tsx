import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import { useDiagnosticForm, type StageValue } from "./DiagnosticFormProvider";
import { trackCtaClick } from "@/lib/analytics";

type Stage = {
  number: string;
  name: string;
  description: string;
  deliverable: string;
  price: string;
  ctaLabel: string;
  value: StageValue;
};

const stages: Stage[] = [
  {
    number: "01",
    name: "נרטיב ייחודי",
    description:
      "פגישה אחת לחילוץ הבידול שלך מתוך החומר שכבר קיים אצלך.",
    deliverable:
      "מסמך נרטיב באורך עמוד עד שניים עם 3 עד 5 ניסוחים מילוליים מוכנים.",
    price: "1,000 ש״ח",
    ctaLabel: "אני רוצה את שלב 1",
    value: "stage-1",
  },
  {
    number: "02",
    name: "הצעת ערך ייחודית",
    description:
      "פגישה אחת לבניית הצעת הערך מתוך הנרטיב, עם ניתוח שוק ומילון כאב מבוסס שיח לקוחות.",
    deliverable: "משפט ליבה ומילון כאב מוכן לשליחה.",
    price: "1,300 ש״ח",
    ctaLabel: "אני רוצה את שלב 2",
    value: "stage-2",
  },
  {
    number: "03",
    name: "מוצר ייחודי",
    description:
      "פגישה אחת להמרת הצעת הערך למוצר עם תמחור ורציונל.",
    deliverable: "תיאור מוצר עם תמחור ורציונל, מוכן לשליחה.",
    price: "1,600 ש״ח",
    ctaLabel: "אני רוצה את שלב 3",
    value: "stage-3",
  },
  {
    number: "04",
    name: "רכישת לקוחות פרואקטיבית",
    description:
      "פגישה אחת לבניית רשימת מקבלי החלטות וטיוטות פנייה.",
    deliverable:
      "10 פניות שנכתבו, נשלחו, ותועדו עם אותות הקנייה שזיהיתי בתגובות.",
    price: "1,900 ש״ח",
    ctaLabel: "אני רוצה את שלב 4",
    value: "stage-4",
  },
];

const SequenceSection = () => {
  const { requestStage } = useDiagnosticForm();

  const handleClick = (stage: Stage) => {
    trackCtaClick(`sequence_${stage.value}`);
    requestStage(stage.value);
  };

  return (
    <section
      id="sequence"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="sequence-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl">
          <p className="cor-overline-he text-muted-foreground">
            הרצף
          </p>
          <h2
            id="sequence-title"
            className="cor-title mt-2 text-foreground"
          >
            ארבעה שלבים. סדר קבוע.
          </h2>
        </Reveal>

        <RevealStagger
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          as="ol"
        >
          {stages.map((s) => (
            <RevealItem
              key={s.number}
              as="li"
              className="group flex flex-col"
            >
              <div className="border-t border-foreground pb-2 pt-4">
                <span className="stage-numeral block">{s.number}</span>
              </div>

              <h3 className="cor-subheading mt-4 text-foreground">
                {s.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
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

              <p className="mt-5 text-base font-semibold text-foreground">
                {s.price}
              </p>

              <button
                type="button"
                onClick={() => handleClick(s)}
                className="cta-line mt-4 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm"
              >
                {s.ctaLabel}
              </button>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal
          delay={0.1}
          className="mx-auto mt-14 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground"
        >
          לא בטוח מאיפה להתחיל? בשיחה הראשונה נחליט ביחד. רוב הלקוחות מתחילים בשלב 1.
        </Reveal>
      </div>
    </section>
  );
};

export default SequenceSection;
