import { useState } from "react";
import { Reveal } from "./Reveal";
import { useDiagnosticForm, type StageValue } from "./DiagnosticFormProvider";
import { trackEvent } from "@/lib/analytics";

type Answer = 0 | 1 | 2;

type Option = {
  label: string;
  value: Answer;
};

type Question = {
  key: "narrative" | "valueprop" | "product" | "outreach";
  text: string;
  options: [Option, Option, Option];
};

const QUESTIONS: Question[] = [
  {
    key: "narrative",
    text: "יש לך משפט אחד שאתה אומר כשמישהו שואל \"מה אתה עושה?\"",
    options: [
      { label: "כן, ברור וחד.", value: 0 },
      { label: "בערך — אבל אני לא אוהב את הניסוח.", value: 1 },
      { label: "לא, אני מסביר אחרת כל פעם.", value: 2 },
    ],
  },
  {
    key: "valueprop",
    text: "כשאתה שולח הצעת מחיר, הלקוח מבין למה זה המחיר?",
    options: [
      { label: "כן, ברור מתוך מה שאני מציע.", value: 0 },
      { label: "לפעמים. אני מסביר במקרה הצורך.", value: 1 },
      { label: "אני מנמק כל פעם — וזה מתיש.", value: 2 },
    ],
  },
  {
    key: "product",
    text: "יש לך תיאור כתוב של מה שאתה מציע, שאתה שולח ללקוחות?",
    options: [
      { label: "כן, מסמך מוכן ששולח לכל פנייה.", value: 0 },
      { label: "יש משהו, אבל אני מתאים אותו ידנית כל פעם.", value: 1 },
      { label: "לא — אני בונה הצעה מאפס לכל לקוח.", value: 2 },
    ],
  },
  {
    key: "outreach",
    text: "מאיפה רוב הלקוחות שלך באים?",
    options: [
      { label: "מהפנייה — אנשים שמכירים אותי.", value: 0 },
      { label: "מהנוכחות שלי ברשתות / SEO.", value: 1 },
      { label: "אין לי צינור עקבי.", value: 2 },
    ],
  },
];

type Recommendation = {
  stage: StageValue;
  name: string;
  reason: string;
  showCta: boolean;
};

function recommend(answers: Answer[]): Recommendation {
  const [narrative, valueprop, product, outreach] = answers;

  if (narrative >= 2) {
    return {
      stage: "stage-1",
      name: "שלב 01 — נרטיב ייחודי",
      reason:
        "כל מה שבא אחרי מתבסס על משפט הליבה שלך. חייבים אותו ראשון, אחרת השלבים הבאים נשענים על קרקע רכה.",
      showCta: true,
    };
  }

  if (valueprop >= 2) {
    return {
      stage: "stage-2",
      name: "שלב 02 — הצעת ערך ייחודית",
      reason:
        "יש לך נרטיב. החסר הוא ההצעה הברורה ללקוח — מה הוא מקבל, ולמה זה שווה את הסכום.",
      showCta: true,
    };
  }

  if (product >= 2) {
    return {
      stage: "stage-3",
      name: "שלב 03 — מוצר ייחודי",
      reason:
        "יש לך הצעת ערך, אבל אין תיעוד מוצרי. אנחנו ניצור מסמך אחד שנשלח שוב ושוב במקום לבנות מאפס.",
      showCta: true,
    };
  }

  if (outreach >= 2) {
    return {
      stage: "stage-4",
      name: "שלב 04 — רכישת לקוחות פרואקטיבית",
      reason:
        "המוצר מוכן והנרטיב חד. חסר רק צינור פנייה שיביא את 10 השיחות הבאות.",
      showCta: true,
    };
  }

  const sum = answers.reduce((s, v) => s + v, 0);

  if (sum === 0) {
    return {
      stage: "unknown",
      name: "אולי לא עכשיו.",
      reason:
        "כל המדדים אצלך תקינים. אם משהו ישתנה — חזור. בינתיים אני לא בטוח שאתה צריך אותי.",
      showCta: false,
    };
  }

  if (sum <= 2) {
    return {
      stage: "stage-1",
      name: "שלב 01 — נרטיב ייחודי",
      reason:
        "יש לך כיוון בכל ארבעת השלבים, אבל אף אחד לא ממש חד. ברוב המקרים, חידוד הנרטיב מחדד אוטומטית את שאר השלבים.",
      showCta: true,
    };
  }

  return {
    stage: "full-package",
    name: "החבילה המלאה",
    reason:
      "כמה שלבים דורשים עבודה. החבילה המלאה זולה ב-1,300 ש״ח מרכישה בנפרד, ושומרת על המומנטום בין הפגישות.",
    showCta: true,
  };
}

