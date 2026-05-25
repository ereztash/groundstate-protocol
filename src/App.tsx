import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ErrorBoundary from "./components/ErrorBoundary";

// Landing is the entry route on every visit, so it stays eager — lazy()
// would add a Suspense flash on the first paint. Index (GroundState tool),
// Privacy, and NotFound are secondary routes loaded only when navigated to,
// so they ship in separate chunks.
const Index = lazy(() => import("./pages/Index"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* basename mirrors vite.config.ts `base`, so routes resolve correctly
            when the app is served from a subpath like /groundstate-protocol/
            on GitHub Pages while still working at "/" locally and on Lovable. */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/groundstate" element={<Index />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
