import { describe, it, expect } from "vitest";
import { LINKEDIN_URL, WHATSAPP_DISPLAY, whatsappUrl } from "./contact";

describe("contact", () => {
  it("dials the same number the page shows", () => {
    const local = WHATSAPP_DISPLAY.replace(/\D/g, "");
    const url = new URL(whatsappUrl());
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe(`/972${local.slice(1)}`);
  });

  it("opens the chat with a message in the page's language", () => {
    expect(new URL(whatsappUrl("he")).searchParams.get("text")).toContain("שיחת התאמה");
    expect(new URL(whatsappUrl("en")).searchParams.get("text")).toContain("fit call");
  });

  it("opens a door page's chat ready for the reader's sentence, still found by its first words", () => {
    const text = new URL(whatsappUrl("he", "sentence")).searchParams.get("text")!;
    expect(text.startsWith("היי ארז, הגעתי מהאתר")).toBe(true);
    expect(text).toContain("המשפט שלי");
    expect(new URL(whatsappUrl("en", "sentence")).searchParams.get("text")).toContain("fit call");
  });

  it("links the public LinkedIn profile", () => {
    expect(LINKEDIN_URL).toBe("https://www.linkedin.com/in/erez-tal-shir/");
  });
});
