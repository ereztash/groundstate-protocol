import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initAnalytics } from "./lib/analytics";
import { initClarity } from "./lib/clarity";
import "./index.css";

initAnalytics();
initClarity();
createRoot(document.getElementById("root")!).render(<App />);
