import { Reveal } from "./Reveal";

const CommitmentSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="commitment-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="rounded-2xl border border-accent/30 bg-card p-8 text-center md:p-10">
          <h2
            id="commitment-title"
            className="cor-title text-foreground"
          >
            המחויבות
          </h2>
          <p className="cor-body-lg mt-5 text-foreground/85">
            על כל שעת פגישה איתי, הארגון או העסק חוסך לפחות שעת עבודה אחת בשבוע, לכל שארית חיי התהליך.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default CommitmentSection;
