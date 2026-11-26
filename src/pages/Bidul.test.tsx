import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MemoryRouter } from "react-router-dom";
import Bidul from "./Bidul";
import { sessionMoments } from "@/lib/clients";

const renderPage = () =>
  render(
    <MemoryRouter>
      <Bidul />
    </MemoryRouter>
  );

/** Any word on payment. The page gives, and says nothing about money. */
const PAY = /תשלום|לשלם|בחינם|חינם|ללא עלות|בלי עלות|מחיר מיוחד|הנחה/;

const ANSWERS = [
  "אני נותנת שירות מקצועי ואישי לעסקים קטנים",
  "לקוחה אחת קיבלה ממני תשובה באותו ערב, עם שלוש חלופות לחוזה",
  "ראיתי שהסעיף על הפיצוי סותר את מה שהיא סיפרה, כי שאלתי פעמיים",
  "היא הייתה חותמת על החוזה בלי לדעת על הסעיף",
];
const SENTENCE = "אני קוראת את החוזה כולו לפני הפגישה הראשונה";

const field = () => screen.getByRole("textbox") as HTMLTextAreaElement;
const write = (text: string) => fireEvent.change(field(), { target: { value: text } });
const next = () => fireEvent.click(screen.getByRole("button", { name: "להמשיך" }));

function fillAll() {
  for (const answer of ANSWERS) {
    write(answer);
    next();
  }
  write(SENTENCE);
  fireEvent.click(screen.getByRole("button", { name: "להוציא את הדף" }));
}

describe("Bidul, the five-question sheet", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("has no detectable a11y violations, empty and finished", async () => {
    const { container } = renderPage();
    expect(await axe(container)).toHaveNoViolations();
    fillAll();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("exposes exactly one h1", () => {
    const { container } = renderPage();
    expect(container.querySelectorAll("h1").length).toBe(1);
  });

  it("says nothing about payment, before or after the sheet is done", () => {
    const { container } = renderPage();
    expect(container.textContent).not.toMatch(PAY);
    fillAll();
    expect(container.textContent).not.toMatch(PAY);
  });

  it("shows the session moments word for word, with no name and no link", () => {
    renderPage();
    const heading = screen.getByRole("heading", { level: 2, name: "כך זה נשמע בתוך השיחה." });
    const section = heading.closest("section")!;
    for (const turn of sessionMoments.flat()) {
      expect(section.textContent).toContain(turn.text);
    }
    expect(section.textContent).toContain("לקוח, השם מושחר");
    expect(section.querySelector("a")).toBeNull();
  });

  it("lets the first question be skipped, and stops on an empty answer after it", () => {
    renderPage();
    expect(screen.getByText("שאלה 1 מתוך 5")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "לדלג לשאלה הבאה" }));
    expect(screen.getByText("שאלה 2 מתוך 5")).toBeInTheDocument();

    next();
    expect(screen.getByText("כתבו כמה מילים, ואז נמשיך.")).toBeInTheDocument();
    expect(screen.getByText("שאלה 2 מתוך 5")).toBeInTheDocument();
  });

  it("asks about one client and one real thing before any sentence", () => {
    renderPage();
    write(ANSWERS[0]);
    next();
    const ask = screen.getByRole("heading", { level: 3 }).textContent!;
    expect(ask).toContain("לקוח אחד ועל דבר אחד");
    expect(ask).not.toContain("משפט");
  });

  it("asks for the sentence last, as the fifth question, with no lead of ours", () => {
    renderPage();
    for (const answer of ANSWERS) {
      write(answer);
      next();
    }
    expect(screen.getByText("שאלה 5 מתוך 5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 }).textContent).toContain(
      "כאילו אני לקוח שלא מאמין לזה"
    );
    expect(document.body.textContent).not.toContain("בוחרים בי כי");
  });

  it("quotes a general word back while the reader is still writing", () => {
    renderPage();
    write(ANSWERS[0]);
    next();
    write("אני פשוט מאוד יסודית");
    expect(screen.getByRole("status").textContent).toContain('כתבתם "יסודית"');
  });

  it("hands back the reader's own words, with the general ones marked", () => {
    const { container } = renderPage();
    fillAll();

    const title = screen.getByRole("heading", { level: 2, name: new RegExp(SENTENCE) });
    expect(title.textContent).toBe(`${SENTENCE}.`);
    for (const answer of ANSWERS) {
      expect(container.textContent).toContain(answer);
    }
    const marked = [...container.querySelectorAll("mark")].map((m) => m.textContent);
    expect(marked).toEqual(["מקצועי", "אישי"]);
  });

  it("sends the sheet in a chat that opens with the counted line", () => {
    renderPage();
    fillAll();

    const link = screen.getByRole("link", { name: /לשלוח לי את הדף בוואטסאפ/ });
    const url = new URL(link.getAttribute("href")!);
    expect(url.hostname).toBe("wa.me");
    const text = url.searchParams.get("text")!;
    expect(text.startsWith("היי ארז, הגעתי מהאתר. מילאתי את דף חמש השאלות.")).toBe(true);
    expect(text).toContain(SENTENCE);
    expect(text).toContain(ANSWERS[3]);
    expect(text).not.toContain("בוחרים בי כי");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("lets the reader send the sheet to themselves, not to Erez, to come back to it", () => {
    renderPage();
    fillAll();

    expect(document.body.textContent).toContain("המשפט הכי ברור הגיע רק בפגישה השנייה");
    const link = screen.getByRole("link", { name: /לשלוח את הדף לעצמי בוואטסאפ/ });
    const url = new URL(link.getAttribute("href")!);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/");
    const text = url.searchParams.get("text")!;
    expect(text).toContain(SENTENCE);
    expect(text).not.toContain("היי ארז");
  });

  it("ends with one question to put to a reader who knows the work", () => {
    renderPage();
    fillAll();
    expect(document.body.textContent).toContain(
      "הקריאו אותו לאדם אחד שמכיר את העבודה שלכם, ושאלו אותו מה הוא שמע."
    );
  });

  it("keeps the sheet in this browser, and brings it back on return", () => {
    const first = renderPage();
    write(ANSWERS[0]);
    next();
    write(ANSWERS[1]);
    first.unmount();

    renderPage();
    expect(screen.getByText("שאלה 2 מתוך 5")).toBeInTheDocument();
    expect(field().value).toBe(ANSWERS[1]);
    expect(screen.getByText(ANSWERS[0])).toBeInTheDocument();
  });

  it("erases everything only after the reader confirms", () => {
    renderPage();
    write(ANSWERS[0]);
    next();

    fireEvent.click(screen.getByRole("button", { name: "למחוק הכול ולהתחיל מחדש" }));
    expect(screen.queryByText(ANSWERS[0])).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "כן, למחוק" }));

    expect(screen.queryByText(ANSWERS[0])).not.toBeInTheDocument();
    expect(screen.getByText("שאלה 1 מתוך 5")).toBeInTheDocument();
    expect(field().value).toBe("");
  });

  it("lets the reader reopen a finished sheet and change an answer", () => {
    renderPage();
    fillAll();
    fireEvent.click(screen.getByRole("button", { name: "לערוך תשובות" }));
    expect(field().value).toBe(SENTENCE);

    fireEvent.click(
      screen.getByRole("button", { name: /לערוך\s*, מה היה שונה אצל איש מקצוע אחר/ })
    );
    expect(field().value).toBe(ANSWERS[3]);
  });
});
