import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { Reveal } from "./Reveal";
import SpotsLeft from "./SpotsLeft";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
// Lazy: react-calendly is ~40KB and only needed AFTER the form is submitted.
// Keeping it out of the main bundle drops first-paint JS by that much.
const BookingSection = lazy(() => import("./BookingSection"));
import {
  submitForm,
  type DiagnosticPayload,
} from "@/lib/web3forms";
import { trackEvent, trackFormStart, trackFormSubmit } from "@/lib/analytics";
import { formatWizardAnswers, loadWizardState } from "@/lib/wizardState";

const ISRAELI_PHONE = /^0\d{1,2}-?\d{7}$|^0\d{9}$/;

const stageLabels: Record<string, string> = {
  "stage-1": "שלב 1, נרטיב ייחודי",
  "stage-2": "שלב 2, הצעת ערך ייחודית",
  "stage-3": "שלב 3, מוצר ייחודי",
  "stage-4": "שלב 4, רכישת לקוחות פרואקטיבית",
  "full-package": "חבילה מלאה",
};

const timeWindows = [
  { id: "morning", label: "בוקר, 08:00 עד 12:00" },
  { id: "noon", label: "צהריים, 12:00 עד 16:00" },
  { id: "evening", label: "ערב, 16:00 עד 20:00" },
] as const;

