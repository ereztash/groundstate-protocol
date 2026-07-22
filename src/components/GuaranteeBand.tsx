import { ShieldCheck } from "lucide-react";

/**
 * Prominent risk-reversal band (conversion lever #3). Removing the buyer's
 * downside is one of the most direct conversion multipliers for a high-ticket,
 * trust-based purchase.
 *
 * Leads with the value guarantee Erez stands behind (an hour saved per week for
 * every meeting-hour), backed by the concrete stage-4 refund (graph-verified) as
 * the money-back safety net.
 */
const GuaranteeBand = ({ className }: { className?: string }) => (
  <div dir="rtl" className={`cor-card-featured p-6 md:p-8 ${className ?? ""}`}>
    <div className="flex items-start gap-4">
      <ShieldCheck
        aria-hidden="true"
        className="mt-1 h-7 w-7 shrink-0 text-accent"
      />
      <div>
        <p className="cor-overline-he">האחריות</p>
        <p className="cor-heading mt-2 text-foreground">
          על כל שעת פגישה איתי — אתה חוסך לפחות שעת עבודה בשבוע, לכל שארית חיי
          התהליך.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          ובשלב 4: ביד שלך אות התעניינות מתועד מלקוח-קצה אחד לפחות, או החזר מלא
          של שלב 4. הסיכון עליי, לא עליך.
        </p>
      </div>
    </div>
  </div>
);

export default GuaranteeBand;
