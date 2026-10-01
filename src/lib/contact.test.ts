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

  it("links the public LinkedIn profile", () => {
    expect(LINKEDIN_URL).toBe("https://www.linkedin.com/in/erez-tal-shir/");
  });
});
