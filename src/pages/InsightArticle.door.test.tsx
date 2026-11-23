import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import InsightArticle from "./InsightArticle";
import { insights } from "@/lib/insights";

/**
 * A door page (step: sentence) carries no word on payment anywhere on the
 * rendered page, footer included. The live check on 23.11 found the footer's
 * "ללא עלות" still on the first door page after the call box was removed.
 */
const PAY = /תשלום|ללא עלות|בלי עלות|בחינם|חינם/;

const renderAt = (slug: string) =>
  render(
    <MemoryRouter initialEntries={[`/insights/${slug}`]}>
      <Routes>
        <Route path="/insights/:slug" element={<InsightArticle />} />
      </Routes>
    </MemoryRouter>
  );

describe("door pages, rendered", () => {
  const doors = insights.filter((i) => i.step === "sentence");

  it("exist", () => {
    expect(doors.length).toBeGreaterThan(0);
  });

  it.each(doors.map((d) => d.slug))("%s shows no word on payment, and its step opens WhatsApp", (slug) => {
    const { container, getByRole } = renderAt(slug);
    expect(container.textContent).not.toMatch(PAY);
    expect(getByRole("link", { name: /לכתוב בוואטסאפ/ }).getAttribute("href")).toContain("wa.me");
  });

  it("an ordinary article keeps the call box", () => {
    const plain = insights.find((i) => i.step !== "sentence")!;
    const { container } = renderAt(plain.slug);
    expect(container.textContent).toContain("שיחת התאמה");
  });
});
