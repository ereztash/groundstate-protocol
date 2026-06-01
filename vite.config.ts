import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// `base` controls how built asset URLs are prefixed. We default production
// builds to a RELATIVE base ("./") so the same artifact works whether it is
// served from a domain root (Lovable, Vercel, custom domain) OR a project
// sub-path (GitHub Pages at /groundstate-protocol/). Relative URLs resolve
// against the HTML's own directory, so neither host 404s on the JS/CSS.
//   - VITE_BASE_PATH, when set, still wins (e.g. an absolute "/groundstate-
//     protocol/" from the Pages workflow) for callers that want it explicit.
//   - dev keeps an absolute "/" so the Vite dev server serves modules correctly.
const explicitBase = process.env.VITE_BASE_PATH;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: explicitBase || (command === "build" ? "./" : "/"),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // NOTE: a previous version split node_modules into react-vendor / motion /
  // radix / vendor chunks for cache benefits. That config broke production
  // because Rollup's ESM init order couldn't guarantee react-vendor evaluated
  // before its consumers — libraries in the vendor chunk hit
  // `Cannot read properties of undefined (reading 'forwardRef')` at runtime.
  // Returning to Vite's defaults (single main chunk) until a stable split is
  // designed that keeps React colocated with everything that touches it.
}));