/**
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
const stepOneSchema = z.object({
  challenge: z
    .string()
    .min(3, { message: "כתוב/י משפט אחד" })
    .max(800, { message: "תיאור ארוך מדי" }),
  fullName: z
    .string()
    .min(2, { message: "שם קצר מדי" })
    .max(80, { message: "שם ארוך מדי" }),
  activePractice: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "בחר/י אחת מהאפשרויות" }),
  }),
});

const stepTwoSchema = z.object({
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

type StepOneValues = z.infer<typeof stepOneSchema>;
type StepTwoValues = z.infer<typeof stepTwoSchema>;

const DiagnosticFormSection = () => {
  const { selectedStage, source } = useDiagnosticForm();
  const [step, setStep] = useState<1 | 2>(1);
  const [stepOneData, setStepOneData] = useState<StepOneValues | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const attemptRef = useRef(0);
  // Honeypot: read at submit time (see payload below). Lives outside the
  // step forms so its value survives the step 1 → step 2 transition.
  const honeypotRef = useRef<HTMLInputElement>(null);

  const stepOne = useForm<StepOneValues>({
    resolver: zodResolver(stepOneSchema),
    mode: "onTouched",
    // activePractice is deliberately left undefined so neither answer is
    // pre-selected — a default would make the screening answer meaningless.
    defaultValues: { challenge: "", fullName: "" },
  });

  const stepTwo = useForm<StepTwoValues>({
    resolver: zodResolver(stepTwoSchema),
    mode: "onTouched",
    defaultValues: { phone: "", email: "", preferredTimes: [] },
  });

  // When a stage button on the page is clicked, we still capture the intent
  // for the payload — but we never ask the visitor to choose a stage in the form.
  const [stageHint, setStageHint] = useState<string>("");
  useEffect(() => {
    if (selectedStage) {
      setStageHint(stageLabels[selectedStage] || selectedStage);
    }
  }, [selectedStage]);

  // Move focus to the confirmation heading on success so screen-reader and
  // keyboard users aren't stranded on a submit button that no longer exists.
  useEffect(() => {
    if (submitted) successHeadingRef.current?.focus();
  }, [submitted]);

  const handleFirstFocus = () => {
    if (!hasInteracted) {
      trackFormStart();
      setHasInteracted(true);
    }
  };

  const submitFinal = async (
    one: StepOneValues,
    two: StepTwoValues
  ) => {
    if (isSending) return;
    setIsSending(true);
    setServerError(null);
    // Retries are the signal that separates a transient blip from an endpoint
    // that is simply down: one failure is noise, the same visitor failing
    // three times is not.
    attemptRef.current += 1;
    const timeIds = two.preferredTimes || [];
    const timeLabels = timeIds
      .map((id) => timeWindows.find((t) => t.id === id)?.label)
      .filter(Boolean) as string[];

    // Read at submit time rather than through the provider, so a visitor who
    // completed the wizard and then converted through any other CTA still has
    // their five qualifying answers attached to the lead.
    const wizard = loadWizardState();
    const wizardAnswers = wizard ? formatWizardAnswers(wizard.answers) : "";
    const wizardOpenText = wizard?.openText?.trim() || "";

    const payload: DiagnosticPayload = {
      fullName: one.fullName,
      email: two.email && two.email.length > 0 ? two.email : "(לא מולא)",
      phone: two.phone,
      stage: stageHint || "(נקבע בשיחה)",
      challenge: one.challenge,
      preferredTimes: timeLabels.length > 0 ? timeLabels : ["(לא מולא)"],
      source: source || "(ישיר)",
      wizardAnswers: wizardAnswers || "(לא מולא)",
      wizardOpenText: wizardOpenText || "(לא מולא)",
      ...(one.activePractice === "no" && {
        screeningFlag: "no_active_practice" as const,
      }),
      company: honeypotRef.current?.value || undefined,
    };

    try {
      const result = await submitForm(payload);
      if (result.success) {
        trackFormSubmit();
        setSubmitted(true);
        return;
      }
      // A failed submission is the one event nobody is present to notice. The
      // visitor sees the message and leaves; without this the funnel just
      // shows step 2 completing and no submit, with no way to tell a drop-off
      // from an endpoint that has stopped accepting posts.
      trackEvent("form_submit_failed", {
        reason: result.reason ?? "unknown",
        attempt: attemptRef.current,
      });
      setServerError(result.message);
    } finally {
      setIsSending(false);
    }
  };

  const onStepOneSubmit = async (values: StepOneValues) => {
    // Screening outcome rides the existing step event rather than a new one, so
    // the funnel gains a qualified/unqualified split without a second hit.
    trackEvent("form_step_complete", {
      step: 1,
      active_practice: values.activePractice,
    });
    setStepOneData(values);
    setStep(2);
  };

  const onStepTwoSubmit = async (values: StepTwoValues) => {
    if (!stepOneData) return;
    trackEvent("form_step_complete", { step: 2 });
    await submitFinal(stepOneData, values);
  };

  return (
    <section
      id="diagnostic-form"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="diagnostic-form-title"
      data-clarity-mask="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-soft" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl px-6">
        {!submitted && (
          <Reveal className="cor-card-form space-y-10 p-7 md:p-10">
            <div className="space-y-3">
              <p className="cor-overline-he">
                שיחה ראשונה
              </p>
              <h2
                id="diagnostic-form-title"
                className="cor-title text-foreground"
              >
                שיחת התאמה — 20 דקות, ללא עלות
              </h2>
              <p className="cor-body-lg text-foreground/80">
                אני חוזר אליך תוך 24 שעות. אם זה לא הזמן הנכון, או אני לא האדם הנכון, נגיד את זה ביושר בלי לבזבז לאף אחד את הזמן.
              </p>
              <SpotsLeft className="text-sm text-muted-foreground" />

              <ul
                aria-label="מה תיקח מהשיחה"
                className="mt-4 space-y-2 rounded-md border border-border/80 bg-background/50 p-4 text-sm text-foreground/85"
              >
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>תדע אם זה מתאים לך — ביושר, גם אם לא.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>תדע מאיזה שלב להתחיל ולמה.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>תקבל פרשנות אחת על התקיעה שלך — גם אם לא נמשיך ביחד.</span>
                </li>
              </ul>

              <div className="flex items-center gap-2 pt-3">
                <span
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step >= 1 ? "bg-primary" : "bg-border"
                  }`}
                />
                <span
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step >= 2 ? "bg-primary" : "bg-border"
                  }`}
                />
              </div>
              <p
                role="status"
                aria-live="polite"
                className="text-xs text-muted-foreground"
              >
                שלב {step} מתוך 2
              </p>
            </div>

            {/* Honeypot: hidden from people and assistive tech; bots fill it,
                and the Apps Script then silently drops the submission. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
            >
              <label>
                אל תמלא/י שדה זה
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  ref={honeypotRef}
                  defaultValue=""
                />
              </label>
            </div>

            {step === 1 && (
              <Form {...stepOne}>
                <form
                  onSubmit={stepOne.handleSubmit(onStepOneSubmit)}
                  onFocusCapture={handleFirstFocus}
                  className="space-y-7"
                  noValidate
                >
                  <FormField
                    control={stepOne.control}
                    name="challenge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="field-num">01.</span>במשפט אחד — מה אתה יודע לעשות, שאתה לא מצליח למכור?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            maxLength={800}
                            placeholder="לדוגמה: יש לי 15 שנה ניסיון, אבל לשווק ולמכור את עצמי — שם אני פחות טוב..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepOne.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="field-num">02.</span>איך לקרוא לך
                        </FormLabel>
                        <FormControl>
                          <Input type="text" autoComplete="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* The one screening question. Native radios inside a
                      fieldset: the group gets a <legend> rather than a label,
                      and arrow-key navigation within the group comes free. */}
                  <FormField
                    control={stepOne.control}
                    name="activePractice"
                    render={({ field }) => (
                      <FormItem>
                        <fieldset>
                          <legend className="text-sm font-medium leading-none text-foreground">
                            <span className="field-num">03.</span>יש לך פרקטיקה
                            פעילה עם לקוחות?
                          </legend>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                            הרצף מחלץ בידול מתוך עבודה שכבר קרתה. בלי לקוחות
                            פעילים אין ממה לחלץ — ועדיף שנדע את זה מראש, שנינו.
                          </p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            {[
                              { value: "yes", label: "כן" },
                              { value: "no", label: "עדיין לא" },
                            ].map((opt) => (
                              <label
                                key={opt.value}
                                className={`flex cursor-pointer items-center gap-2.5 rounded-md border bg-card px-4 py-3 text-sm transition-colors ${
                                  field.value === opt.value
                                    ? "border-primary bg-primary/5 text-foreground"
                                    : "border-border text-foreground/85 hover:border-foreground/40"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={opt.value}
                                  checked={field.value === opt.value}
                                  onChange={() => field.onChange(opt.value)}
                                  onBlur={field.onBlur}
                                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                                />
                                <span>{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={stepOne.formState.isSubmitting}
                      className="cta-action inline-flex h-14 w-full items-center justify-center rounded-md text-base font-semibold"
                    >
                      המשך
                    </button>
                    <p className="text-center text-xs leading-relaxed text-muted-foreground">
                      עוד שלב אחד. המידע נשמר רק לצורך השיחה.
                    </p>
                  </div>
                </form>
              </Form>
            )}

            {step === 2 && (
              <Form {...stepTwo}>
                <form
                  onSubmit={stepTwo.handleSubmit(onStepTwoSubmit)}
                  className="space-y-7"
                  noValidate
                >
                  <p className="rounded-md border border-border bg-card p-4 text-sm leading-relaxed text-foreground/85">
                    תודה. עוד שדה אחד וסיימנו. הטלפון הוא בשביל שאחזור אליך — לא נעשה ניוזלטר ולא נשתף עם אף אחד.
                  </p>

                  <FormField
                    control={stepTwo.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="field-num">04.</span>טלפון
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            dir="ltr"
                            autoComplete="tel"
                            placeholder="05X-XXXXXXX"
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepTwo.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="field-num">05.</span>מייל (אופציונלי)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            dir="ltr"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepTwo.control}
                    name="preferredTimes"
                    render={({ field }) => {
                      const value = field.value || [];
                      const toggle = (id: string, checked: boolean) => {
                        if (checked) {
                          field.onChange([...value, id]);
                        } else {
                          field.onChange(value.filter((v) => v !== id));
                        }
                      };
                      return (
                        <FormItem>
                          <FormLabel>
                            <span className="field-num">06.</span>חלונות זמן נוחים (אופציונלי)
                          </FormLabel>
                          <div className="mt-2 space-y-2">
                            {timeWindows.map((tw) => {
                              const checked = value.includes(tw.id);
                              return (
                                <label
                                  key={tw.id}
                                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:border-foreground/40"
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(c) =>
                                      toggle(tw.id, Boolean(c))
                                    }
                                  />
                                  <span className="text-sm text-foreground">
                                    {tw.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {serverError && (
                    <div
                      role="alert"
                      className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      {serverError}
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSending}
                      aria-busy={isSending}
                      className="cta-action inline-flex h-14 w-full items-center justify-center rounded-md text-base font-semibold"
                    >
                      {isSending ? "שולח" : "שלח, אחזור אליך תוך 24 שעות"}
                    </button>
                  </div>
                </form>
              </Form>
            )}
          </Reveal>
        )}

        {submitted && (
          <Reveal className="cor-card-form space-y-6 p-7 text-center md:p-10">
            <p className="cor-overline-he">
              קיבלתי
            </p>
            <h2
              ref={successHeadingRef}
              tabIndex={-1}
              className="cor-title text-foreground outline-none"
            >
              תודה. בוא נקבע את הפגישה.
            </h2>
            <Suspense fallback={<div className="h-[720px]" aria-hidden="true" />}>
              <BookingSection visible />
            </Suspense>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default DiagnosticFormSection;
