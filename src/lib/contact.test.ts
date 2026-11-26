import { describe, it, expect } from "vitest";
import {
  LINKEDIN_URL,
  WHATSAPP_DISPLAY,
  sheetText,
  whatsappSelfUrl,
  whatsappSheetUrl,
  whatsappUrl,
} from "./contact";

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

describe("whatsappSheetUrl", () => {
  const lines = [
    { label: "מה שכתוב היום", text: "ליווי עסקי לעצמאים" },
    { label: "מקרה אחד", text: "" },
  ];
  const text = (sentence: string, l = lines) =>
    new URL(whatsappSheetUrl(sentence, l)).searchParams.get("text") ?? "";

  it("opens with the line the locked prediction counts", () => {
    expect(text("בוחרים בי כי אני מחזירה תשובה באותו יום")).toMatch(
      /^היי ארז, הגעתי מהאתר\. מילאתי את דף חמש השאלות\./
    );
  });

  it("carries the sentence and the answers, and skips an empty one", () => {
    const t = text("בוחרים בי כי אני מחזירה תשובה באותו יום");
    expect(t).toContain("בוחרים בי כי אני מחזירה תשובה באותו יום");
    expect(t).toContain("1. מה שכתוב היום\nליווי עסקי לעצמאים");
    expect(t).not.toContain("מקרה אחד");
  });

  it("clips a long answer so the link still opens on a phone", () => {
    const long = [{ label: "מקרה אחד", text: "מילה ".repeat(900) }];
    const t = text("", long);
    expect(t.length).toBeLessThan(600);
    expect(t.endsWith("…")).toBe(true);
  });

  it("gives the copy button the whole text", () => {
    const whole = "מילה ".repeat(200).trim();
    expect(sheetText("", [{ label: "מקרה אחד", text: whole }])).toContain(whole);
  });
});

describe("whatsappSelfUrl", () => {
  const page = "https://ereztash.github.io/groundstate-protocol/bidul/";
  const lines = [{ label: "לקוח אחד ודבר אחד", text: "שלחתי לה שלוש חלופות לחוזה" }];

  it("names no number, so the person picks their own chat, and carries no opener to Erez", () => {
    const url = new URL(whatsappSelfUrl("אני קוראת את החוזה כולו", lines, page));
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/");
    const t = url.searchParams.get("text")!;
    expect(t).not.toContain("היי ארז");
    expect(t).toContain("אני קוראת את החוזה כולו");
    expect(t).toContain("שלחתי לה שלוש חלופות לחוזה");
  });

  it("keeps the way back to the page whole, even when the answers are clipped", () => {
    const long = [1, 2, 3, 4].map((n) => ({ label: `שאלה ${n}`, text: "מילה ".repeat(400) }));
    const t = new URL(whatsappSelfUrl("", long, page)).searchParams.get("text")!;
    expect(t.endsWith(page)).toBe(true);
    expect(t.length).toBeLessThanOrEqual(1700);
  });
});
