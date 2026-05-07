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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Reveal } from "./Reveal";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import BookingSection from "./BookingSection";
import {
  submitForm,
  type DiagnosticPayload,
} from "@/lib/web3forms";
import { trackEvent, trackFormStart, trackFormSubmit } from "@/lib/analytics";

const ISRAELI_PHONE = /^0\d{1,2}-?\d{7}$|^0\d{9}$/;

const stageOptions = [
  { value: "stage-1", label: "שלב 1, נרטיב ייחודי" },
  { value: "stage-2", label: "שלב 2, הצעת ערך ייחודית" },
  { value: "stage-3", label: "שלב 3, מוצר ייחודי" },
  { value: "stage-4", label: "שלב 4, רכישת לקוחות פרואקטיבית" },
  { value: "full-package", label: "חבילה מלאה" },
  { value: "unknown", label: "עוד לא יודע" },
] as const;

const timeWindows = [
  { id: "morning", label: "בוקר, 08:00 עד 12:00" },
  { id: "noon", label: "צהריים, 12:00 עד 16:00" },
  { id: "evening", label: "ערב, 16:00 עד 20:00" },
] as const;

/**
 * Two-step progressive form.
 * Step 1 (low friction): name, email, phone, stage. 4 fields. ~17-25% conversion.
 * Step 2 (after step 1 submit, before final send): challenge text + time windows.
 *   Optional but encouraged. The user is already invested by this point.
 */
const stepOneSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "שם קצר מדי" })
    .max(80, { message: "שם ארוך מדי" }),
  email: z.string().email({ message: "כתובת מייל לא תקינה" }),
  phone: z
    .string()
    .min(9, { message: "מספר טלפון לא תקין" })
    .regex(ISRAELI_PHONE, { message: "מספר טלפון ישראלי לא תקין" }),
  stage: z.string().min(1, { message: "יש לבחור שלב" }),
});

const stepTwoSchema = z.object({
  challenge: z.string().max(800, { message: "תיאור ארוך מדי" }).optional(),
  preferredTimes: z.array(z.string()).optional(),
});

type StepOneValues = z.infer<typeof stepOneSchema>;
type StepTwoValues = z.infer<typeof stepTwoSchema>;

const DRAFT_KEY = "corsys_diag_draft_v1";
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type Draft = {
  values: Partial<StepOneValues>;
  savedAt: number;
};

const readDraft = (): Partial<StepOneValues> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > DRAFT_TTL_MS) {
      window.localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return parsed.values || null;
  } catch {
    return null;
  }
};

const writeDraft = (values: Partial<StepOneValues>) => {
  if (typeof window === "undefined") return;
  try {
    const draft: Draft = { values, savedAt: Date.now() };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* quota exceeded or private mode — silently degrade */
  }
};

const clearDraft = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
};

const formatIsraeliPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
};

const COMMON_EMAIL_TYPOS: Record<string, string> = {
  "gmail.con": "gmail.com",
  "gmial.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "icoud.com": "icloud.com",
  "iclod.com": "icloud.com",
};

const suggestEmailFix = (email: string): string | null => {
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const domain = email.slice(at + 1).toLowerCase();
  const fixed = COMMON_EMAIL_TYPOS[domain];
  if (!fixed) return null;
  return `${email.slice(0, at + 1)}${fixed}`;
};

