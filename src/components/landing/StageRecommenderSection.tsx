import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDiagnosticForm, type StageValue } from "./DiagnosticFormProvider";
import { trackEvent } from "@/lib/analytics";
import { fullPackage, getStage } from "@/lib/stages";

function baseFor(value: StageValue): Pick<Recommendation, "stage" | "number" | "name" | "price" | "deliverable" | "ctaPrimary"> {
  const s = getStage(value);
  if (!s) throw new Error(`Unknown stage: ${value}`);
  return {
    stage: value,
    number: s.number,
    name: s.name,
    price: s.priceLabel,
    deliverable: s.deliverable,
    ctaPrimary: `${s.ctaLabel} — ${s.priceLabel}`,
  };
}

export type Answer = 0 | 1 | 2;

type Option = {
  label: string;
  value: Answer;
};

type Question = {
  key: "narrative" | "valueprop" | "product" | "outreach";
  anticipation: string;
  text: string;
  options: [Option, Option, Option];
};

const QUESTIONS: Question[] = [
  {
    key: "narrative",
    anticipation: "שתי השניות הראשונות של כל פגישה.",
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
    anticipation: "הרגע השני של אמת — אחרי המשפט.",
    text: "כשלקוח רואה את המחיר שלך — מה התגובה הראשונה?",
    options: [
      { label: "״מצוין, מתי מתחילים?״", value: 0 },
      { label: "״אהמ, אחזור אליך״ (לפעמים חוזרים, לפעמים לא).", value: 1 },
      { label: "״וואו, זה הרבה״ — וצריך לנמק.", value: 2 },
    ],
  },
  {
    key: "product",
    anticipation: "מה אתה שולח, אחרי שהוא ביקש.",
    text: "לקוח שואל ״מה אני מקבל בדיוק?״ — מה אתה עושה?",
    options: [
      { label: "שולח קובץ מוכן שאני שולח לכל פנייה.", value: 0 },
      { label: "שולח משהו ישן ומוסיף הסבר בגוף המייל.", value: 1 },
      { label: "פותח Word ריק ומתחיל לכתוב.", value: 2 },
    ],
  },
  {
    key: "outreach",
    anticipation: "השאלה האחרונה — הקריטית מכולן.",
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

export type Recommendation = {
  stage: StageValue;
  number: "01" | "02" | "03" | "04" | null;
  name: string;
  price: string;
  deliverable: string;
  reflection: string;
  reason: string;
  ctaPrimary: string;
};

// Single-problem recommendations (one "2" wins). Stage facts (number, name,
// price, deliverable) come from src/lib/stages.ts so SequenceSection and the
// wizard can never drift on pricing or copy. Each rec owns only the wizard-
// specific reflection + reason.
const SINGLE_RECS: Record<number, Recommendation> = {
  0: {
    ...baseFor("stage-1"),
    reflection:
      "אמרת שכשאתה אומר במסיבה מה אתה עושה — האדם מהנהן ומחליף נושא. זה האות שהנרטיב עוד לא יודע לתפוס את הקרקע. כל מה שבא אחריו — מחיר, מוצר, פניות — נשען עליו. אז שם מתחילים.",
    reason:
      "כל מה שבא אחר כך מבוסס על משפט הליבה שלך. בלעדיו, השלבים הבאים נשענים על קרקע רכה.",
  },
  1: {
    ...baseFor("stage-2"),
    reflection:
      "סיפרת שלקוח רואה את המחיר ואומר ״וואו, זה הרבה״, ואתה מנמק בכל פעם. זו לא בעיה של מחיר — זו בעיה של הצעה. אם הלקוח לא רואה למה זה שווה לפני שראה את הסכום, הסכום תמיד יהיה גדול.",
    reason:
      "יש לך נרטיב. החסר הוא ההצעה הברורה ללקוח — מה הוא מקבל, ולמה זה שווה את הסכום.",
  },
  2: {
    ...baseFor("stage-3"),
    reflection:
      "אמרת שכשלקוח שואל ״מה אני מקבל?״ אתה פותח Word ריק. זה אומר שאתה מתחיל מאפס לכל לקוח — וזה גוזל זמן ומשדר חוסר ביטחון. צריך מסמך אחד שעובד פעם אחר פעם.",
    reason:
      "יש לך הצעת ערך אבל אין תיעוד מוצרי. ניצור מסמך אחד שנשלח שוב ושוב, במקום לבנות מאפס בכל פעם.",
  },
  3: {
    ...baseFor("stage-4"),
    reflection:
      "אמרת שאתה לא יודע מאיפה יבואו הלקוחות הבאים. זו לא בעיה של איכות — זו בעיה של מערכת. כל החודש שלך נסמך על תקווה. צריך צינור פעיל, גם אם הוא קטן.",
    reason:
      "המוצר מוכן והנרטיב חד. חסר רק צינור פנייה שיביא את 10 השיחות הבאות.",
  },
};

// Dual-problem reflections — when exactly two answers are "2"
// Recommendation is always the lower-indexed stage (more foundational).
const DUAL_REFLECTIONS: Record<string, string> = {
  "0-1":
    "אנשים מהנהנים ומחליפים נושא — וגם לקוחות בוואו על המחיר. שני אלה ביחד מצביעים על נושא אחד: המאזין לא מבין מה אתה מוכר עד שראה את הסכום. ובלי הבנה — סכום תמיד גדול. הנרטיב הוא הקרקע, אז משם מתחילים.",
  "0-2":
    "אנשים מהנהנים ומחליפים נושא — וגם אתה פותח Word ריק לכל לקוח. שני אלה ביחד אומרים שהמסר עוד לא מקודד. בלי משפט ליבה לא תוכל לתחזק מסמך אחד; בלי מסמך אחד, כל לקוח דורש מאמץ מאפס. נרטיב ראשון, מוצר אחריו.",
  "0-3":
    "אנשים מהנהנים ומחליפים נושא — וגם אתה לא יודע מאיפה יבוא חודש הבא. אם פניות יוצאות לא מצליחות, חלק גדול מהסיבה הוא שהמשפט הראשון לא תופס. נרטיב מתקן את שני הצמתים ביחד.",
  "1-2":
    "לקוחות בוואו על המחיר — וגם אתה פותח Word ריק לכל פנייה. כשאין הצעת ערך ברורה, אין מה לקבוע במסמך; וכשאין מסמך, הצעת הערך נשארת בעל-פה. שני אלה נפתרים בשלב 2 שמייצר את התיאור הראשון.",
  "1-3":
    "לקוחות בוואו על המחיר — וגם אין צינור פנייה ברור. שני אלה ביחד אומרים: הצעת הערך לא מספיק חדה כדי שמי שמקבל פנייה ידע מהר למה זה הוא. עובדים על שלב 2 קודם, אחר כך שלב 4 יהיה הרבה יותר קל.",
  "2-3":
    "אתה פותח Word ריק לכל לקוח — וגם אין צינור פנייה ברור. שני אלה ביחד אומרים שאין לך ׳נכס׳ להעביר הלאה. בלי מוצר מנוסח, הפנייה — גם אם תיכתב — לא תפעל. שלב 3 הוא הצומת הראשון.",
};

const ALL_ZERO_REC: Recommendation = {
  ...baseFor("stage-4"),
  reflection:
    "מבחינת המבנה — אתה במצב טוב. נרטיב חד, הצעה ברורה, מוצר מוכן. רוב הלקוחות שלי מגיעים אחרי שמשהו נשבר פתאום: לקוח מרכזי עזב, השוק זז, החלטת להעלות מחיר. עד שזה קורה אצלך — תוסף של פניות יוצאות יכול להגדיל בלי להזיז דבר אחר.",
  reason:
    "אתה במצב טוב. פניות יוצאות הן תוסף — לא תיקון, אלא שכבה שתיתן לך שליטה על קצב הלקוחות.",
};

const MILD_REC: Recommendation = {
  ...baseFor("stage-1"),
  reflection:
    "יש לך כיוון בכל ארבעת הצמתים — אבל אף אחד לא ממש חד. ברוב המקרים, חידוד הנרטיב הוא הצומת שכשפותחים אותו השאר נפתח אוטומטית. עדיף לחדד את הקרקע לפני שמוסיפים שכבות.",
  reason:
    "יש לך כיוון בכל הצמתים — אף אחד לא חד. חידוד הנרטיב מחדד את שאר השלבים כתוצאה.",
};

const FULL_PACKAGE_REC: Recommendation = {
  stage: "full-package",
  number: null,
  name: fullPackage.name,
  price: fullPackage.priceLabel,
  deliverable: fullPackage.deliverable,
  reflection: `כמה צמתים דורשים עבודה ביחד. במקום לקנות שלבים בנפרד, החבילה המלאה זולה ב-${fullPackage.savingsLabel} ושומרת על המומנטום בין הפגישות.`,
  reason: `כמה שלבים דורשים עבודה. החבילה המלאה זולה ב-${fullPackage.savingsLabel} לעומת רכישה שלב-אחר-שלב, ושומרת על המומנטום.`,
  ctaPrimary: `${fullPackage.ctaLabel} — ${fullPackage.priceLabel}`,
};

function findTwos(answers: Answer[]): number[] {
  const twos: number[] = [];
  answers.forEach((a, i) => {
    if (a >= 2) twos.push(i);
  });
  return twos;
}

export function recommend(answers: Answer[], openText: string): Recommendation {
  const twos = findTwos(answers);

  let base: Recommendation;

  if (twos.length >= 3) {
    base = FULL_PACKAGE_REC;
  } else if (twos.length === 2) {
    const key = `${twos[0]}-${twos[1]}`;
    const reflection = DUAL_REFLECTIONS[key];
    const single = SINGLE_RECS[twos[0]];
    base = { ...single, reflection };
  } else if (twos.length === 1) {
    base = SINGLE_RECS[twos[0]];
  } else {
    const sum = answers.reduce((s, v) => s + v, 0);
    base = sum === 0 ? ALL_ZERO_REC : MILD_REC;
  }

  if (openText.trim()) {
    const quote = openText.trim().slice(0, 200);
    return {
      ...base,
      reflection: `כתבת: ״${quote}״.\n\n${base.reflection}`,
    };
  }

  return base;
}

type Phase = "intro" | "open" | "question" | "result";

type SavedState = {
  phase: Phase;
  stepIndex: number;
  answers: Answer[];
  openText: string;
};

const STORAGE_KEY = "cor-sys-wizard-state-v3";

function loadState(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedState;
    if (
      (parsed.phase === "intro" ||
        parsed.phase === "open" ||
        parsed.phase === "question" ||
        parsed.phase === "result") &&
      typeof parsed.stepIndex === "number" &&
      Array.isArray(parsed.answers) &&
      typeof parsed.openText === "string"
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function persistState(state: SavedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
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

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0, 0, 0.2, 1] as const },
};

const StageRecommenderSection = () => {
  const { requestStage } = useDiagnosticForm();
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [openText, setOpenText] = useState("");
  const [pendingChoice, setPendingChoice] = useState<number | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusResultRef = useRef(false);

  useEffect(() => {
    const saved = loadState();
    if (saved && saved.phase !== "intro") {
      setPhase(saved.phase);
      setStepIndex(saved.stepIndex);
      setAnswers(saved.answers);
      setOpenText(saved.openText);
    }
  }, []);

  useEffect(() => {
    if (phase === "intro" && answers.length === 0 && !openText) {
      clearPersistedState();
    } else {
      persistState({ phase, stepIndex, answers, openText });
    }
  }, [phase, stepIndex, answers, openText]);

  const submitAnswer = useCallback(
    (optionIdx: number, value: Answer) => {
      if (pendingChoice !== null) return;
      setPendingChoice(optionIdx);
      const next = [...answers, value];
      trackEvent("wizard_question_answered", {
        wizard: "stage_recommender",
        question_key: QUESTIONS[stepIndex].key,
        answer_value: value,
      });
      window.setTimeout(() => {
        if (stepIndex < QUESTIONS.length - 1) {
          setAnswers(next);
          setStepIndex(stepIndex + 1);
        } else {
          const result = recommend(next, openText);
          trackEvent("wizard_complete", {
            wizard: "stage_recommender",
            recommended_stage: result.stage,
          });
          setAnswers(next);
          shouldFocusResultRef.current = true;
          setPhase("result");
        }
        setPendingChoice(null);
      }, 280);
    },
    [answers, stepIndex, openText, pendingChoice]
  );

  useEffect(() => {
    if (phase !== "question") return;
    const handler = (e: KeyboardEvent) => {
      if (pendingChoice !== null) return;
      if (e.key >= "1" && e.key <= "3") {
        const idx = parseInt(e.key, 10) - 1;
        const opt = QUESTIONS[stepIndex].options[idx];
        if (opt) submitAnswer(idx, opt.value);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, stepIndex, submitAnswer, pendingChoice]);

  // On wizard completion (user-driven only — not on localStorage restore),
  // move focus to the result heading so keyboard/SR users land on the payoff.
  useEffect(() => {
    if (phase === "result" && shouldFocusResultRef.current) {
      shouldFocusResultRef.current = false;
      resultHeadingRef.current?.focus();
    }
  }, [phase]);

  const startWizard = () => {
    trackEvent("wizard_start", { wizard: "stage_recommender" });
    setStepIndex(0);
    setAnswers([]);
    setOpenText("");
    setPhase("open");
  };

  const submitOpen = () => {
    trackEvent("wizard_open_submitted", {
      wizard: "stage_recommender",
      has_text: openText.trim().length > 0,
      text_length: openText.trim().length,
    });
    setPhase("question");
  };

  const backFromOpen = () => {
    trackEvent("wizard_back_clicked", {
      wizard: "stage_recommender",
      from_phase: "open",
    });
    setPhase("intro");
    setOpenText("");
    setAnswers([]);
  };

  const backFromQuestion = () => {
    trackEvent("wizard_back_clicked", {
      wizard: "stage_recommender",
      from_phase: "question",
      from_step: stepIndex,
    });
    if (stepIndex === 0) {
      setPhase("open");
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
    setOpenText("");
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

  const result = phase === "result" ? recommend(answers, openText) : null;
  const currentQuestion = phase === "question" ? QUESTIONS[stepIndex] : null;
  const progressPct =
    phase === "question"
      ? Math.round(((stepIndex + 1) / QUESTIONS.length) * 100)
      : 0;

  // Announced to assistive tech on every phase/question change (WCAG 4.1.3),
  // since the visual swap via framer-motion isn't a focus change.
  const liveAnnouncement =
    phase === "question" && currentQuestion
      ? `שאלה ${stepIndex + 1} מתוך ${QUESTIONS.length}: ${currentQuestion.text}`
      : phase === "result"
        ? "ההמלצה מוכנה."
        : "";

  // Mini-echo: the previous answer's label, shown above the current question
  const previousAnswerLabel =
    phase === "question" && stepIndex > 0
      ? QUESTIONS[stepIndex - 1].options.find(
          (o) => o.value === answers[stepIndex - 1]
        )?.label ?? null
      : null;

  return (
    <section
      id="stage-recommender"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="recommender-overline"
    >
      <div className="mx-auto max-w-2xl px-6">
        <div role="status" aria-live="polite" className="sr-only">
          {liveAnnouncement}
        </div>
        <AnimatePresence mode="wait">
          {/* INTRO */}
          {phase === "intro" && (
            <motion.div key="intro" {...FADE_IN} className="space-y-6">
              <p id="recommender-overline" className="cor-overline-he">
                בדיקת התאמה
              </p>
              <h2 className="cor-title text-foreground">
                איפה אתה בארבעת הצמתים?
              </h2>
              <p className="cor-body-lg text-foreground/80">
                5 שאלות, דקה. שאלה אחת פתוחה ו-4 בחירה. בסוף — לא ״מה לקנות״; אקרא איפה אתה ואגיד מה הצומת הראשון לפתוח.
              </p>
              <button
                type="button"
                onClick={startWizard}
                className="cta-line mt-2 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
              >
                התחל את הבדיקה
              </button>
            </motion.div>
          )}

          {/* OPEN-TEXT Q0 */}
          {phase === "open" && (
            <motion.div key="open" {...FADE_IN} className="space-y-6">
              <div className="space-y-3">
                <p id="recommender-overline" className="cor-overline-he">
                  בדיקת התאמה
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  שאלה פתוחה — לפני שמתחילים
                </p>
              </div>
              <h2 className="cor-title text-foreground">
                במשפט אחד — מה התקיעה הכי בוערת אצלך כרגע?
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                לא חובה. אבל אם תכתוב, אצטט אותך בתשובה — הניתוח יוצא יותר מדויק.
              </p>
              <textarea
                value={openText}
                onChange={(e) => setOpenText(e.target.value.slice(0, 280))}
                placeholder="לדוגמה: ״הסיפור שלי נשמע כמו של כל יועץ אחר, ואני לא יודע איך לחדד אותו…״"
                className="block w-full rounded-md border border-border bg-card px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows={4}
                maxLength={280}
                dir="auto"
                aria-label="תיאור התקיעה בקצרה"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {openText.length}/280
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={submitOpen}
                  className="cta-line inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
                >
                  {openText.trim()
                    ? "המשך ל-4 השאלות"
                    : "דלג — קח אותי ל-4 השאלות"}
                </button>
                <button
                  type="button"
                  onClick={backFromOpen}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  חזור להתחלה
                </button>
              </div>
            </motion.div>
          )}

          {/* QUESTION */}
          {phase === "question" && currentQuestion && (
            <motion.div
              key="question-shell"
              {...FADE_IN}
              className="space-y-8"
            >
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
                  <motion.div
                    className="h-full bg-primary"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
                  className="space-y-6"
                >
                  {previousAnswerLabel && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      <span className="text-primary/70">ענית: </span>
                      <span className="text-foreground/70">
                        ״{previousAnswerLabel}״
                      </span>
                    </p>
                  )}

                  <p className="text-[13px] leading-snug text-primary/85">
                    {currentQuestion.anticipation}
                  </p>

                  <h3 className="cor-title text-foreground">
                    {currentQuestion.text}
                  </h3>

                  <ul className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => {
                      const isPending = pendingChoice === idx;
                      const isDimmed =
                        pendingChoice !== null && pendingChoice !== idx;
                      return (
                        <li key={opt.label}>
                          <button
                            type="button"
                            onClick={() => submitAnswer(idx, opt.value)}
                            disabled={pendingChoice !== null}
                            className={`group flex w-full items-baseline justify-between gap-4 rounded-md border bg-card px-5 py-4 text-right text-[15px] leading-snug text-foreground transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                              isPending
                                ? "border-primary bg-primary/10"
                                : isDimmed
                                ? "border-border opacity-40"
                                : "border-border hover:border-primary hover:bg-primary/5 active:scale-[0.99]"
                            }`}
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
                              {isPending ? "✓" : "←"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={backFromQuestion}
                      disabled={pendingChoice !== null}
                      className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                    >
                      {stepIndex === 0 ? "חזור לשאלה הפתוחה" : "שאלה קודמת"}
                    </button>
                    <a
                      href="#diagnostic-form"
                      onClick={onSkipToForm}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      דלג ישר לשיחה ←
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* RESULT — 3-act stagger */}
          {phase === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0, 0, 0.2, 1], delay: 0 }}
                className="space-y-3"
              >
                <p id="recommender-overline" className="cor-overline-he">
                  ההמלצה
                </p>
                <h2
                  ref={resultHeadingRef}
                  tabIndex={-1}
                  className="cor-display text-foreground outline-none"
                >
                  בסדר. אני מבין איפה אתה.
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0, 0, 0.2, 1],
                  delay: 0.4,
                }}
                className="cor-body-lg whitespace-pre-line text-foreground/85"
              >
                {result.reflection}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0, 0, 0.2, 1],
                  delay: 0.9,
                }}
              >
                <div className="cor-card p-6">
                  <div className="border-t border-foreground pb-2 pt-4">
                    {result.number ? (
                      <span className="stage-numeral block">
                        {result.number}
                      </span>
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0, 0, 0.2, 1],
                  delay: 1.4,
                }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {/* The free 20-min call is the primary CTA — the lowest-risk
                      next step for a skeptical visitor. Buying a specific stage
                      is the secondary action. The analytics event names below
                      (primary=buy-stage, secondary=book-call) are kept as-is so
                      existing GA4 funnels keep working, even though the visual
                      hierarchy is intentionally flipped. */}
                  <button
                    type="button"
                    onClick={() => onCtaSecondary(result)}
                    className="cta-action inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
                  >
                    קבע שיחת 20 דקות בחינם
                  </button>
                  <button
                    type="button"
                    onClick={() => onCtaPrimary(result)}
                    className="cta-line inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
                  >
                    {result.ctaPrimary}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={restart}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  שנה תשובות
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default StageRecommenderSection;
