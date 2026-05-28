import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initAnalytics, trackError } from "./lib/analytics";
import { initClarity } from "./lib/clarity";
import "./index.css";

// TEMPORARY launch override: load analytics + session recording for everyone
// so the launch traffic is fully tracked. The consent gate (a getConsent()
// check here + <ConsentBanner/> in App.tsx) is intentionally disabled for the
// launch window — RE-ENABLE it once the push settles.
initAnalytics();
initClarity();

// Global error capture — reports to analytics when it's available (post-
// consent) so production crashes we'd otherwise never see become visible.
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    trackError(
      "window_error",
      e.message,
      e.error instanceof Error ? e.error.stack : undefined
    );
  });
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    trackError(
      "unhandled_rejection",
      typeof reason === "string" ? reason : reason?.message ?? "unknown"
    );
  });
}

createRoot(document.getElementById("root")!).render(<App />);
