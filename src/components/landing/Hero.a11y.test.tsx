import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Hero from "./Hero";
import { DiagnosticFormProvider } from "./DiagnosticFormProvider";

// Hero's CTA now routes through the provider so the lead records which entry
// point it came from, rather than scrolling to the form anonymously.
const renderHero = () =>
  render(
    <MemoryRouter>
      <TooltipProvider>
        <DiagnosticFormProvider>
          <Hero />
        </DiagnosticFormProvider>
      </TooltipProvider>
    </MemoryRouter>
  );

describe("Hero accessibility", () => {
  it("has no detectable a11y violations (axe)", async () => {
    const { container } = renderHero();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("portrait image has a meaningful, non-empty alt", () => {
    const { container } = renderHero();
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    const alt = img!.getAttribute("alt") ?? "";
    expect(alt.trim().length).toBeGreaterThan(10);
    // Must not be a generic placeholder
    expect(alt.toLowerCase()).not.toMatch(/^(image|picture|photo|תמונה)$/);
  });

  it("does not misuse aria-hidden on focusable or labeled elements", () => {
    const { container } = renderHero();
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