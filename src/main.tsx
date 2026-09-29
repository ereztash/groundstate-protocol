import { createRoot, hydrateRoot } from "react-dom/client";
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

const container = document.getElementById("root")!;

// The prerendered landing page is adopted, not redrawn. createRoot discards the
// static DOM and renders it again once the bundle has run; on a mid-range phone
// that is several seconds in which the page the visitor is already reading is
// torn down and rebuilt, and it was the largest single cost in the landing
// page's 4.5s of blocked main thread. Only the landing page opts in: other
// routes render scroll-reveal state differently during prerender
// (window.__PRERENDER__), which would not hydrate cleanly.
//
// Both conditions are needed. GitHub Pages answers unknown paths with 404.html,
// which is a copy of the landing page, so landing markup in the container does
// not mean the router is about to render the landing page. The site root is
// derived the same way App.tsx derives the router basename.
const moduleParentPath = "../";
const siteRoot = new URL(moduleParentPath, import.meta.url).pathname;
const onLanding = [siteRoot, siteRoot.replace(/\/$/, ""), `${siteRoot}index.html`].includes(
  window.location.pathname
);
if (onLanding && container.querySelector('[data-page="landing"]')) {
  hydrateRoot(container, <App />, {
    onRecoverableError: (error) =>
      trackError(
        "hydration",
        error instanceof Error ? error.message : String(error)
      ),
  });
} else {
  createRoot(container).render(<App />);
}
