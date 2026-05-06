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
            <p className="cor-overline-he text-muted-foreground">
              איך הגעתי לכאן
            </p>
            <h2
              id="origin-title"
              className="cor-title mt-2 text-foreground"
            >
              ראיתי את הקיים אחרי שיצאתי ממנו.
            </h2>
          </div>

          <div className="space-y-6 text-foreground/85">
            <p className="cor-body-lg">
              שנים החזקתי רק צד אחד, הצד האנושי. סיפור, נרטיב, סכמה. רק כשנכנסתי לעולם העסקי, ראיתי שהצד השני, הצד המבני, הוא חצי שני של אותה צורה. לא חיברתי ביניהם. ראיתי את הקיים אחרי שיצאתי ממנו.
            </p>
          </div>

          <p className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            תיעדתי בעבר גידול של מיליון שקל בהכנסות בהקשר קמעונאי דרך התערבות התנהגותית. את הרצף הזה בנוי לעצמאיים בניתי השנה.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default OriginStorySection;
