import { describe, it, expect } from "vitest";
import {
  findGeneralWords,
  splitByGeneralWords,
  uniqueGeneralWords,
} from "./generalWords";

describe("general words", () => {
  it("catches the words a competitor would also write", () => {
    expect(uniqueGeneralWords("אני נותנת שירות מקצועי, אמין ואיכותי")).toEqual([
      "מקצועי",
      "אמין",
      "איכותי",
    ]);
  });

  it("returns the word as written, without its prefix letters", () => {
    expect(uniqueGeneralWords("עובדת במקצועיות ובאכפתיות")).toEqual([
      "מקצועיות",
      "אכפתיות",
    ]);
    expect(uniqueGeneralWords("מה שהמיוחד אצלי")).toEqual(["מיוחד"]);
  });

  it("takes a phrase as one catch", () => {
    expect(uniqueGeneralWords("יחס אישי וערך מוסף לכל לקוח")).toEqual([
      "יחס אישי",
      "ערך מוסף",
    ]);
    expect(uniqueGeneralWords("מדברת בגובה העיניים")).toEqual(["גובה העיניים"]);
  });

  it("does not catch a verb that ends in a listed word", () => {
    // Each of these ends in a listed word once a letter is dropped.
    expect(uniqueGeneralWords("אני מאמין שהלקוח מרגיש את זה")).toEqual([]);
    expect(uniqueGeneralWords("מי שמזמין אותי, או לקוח שהזמין סדנה")).toEqual([]);
    expect(uniqueGeneralWords("צריך למסור את הקבצים בזמן")).toEqual([]);
    expect(uniqueGeneralWords("עובדת במיוחד עם מערך של שיעורים, בערך שנה")).toEqual([]);
  });

  it("finds nothing in a concrete sentence", () => {
    expect(
      uniqueGeneralWords("בניתי למשרד עורכי דין טופס שסוגר תיק בשלושה ימים")
    ).toEqual([]);
  });

  it("reports ranges that cut the text back together", () => {
    const text = "ליווי מקצועי ויחס אישי, בלי קיצורים.";
    const parts = splitByGeneralWords(text);
    expect(parts.map((p) => p.text).join("")).toBe(text);
    expect(parts.filter((p) => p.general).map((p) => p.text)).toEqual([
      "מקצועי",
      "יחס אישי",
    ]);
    for (const { word, start, end } of findGeneralWords(text)) {
      expect(text.slice(start, end)).toBe(word);
    }
  });

  it("keeps a repeated word once, in order of first appearance", () => {
    expect(uniqueGeneralWords("מקצועי, אישי, ושוב מקצועי")).toEqual([
      "מקצועי",
      "אישי",
    ]);
  });
});