const StageRecommenderSection = () => {
  const { requestStage } = useDiagnosticForm();
  const [phase, setPhase] = useState<"intro" | "question" | "result">("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const start = () => {
    trackEvent("wizard_start", { wizard: "stage_recommender" });
    setPhase("question");
    setStepIndex(0);
    setAnswers([]);
  };

  const answer = (value: Answer) => {
    const next = [...answers, value];
    setAnswers(next);
    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      const result = recommend(next);
      trackEvent("wizard_complete", {
        wizard: "stage_recommender",
        recommended_stage: result.stage,
      });
      setPhase("result");
    }
  };

  const back = () => {
    if (stepIndex === 0) {
      setPhase("intro");
      return;
    }
    setStepIndex(stepIndex - 1);
    setAnswers(answers.slice(0, -1));
  };

  const restart = () => {
    setPhase("intro");
    setStepIndex(0);
    setAnswers([]);
  };

  const goToForm = (rec: Recommendation) => {
    trackEvent("wizard_cta_click", {
      wizard: "stage_recommender",
      stage: rec.stage,
    });
    requestStage(rec.stage);
  };

  const result = phase === "result" ? recommend(answers) : null;
  const progressPct =
    phase === "question"
      ? Math.round(((stepIndex + 1) / QUESTIONS.length) * 100)
      : 0;

  return (
    <section
      id="stage-recommender"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="recommender-title"
    >
      <div className="mx-auto max-w-2xl px-6">
        {phase === "intro" && (
          <Reveal className="space-y-6">
            <p className="cor-overline-he">בדיקת התאמה</p>
            <h2
              id="recommender-title"
              className="cor-title text-foreground"
            >
              מאיזה שלב להתחיל?
            </h2>
            <p className="cor-body-lg text-foreground/80">
              4 שאלות. דקה. בסוף תקבל המלצה ישירה — איזה שלב מתאים לך, או שזה בכלל לא הזמן.
            </p>
            <button
              type="button"
              onClick={start}
              className="cta-line mt-2 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
            >
              התחל את הבדיקה
            </button>
          </Reveal>
        )}

        {phase === "question" && (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span>
                  שאלה {stepIndex + 1} מתוך {QUESTIONS.length}
                </span>
                <span className="text-primary/80">{progressPct}%</span>
              </div>
              <div
                className="h-[2px] w-full overflow-hidden rounded-full bg-border"
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <Reveal key={stepIndex} className="space-y-6">
              <h3
                id="recommender-title"
                className="cor-title text-foreground"
              >
                {QUESTIONS[stepIndex].text}
              </h3>

              <ul className="space-y-3">
                {QUESTIONS[stepIndex].options.map((opt) => (
                  <li key={opt.label}>
                    <button
                      type="button"
                      onClick={() => answer(opt.value)}
                      className="group flex w-full items-center justify-between gap-4 rounded-md border border-border bg-card px-5 py-4 text-right text-[15px] leading-snug text-foreground transition-all hover:border-primary hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span>{opt.label}</span>
                      <span
                        aria-hidden="true"
                        className="text-primary/40 transition-colors group-hover:text-primary"
                      >
                        ←
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={back}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {stepIndex === 0 ? "חזור להתחלה" : "שאלה קודמת"}
              </button>
            </Reveal>
          </div>
        )}

        {phase === "result" && result && (
          <Reveal className="space-y-6">
            <p className="cor-overline-he">ההמלצה</p>
            <h2
              id="recommender-title"
              className="cor-title text-foreground"
            >
              {result.name}
            </h2>
            <p className="cor-body-lg text-foreground/80">{result.reason}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {result.showCta && (
                <button
                  type="button"
                  onClick={() => goToForm(result)}
                  className="cta-action inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
                >
                  אני רוצה את {result.name.replace(/^שלב \d+ — /, "").replace(/^החבילה המלאה$/, "החבילה המלאה")}
                </button>
              )}
              <button
                type="button"
                onClick={restart}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                שנה תשובות
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default StageRecommenderSection;
