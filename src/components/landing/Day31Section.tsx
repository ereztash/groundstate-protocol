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
          <SectionHead label="אחרי" />
          <h2
            id="day-31-title"
            className="mt-4 font-heading text-[3.25rem] font-black leading-none tracking-tight sm:text-[5rem]"
          >
            מה קורה אחרי חודש<span className="cor-point">.</span>
          </h2>
        </div>

        <div className="max-w-2xl space-y-6 text-2xl leading-[1.5]">
          <p>
            מישהו שואל במה אתם עוסקים, ויש לכם משפט אחד שאתם יכולים להגיד לו בלי להסביר קודם את כל הפילוסופיה.
          </p>
          <p>
            כשהוא שואל כמה זה עולה, אתם עונים במספר שכתוב אצלכם במסמך. עד אז
            כבר שלחתם {outreachCount} פניות לאנשים שבחרתם.
          </p>

          {/* Restored 2.10 after round 5 dropped it for sounding like a reflex hedge:
              see the header, this line is what keeps the scene from being a forecast.
              One sentence now, in Erez's own "לא יכול להבטיח" (E05394). */}
          <p className="border-t border-border pt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            אני לא יכול להבטיח שזה יקרה, זה תלוי גם במי שתפנו אליו.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Day31Section;
