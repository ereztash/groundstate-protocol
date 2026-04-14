import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PopupModal } from "react-calendly";
import { CALENDLY_URL, CALENDLY_PAGE_SETTINGS } from "@/lib/calendly";

type CalendlyContextValue = {
  open: () => void;
};

const CalendlyContext = createContext<CalendlyContextValue | null>(null);

/**
 * Wraps the landing page and renders a single `PopupModal` instance.
 * Any descendant can call `useCalendly().open()` to launch the scheduler.
 */
export const CalendlyProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  // `PopupModal` mounts into a portal — grab <body> once on the client.
  useEffect(() => {
    setRootEl(document.body);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CalendlyContextValue>(() => ({ open }), [open]);

  return (
    <CalendlyContext.Provider value={value}>
      {children}
      {rootEl && (
        <PopupModal
          url={CALENDLY_URL}
          pageSettings={CALENDLY_PAGE_SETTINGS}
          open={isOpen}
          onModalClose={close}
          rootElement={rootEl}
        />
      )}
    </CalendlyContext.Provider>
  );
};

export const useCalendly = (): CalendlyContextValue => {
  const ctx = useContext(CalendlyContext);
  if (!ctx) {
    throw new Error("useCalendly must be used inside <CalendlyProvider>");
  }
  return ctx;
};
