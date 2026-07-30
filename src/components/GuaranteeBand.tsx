import GuaranteeBlock from "@/components/GuaranteeBlock";
import { activeGuarantee } from "@/data/guarantee";

/**
 * Risk-reversal band on /protocol.
 *
 * Renders nothing while ACTIVE_VARIANT is "none". The guarantee is a commercial
 * commitment, so which variant ships is Erez's call; see src/data/guarantee.ts
 * and /guarantee-review.
 */
const GuaranteeBand = ({ className }: { className?: string }) => {
  const variant = activeGuarantee();
  if (!variant) return null;
  return <GuaranteeBlock variant={variant} className={className} />;
};

export default GuaranteeBand;
