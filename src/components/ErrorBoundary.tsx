import { Component, type ErrorInfo, type ReactNode } from "react";
import { trackError } from "@/lib/analytics";
import { CALENDLY_URL } from "@/lib/calendly";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Catches render-time crashes so a single thrown error can't blank the
 * whole page (which would mean zero conversions). The fallback keeps the
 * one action that matters reachable — a direct link to book a call — so
 * even a broken render still converts.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    trackError("react_error_boundary", error.message, error.stack || info.componentStack || undefined);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center gap-7 bg-background px-6 text-center"
      >
        <div className="space-y-3">
          <p className="cor-overline-he">רגע</p>
          <h1 className="cor-title text-foreground">משהו נתקע כאן לרגע.</h1>
          <p className="cor-body-lg max-w-md text-foreground/80">
            אפשר לרענן את העמוד — או פשוט לקבוע איתי שיחה ישירות, וגם זה ייפתר.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="cta-line inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
          >
            רענן את העמוד
          </button>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noreferrer"
            className="cta-action inline-flex h-11 items-center justify-center rounded-md px-6 text-sm"
          >
            קבע שיחה עכשיו
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
