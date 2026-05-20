import { Reveal } from "./Reveal";

const WhatYouTriedSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="what-you-tried-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-8">
          <div>
            <p className="cor-overline-he">
              למה הגעת לכאן
            </p>
            <h2
              id="what-you-tried-title"
              className="cor-title mt-2 text-foreground"
            >
              ניסית כבר את כל מה שמציעים. וזה לא הזיז.
            </h2>
          </div>

          <div className="space-y-5 text-foreground/85">
            <p className="cor-body-lg">
              ישבת שעות מול GPT והחזרת לעצמך את עצמך, רק עם יותר מילים. שילמת ל"מומחה לידים" שעזב אותך עם רשימה ובלי מערכת יחסים. כתבת פוסטים שאספו מאות חשיפות, ואפס פניות חזרו.
            </p>
            <p className="cor-body-lg">
              זה לא קרה כי לא ניסית. זה קרה כי הכלים האלה לא יודעים מה אתה בעצם מציע. רק אתה יודע. הם לא יכולים להוציא את זה ממך, כי הם לא יושבים מולך בחדר.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default WhatYouTriedSection;
