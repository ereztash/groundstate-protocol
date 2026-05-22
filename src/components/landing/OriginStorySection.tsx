import { Reveal } from "./Reveal";

const OriginStorySection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="origin-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-8">
          <div>
            <p className="cor-overline-he">
              איך הגעתי לכאן
            </p>
            <h2
              id="origin-title"
              className="cor-title mt-2 text-foreground"
            >
              גם לי היה ידע. ולא ידעתי איך להעביר אותו.
            </h2>
          </div>

          <div className="space-y-6 text-foreground/85">
            <p className="cor-body-lg">
              שנים החזקתי רק את הצד האנושי, סיפור ונרטיב. כשנכנסתי לעולם העסקי, גיליתי שאני יודע דברים שאחרים לא יודעים — וגם שאין לי שום מושג איך להסביר את זה ללקוח. נשמע מוכר.
            </p>
            <p className="cor-body-lg">
              מצאתי שהמבנה הוא חצי שני של אותה צורה. הבנתי שמי שמשלב שני עולמות לא צריך לבחור אחד מהם, צריך משפט אחד שמסביר למה דווקא הצירוף הזה הוא היתרון.
            </p>
          </div>

          <p className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            תיעדתי בעבר גידול של מיליון שקל בהכנסות בהקשר קמעונאי דרך התערבות התנהגותית. את הרצף הזה לעצמאיים בניתי השנה.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default OriginStorySection;
