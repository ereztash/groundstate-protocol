import { Reveal } from "./Reveal";

const ClientProofSection = () => {
  return (
    <section
      dir="rtl"
      className="relative bg-secondary/30 py-20 md:py-28"
      aria-labelledby="client-proof-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-8 text-center">
          <h2
            id="client-proof-title"
            className="cor-title text-foreground"
          >
            לקוחה ראשונה שהשלימה את הרצף
          </h2>

          <blockquote className="rounded-xl border border-border bg-card p-8 text-right md:p-10">
            <p className="cor-body-lg text-foreground/90">
              המבניות והחיבור מצד אחד ל-AI ומצד שני לסקרנות, היכולת להיות סקרן ולהוסיף ערך על מה שאני מביאה זה מה שנתן לי ביטחון.
            </p>
          </blockquote>

          <p className="text-sm leading-relaxed text-muted-foreground">
            חודש אחד. ארבעה שלבים. עסקה במספר ארבע ספרות שנסגרה אחרי השלב הרביעי.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default ClientProofSection;
