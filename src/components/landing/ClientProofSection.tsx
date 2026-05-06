import { Reveal } from "./Reveal";

const ClientProofSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="client-proof-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-10">
          <div>
            <p className="cor-overline-he text-muted-foreground">
              לקוחה ראשונה שהשלימה את הרצף
            </p>
            <h2
              id="client-proof-title"
              className="cor-title mt-2 text-foreground"
            >
              חודש אחד. ארבעה שלבים. עסקה במספר ארבע ספרות.
            </h2>
          </div>

          <blockquote className="pull-quote pr-8 md:pr-10">
            <p>
              המבניות והחיבור מצד אחד ל-AI ומצד שני לסקרנות, היכולת להיות סקרן ולהוסיף ערך על מה שאני מביאה זה מה שנתן לי ביטחון.
            </p>
          </blockquote>

          <p className="text-sm leading-relaxed text-muted-foreground">
            עסקה נסגרה אחרי השלב הרביעי, מתוך 10 הפניות שיצאו ביחד.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default ClientProofSection;
