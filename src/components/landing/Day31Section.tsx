import { outreachCount } from "@/data/sprint-stages";
import SectionHead from "./SectionHead";

/**
 * The scene after the sprint ends.
 *
 * The page had process and artefacts and no picture of the reader using
 * either, and a spec sheet does not create wanting. This section is the one
 * place the site describes an ordinary moment rather than a deliverable, so it
 * gets its own sheet band and the largest type below the hero. It was
 * charcoal until the 30.9 pilot: four dark bands in ten sections broke the
 * brand book's one-in-three-or-four, and both respondents found the page too
 * dark to read comfortably.
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
    className="ld-section ld-band-sheet border-y border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
        <div>
          <SectionHead n="03" label="אחרי" />
          <h2
            id="day-31-title"
            className="mt-4 font-heading text-[3.25rem] font-black leading-none tracking-tight sm:text-[5rem]"
          >
            יום 31<span className="cor-point">.</span>
          </h2>
        </div>

        <div className="max-w-2xl space-y-6 text-2xl leading-[1.5]">
          <p>
            מישהו שואל במה אתם עוסקים. יש לכם משפט אחד. אתם אומרים אותו, ולא
            מוסיפים אחריו הסתייגות.
          </p>
          <p>
            הוא שואל כמה זה עולה. המספר כתוב אצלכם במסמך, אז הוא יוצא כמו שהוא.
            בלי לבדוק את הפנים שלו קודם.
          </p>
          <p>ו-{outreachCount} הפניות כבר בחוץ, כל אחת לאדם ששמו ידוע לכם.</p>

          <p className="border-t border-border pt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            זה מה שארבעת המסמכים נועדו לאפשר: תיאור של מה שצריך להיות בידכם כדי
            שזה יהיה אפשרי. אין כאן הבטחה שזה יקרה. מה שקורה אחר כך תלוי גם
            בשוק, וגם באנשים שבחרתם לפנות אליהם.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Day31Section;
