import { useCallback, useEffect, useState } from "react";
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
    text: "כשאתה אומר במסיבה ״אני עוסק ב-X״ — מה קורה לרוב?",
    options: [
      { label: "האדם מבין מיד ושואל שאלה ספציפית.", value: 0 },
      {
        label:
          "האדם מנסה לקטלג (״אה, אז אתה כמו…?״) ואני מסביר עוד שני משפטים.",
        value: 1,
      },
      { label: "האדם מהנהן בנימוס ומחליף נושא.", value: 2 },
    ],
  },
  {
    key: "valueprop",
    text: "כשלקוח רואה את המחיר שלך — מה התגובה הראשונה?",
    options: [
      { label: "״מצוין, מתי מתחילים?״", value: 0 },
      { label: "״אהמ, אחזור אליך״ (לפעמים חוזרים, לפעמים לא).", value: 1 },
      { label: "״וואו, זה הרבה״ — וצריך לנמק.", value: 2 },
    ],
  },
  {
    key: "product",
    text: "לקוח שואל ״מה אני מקבל בדיוק?״ — מה אתה עושה?",
    options: [
      { label: "שולח קובץ מוכן שאני שולח לכל פנייה.", value: 0 },
      { label: "שולח משהו ישן ומוסיף הסבר בגוף המייל.", value: 1 },
      { label: "פותח Word ריק ומתחיל לכתוב.", value: 2 },
    ],
  },
  {
    key: "outreach",
    text: "חודש הבא — מאיפה הלקוחות הבאים שלך יבואו?",
    options: [
      {
        label: "יודע בדיוק — יש 3 שיחות פתוחות / לקוח חוזר / הפניה ידועה.",
        value: 0,
      },
      { label: "מקווה — יש כמה הזדמנויות, לא בטוח.", value: 1 },
      { label: "אין לי מושג. אם לא ייכנס משהו, החודש יהיה ריק.", value: 2 },
    ],
  },
];

type Recommendation = {
  stage: StageValue;
  number: "01" | "02" | "03" | "04" | null;
  name: string;
  price: string;
  deliverable: string;
  reflection: string;
  reason: string;
  ctaPrimary: string;
};

