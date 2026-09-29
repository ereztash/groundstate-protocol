import GuaranteeBlock from "@/components/GuaranteeBlock";
import { activeGuarantee } from "@/data/guarantee";

/**
 * Compact guarantee line under the price in FullPackageSection. Renders nothing
 * while no variant is live; see src/data/guarantee.ts.
 */
const Guarantee = ({ className = "" }: { className?: string }) => {
  const variant = activeGuarantee();
  if (!variant) return null;
  return <GuaranteeBlock variant={variant} compact className={className} />;
};

export default Guarantee;
