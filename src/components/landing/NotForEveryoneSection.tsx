import { Reveal } from "./Reveal";

const NotForEveryoneSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="not-for-everyone-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-6">
          <p className="cor-overline-he text-muted-foreground">
            פילטר
          </p>
          <h2
            id="not-for-everyone-title"
            className="cor-title text-foreground"
          >
            זה לא מתאים לכולם.
          </h2>
          <p className="cor-body-lg text-foreground/80">
            אם אתם רגילים לעבוד על תחושה ולא על מבנה, זה ירגיש מעצבן. אם אתם מחפשים חימום רגשי לפני פעולה, אני לא הכתובת. נדבר לפני ונראה ביחד אם זה מתאים.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default NotForEveryoneSection;