function recommend(answers: Answer[]): Recommendation {
  const [narrative, valueprop, product, outreach] = answers;

  if (narrative >= 2) {
    return {
      stage: "stage-1",
      number: "01",
      name: "נרטיב ייחודי",
      price: "1,000 ש״ח",
      deliverable: "מסמך נרטיב של עמוד-שניים עם 3-5 ניסוחים מוכנים.",
      reflection:
        "אמרת שכשאתה אומר במסיבה מה אתה עושה — האדם מהנהן ומחליף נושא. זה האות שהנרטיב עוד לא יודע לתפוס את הקרקע. כל מה שבא אחריו — מחיר, מוצר, פניות — נשען עליו. אז שם מתחילים.",
      reason:
        "כל מה שבא אחר כך מבוסס על משפט הליבה שלך. בלעדיו, השלבים הבאים נשענים על קרקע רכה.",
      ctaPrimary: "אני רוצה את שלב 1",
    };
  }

  if (valueprop >= 2) {
    return {
      stage: "stage-2",
      number: "02",
      name: "הצעת ערך ייחודית",
      price: "1,300 ש״ח",
      deliverable: "משפט ליבה ומילון כאב מוכן לשליחה.",
      reflection:
        "סיפרת שלקוח רואה את המחיר ואומר ״וואו, זה הרבה״, ואתה מנמק בכל פעם. זו לא בעיה של מחיר — זו בעיה של הצעה. אם הלקוח לא רואה למה זה שווה לפני שראה את הסכום, הסכום תמיד יהיה גדול.",
      reason:
        "יש לך נרטיב. החסר הוא ההצעה הברורה ללקוח — מה הוא מקבל, ולמה זה שווה את הסכום.",
      ctaPrimary: "אני רוצה את שלב 2",
    };
  }

  if (product >= 2) {
    return {
      stage: "stage-3",
      number: "03",
      name: "מוצר ייחודי",
      price: "1,600 ש״ח",
      deliverable: "תיאור מוצר עם תמחור ורציונל, מוכן לשליחה.",
      reflection:
        "אמרת שכשלקוח שואל ״מה אני מקבל?״ אתה פותח Word ריק. זה אומר שאתה מתחיל מאפס לכל לקוח — וזה גוזל זמן ומשדר חוסר ביטחון. צריך מסמך אחד שעובד פעם אחר פעם.",
      reason:
        "יש לך הצעת ערך אבל אין תיעוד מוצרי. ניצור מסמך אחד שנשלח שוב ושוב, במקום לבנות מאפס בכל פעם.",
      ctaPrimary: "אני רוצה את שלב 3",
    };
  }

  if (outreach >= 2) {
    return {
      stage: "stage-4",
      number: "04",
      name: "רכישת לקוחות פרואקטיבית",
      price: "1,900 ש״ח",
      deliverable: "10 פניות שנכתבו, נשלחו, ותועדו עם אותות הקנייה.",
      reflection:
        "אמרת שאתה לא יודע מאיפה יבואו הלקוחות הבאים. זו לא בעיה של איכות — זו בעיה של מערכת. כל החודש שלך נסמך על תקווה. צריך צינור פעיל, גם אם הוא קטן.",
      reason:
        "המוצר מוכן והנרטיב חד. חסר רק צינור פנייה שיביא את 10 השיחות הבאות.",
      ctaPrimary: "אני רוצה את שלב 4",
    };
  }

  const sum = answers.reduce((s, v) => s + v, 0);

  if (sum === 0) {
    return {
      stage: "stage-4",
      number: "04",
      name: "רכישת לקוחות פרואקטיבית",
      price: "1,900 ש״ח",
      deliverable: "10 פניות שנכתבו, נשלחו, ותועדו עם אותות הקנייה.",
      reflection:
        "מבחינת המבנה — אתה במצב טוב. נרטיב חד, הצעה ברורה, מוצר מוכן. רוב הלקוחות שלי מגיעים אחרי שמשהו נשבר פתאום: לקוח מרכזי עזב, השוק זז, החלטת להעלות מחיר. עד שזה קורה אצלך — תוסף של פניות יוצאות יכול להגדיל בלי להזיז דבר אחר.",
      reason:
        "אתה במצב טוב. פניות יוצאות הן תוסף — לא תיקון, אלא שכבה שתיתן לך שליטה על קצב הלקוחות.",
      ctaPrimary: "אני רוצה את שלב 4",
    };
  }

  if (sum <= 2) {
    return {
      stage: "stage-1",
      number: "01",
      name: "נרטיב ייחודי",
      price: "1,000 ש״ח",
      deliverable: "מסמך נרטיב של עמוד-שניים עם 3-5 ניסוחים מוכנים.",
      reflection:
        "יש לך כיוון בכל ארבעת הצמתים — אבל אף אחד לא ממש חד. ברוב המקרים, חידוד הנרטיב הוא הצמיד שכשפותחים אותו השאר נפתח אוטומטית. עדיף לחדד את הקרקע לפני שמוסיפים שכבות.",
      reason:
        "יש לך כיוון בכל הצמתים — אף אחד לא חד. חידוד הנרטיב מחדד את שאר השלבים כתוצאה.",
      ctaPrimary: "אני רוצה את שלב 1",
    };
  }

  return {
    stage: "full-package",
    number: null,
    name: "החבילה המלאה",
    price: "4,500 ש״ח",
    deliverable: "כל ארבעת השלבים ברצף, עם ליווי בין הפגישות.",
    reflection:
      "כמה צמתים דורשים עבודה ביחד. במקום לקנות שלבים בנפרד, החבילה המלאה זולה ב-1,300 ש״ח ושומרת על המומנטום בין הפגישות.",
    reason:
      "כמה שלבים דורשים עבודה. החבילה המלאה זולה ב-1,300 ש״ח לעומת רכישה שלב-אחר-שלב, ושומרת על המומנטום.",
    ctaPrimary: "אני רוצה את החבילה המלאה",
  };
}

type Phase = "intro" | "question" | "result";

type SavedState = {
  phase: Phase;
  stepIndex: number;
  answers: Answer[];
};

const STORAGE_KEY = "cor-sys-wizard-state-v2";

function loadState(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedState;
    if (
      (parsed.phase === "intro" ||
        parsed.phase === "question" ||
        parsed.phase === "result") &&
      typeof parsed.stepIndex === "number" &&
      Array.isArray(parsed.answers)
    ) {
      return parsed;
    }
  } catch {
    /* ignore malformed state */
  }
  return null;
}

