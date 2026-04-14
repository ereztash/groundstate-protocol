import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const signupSchema = z.object({
  name: z.string().min(2, "שם חייב להיות לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  businessDescription: z.string().min(10, "תאר את העיסוק שלך (לפחות 10 תווים)"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmitSuccess?: () => void;
}

const SignupForm = ({ onSubmitSuccess }: SignupFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Log the submission (in production, send to backend/email service)
    console.log("Sprint 30 Signup:", data);

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      reset();
      setSubmitted(false);
      onSubmitSuccess?.();
    }, 3000);
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto bg-muted/50 border-border p-8 text-center animate-slow-fade-in">
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <div>
            <p className="text-foreground font-medium">מעולה!</p>
            <p className="text-sm text-muted-foreground mt-2">
              קיבלנו את הפרטים שלך. נחזור אליך בעוד 24 שעות כדי לתחזק את הספרינט.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-muted/30 border-border p-8 animate-slow-fade-in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">
            שם
          </label>
          <Input
            {...register("name")}
            placeholder="שמך"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 h-10 font-mono text-sm"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">
            אימייל
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 h-10 font-mono text-sm"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">
            תיאור העיסוק שלך
          </label>
          <textarea
            {...register("businessDescription")}
            placeholder="למה אתה חושב שמסלול זה רלוונטי לך?"
            className="w-full h-24 px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            disabled={isSubmitting}
          />
          {errors.businessDescription && (
            <p className="text-xs text-destructive">{errors.businessDescription.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 font-mono text-sm tracking-wider bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "שולח..." : "בואו נתחיל"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          אנחנו לא נשלח דוא"ל ספאם. הזה מידע בטוח לגמרי.
        </p>
      </form>
    </Card>
  );
};

export default SignupForm;
