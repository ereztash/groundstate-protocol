import { useEffect, useState } from "react";
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
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import BookingSection from "./BookingSection";
import {
  submitForm,
  type DiagnosticPayload,
} from "@/lib/web3forms";
import { trackEvent, trackFormStart, trackFormSubmit } from "@/lib/analytics";

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
 * Step 1 (low-stakes emotional entry): the pain in one sentence + name.
 *   Lets the visitor "pay" with a small disclosure before identity.
 * Step 2 (commitment): phone (required), email + time windows (optional).
 *   They are already invested by this point.
 * Stage selection (which package) is decided in the call, not on the form.
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
  const { selectedStage } = useDiagnosticForm();
  const [step, setStep] = useState<1 | 2>(1);
  const [stepOneData, setStepOneData] = useState<StepOneValues | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const stepOne = useForm<StepOneValues>({
    resolver: zodResolver(stepOneSchema),
    mode: "onTouched",
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
    const timeIds = two.preferredTimes || [];
    const timeLabels = timeIds
      .map((id) => timeWindows.find((t) => t.id === id)?.label)
      .filter(Boolean) as string[];

    const payload: DiagnosticPayload = {
      fullName: one.fullName,
      email: two.email && two.email.length > 0 ? two.email : "(לא מולא)",
      phone: two.phone,
      stage: stageHint || "(נקבע בשיחה)",
      challenge: one.challenge,
      preferredTimes: timeLabels.length > 0 ? timeLabels : ["(לא מולא)"],
    };

    try {
      const result = await submitForm(payload);
      if (result.success) {
        trackFormSubmit();
        setSubmitted(true);
        return;
      }
      setServerError(result.message);
    } finally {
      setIsSending(false);
    }
  };

  const onStepOneSubmit = async (values: StepOneValues) => {
    trackEvent("form_step_complete", { step: 1 });
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
                20 דקות. בלי תשלום. נדבר.
              </h2>
              <p className="cor-body-lg text-foreground/80">
                אני חוזר אליך תוך 24 שעות. אם זה לא הזמן הנכון, או אני לא האדם הנכון, נגיד את זה ביושר בלי לבזבז לאף אחד את הזמן.
              </p>
              <div className="flex items-center gap-2 pt-2">
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
              <p className="text-xs text-muted-foreground">
                שלב {step} מתוך 2
              </p>
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
                          <span className="field-num">01.</span>במשפט אחד, מה התקיעה
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            maxLength={800}
                            placeholder="לדוגמה: יש לי ניסיון של 15 שנה, אבל לא מצליח/ה לתרגם את זה לפניות..."
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
                          <span className="field-num">03.</span>טלפון
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            dir="ltr"
                            autoComplete="tel"
                            placeholder="05X-XXXXXXX"
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
                          <span className="field-num">04.</span>מייל (אופציונלי)
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
                            <span className="field-num">05.</span>חלונות זמן נוחים (אופציונלי)
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
            <h2 className="cor-title text-foreground">
              תודה. בוא נקבע את הפגישה.
            </h2>
            <BookingSection visible />
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default DiagnosticFormSection;