const DiagnosticFormSection = () => {
  const { selectedStage } = useDiagnosticForm();
  const [step, setStep] = useState<1 | 2>(1);
  const [stepOneData, setStepOneData] = useState<StepOneValues | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

  const stepOne = useForm<StepOneValues>({
    resolver: zodResolver(stepOneSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", phone: "", stage: "" },
  });

  const stepTwo = useForm<StepTwoValues>({
    resolver: zodResolver(stepTwoSchema),
    mode: "onTouched",
    defaultValues: { challenge: "", preferredTimes: [] },
  });

  useEffect(() => {
    const draft = readDraft();
    if (!draft) return;
    (Object.keys(draft) as Array<keyof StepOneValues>).forEach((key) => {
      const v = draft[key];
      if (typeof v === "string" && v.length > 0) {
        stepOne.setValue(key, v, { shouldDirty: false, shouldValidate: false });
      }
    });
  }, [stepOne]);

  useEffect(() => {
    const sub = stepOne.watch((values) => {
      const hasAny = Object.values(values).some(
        (v) => typeof v === "string" && v.length > 0
      );
      if (hasAny) writeDraft(values as Partial<StepOneValues>);
    });
    return () => sub.unsubscribe();
  }, [stepOne]);

  useEffect(() => {
    if (selectedStage) {
      stepOne.setValue("stage", selectedStage, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedStage, stepOne]);

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
    const stageLabel =
      stageOptions.find((s) => s.value === one.stage)?.label || one.stage;
    const timeIds = two.preferredTimes || [];
    const timeLabels = timeIds
      .map((id) => timeWindows.find((t) => t.id === id)?.label)
      .filter(Boolean) as string[];

    const payload: DiagnosticPayload = {
      fullName: one.fullName,
      email: one.email,
      phone: one.phone,
      stage: stageLabel,
      challenge: two.challenge || "(לא מולא)",
      preferredTimes: timeLabels.length > 0 ? timeLabels : ["(לא מולא)"],
    };

    try {
      const result = await submitForm(payload);
      if (result.success) {
        trackFormSubmit();
        clearDraft();
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

  const skipStepTwo = async () => {
    if (!stepOneData) return;
    trackEvent("form_step_skipped", { step: 2 });
    await submitFinal(stepOneData, { challenge: "", preferredTimes: [] });
  };

  return (
    <section
      id="diagnostic-form"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="diagnostic-form-title"
    >
      <div className="mx-auto max-w-2xl px-6">
        {!submitted && (
          <Reveal className="space-y-10">
            <div className="space-y-3">
              <p className="cor-overline-he text-muted-foreground">
                אבחון התאמה
              </p>
              <h2
                id="diagnostic-form-title"
                className="cor-title text-foreground"
              >
                20 דקות. בלי תשלום. בלי התחייבות.
              </h2>
              <p className="cor-body-lg text-foreground/80">
                בסוף השיחה אני אומר ישר אם זה מתאים. אם לא, גם זה תשובה.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step === 1 ? "bg-accent" : "bg-foreground/40"
                  }`}
                />
                <span
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step === 2 ? "bg-accent" : "bg-border"
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
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="field-num">01.</span>שם מלא
                        </FormLabel>
                        <FormControl>
                          <Input type="text" autoComplete="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepOne.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="field-num">02.</span>מייל
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            dir="ltr"
                            inputMode="email"
                            autoComplete="email"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setEmailSuggestion(null);
                            }}
                            onBlur={(e) => {
                              field.onBlur();
                              const value = e.target.value.trim();
                              setEmailSuggestion(value ? suggestEmailFix(value) : null);
                            }}
                          />
                        </FormControl>
                        {emailSuggestion && (
                          <button
                            type="button"
                            onClick={() => {
                              stepOne.setValue("email", emailSuggestion, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setEmailSuggestion(null);
                            }}
                            className="cta-text mt-1 inline-flex text-xs"
                            dir="rtl"
                          >
                            התכוונת ל-<span dir="ltr">{emailSuggestion}</span>?
                          </button>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepOne.control}
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
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="054-1234567"
                            {...field}
                            onChange={(e) =>
                              field.onChange(formatIsraeliPhone(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stepOne.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="field-num">04.</span>שלב או חבילה
                        </FormLabel>
                        <Select
                          dir="rtl"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחרו אפשרות" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stageOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      תשובה תוך 24 שעות. המידע נשמר רק לצורך השיחה.
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
                    תודה. עוד שני שדות אופציונליים שיעזרו לי להגיע מוכן לשיחה. אפשר גם לדלג ולשלוח עכשיו.
                  </p>

                  <FormField
                    control={stepTwo.control}
                    name="challenge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="field-num">05.</span>במשפט אחד, מה התהליך שאתם מנסים לזוז בו ולא מצליחים
                        </FormLabel>
                        <FormControl>
                          <Textarea rows={4} maxLength={800} {...field} />
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
                            <span className="field-num">06.</span>חלונות זמן נוחים לשיחה
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
                      {isSending ? "שולח" : "אני רוצה לקבוע 20 דקות"}
                    </button>
                    <button
                      type="button"
                      onClick={skipStepTwo}
                      disabled={isSending}
                      className="cta-text inline-flex w-full items-center justify-center text-sm disabled:opacity-50"
                    >
                      דלג ושלח עכשיו
                    </button>
                  </div>
                </form>
              </Form>
            )}
          </Reveal>
        )}

        {submitted && (
          <Reveal className="space-y-8">
            <div className="space-y-4 text-center">
              <p className="cor-overline-he text-muted-foreground">
                קיבלתי
              </p>
              <h2 className="cor-title text-foreground">
                תודה. בוא נקבע את הפגישה.
              </h2>
            </div>

            <ol className="mx-auto max-w-md space-y-4 border-y border-border py-6 text-sm text-foreground/85">
              <li className="flex gap-3">
                <span className="font-mono text-xs font-semibold text-accent" aria-hidden="true">
                  01
                </span>
                <span>
                  קיבלתי את הפנייה שלך. עוברת אליי ישירות, לא דרך מערכת.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-xs font-semibold text-accent" aria-hidden="true">
                  02
                </span>
                <span>
                  אני קורא את הפרטים, מסמן אותך ביומן, וחוזר אליך תוך 24 שעות עם תאריך מוצע. גם בסופ"ש.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-xs font-semibold text-accent" aria-hidden="true">
                  03
                </span>
                <span>
                  אם רוצים להאיץ, אפשר לקבוע פגישה כבר עכשיו דרך היומן למטה.
                </span>
              </li>
            </ol>

            <BookingSection visible />
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default DiagnosticFormSection;
