import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import {
  allCases,
  isPublishable,
  parseCaseRecord,
  publishableCases,
  CHAIN_COLUMNS,
} from "./caseChain";

/**
 * These tests guard a privacy boundary, not a rendering detail. A case record
 * reaching the page without consent, or with a chain that is missing a link, is
 * the failure this file exists to catch.
 */

const valid = {
  id: "TEST",
  consent_state: "granted",
  source_integrity_confirmed: true,
  outcome: "converted",
  subject_label: "מומחה תחום נישתי",
  niche_generalized: true,
  pre_registered_rule: null,
  chain: CHAIN_COLUMNS.map((column) => ({
    column,
    text: "טקסט",
    evidence_level: "operator",
  })),
  caveats: ["n=1."],
};

describe("parseCaseRecord", () => {
  it("accepts a complete record", () => {
    expect(parseCaseRecord(valid)?.id).toBe("TEST");
  });

  it("rejects a chain with a missing link", () => {
    // A four-link chain would render as a tidier story than the one that
    // actually happened.
    const short = { ...valid, chain: valid.chain.slice(0, 4) };
    expect(parseCaseRecord(short)).toBeNull();
  });

  it("rejects a duplicated column", () => {
    const dup = { ...valid, chain: [...valid.chain.slice(0, 4), valid.chain[0]] };
    expect(parseCaseRecord(dup)).toBeNull();
  });

  it("rejects an unknown evidence level", () => {
    const bad = {
      ...valid,
      chain: valid.chain.map((c, i) =>
        i === 0 ? { ...c, evidence_level: "verified" } : c
      ),
    };
    expect(parseCaseRecord(bad)).toBeNull();
  });

  it("rejects an unknown consent state rather than defaulting it open", () => {
    expect(parseCaseRecord({ ...valid, consent_state: "maybe" })).toBeNull();
  });

  it("returns null on malformed input instead of throwing", () => {
    expect(parseCaseRecord(null)).toBeNull();
    expect(parseCaseRecord("nope")).toBeNull();
    expect(parseCaseRecord({})).toBeNull();
  });
});

describe("counter-case support", () => {
  it("accepts a case that did not convert, carrying its pre-registered rule", () => {
    // Publishing a case that did not convert, next to the rule written before
    // the outcome was known, is the capability this shape exists for.
    const counter = parseCaseRecord({
      ...valid,
      id: "COUNTER",
      outcome: "not_converted",
      pre_registered_rule: "אם אין פרקטיקה פעילה, לא מתחילים.",
    });
    expect(counter?.outcome).toBe("not_converted");
    expect(counter?.pre_registered_rule).toBe(
      "אם אין פרקטיקה פעילה, לא מתחילים."
    );
  });

  it("rejects a non-string pre-registered rule", () => {
    expect(parseCaseRecord({ ...valid, pre_registered_rule: 7 })).toBeNull();
  });
});

describe("isPublishable", () => {
  it("requires both gates", () => {
    const rec = parseCaseRecord(valid)!;
    expect(isPublishable(rec)).toBe(true);
    expect(isPublishable({ ...rec, consent_state: "pending" })).toBe(false);
    expect(isPublishable({ ...rec, consent_state: "declined" })).toBe(false);
    expect(isPublishable({ ...rec, source_integrity_confirmed: false })).toBe(
      false
    );
  });
});

describe("the case files actually in the repo", () => {
  it("every bundled record parses", () => {
    // A file that fails validation is silently dropped at runtime, so count
    // here rather than discovering it as a blank section. The directory is
    // empty today and that is correct: C1 moved to docs/cases/ on 2026-08-01
    // because eager globbing was shipping a consent-pending record to every
    // visitor. See src/data/cases/README.md.
    const dir = join(process.cwd(), "src", "data", "cases");
    const onDisk = readdirSync(dir).filter((f) => f.endsWith(".json"));
    expect(allCases().length).toBe(onDisk.length);
  });

  it("publishes nothing until an operator opens both gates", () => {
    // If this ever fails without a deliberate decision, a client case went
    // live. src/data/cases.test.ts is the gate on what may sit in the bundled
    // directory at all; this one is the gate on what renders.
    expect(publishableCases()).toEqual([]);
  });

  it("carries no client name and no free-text identifier in the chain", () => {
    for (const c of allCases()) {
      expect(c.niche_generalized).toBe(true);
      expect(c.subject_label).not.toMatch(/[A-Za-z]{3,}/);
    }
  });
});
