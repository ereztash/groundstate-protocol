import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_not_found", { path: location.pathname });
  }, [location.pathname]);

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-20 text-foreground"
    >
      <div className="mx-auto w-full max-w-lg space-y-8">
        <div className="space-y-3">
          <p className="cor-overline-he text-muted-foreground">
            שגיאה 404
          </p>
          <h1 className="cor-title text-foreground">
            הדף הזה לא קיים. אבל אני כן.
          </h1>
          <p className="cor-body-lg text-foreground/80">
            הקישור שהגיע אליך כנראה ישן או שגוי. אם הגעת לכאן ממקום שאמור היה לעבוד, אשמח לדעת.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="cta-action inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold"
          >
            חזרה לעמוד הבית
          </Link>
          <p className="text-xs leading-relaxed text-muted-foreground">
            או דלג ישר ל
            <Link to="/#diagnostic-form" className="text-link mx-1">
              אבחון התאמה של 20 דקות
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
