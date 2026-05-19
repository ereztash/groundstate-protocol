import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero";

describe("Hero accessibility", () => {
  it("has no detectable a11y violations (axe)", async () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("portrait image has a meaningful, non-empty alt", () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    const alt = img!.getAttribute("alt") ?? "";
    expect(alt.trim().length).toBeGreaterThan(10);
    // Must not be a generic placeholder
    expect(alt.toLowerCase()).not.toMatch(/^(image|picture|photo|תמונה)$/);
  });

  it("does not misuse aria-hidden on focusable or labeled elements", () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    hidden.forEach((el) => {
      // No interactive descendants inside aria-hidden subtrees
      const focusable = el.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      expect(focusable.length).toBe(0);
      // Image alt must not live inside an aria-hidden subtree
      expect(el.querySelector("img[alt]")).toBeNull();
    });
  });
});