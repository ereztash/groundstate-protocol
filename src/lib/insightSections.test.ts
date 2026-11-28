import { describe, it, expect } from "vitest";
import { marked } from "marked";
import { insights } from "@/lib/insights";
import { insightSections } from "@/data/insightSections";

/**
 * /insights by the reader's question (28.11). The sections and their order are
 * the decision; each article says in its own frontmatter where it sits.
 */

/** Live at their addresses and in the sitemap, out of the list on purpose (28.11). */
const LEFT_OUT = ["one-source-of-meaning", "anatomy-of-a-mistake", "why-prompt-engineering-fails"];

const inSection = (id: string) =>
  insights
    .filter((a) => a.section === id)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map((a) => a.slug);

describe("/insights sections", () => {
  it("are the four questions, in this order", () => {
    expect(insightSections.map((s) => s.id)).toEqual(["bidul", "offer", "pricing", "outreach"]);
  });

  it("list the eight articles, each once, in the order chosen", () => {
    expect(inSection("bidul")).toEqual([
      "what-is-business-differentiation",
      "why-you-cannot-diagnose-yourself",
      "impostor-syndrome-for-freelancers",
    ]);
    expect(inSection("offer")).toEqual(["unique-value-proposition"]);
    expect(inSection("pricing")).toEqual([
      "how-to-price-a-service",
      "how-to-raise-prices-for-regular-clients",
      "why-you-charge-less-than-your-value",
    ]);
    expect(inSection("outreach")).toEqual(["how-to-get-clients-after-going-freelance"]);
  });

  it("name only sections that exist, with no two articles in one place", () => {
    const ids = new Set(insightSections.map((s) => s.id));
    for (const a of insights.filter((i) => i.section)) {
      expect(ids.has(a.section!), `${a.slug}: section "${a.section}"`).toBe(true);
      expect(Number.isFinite(a.order), `${a.slug}: order`).toBe(true);
    }
    for (const s of insightSections) {
      const orders = insights.filter((a) => a.section === s.id).map((a) => a.order);
      expect(new Set(orders).size).toBe(orders.length);
    }
  });

  it("leave out only the three chosen, so a new article cannot drop out of the list unseen", () => {
    const unlisted = insights.filter((a) => !a.section).map((a) => a.slug).sort();
    expect(unlisted).toEqual([...LEFT_OUT].sort());
  });

  it("send their way-on links inside the site, to targets that exist", () => {
    for (const s of insightSections) {
      expect(s.more.to.startsWith("/")).toBe(true);
    }
    expect(insightSections.filter((s) => s.more.to === "/protocol/#stages-title")).toHaveLength(3);
    expect(insightSections[0].more.to).toBe("/bidul/");
  });
});

describe("the clients article opens on the reader's case", () => {
  const a = insights.find((i) => i.slug === "how-to-get-clients-after-going-freelance")!;
  const html = marked.parse(a.body, { async: false }) as string;

  it("asks first, then gives three cases a step each", () => {
    const first = a.body.split(/\r?\n\r?\n/)[0];
    expect(first).toBe("חשבו על הפעם האחרונה שניסיתם להגיע ללקוח שמתאים לכם. מה קרה בפועל?");
    for (const said of [
      "עוד לא הגעתי לשיחה עם מישהו מתאים.",
      "מגיעות אליי פניות, אבל הן לא מהסוג שאני רוצה.",
      "ברור לי למי לפנות, אבל קשה לי להסביר מה ההצעה שלי.",
    ]) {
      expect(a.body).toContain(said);
    }
  });

  it("links the third case to an anchor the page has", () => {
    expect(html).toContain('href="#from-three-people"');
    expect(html).toContain('id="from-three-people"');
  });

  it("no longer assumes, in its description, that every reader is stuck on the wording", () => {
    expect(a.description).toContain("פניות שלא מתאימות");
    expect(a.description).toContain("לשיחה עם לקוח מתאים");
  });
});
