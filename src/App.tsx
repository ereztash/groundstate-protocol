import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* basename is derived from the bundle URL (see routerBasename above),
            so routes resolve correctly whether the app is served from "/" or a
            subpath like /groundstate-protocol/ on GitHub Pages. */}
        <BrowserRouter basename={routerBasename}>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/protocol" element={<Methodology />} />
              <Route path="/insights" element={<InsightsIndex />} />
              <Route path="/insights/:slug" element={<InsightArticle />} />
              <Route path="/privacy" element={<Privacy />} />
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
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
