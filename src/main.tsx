import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initAnalytics, trackError } from "./lib/analytics";
import { initClarity } from "./lib/clarity";
import { getConsent } from "./lib/consent";
import "./index.css";

// Privacy-by-default: analytics + session recording (GA4, Microsoft Clarity)
// load only for visitors who already granted consent on a previous visit.
// First-time visitors get <ConsentBanner/> (rendered in App.tsx), which inits
// these the moment they accept. This keeps runtime behaviour consistent with
// the promise in the privacy policy ("נטענים רק לאחר אישורך").
if (getConsent() === "granted") {
  initAnalytics();
  initClarity();
}

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
