import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
  requestStage: (s: StageValue) => void;
};

const DiagnosticFormContext = createContext<Ctx | null>(null);

export const DiagnosticFormProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStage, setSelectedStage] = useState<StageValue>("");

  const requestStage = useCallback((s: StageValue) => {
    setSelectedStage(s);
    if (typeof window !== "undefined") {
      const el = document.getElementById("diagnostic-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ selectedStage, setSelectedStage, requestStage }),
    [selectedStage, requestStage]
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
