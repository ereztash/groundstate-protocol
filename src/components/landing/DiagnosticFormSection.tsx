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
import { trackFormStart, trackFormSubmit } from "@/lib/analytics";

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

const schema = z.object({
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
  challenge: z
    .string()
    .min(50, { message: "תיאור קצר מדי, מינימום 50 תווים" })
    .max(800, { message: "תיאור ארוך מדי" }),
  preferredTimes: z
    .array(z.string())
    .min(1, { message: "בחרו לפחות חלון זמן אחד" }),
});

type FormValues = z.infer<typeof schema>;

const DiagnosticFormSection = () => {
  const { selectedStage } = useDiagnosticForm();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      stage: "",
      challenge: "",
      preferredTimes: [],
    },
  });

  const challengeLength = form.watch("challenge")?.length || 0;

  useEffect(() => {
    if (selectedStage) {
      form.setValue("stage", selectedStage, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedStage, form]);

  const handleFirstFocus = () => {
    if (!hasInteracted) {
      trackFormStart();
      setHasInteracted(true);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const stageLabel =
      stageOptions.find((s) => s.value === values.stage)?.label ||
      values.stage;
    const timeLabels = values.preferredTimes
      .map((id) => timeWindows.find((t) => t.id === id)?.label)
      .filter(Boolean) as string[];

    const payload: DiagnosticPayload = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      stage: stageLabel,
      challenge: values.challenge,
      preferredTimes: timeLabels,
    };

    const result = await submitForm(payload);
    if (result.success) {
      trackFormSubmit();
      setSubmitted(true);
      return;
    }
    setServerError(result.message);
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
                שש שאלות. בסוף השיחה אני אומר ישר אם זה מתאים. אם לא, גם זה תשובה.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                onFocusCapture={handleFirstFocus}
                className="space-y-7"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="field-num">01.</span>שם מלא
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="field-num">04.</span>שלב או חבילה שמעניינים אתכם
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

                <FormField
                  control={form.control}
                  name="challenge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="field-num">05.</span>במשפט אחד, מה התהליך שאתם מנסים לזוז בו ולא מצליחים
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          maxLength={800}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormMessage />
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {challengeLength} / 50 מינימום
                        </span>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                    disabled={form.formState.isSubmitting}
                    className="cta-action inline-flex h-14 w-full items-center justify-center rounded-md text-base font-semibold"
                  >
                    {form.formState.isSubmitting
                      ? "שולח"
                      : "אני רוצה לקבוע 20 דקות"}
                  </button>
                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    תגיע תשובה תוך 24 שעות. המידע נשמר רק לצורך השיחה ולא נעשה בו שום שימוש אחר.
                  </p>
                </div>
              </form>
            </Form>
          </Reveal>
        )}

        {submitted && (
          <Reveal className="space-y-6 text-center">
            <p className="cor-overline-he text-muted-foreground">
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
