type ClarityFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    clarity?: ClarityFn & { q?: unknown[][] };
  }
}

const PROJECT_ID =
  (import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined) ||
  "wul1u06qo7";

export function initClarity(): void {
  if (typeof window === "undefined") return;
  if (!PROJECT_ID) return;
  if (typeof window.clarity === "function") return;

  const stub: ClarityFn & { q?: unknown[][] } = function (
    ...args: unknown[]
  ): void {
    (stub.q = stub.q || []).push(args);
  };
  window.clarity = stub;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(PROJECT_ID)}`;
  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}
