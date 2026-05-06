import { Reveal } from "./Reveal";

const CommitmentSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="commitment-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-6">
          <p className="cor-overline-he text-muted-foreground">
            המחויבות
          </p>
          <h2
            id="commitment-title"
            className="cor-title text-foreground"
          >
            שעת פגישה אחת. שעת חיסכון בשבוע. לכל החיים.
          </h2>
          <p className="cor-body-lg text-foreground/80">
            על כל שעת פגישה איתי, הארגון או העסק חוסך לפחות שעת עבודה אחת בשבוע, לכל שארית חיי התהליך.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default CommitmentSection;
