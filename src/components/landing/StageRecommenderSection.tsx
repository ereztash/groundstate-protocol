import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import { trackEvent } from "@/lib/analytics";
// The questions and the answers-to-recommendation rule. Pure, and tested on
// their own in src/data/stage-recommender.test.ts; this file is the UI over
// them.
import {
  QUESTIONS,
  recommend,
  type Recommendation,
} from "@/data/stage-recommender";
// Storage lives in a shared module so the diagnostic form can read the same
// answers at submit time — see src/lib/wizardState.ts.
import {
  clearWizardState,
  loadWizardState,
  persistWizardState,
  type Answer,
  type WizardPhase,
} from "@/lib/wizardState";

type Phase = WizardPhase;

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
    const saved = loadWizardState();
    if (saved && saved.phase !== "intro") {
      setPhase(saved.phase);
      setStepIndex(saved.stepIndex);
      setAnswers(saved.answers);
      setOpenText(saved.openText);
    }
  }, []);

  useEffect(() => {
    if (phase === "intro" && answers.length === 0 && !openText) {
      clearWizardState();
    } else {
      persistWizardState({ phase, stepIndex, answers, openText });
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
    clearWizardState();
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
    requestStage(rec.stage, "wizard");
  };

  const onCtaSecondary = (rec: Recommendation) => {
    trackEvent("wizard_cta_secondary_click", {
      wizard: "stage_recommender",
      stage: rec.stage,
    });
    requestStage("unknown", "wizard");
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
              {/* "צומת" runs through all seven result texts below as a
                  consistent metaphor, so it stays — but it used to appear
                  first in the heading, asking the visitor to already know what
                  a junction is. The heading now uses the vocabulary the page
                  defines (שלבים), and the intro introduces the metaphor once,
                  with its meaning attached. */}
              <h2 className="cor-title text-foreground">
                איפה את בארבעת השלבים?
              </h2>
              <p className="cor-body-lg text-foreground/80">
                5 שאלות, דקה. שאלה אחת פתוחה ו-4 בחירה. בסוף לא ״מה לקנות״: אקרא איפה את ואגיד מאיזה שלב להתחיל: הצומת שפתיחתו משחררת את השאר.
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
                  שאלה פתוחה, לפני שמתחילים
                </p>
              </div>
              <h2 className="cor-title text-foreground">
                במשפט אחד, מה התקיעה הכי בוערת אצלך כרגע?
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                לא חובה. אבל אם תכתבי, אצטט אותך בתשובה, הניתוח יוצא יותר מדויק.
              </p>
              <textarea
                value={openText}
                onChange={(e) => setOpenText(e.target.value.slice(0, 280))}
                placeholder="לדוגמה: ״הסיפור שלי נשמע כמו של כל יועץ אחר, ואני לא יודעת איך לחדד אותו…״"
                className="block w-full rounded-md border border-border bg-card px-4 py-3 text-base leading-relaxed md:text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                    : "דלג, קחו אותי ל-4 השאלות"}
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

                  <p className="text-sm leading-snug text-primary/85">
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
                  בסדר. אני מבין איפה את.
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
                    קבע שיחת התאמה, 20 דקות, בחינם
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
