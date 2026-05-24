import { ShieldCheck } from "lucide-react";

type GuaranteeProps = { className?: string };

const Guarantee = ({ className = "" }: GuaranteeProps) => (
  <p
    className={`flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80 ${className}`}
  >
    <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
    <span>
      <span className="font-semibold text-foreground">אחריות החזר מלא</span> — אם
      אחרי שלב 1 לא קיבלת נרטיב חד יותר, אתה לא משלם. בלי טפסים, בלי ויכוח.
    </span>
  </p>
);

export default Guarantee;
