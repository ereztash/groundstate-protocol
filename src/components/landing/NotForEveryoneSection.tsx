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
          <p className="cor-body-lg text-foreground/85">
            זה לא מתאים אם:
          </p>
          <ul className="cor-body-lg list-none space-y-2 text-foreground/80">
            <li>אתה נותן שירות בעיקר לתאגידים, לא לעצמאים.</li>
            <li>יש לך כבר 30+ לקוחות פעילים ואתה רוצה לסנן.</li>
            <li>אתה רגיל לעבוד על תחושה ולא על מבנה, זה ירגיש מעצבן.</li>
            <li>אתה מחפש חימום רגשי לפני פעולה, אני לא הכתובת.</li>
          </ul>
          <p className="cor-body-lg text-foreground/80">
            נדבר לפני שנמשיך, נראה ביחד אם זה מתאים.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default NotForEveryoneSection;