function persistState(state: SavedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

function clearPersistedState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

const StageRecommenderSection = () => {
  const { requestStage } = useDiagnosticForm();
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const saved = loadState();
    if (saved && saved.phase !== "intro") {
      setPhase(saved.phase);
      setStepIndex(saved.stepIndex);
      setAnswers(saved.answers);
    }
  }, []);

  useEffect(() => {
    if (phase === "intro" && answers.length === 0) {
      clearPersistedState();
    } else {
      persistState({ phase, stepIndex, answers });
    }
  }, [phase, stepIndex, answers]);

  const submitAnswer = useCallback(
    (value: Answer) => {
      const next = [...answers, value];
      trackEvent("wizard_question_answered", {
        wizard: "stage_recommender",
        question_key: QUESTIONS[stepIndex].key,
        answer_value: value,
      });
      if (stepIndex < QUESTIONS.length - 1) {
        setAnswers(next);
        setStepIndex(stepIndex + 1);
      } else {
        const result = recommend(next);
        trackEvent("wizard_complete", {
          wizard: "stage_recommender",
          recommended_stage: result.stage,
        });
        setAnswers(next);
        setPhase("result");
      }
    },
    [answers, stepIndex]
  );

  useEffect(() => {
    if (phase !== "question") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "3") {
        const idx = parseInt(e.key, 10) - 1;
        const opt = QUESTIONS[stepIndex].options[idx];
        if (opt) submitAnswer(opt.value);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, stepIndex, submitAnswer]);

  const start = () => {
    trackEvent("wizard_start", { wizard: "stage_recommender" });
    setStepIndex(0);
    setAnswers([]);
    setPhase("question");
  };

  const back = () => {
    if (stepIndex === 0) {
      setPhase("intro");
      setAnswers([]);
      return;
    }
    setStepIndex(stepIndex - 1);
    setAnswers(answers.slice(0, -1));
  };

  const restart = () => {
    clearPersistedState();
    setStepIndex(0);
    setAnswers([]);
    setPhase("intro");
  };

  const onCtaPrimary = (rec: Recommendation) => {
    trackEvent("wizard_cta_primary_click", {
      wizard: "stage_recommender",
      stage: rec.stage,
    });
    requestStage(rec.stage);
  };

  const onCtaSecondary = (rec: Recommendation) => {
    trackEvent("wizard_cta_secondary_click", {
      wizard: "stage_recommender",
      stage: rec.stage,
    });
    requestStage("unknown");
  };

  const onSkipToForm = () => {
    trackEvent("wizard_skip_to_form", {
      wizard: "stage_recommender",
      from_step: stepIndex,
    });
  };

  const result = phase === "result" ? recommend(answers) : null;
  const currentQuestion = phase === "question" ? QUESTIONS[stepIndex] : null;
  const progressPct =
    phase === "question"
      ? Math.round(((stepIndex + 1) / QUESTIONS.length) * 100)
      : 0;

  return (
    <section
      id="stage-recommender"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="recommender-overline"
    >
      <div className="mx-auto max-w-2xl px-6">
        {phase === "intro" && (
          <Reveal className="space-y-6">
            <p id="recommender-overline" className="cor-overline-he">
              בדיקת התאמה
            </p>
            <h2 className="cor-title text-foreground">
              איפה אתה בארבעת הצמתים?
            </h2>
            <p className="cor-body-lg text-foreground/80">
              4 שאלות, דקה. בסוף — לא ״מה לקנות״; אקרא איפה אתה ואגיד מה הצמיד הראשון לפתוח.
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

        {phase === "question" && currentQuestion && (
          <div className="space-y-8">
            <div className="space-y-3">
              <p id="recommender-overline" className="cor-overline-he">
                בדיקת התאמה
              </p>
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
                aria-label={`התקדמות שאלון: ${progressPct} אחוז`}
              >
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <Reveal key={stepIndex} className="space-y-6">
              <h3 className="cor-title text-foreground">
                {currentQuestion.text}
              </h3>

              <ul className="space-y-3">
                {currentQuestion.options.map((opt, idx) => (
                  <li key={opt.label}>
                    <button
                      type="button"
                      onClick={() => submitAnswer(opt.value)}
                      className="group flex w-full items-baseline justify-between gap-4 rounded-md border border-border bg-card px-5 py-4 text-right text-[15px] leading-snug text-foreground transition-all hover:border-primary hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`אפשרות ${idx + 1}: ${opt.label}`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          aria-hidden="true"
                          className="hidden font-mono text-[11px] text-muted-foreground sm:inline"
                        >
                          {idx + 1}
                        </span>
                        <span>{opt.label}</span>
                      </span>
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

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={back}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {stepIndex === 0 ? "חזור להתחלה" : "שאלה קודמת"}
                </button>
                <a
                  href="#diagnostic-form"
                  onClick={onSkipToForm}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  דלג ישר לשיחה ←
                </a>
              </div>
            </Reveal>
          </div>
        )}

        {phase === "result" && result && (
          <Reveal className="space-y-8">
            <div className="space-y-3">
              <p id="recommender-overline" className="cor-overline-he">
                ההמלצה
              </p>
              <h2 className="cor-display text-foreground">
                בסדר. אני מבין איפה אתה.
              </h2>
            </div>

            <p className="cor-body-lg text-foreground/85">{result.reflection}</p>

            <div className="cor-card p-6">
              <div className="border-t border-foreground pb-2 pt-4">
                {result.number ? (
                  <span className="stage-numeral block">{result.number}</span>
                ) : (
                  <span className="stage-numeral block text-[2rem] leading-none tracking-tight">
                    01 · 02 · 03 · 04
                  </span>
                )}
              </div>

              <h3 className="cor-subheading mt-4 text-foreground">
                {result.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {result.reason}
              </p>

              <div className="mt-5 border-r-2 border-border pr-3">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  תוצר ביד
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                  {result.deliverable}
                </p>
              </div>

              <p className="mt-5 text-base font-semibold text-foreground">
                {result.price}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onCtaPrimary(result)}
                className="cta-action inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
              >
                {result.ctaPrimary}
              </button>
              <button
                type="button"
                onClick={() => onCtaSecondary(result)}
                className="cta-line inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
              >
                קודם רוצה לדבר 20 דקות
              </button>
            </div>

            <button
              type="button"
              onClick={restart}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              שנה תשובות
            </button>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default StageRecommenderSection;
