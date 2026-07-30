/*
 * Each beat previously carried a "הפעולה הקוגניטיבית" label — איסוף,
 * זיהוי משפט-תפיסה, הוספת זווית, תיווך לפעולה. Nothing on the site or in the
 * knowledge-graph brief defines any of those four, and they were set in 10px
 * uppercase: the most opaque vocabulary on the page in its weakest type. The
 * stage verbs in stages.ts (חילוץ / הבלטה / תרגום / הפעלה) are the terms the
 * page actually explains, so those are the ones that stay.
 */
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
    body: "מה התקיעה ומה ניסית עד עכשיו. אני מקשיב, לא קוטע, לא מתקן.",
  },
  {
    marker: "00:05",
    title: "חילוץ נקודה אחת.",
    body: "אני שואל על משהו ספציפי שעשית פעם שאתה גאה בו מקצועית. שם יושב הבידול שלך, רק שעוד לא ניסחת אותו.",
  },
  {
    marker: "00:12",
    title: "שיקוף.",
    body: "אני אומר בקול מה שאני שומע. אם זה מדויק, ממשיכים. אם לא, מתקנים ביחד.",
  },
  {
    marker: "00:17",
    title: "החלטה.",
    body: "אומר ישר אם זה מתאים, ומאיזה שלב להתחיל. אם לא מתאים, גם זה תשובה ברורה.",
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
          <p className="cor-overline-he">
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
              <p className="font-mono text-xs tracking-wide text-primary">
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
