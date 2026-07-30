import { describe, it, expect } from "vitest";
import {
  makeRng,
  twoProportionP,
  power,
  peekingFalsePositive,
  minimumDetectableEffect,
} from "../../scripts/ab-simulate.mjs";

/**
 * The simulator is only worth running if it is right. A planning tool that
 * overstates power produces confident decisions on tests that cannot resolve,
 * which is worse than having no tool.
 *
 * The load-bearing check is the first one: under a true null, the rate of
 * significant results must land near alpha. Any error in the test statistic
 * shows up there.
 */

describe("twoProportionP", () => {
  it("matches a hand-computed case", () => {
    // 100/1000 vs 140/1000: pooled 0.12, se 0.014533, z 2.752, two-sided ~0.0059
    const p = twoProportionP(100, 1000, 140, 1000);
    expect(p).toBeGreaterThan(0.004);
    expect(p).toBeLessThan(0.008);
  });

  it("returns ~1 for identical proportions", () => {
    expect(twoProportionP(50, 1000, 50, 1000)).toBeGreaterThan(0.99);
  });

  it("is symmetric in its arms", () => {
    const a = twoProportionP(30, 500, 45, 500);
    const b = twoProportionP(45, 500, 30, 500);
    expect(Math.abs(a - b)).toBeLessThan(1e-12);
  });

  it("degrades safely on empty arms", () => {
    expect(twoProportionP(0, 0, 0, 0)).toBe(1);
  });
});

describe("power", () => {
  it("equals alpha under a true null", () => {
    // The calibration check. A biased statistic or a broken RNG breaks this.
    const { power: pw } = power({
      baseline: 0.03,
      relLift: 0,
      nPerArm: 3000,
      trials: 4000,
      seed: 12345,
    });
    expect(pw).toBeGreaterThan(0.035);
    expect(pw).toBeLessThan(0.065);
  });

  it("approaches the analytic sample size for a known design", () => {
    // 2% to 3% (+50% relative), 80% power, alpha 0.05 two-sided.
    //   n = (1.96 + 0.8416)^2 * [0.02*0.98 + 0.03*0.97] / 0.01^2
    //     = 7.849 * 0.0487 / 0.0001
    //     = 3,822 per arm
    // The simulation is the arbiter here: an earlier draft of this test asserted
    // 2,300 from a pooled-variance shortcut and the simulator returned 59%
    // power, which was the shortcut being wrong rather than the simulator.
    const { power: pw } = power({
      baseline: 0.02,
      relLift: 0.5,
      nPerArm: 3822,
      trials: 3000,
      seed: 999,
    });
    expect(pw).toBeGreaterThan(0.75);
    expect(pw).toBeLessThan(0.87);
  });

  it("rises with sample size", () => {
    const small = power({ baseline: 0.03, relLift: 0.3, nPerArm: 500, trials: 1500, seed: 7 });
    const large = power({ baseline: 0.03, relLift: 0.3, nPerArm: 8000, trials: 1500, seed: 7 });
    expect(large.power).toBeGreaterThan(small.power + 0.2);
  });

  it("reports sign errors that vanish as power grows", () => {
    // An underpowered win points the wrong way a meaningful share of the time.
    const weak = power({ baseline: 0.02, relLift: 0.1, nPerArm: 400, trials: 3000, seed: 4 });
    const strong = power({ baseline: 0.02, relLift: 0.1, nPerArm: 40000, trials: 800, seed: 4 });
    expect(weak.signErrorGivenSignificant).toBeGreaterThan(strong.signErrorGivenSignificant);
  });
});

describe("peekingFalsePositive", () => {
  it("is ~alpha with a single look", () => {
    const fp = peekingFalsePositive({ baseline: 0.03, nPerArm: 3000, peeks: 1, trials: 3000, seed: 21 });
    expect(fp).toBeGreaterThan(0.03);
    expect(fp).toBeLessThan(0.07);
  });

  it("inflates well past alpha when checked repeatedly", () => {
    const once = peekingFalsePositive({ baseline: 0.03, nPerArm: 3000, peeks: 1, trials: 3000, seed: 21 });
    const often = peekingFalsePositive({ baseline: 0.03, nPerArm: 3000, peeks: 20, trials: 3000, seed: 21 });
    expect(often).toBeGreaterThan(once * 2);
  });
});

describe("minimumDetectableEffect", () => {
  it("shrinks as sample size grows", () => {
    const small = minimumDetectableEffect({ baseline: 0.03, nPerArm: 500, trials: 800, seed: 3 });
    const large = minimumDetectableEffect({ baseline: 0.03, nPerArm: 10000, trials: 800, seed: 3 });
    expect(large).toBeLessThan(small);
  });
});

describe("makeRng", () => {
  it("is deterministic for a seed", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays in range", () => {
    const r = makeRng(5);
    for (let i = 0; i < 2000; i += 1) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
