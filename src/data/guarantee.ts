import { SIGNED_PROPOSAL_GUARANTEE } from "./guaranteeSigned";

/**
 * The guarantee. Live since 2026-09-29.
 *
 * Round 1 replaced a stage-1 promise ("a sharper narrative or you do not pay",
 * phrased "no forms, no argument") with the stage-4 guarantee, which is the one
 * with a stated source. That was the right call on sourcing and the wrong call
 * to make alone: removing a guarantee is a commercial decision, and removing it
 * bought no evidence hygiene. The recorded exposure was on the NUMBER (₪1,900
 * was set operationally, with no derivation, ledger 2026-07-29), not on the
 * promise.
 *
 * Three options were built and none shipped while the decision was open. Erez
 * decided on 2026-09-29, and picked none of the three: he chose the guarantee
 * from the proposal he signed with a client on 2026-08-31, as written. It lives
 * in ./guaranteeSigned. The three earlier options stay in ./guaranteeVariants
 * for /guarantee-review, in dev, and never reach the bundle.
 *
 * Never add "no questions asked", and never add a condition that is not in the
 * signed text.
 */

export type GuaranteeVariantId =
  | "signed-proposal"
  | "outreach-sent"
  | "with-amount"
  | "without-amount"
  | "none";

/**
 * Flip only on Erez's decision. "none" renders no guarantee anywhere.
 * Set to "signed-proposal" on his decision of 2026-09-29.
 */
export const ACTIVE_VARIANT: GuaranteeVariantId = "signed-proposal";

export type GuaranteeVariant = {
  id: Exclude<GuaranteeVariantId, "none">;
  /** The money amount, or null when the variant states no number. */
  amount: string | null;
  headline: string;
  signalsLabel: string;
  signals: readonly string[];
  signalsNote: string;
  excludedLabel: string;
  excluded: readonly string[];
  /** A documentation rule, only where the guarantee's own text states one. */
  documentation?: string;
};

export function activeGuarantee(): GuaranteeVariant | null {
  // Only the adopted wording is reachable from here. The three superseded
  // options are imported by /guarantee-review alone, which is compiled out of
  // production, so they cannot ship by accident; e2e/case-intake.spec.ts
  // asserts their absence from the bundle.
  if (ACTIVE_VARIANT === "none") return null;
  return ACTIVE_VARIANT === SIGNED_PROPOSAL_GUARANTEE.id
    ? SIGNED_PROPOSAL_GUARANTEE
    : null;
}
