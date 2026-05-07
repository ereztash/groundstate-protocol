import { Reveal } from "./Reveal";

const PreFormSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-16 md:py-20"
      aria-labelledby="pre-form-title"
    >
      <div className="mx-auto max-w-2xl px-6">
        <Reveal className="space-y-5">
          <p className="cor-overline-he text-muted-foreground">
            שאלה אחת לפני שאתם ממלאים
          </p>
          <h2
            id="pre-form-title"
            className="cor-title text-foreground"
          >
            יש אצלכם תהליך מסוים שאתם תקועים בו, וכבר ניסיתם לפחות פעם אחת לזוז ממנו ולא הצליח?
          </h2>
          <p className="cor-body-lg text-foreground/80">
            אם התשובה היא <strong className="font-semibold">כן</strong>, שווה למלא. אם <strong className="font-semibold">לא בטוח</strong>, גם בסדר. נדבר 20 דקות ונראה.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            הטופס למטה. ארבעה שדות בשלב הראשון. תוך פחות מדקה.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default PreFormSection;
