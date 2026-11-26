import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WhatYouTriedSection from "./WhatYouTriedSection";

describe("WhatYouTriedSection", () => {
  it("offers the five questions to the reader who is not ready for a call", () => {
    render(
      <MemoryRouter>
        <WhatYouTriedSection />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "לחמש השאלות" });
    expect(link.getAttribute("href")).toBe("/bidul");
    // A plain link, not a second booking-weight button.
    expect(link.className).not.toMatch(/ld-cta/);
    expect(screen.getByText(/אפשר להתחיל בשאלה/)).toBeInTheDocument();
  });
});
