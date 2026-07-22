import { useEffect } from "react";

/**
 * Per-route document <head> management, dependency-free.
 *
 * The landing page ships its meta statically in index.html. Secondary routes
 * are client-rendered, so on navigation we set title / description / canonical /
 * OG here and RESTORE the previous values on unmount (so navigating back to "/"
 * doesn't leak this page's title).
 *
 * NOTE: this is the runtime meta layer. It is correct for in-app navigation and
 * for users, but crawlers/social scrapers that don't execute JS see index.html's
 * static tags. Full per-page SEO requires the prerender/SSG step (Phase 0) that
 * bakes these values into each route's static HTML at build time.
 */

const SITE_ORIGIN = "https://ereztalshir.co.il";

export type DocumentMeta = {
  title: string;
  description?: string;
  /** Absolute site path for canonical + og:url, e.g. "/protocol". */
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
};

type Restore = () => void;

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string
): Restore {
  const existing = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (existing) {
    const prev = existing.getAttribute("content");
    existing.setAttribute("content", content);
    return () => {
      if (prev === null) existing.removeAttribute("content");
      else existing.setAttribute("content", prev);
    };
  }
  const el = document.createElement("meta");
  el.setAttribute(attr, key);
  el.setAttribute("content", content);
  document.head.appendChild(el);
  return () => el.remove();
}

function upsertLink(rel: string, href: string): Restore {
  const existing = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"]`
  );
  if (existing) {
    const prev = existing.getAttribute("href");
    existing.setAttribute("href", href);
    return () => {
      if (prev === null) existing.removeAttribute("href");
      else existing.setAttribute("href", prev);
    };
  }
  const el = document.createElement("link");
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  document.head.appendChild(el);
  return () => el.remove();
}

export function useDocumentMeta({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: DocumentMeta): void {
  useEffect(() => {
    const restores: Restore[] = [];

    const prevTitle = document.title;
    document.title = title;
    restores.push(() => {
      document.title = prevTitle;
    });

    restores.push(upsertMeta("property", "og:title", ogTitle ?? title));

    if (description) {
      restores.push(upsertMeta("name", "description", description));
      restores.push(
        upsertMeta("property", "og:description", ogDescription ?? description)
      );
    }

    if (path) {
      const url = `${SITE_ORIGIN}${path}`;
      restores.push(upsertMeta("property", "og:url", url));
      restores.push(upsertLink("canonical", url));
    }

    return () => {
      // Restore in reverse so nested edits unwind cleanly.
      for (const restore of restores.reverse()) restore();
    };
  }, [title, description, path, ogTitle, ogDescription]);
}
