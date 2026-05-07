import { Component, type ErrorInfo, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    trackEvent("react_error", {
      message: error.message,
      stack: info.componentStack?.slice(0, 500),
    });
    if (typeof console !== "undefined") {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  private handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-background px-6 py-20 text-foreground"
      >
        <div className="mx-auto w-full max-w-lg space-y-6">
          <p className="cor-overline-he text-muted-foreground">משהו השתבש</p>
          <h1 className="cor-title text-foreground">
            התרחשה שגיאה. הנה המוצא.
          </h1>
          <p className="cor-body-lg text-foreground/80">
            הדף נתקע באמצע טעינה. רוב הסיכויים שטעינה מחדש תפתור את זה.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="cta-action inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold"
            >
              לטעון מחדש
            </button>
            <a
              href="/"
              className="cta-line inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold"
            >
              חזרה לעמוד הבית
            </a>
          </div>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
