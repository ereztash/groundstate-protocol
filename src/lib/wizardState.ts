/**
 * Persisted state for the stage-recommender wizard.
 *
 * Extracted from StageRecommenderSection so the diagnostic form can read it
 * too. Before this, the wizard collected five qualifying answers (one open
 * text + four multiple choice), persisted them to localStorage, and the form
 * submitted only the resulting stage name — the other five signals were
 * discarded on every lead.
 *
 * The form reads this at submit time rather than receiving it through the
 * provider, so a visitor who completes the wizard and then converts via any
 * other CTA still has their answers attached.
 */

export type Answer = 0 | 1 | 2;

export type WizardPhase = "intro" | "open" | "question" | "result";

export type SavedState = {
  phase: WizardPhase;
  stepIndex: number;
  answers: Answer[];
  openText: string;
};

const STORAGE_KEY = "cor-sys-wizard-state-v3";

export function loadWizardState(): SavedState | null {
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

export function persistWizardState(state: SavedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function clearWizardState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * The wizard answers formatted for a single spreadsheet cell, paired with the
 * question they answer. Returns "" when the visitor never answered any — the
 * form then sends the documented "(לא מולא)" fallback like every other
 * optional field.
 *
 * Kept as short keys rather than full question text so the cell stays
 * readable: the questions live in StageRecommenderSection and don't change
 * per lead.
 */
export const WIZARD_QUESTION_KEYS = [
  "נרטיב",
  "הצעת ערך",
  "מוצר",
  "פניות",
] as const;

/** 0 = no problem, 1 = partial, 2 = the blocking problem. */
const ANSWER_LABELS = ["חד", "חלקי", "תקוע"] as const;

export function formatWizardAnswers(answers: Answer[]): string {
  if (!answers.length) return "";
  return answers
    .map((a, i) => {
      const key = WIZARD_QUESTION_KEYS[i] ?? `שאלה ${i + 1}`;
      const label = ANSWER_LABELS[a] ?? String(a);
      return `${key}: ${label}`;
    })
    .join(" · ");
}
