import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// `base` is configurable so the same build works for:
//   - root deployments (Lovable, Vercel, custom domain): VITE_BASE_PATH=/
//   - project-subpath deployments (GitHub Pages): VITE_BASE_PATH=/groundstate-protocol/
// Default "/" keeps `bun run dev` / local builds working unchanged.
const BASE_PATH = process.env.VITE_BASE_PATH || "/";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: BASE_PATH,
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
