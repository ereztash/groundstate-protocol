import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { faq } from "./faq";

/**
 * index.html serves an FAQPage block to search engines. It was maintained by
 * hand and had drifted into a different set of answers from the ones on the
 * page, including a guarantee that had been taken down and a price framing that
 * had been retracted. Search results were showing claims the site no longer
 * made, which is worse than showing nothing.
 *
 * These tests fail when the two disagree.
 */

const html = readFileSync(join(process.cwd(), "index.html"), "utf8");

function faqFromStructuredData() {
  const block = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  );
  if (!block) throw new Error("no JSON-LD block in index.html");
  const parsed = JSON.parse(block[1]);
  const nodes = parsed["@graph"] ?? [parsed];
  const page = nodes.find(
    (n: { "@type"?: string }) => n["@type"] === "FAQPage"
  );
  if (!page) throw new Error("no FAQPage node");
  return (page.mainEntity as Array<{
    name: string;
    acceptedAnswer: { text: string };
  }>).map((q) => ({ q: q.name, a: q.acceptedAnswer.text }));
}

describe("FAQ structured data", () => {
  it("matches the FAQ the page actually renders", () => {
    expect(faqFromStructuredData()).toEqual(
      faq.map((item) => ({ q: item.q, a: item.a }))
    );
  });

  it("does not advertise a guarantee", () => {
    // The guarantee question is generated in the component only while a variant
    // is live, so it must never be baked into the static structured data. A
    // commercial promise reaching Google ahead of the decision is the exact
    // failure this guards.
    const text = JSON.stringify(faqFromStructuredData());
    expect(text).not.toMatch(/אחריות החזר/);
    expect(text).not.toMatch(/בלי טפסים|בלי ויכוח/);
  });

  it("carries no retracted framing", () => {
    const text = JSON.stringify(faqFromStructuredData());
    // The value-derived pricing answer and the "not X, it is Y" construction.
    expect(text).not.toMatch(/אני לא מוכר 10 פניות/);
    expect(text).not.toMatch(/התוצר הוא לא תובנה/);
  });
});
