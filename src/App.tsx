import { lazy, Suspense, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import ErrorBoundary from "./components/ErrorBoundary";
import ConsentBanner from "./components/ConsentBanner";

// Landing is the entry route on every visit, so it stays eager — lazy()
// would add a Suspense flash on the first paint. Privacy and NotFound are
// secondary routes loaded only when navigated to, so they ship in separate
// chunks.
const Privacy = lazy(() => import("./pages/Privacy"));
const Methodology = lazy(() => import("./pages/Methodology"));
const InsightsIndex = lazy(() => import("./pages/InsightsIndex"));
const InsightArticle = lazy(() => import("./pages/InsightArticle"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
/**
 * Internal capture tool, holding client case detail.
 *
 * GitHub Pages is a static host with no request layer, so there is nowhere to
 * check a credential and nothing that can answer 401. Hiding the route in the UI
 * would leave the code — and the form — one URL guess away. The only protection
 * a static host can actually enforce is absence: the route is compiled out, so
 * in a normal production build the chunk does not exist and /case-intake falls
 * through to the 404 page.
 *
 * It stays available in dev. Setting VITE_ENABLE_CASE_INTAKE=1 at build time
 * includes it, which is for a host that can put a real credential in front of
 * it. Do not set it for the Pages deploy.
 */
const CASE_INTAKE_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_CASE_INTAKE === "1";
const CaseIntake = CASE_INTAKE_ENABLED
  ? lazy(() => import("./pages/CaseIntake"))
  : null;
/** Same gate: an internal review surface, not part of the public site. */
const GuaranteeReview = CASE_INTAKE_ENABLED
  ? lazy(() => import("./pages/GuaranteeReview"))
  : null;

/**
 * Reset scroll to the top on client-side navigation. Without this, following a
 * cross-page link from a page bottom (e.g. the footer nav) lands the reader at
 * the previous scroll offset on the new page. Hash targets (e.g.
 * /#diagnostic-form) are left alone so they scroll to their anchor instead.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

// vite.config.ts builds with a RELATIVE base ("./") so one artifact works at a
// domain root and at a project sub-path. That makes import.meta.env.BASE_URL
// "./", which is not a valid router basename. Derive the real absolute mount
// path from this bundled module's own URL instead: chunks live at
// "<base>/assets/<chunk>.js", so "../" resolves to "<base>/" — yielding "/" at
// a root deploy and "/groundstate-protocol/" on GitHub Pages, with nothing
// hardcoded. In dev the module is "/src/App.tsx", so "../" → "/".
//
// The "../" is held in a variable on purpose. Vite's dev server special-cases
// the *literal* form `new URL("<literal>", import.meta.url)` as an asset
// reference and rewrites it to the on-disk path "/@fs/<abs project dir>". That
// made the router basename "/@fs/home/.../groundstate-protocol", which no URL
// starts with, so <BrowserRouter> matched nothing and `npm run dev` rendered a
// blank page. A non-literal first argument sidesteps that transform; the
// production build already leaves the expression untouched (it can't be
// resolved at build time), so runtime behaviour there is unchanged.
const moduleParentPath = "../";
const routerBasename = new URL(moduleParentPath, import.meta.url).pathname;

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      {/* basename is derived from the bundle URL (see routerBasename above),
          so routes resolve correctly whether the app is served from "/" or a
          subpath like /groundstate-protocol/ on GitHub Pages. */}
      <BrowserRouter basename={routerBasename}>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/protocol" element={<Methodology />} />
            <Route path="/insights" element={<InsightsIndex />} />
            <Route path="/insights/:slug" element={<InsightArticle />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            {CASE_INTAKE_ENABLED && CaseIntake && (
              <Route path="/case-intake" element={<CaseIntake />} />
            )}
            {CASE_INTAKE_ENABLED && GuaranteeReview && (
              <Route path="/guarantee-review" element={<GuaranteeReview />} />
            )}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {/* Privacy-by-default consent gate. Lives inside BrowserRouter
            because it links to /privacy. Shows once (until a choice is
            stored), then inits analytics + Clarity only on accept. */}
        <ConsentBanner />
      </BrowserRouter>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;
