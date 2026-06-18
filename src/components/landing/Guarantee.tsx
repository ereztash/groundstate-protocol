import { ShieldCheck } from "lucide-react";

type GuaranteeProps = { className?: string };

const Guarantee = ({ className = "" }: GuaranteeProps) => (
  <p
    className={`flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80 ${className}`}
  >
    <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
    <span>
      <span className="font-semibold text-foreground">אחריות ללא פשרות</span> — שלב 1
      עולה 1,000 ₪. אם בסוף הפגישה הנרטיב שלך לא חד יותר — אתה לא משלם. בלי טופס, בלי
      ויכוח. אני מציע את זה כי אני בטוח במה שאני עושה.
    </span>
  </p>
);

export default Guarantee;
