import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The case-intake tool holds client detail. On a static host there is no request
 * layer to check a credential against, so the protection is that the route is
 * compiled out: the chunk is not built, and the URL falls through to the 404
 * page.
 *
 * Two assertions, because either alone is weak. The navigation check proves a
 * visitor does not get the form. The bundle check proves the code is not merely
 * unrouted but absent, so no amount of client-side poking reaches it.
 */

test.describe("case-intake is not reachable in a production build", () => {
  test("navigating to /case-intake does not render the form", async ({ page }) => {
    await page.goto("/case-intake");
    await page.waitForLoadState("networkidle");

    // The form's own fields and heading must not appear.
    await expect(page.locator("text=קליטת מקרה")).toHaveCount(0);
    await expect(page.locator("text=מה נאמר")).toHaveCount(0);
    await expect(page.locator("textarea")).toHaveCount(0);

    // The SPA fallback serves the 404 route instead.
    const body = await page.locator("body").innerText();
    expect(body.length).toBeGreaterThan(0);
    expect(body).not.toContain("הדבק אותה לקובץ חדש");
  });

  test("the intake code is absent from the built assets", () => {
    const assets = join(process.cwd(), "dist", "assets");
    expect(existsSync(assets)).toBe(true);

    const markers = ["קליטת מקרה", "הדבק אותה לקובץ חדש", "case_intake"];
    const offenders: string[] = [];
    for (const file of readdirSync(assets)) {
      if (!file.endsWith(".js")) continue;
      const text = readFileSync(join(assets, file), "utf8");
      for (const m of markers) {
        if (text.includes(m)) offenders.push(`${file} contains "${m}"`);
      }
    }
    expect(
      offenders,
      `intake tool shipped to production:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});

/**
 * Nothing awaiting a decision reaches the bundle.
 *
 * Both of these shipped until 2026-08-01, for the same reason: the gate that
 * was supposed to hold them ran at render, and a bundler does not render.
 *
 * `C1` is the serious one. caseChain.ts globs src/data/cases eagerly, so Vite
 * inlined a record marked `consent_state: "pending"` — the client's pricing
 * problem, what was built for them, the ₪5,500 figure — into a public
 * JavaScript file, while the component correctly refused to draw it. The
 * record's own caveat says the domain was generalised so the client would not
 * be identified in a small market, which is a statement that identification
 * was a live risk. Pending records now live in docs/cases/, which nothing
 * bundles, and src/data/cases.test.ts fails if an ungranted record is put back.
 *
 * The guarantee copy is milder but the same shape: three variants, none live,
 * all shipping, including `reviewNote` — operator-facing notes on how much
 * commercial exposure each option leaves open.
 *
 * These markers are chosen to be load-bearing. If a case is later cleared for
 * publication, or a guarantee variant goes live, the corresponding block below
 * is what must be deleted, deliberately, by whoever made that decision.
 */
test.describe("undecided material stays out of the bundle", () => {
  const jsAssets = () => {
    const assets = join(process.cwd(), "dist", "assets");
    expect(existsSync(assets)).toBe(true);
    return readdirSync(assets)
      .filter((f) => f.endsWith(".js"))
      .map((f) => [f, readFileSync(join(assets, f), "utf8")] as const);
  };

  const absent = (markers: string[], label: string) => {
    const offenders: string[] = [];
    for (const [name, text] of jsAssets()) {
      for (const m of markers) {
        if (text.includes(m)) offenders.push(`${name} contains "${m}"`);
      }
    }
    expect(offenders, `${label}\n${offenders.join("\n")}`).toEqual([]);
  };

  /**
   * Markers are record CONTENT, never schema field names.
   *
   * The first draft of this test looked for "consent_state" and failed
   * immediately, on caseChain.ts itself: the validator that enforces the gate
   * necessarily names the field it reads, so that string ships whether or not
   * any record does. A marker like that fails forever and teaches whoever hits
   * it to delete the test.
   */
  test("no case record awaiting consent", () => {
    absent(
      [
        "מומחה תחום נישתי",
        "מזהה דליפות אצל אחרים",
        "ריבוי ערוצים, אין משפט ליבה",
        "שלושה לקוחות בטסט",
      ],
      "A case record reached the bundle. Publication consent is the client's:"
    );
  });

  /**
   * Likewise, "אות התעניינות מתועד" is not usable here. It reads like a
   * guarantee marker and it is not: preRegistration.ts uses the same phrase in
   * copy that is live and rendering, so the string ships legitimately. These
   * markers are whole sentences unique to the variants.
   */
  test("no guarantee variant while none is live", () => {
    absent(
      [
        "בסוף הספרינט יש בידך אות התעניינות מתועד",
        "בסוף שלב 4 יצאו חמש פניות בפועל",
        "אות שלא תועד אינו נחשב",
        "הנמען נבחר בשמו ובתפקידו",
      ],
      'Guarantee copy shipped while ACTIVE_VARIANT is "none". If a variant just went live, delete this test:'
    );
  });

  /**
   * Unlike the two above, this one is never deleted.
   *
   * The variants are visitor copy and are meant to ship the day one goes live.
   * The review notes are not: they are the read on how much perceived risk each
   * option reverses and what exposure it leaves open, written for the person
   * choosing between them. A prospect who opened the bundle would be reading an
   * assessment of the weakness of the promise being made to them.
   *
   * They lived on the variant objects until review of this PR caught that the
   * split protected them only while ACTIVE_VARIANT was "none" — that is, only
   * while nobody could see the guarantee anyway. They now sit in
   * src/data/guaranteeReviewNotes.ts, whose sole importer is /guarantee-review,
   * which is compiled out of production. This assertion holds in every state.
   */
  test("no operator review notes, in any state", () => {
    absent(
      [
        "מבטיח תוצר שנמצא כולו בשליטתך",
        "כלשונו בגרף. מפחית סיכון נתפס",
        "מסיר את החשיפה על הנגזרת",
      ],
      "Operator-facing review notes reached the bundle. These are never visitor copy:"
    );
  });
});
