import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";

type Session = {
  day: string;
  title: string;
  desc: string;
  marker: string;
  tracks: { label: string; move: string; tone: "primary" | "opportunity" | "insight" }[];
};

const sessions: Session[] = [
  {
    day: "יום 1–8",
    title: "פגישה 1 · פתיחת המנסרה",
    desc: "שלושת המסלולים נפתחים יחד. אתה יוצא מהפגישה עם משפט אחד שאתה אומר בלי למצמץ — וחוזר הביתה ומספר לבת הזוג בלי להתבלבל.",
    marker: "Kickoff",
    tracks: [
      { label: "A", move: "נקודת מוצא", tone: "primary" },
      { label: "B", move: "יעד בשם ותאריך", tone: "opportunity" },
      { label: "Data", move: "מקורות האזנה", tone: "insight" },
    ],
  },
  {
    day: "יום 8–15",
    title: "פגישה 2 · עומק בכל מסלול",
    desc: "המשפט מתחדד. ההצעה הופכת למחיר סגור. מה שהלקוח אמר בלינקדאין — כבר ברשימה שלך. בסוף השבוע יש לך דף אחד שאפשר לשלוח.",
    marker: "Depth",
    tracks: [
      { label: "A", move: "המנגנון בגוף המשפט", tone: "primary" },
      { label: "B", move: "מחיר סגור · דף אחד", tone: "opportunity" },
      { label: "Data", move: "מילון כאב · 5 משפטים", tone: "insight" },
    ],
  },
  {
    day: "יום 15–22",
    title: "פגישה 3 · השחמט",
    desc: "אנחנו עומדים ביעד ומחזירים את הצעדים אחורה. לפניך 15 שמות ברשימה, סדר עדיפויות, ובדיוק מה לכתוב לכל אחד — עד הפסיק.",
    marker: "Reverse",
    tracks: [
      { label: "A", move: "המיצוב ננעל", tone: "primary" },
      { label: "B", move: "פקודת מבצע", tone: "opportunity" },
      { label: "Data", move: "15 שמות · מי קודם", tone: "insight" },
    ],
  },
  {
    day: "יום 22–30",
    title: "פגישה 4 · פניות קרות · ליווי אישי",
    desc: "ארבע שעות בזום משותף. אתה כותב, אני מסתכל, אנחנו שולחים. עשר פניות יוצאות בזמן אמת. ההתנגדות הראשונה שחוזרת — ענינו עליה יחד.",
    marker: "Live Fire",
    tracks: [
      { label: "10 פניות", move: "יצאו בזמן אמת", tone: "opportunity" },
      { label: "לקוח ראשון", move: "מחזיר במייל", tone: "primary" },
    ],
  },
];

const toneChip: Record<
  "primary" | "opportunity" | "insight",
  { text: string; border: string; bg: string }
> = {
  primary: {
    text: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/10",
  },
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
};

const SprintTimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 40%"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      dir="rtl"
      className="relative py-24 md:py-32"
      aria-labelledby="sprint-title"
    >
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="cor-overline text-primary">הלוח · 30 ימים</p>
          <h2 id="sprint-title" className="cor-title mt-3 text-foreground">
            ארבע פגישות. עד שלקוח ראשון אומר "בוא נדבר".
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            בכל פגישה A, B ו-Data זזים יחד. בפגישה הרביעית אני לא שולח לך feedback — אני יושב לידך, ואנחנו שולחים.
          </p>
        </Reveal>

        <div ref={containerRef} className="relative pr-12 md:pr-16">
          {/* Rail — static + animated fill */}
          <div className="pointer-events-none absolute right-4 top-0 bottom-0 w-px bg-border/40 md:right-6" />
          <motion.div
            className="pointer-events-none absolute right-4 top-0 w-px origin-top bg-gradient-to-b from-primary via-cor-insight to-cor-opportunity md:right-6"
            style={{ height: railHeight }}
          />

          <ol className="space-y-10 md:space-y-14">
            {sessions.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0, 0, 0.2, 1],
                }}
                className="relative"
              >
                {/* Node marker on rail */}
                <div className="absolute -right-[2.25rem] top-1 md:-right-[2.75rem]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-primary/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                </div>

                <div className="group rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="cor-overline rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-primary">
                      {s.day}
                    </span>
                    <span className="cor-overline text-muted-foreground">
                      {s.marker}
                    </span>
                  </div>
                  <h3 className="cor-subheading mt-3 text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>

                  {/* Track chips showing what moves in this session */}
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.tracks.map((t) => {
                      const chip = toneChip[t.tone];
                      return (
                        <li
                          key={`${s.title}-${t.label}`}
                          className={`inline-flex items-center gap-2 rounded-full border ${chip.border} ${chip.bg} px-2.5 py-1`}
                        >
                          <span className={`font-mono text-[10px] font-bold ${chip.text}`}>
                            {t.label}
                          </span>
                          <span className="text-xs text-foreground/80">
                            {t.move}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default SprintTimelineSection;
