/**
 * Insights (articles) content layer. Each article is a markdown file in
 * content/insights/<slug>.md with a small frontmatter block. Vite imports them
 * all at build time (import.meta.glob, raw), so adding an article = drop a file.
 * The prerender step (scripts/prerender.mjs) bakes each one to a static
 * /insights/<slug>/index.html with its own meta + Article JSON-LD.
 */

export type Insight = {
  slug: string;
  title: string;
  description: string;
  subtitle?: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Raw markdown body (frontmatter stripped). */
  body: string;
};

const raws = import.meta.glob("../../content/insights/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  body: string;
} {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      // Strip a single pair of wrapping quotes (used when a value contains ":").
      if (
        value.length >= 2 &&
        ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'")))
      ) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  }
  return { data, body: m[2].trim() };
}

export const insights: Insight[] = Object.entries(raws)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      subtitle: data.subtitle,
      date: data.date || "",
      body,
    };
  })
  // Newest first.
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getInsight(slug: string | undefined): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}

/** Formats an ISO date as a Hebrew-locale long date, e.g. "12 ביולי 2026". */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
