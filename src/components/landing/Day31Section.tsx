import { Reveal } from "./Reveal";
import { outreachCount } from "@/data/sprint-stages";

/**
 * The scene after the sprint ends.
 *
 * The page had process and artefacts and no picture of the reader using
 * either — the D in AIDA was simply absent, and a spec sheet does not create
 * wanting. This section is the one place the site describes an ordinary moment
 * rather than a deliverable.
 *
 * The last paragraph is not a softener that can be trimmed later. A vivid scene
 * of success reads as a forecast, and `src/data/claims.ts` holds the business
 * claim at `pending`: "המדגם קטן מכדי לקבוע שיעור, ולכן אין כאן מספר." So the
 * scene is written as what the four documents are FOR, and then says so
 * outright. Remove that line and this becomes an outcome promise the ledger
 * does not carry.
 *
 * Nothing here is a new claim: the sentence, the price and the outreaches are
 * the stage 1, 3 and 4 deliverables already specified in sprint-stages.ts.
 */

const Day31Section = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="day-31-title"
    >
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <p className="cor-overline-he">אחרי</p>
          <h2 id="day-31-title" className="cor-title mt-2 text-foreground">
            יום 31.
          </h2>

          <div className="mt-6 space-y-4 text-foreground/85">
            <p className="cor-body-lg">
              מישהו שואל במה אתה עוסק. יש לך משפט אחד. אתה אומר אותו, ולא מוסיף
              אחריו הסתייגות.
            </p>
            <p className="cor-body-lg">
              הוא שואל כמה זה עולה. המספר כתוב אצלך במסמך, אז הוא יוצא כמו שהוא.
              בלי לבדוק את הפנים שלו קודם.
            </p>
            <p className="cor-body-lg">
              ו-{outreachCount} הפניות כבר בחוץ, כל אחת לאדם ששמו ידוע לך.
            </p>
          </div>

          <p className="mt-8 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
            זה מה שארבעת המסמכים נועדו לאפשר. לא הבטחה שזה יקרה, אלא תיאור של מה
            שצריך להיות בידך כדי שזה יהיה אפשרי. מה שקורה אחר כך תלוי גם בשוק,
            וגם באנשים שבחרת לפנות אליהם.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Day31Section;
