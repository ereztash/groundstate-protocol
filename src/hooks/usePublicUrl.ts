import { useHref } from "react-router-dom";

/**
 * public/ files, from a page one level down (/en, /bidul).
 *
 * The CI and e2e build use a relative base, so BASE_URL is "./" and
 * "./portrait.webp" would resolve against the page's own folder (404); the
 * deploy build's absolute base is unaffected. Resolve "./" against the
 * router's root instead, which is right in both.
 */
export function usePublicUrl() {
  const root = useHref("/").replace(/\/?$/, "/");
  return (url: string) => (url.startsWith("./") ? root + url.slice(2) : url);
}
