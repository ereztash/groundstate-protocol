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
// would add a Suspense flash on the first paint. Index (GroundState tool),
// Privacy, and NotFound are secondary routes loaded only when navigated to,
// so they ship in separate chunks.
const Index = lazy(() => import("./pages/Index"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// vite.config.ts builds with a RELATIVE base ("./") so one artifact works at a
// domain root and at a project sub-path. That makes import.meta.env.BASE_URL
// "./", which is not a valid router basename. Derive the real absolute mount
// path from this bundled module's own URL instead: chunks live at
// "<base>/assets/<chunk>.js", so "../" resolves to "<base>/" — yielding "/" at
// a root deploy and "/groundstate-protocol/" on GitHub Pages, with nothing
// hardcoded. In dev the module is "/src/App.tsx", so "../" → "/".
const routerBasename = new URL("../", import.meta.url).pathname;

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
              <Route path="/groundstate" element={<Index />} />
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
