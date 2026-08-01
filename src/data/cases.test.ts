import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Everything in src/data/cases is publishable.
 *
 * caseChain.ts globs that directory with `eager: true`, so Vite inlines every
 * file there into the production bundle at build time. The consent and
 * source-integrity checks in that module run at render, which is one step too
 * late: they kept `C1` off the screen while the bundler had already put the
 * whole record — a real client's pricing problem, what was built for them, and
 * the ₪5,500 figure — into a JavaScript file served to every visitor. The
 * record's own caveat says the domain was generalised so the client would not
 * be identified in a small market, which makes shipping it a consent problem
 * rather than a byte problem.
 *
 * Pending records live in docs/cases/, which nothing bundles. This test is what
 * makes that convention hold: a file cannot sit in the shipped directory unless
 * both gates are already open.
 *
 * Deliberately not asserting that the directory is non-empty. Zero publishable
 * cases is the correct state today, and a test that demanded one would push
 * someone to satisfy it with a record that has not been cleared.
 */

const CASES = join(process.cwd(), "src", "data", "cases");

describe("bundled case records", () => {
  const files = readdirSync(CASES).filter((f) => f.endsWith(".json"));

  it("reads the directory", () => {
    // Guards against a rename silently turning this suite into a no-op.
    expect(() => readdirSync(CASES)).not.toThrow();
  });

  for (const file of files) {
    describe(file, () => {
      const record = JSON.parse(
        readFileSync(join(CASES, file), "utf8")
      ) as Record<string, unknown>;

      it("has publication consent", () => {
        expect(
          record.consent_state,
          `${file} is in the bundled directory with consent_state "${String(record.consent_state)}". Publication consent belongs to the client. Move it to docs/cases/ until it is granted.`
        ).toBe("granted");
      });

      it("has a confirmed source", () => {
        expect(
          record.source_integrity_confirmed,
          `${file} has not passed the source-integrity gate. Move it to docs/cases/ until it has.`
        ).toBe(true);
      });
    });
  }
});
