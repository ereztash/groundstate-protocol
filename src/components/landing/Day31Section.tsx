import { outreachCount } from "@/data/sprint-stages";

/**
 * The scene after the sprint ends, and the one ink band on the landing page.
 *
 * The page had process and artefacts and no picture of the reader using
 * either, and a spec sheet does not create wanting. This section is the one
 * place the site describes an ordinary moment rather than a deliverable, so it
 * gets the page's only dark surface and the largest type below the hero.
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
const Day31Section = () => (
  <section
    dir="rtl"
    aria-labelledby="day-31-title"
    className="dark ld-section bg-background text-foreground"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
        <div>
          <p className="cor-overline-he">אחרי</p>
          <h2
            id="day-31-title"
            className="mt-4 font-heading text-[4.5rem] font-black leading-none tracking-tight sm:text-[6.5rem]"
          >
            יום 31.
          </h2>
        </div>

        <div className="max-w-2xl space-y-6 font-heading text-[1.375rem] leading-[1.45] sm:text-[1.625rem]">
          <p>
            מישהו שואל במה את עוסקת. יש לך משפט אחד. את אומרת אותו, ולא מוסיפה
            אחריו הסתייגות.
          </p>
          <p>
            הוא שואל כמה זה עולה. המספר כתוב אצלך במסמך, אז הוא יוצא כמו שהוא.
            בלי לבדוק את הפנים שלו קודם.
          </p>
          <p>ו-{outreachCount} הפניות כבר בחוץ, כל אחת לאדם ששמו ידוע לך.</p>

          <p className="border-t border-border pt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            זה מה שארבעת המסמכים נועדו לאפשר. לא הבטחה שזה יקרה, אלא תיאור של מה
            שצריך להיות בידך כדי שזה יהיה אפשרי. מה שקורה אחר כך תלוי גם בשוק,
            וגם באנשים שבחרת לפנות אליהם.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Day31Section;
