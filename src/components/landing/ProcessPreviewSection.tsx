import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Beat = {
  marker: string;
  title: string;
  body: string;
};

const beats: Beat[] = [
  {
    marker: "00:00",
    title: "פתיחה. שתי שאלות.",
    body: "מה התהליך שאתם מנסים לזוז בו ולא מצליחים, ומה ניסיתם עד עכשיו. אני שותק.",
  },
  {
    marker: "00:05",
    title: "חילוץ אירוע אחד.",
    body: "אני שואל על אירוע ספציפי מהעבר שאתם לא מסוגלים להחמיא לעצמכם עליו היום, אבל מסוגלים ביחס לעבר שלכם. שם יושב הבידול.",
  },
  {
    marker: "00:12",
    title: "שיקוף.",
    body: "אני אומר לכם בקול את מה שאני שומע. אם זה מדויק, ממשיכים. אם לא, מתקנים.",
  },
  {
    marker: "00:17",
    title: "החלטה.",
    body: "אני אומר ישר אם הרצף מתאים, ואיזה שלב לפתוח בו. אם לא מתאים, גם זה תשובה.",
  },
];

const ProcessPreviewSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="process-preview-title"
    >
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="mx-auto max-w-2xl">
          <p className="cor-overline-he text-muted-foreground">
            מה קורה בפגישה הראשונה
          </p>
          <h2
            id="process-preview-title"
            className="cor-title mt-2 text-foreground"
          >
            עשרים דקות. ארבע תחנות.
          </h2>
        </Reveal>

        <RevealStagger
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          as="ol"
        >
          {beats.map((b) => (
            <RevealItem key={b.marker} as="li">
              <p className="font-mono text-xs tracking-wide text-accent">
                {b.marker}
              </p>
              <h3 className="cor-subheading mt-2 text-foreground">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {b.body}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
};

export default ProcessPreviewSection;
