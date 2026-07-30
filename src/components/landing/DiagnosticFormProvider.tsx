import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LeadSource } from "@/lib/web3forms";

export type StageValue =
  | "stage-1"
  | "stage-2"
  | "stage-3"
  | "stage-4"
  | "full-package"
  | "unknown"
  | "";

type Ctx = {
  selectedStage: StageValue;
  setSelectedStage: (s: StageValue) => void;
  /** Scroll to the form, recording both the chosen stage and the CTA used. */
  requestStage: (s: StageValue, source: LeadSource) => void;
  /**
   * Scroll to the form from a CTA that doesn't pick a stage (hero, mid-page,
   * sticky). Previously these called scrollIntoView directly, which meant the
   * lead arrived with no record of where it came from.
   */
  requestForm: (source: LeadSource) => void;
  source: LeadSource | null;
};

const DiagnosticFormContext = createContext<Ctx | null>(null);

function scrollToForm(): void {
  if (typeof window === "undefined") return;
  document
    .getElementById("diagnostic-form")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export const DiagnosticFormProvider = ({
  children,
  initialSource = null,
}: {
  children: ReactNode;
  /**
   * Seeds the source for visitors who arrived from another page's CTA (the
   * site header deep-links to /?src=header#diagnostic-form). A same-page CTA
   * overwrites it, which is correct: the last thing they clicked is what
   * actually carried them to the form.
   */
  initialSource?: LeadSource | null;
}) => {
  const [selectedStage, setSelectedStage] = useState<StageValue>("");
  const [source, setSource] = useState<LeadSource | null>(initialSource);

  const requestStage = useCallback((s: StageValue, src: LeadSource) => {
    setSelectedStage(s);
    setSource(src);
    scrollToForm();
  }, []);

  const requestForm = useCallback((src: LeadSource) => {
    setSource(src);
    scrollToForm();
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      selectedStage,
      setSelectedStage,
      requestStage,
      requestForm,
      source,
    }),
    [selectedStage, requestStage, requestForm, source]
  );

  return (
    <DiagnosticFormContext.Provider value={value}>
      {children}
    </DiagnosticFormContext.Provider>
  );
};

export const useDiagnosticForm = (): Ctx => {
  const ctx = useContext(DiagnosticFormContext);
  if (!ctx) {
    throw new Error(
      "useDiagnosticForm must be used inside <DiagnosticFormProvider>"
    );
  }
  return ctx;
};

/**
 * Null-safe variant for components rendered both inside and outside the
 * provider. SiteHeader is the case: it ships on every route, but only the
 * landing page has a form to scroll to.
 */
export const useOptionalDiagnosticForm = (): Ctx | null =>
  useContext(DiagnosticFormContext);
