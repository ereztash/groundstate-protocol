import { z } from "zod";
import { stagePayloadLabels } from "@/data/sprint-stages";

/**
 * The diagnostic form's validation contract, and the option lists it renders.
 *
 * Split out of DiagnosticFormSection.tsx so the rules that decide whether a
 * lead is accepted can be read and tested without mounting a form. This is the
 * gate every enquiry passes through: the six CTAs on the site all land here, so
 * a rule that is wrong here is wrong for every visitor, and the only way to see
 * it through the component was to drive the UI.
 *
 * Two-step progressive form, psychological order:
 * Step 1 (low-stakes emotional entry): the pain in one sentence + name, then
 *   the one screening question.
 *   Lets the visitor "pay" with a small disclosure before identity.
 * Step 2 (commitment): phone (required), email + time windows (optional).
 *   They are already invested by this point.
 * Stage selection (which package) is decided in the call, not on the form.
 *
 * The screening question is the objective half of NotForEveryoneSection's
 * filter, and matches the "שלב 0" gate already written on /protocol. It sits in
 * step 1 specifically because every CTA on the site lands here — the prose
 * filter further up the page can be scrolled past by any of the six entry
 * points, this cannot. A "no" never blocks the submit (it is still a lead); it
 * tags the row so follow-up can be prioritised and worded differently.
 */

/**
 * Israeli local format: a leading 0, a one or two digit area/carrier code, an
 * optional hyphen, then seven digits. The second branch accepts ten digits with
 * no separator.
 *
 * Deliberately local-only. It rejects the +972 international form, which a
 * visitor abroad or one copying from a contact card may well type. Left as-is
 * here because widening what the form accepts is a product decision rather than
 * part of moving this file; diagnosticSchema.test.ts pins the current behaviour
 * either way, so a later change to it has to be made on purpose.
 */
export const ISRAELI_PHONE = /^0\d{1,2}-?\d{7}$|^0\d{9}$/;

// Derived, not re-typed. These labels used to repeat all four stage names as
// literals, so renaming a stage had three places to go wrong.
export const stageLabels = stagePayloadLabels;

export const timeWindows = [
  { id: "morning", label: "בוקר, 08:00 עד 12:00" },
  { id: "noon", label: "צהריים, 12:00 עד 16:00" },
  { id: "evening", label: "ערב, 16:00 עד 20:00" },
] as const;

export const stepOneSchema = z.object({
  challenge: z
    .string()
    .min(3, { message: "כתבי משפט אחד" })
    .max(800, { message: "תיאור ארוך מדי" }),
  fullName: z
    .string()
    .min(2, { message: "שם קצר מדי" })
    .max(80, { message: "שם ארוך מדי" }),
  activePractice: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "בחרי אחת מהאפשרויות" }),
  }),
});

export const stepTwoSchema = z.object({
  phone: z
    .string()
    .min(9, { message: "מספר טלפון לא תקין" })
    .regex(ISRAELI_PHONE, { message: "מספר טלפון ישראלי לא תקין" }),
  email: z
    .string()
    .email({ message: "כתובת מייל לא תקינה" })
    .optional()
    .or(z.literal("")),
  preferredTimes: z.array(z.string()).optional(),
});

export type StepOneValues = z.infer<typeof stepOneSchema>;
export type StepTwoValues = z.infer<typeof stepTwoSchema>;
