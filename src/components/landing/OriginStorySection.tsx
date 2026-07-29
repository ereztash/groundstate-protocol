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

          {/* The previous version opened with an unattributed million-shekel
              revenue claim. ClientProofSection tells the visitor every piece of
              proof here is "ניתנות לאימות", and that figure carried no company,
              year or link — the largest number on the page was the one nobody
              could check. Removed rather than dressed up: there is no evidence
              available for it. */}
          <p className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            את הרצף הזה לעצמאים בניתי השנה.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default OriginStorySection;
