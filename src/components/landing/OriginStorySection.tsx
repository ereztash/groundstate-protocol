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
          <h2
            id="origin-title"
            className="cor-title text-foreground"
          >
            איך הגעתי לכאן
          </h2>

          <p className="cor-body-lg text-foreground/85">
            שנים החזקתי רק צד אחד, הצד האנושי. סיפור, נרטיב, סכמה. רק כשנכנסתי לעולם העסקי, ראיתי שהצד השני, הצד המבני, הוא חצי שני של אותה צורה. לא חיברתי ביניהם. ראיתי את הקיים אחרי שיצאתי ממנו.
          </p>

          <p className="text-sm leading-relaxed text-muted-foreground">
            תיעדתי בעבר גידול של מיליון שקל בהכנסות בהקשר קמעונאי דרך התערבות התנהגותית. את הרצף הזה בנוי לעצמאיים בניתי השנה.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default OriginStorySection;
