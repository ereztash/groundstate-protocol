/**
 * Runs the planning simulation for the tests actually on the table and prints
 * the tables. See scripts/ab-simulate.mjs for what this can and cannot answer.
 *
 * Every rate here is a scenario, not a measurement. The site has no conversion
 * data, so the sweep spans a plausible range instead of pretending to a
 * baseline.
 */
import {
  power,
  peekingFalsePositive,
  minimumDetectableEffect,
  makeRng,
  probBBeatsA,
  binomial,
} from "./ab-simulate.mjs";

const SEED = 20260730;
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const int = (x) => Math.round(x).toLocaleString("en-US");

/** Monthly unique visitors. Erez is a solo consultant driving traffic off LinkedIn. */
const TRAFFIC = [100, 250, 500, 1000, 2000];
/** Fit-call requests per unique visitor, for a high-ticket B2B consulting page. */
const BASELINES = [0.01, 0.02, 0.03, 0.05];

console.log("=".repeat(76));
console.log("1. HOW BIG AN EFFECT IS EVEN VISIBLE, BY SAMPLE SIZE");
console.log("   Minimum detectable relative lift, 80% power, alpha 0.05 two-sided.");
console.log("=".repeat(76));
console.log("baseline |" + TRAFFIC.map((t) => `${int(t)}/arm`.padStart(12)).join(""));
for (const b of BASELINES) {
  const cells = TRAFFIC.map((n) => {
    const mde = minimumDetectableEffect({ baseline: b, nPerArm: n, trials: 700, seed: SEED });
    return (mde >= 3.9 ? ">+390%" : `+${(mde * 100).toFixed(0)}%`).padStart(12);
  });
  console.log(`${pct(b).padStart(8)} |${cells.join("")}`);
}

console.log();
console.log("=".repeat(76));
console.log("2. HOW LONG A REALISTIC TEST WOULD TAKE");
console.log("   Months of traffic to reach 80% power, both arms, at 250 visitors/month.");
console.log("=".repeat(76));
const MONTHLY = 250;
const LIFTS = [0.15, 0.25, 0.5, 1.0];
console.log("baseline |" + LIFTS.map((l) => `+${(l * 100).toFixed(0)}% lift`.padStart(14)).join(""));
for (const b of BASELINES) {
  const cells = LIFTS.map((lift) => {
    let lo = 50, hi = 400000;
    for (let i = 0; i < 16; i += 1) {
      const mid = Math.floor((lo + hi) / 2);
      const { power: pw } = power({ baseline: b, relLift: lift, nPerArm: mid, trials: 500, seed: SEED });
      if (pw < 0.8) lo = mid; else hi = mid;
    }
    const months = (hi * 2) / MONTHLY;
    return (months > 240 ? ">20 years" : months >= 24 ? `${(months / 12).toFixed(1)} years` : `${months.toFixed(1)} mo`).padStart(14);
  });
  console.log(`${pct(b).padStart(8)} |${cells.join("")}`);
}

console.log();
console.log("=".repeat(76));
console.log("3. WHAT HAPPENS IF YOU CHECK EARLY");
console.log("   Two identical variants. Rate of declaring a winner anyway.");
console.log("=".repeat(76));
for (const peeks of [1, 5, 10, 20, 50]) {
  const fp = peekingFalsePositive({ baseline: 0.02, nPerArm: 4000, peeks, trials: 2500, seed: SEED });
  const bar = "#".repeat(Math.round(fp * 60));
  console.log(`${String(peeks).padStart(3)} looks | ${pct(fp).padStart(6)} ${bar}`);
}

console.log();
console.log("=".repeat(76));
console.log("4. THE REALISTIC RUN: 3 MONTHS AT 250/MONTH, SPLIT TWO WAYS");
console.log("   True lift is +25%. What you would actually observe.");
console.log("=".repeat(76));
const nPerArm = Math.floor((MONTHLY * 3) / 2);
const rng = makeRng(SEED);
const baseline = 0.02;
const trueB = baseline * 1.25;
let sig = 0, wrongWay = 0;
const observed = [];
for (let t = 0; t < 3000; t += 1) {
  const a = binomial(nPerArm, baseline, rng);
  const b = binomial(nPerArm, trueB, rng);
  observed.push([a, b]);
  const { power: _p } = { power: 0 };
  void _p;
}
const { power: pw3, signErrorGivenSignificant: se3 } = power({
  baseline, relLift: 0.25, nPerArm, trials: 3000, seed: SEED,
});
sig = pw3; wrongWay = se3;
console.log(`  visitors per arm            ${int(nPerArm)}`);
console.log(`  expected conversions/arm    ~${(nPerArm * baseline).toFixed(1)} vs ~${(nPerArm * trueB).toFixed(1)}`);
console.log(`  chance of reaching p<0.05   ${pct(sig)}`);
console.log(`  of those wins, wrong-way    ${pct(wrongWay)}`);
const [a0, b0] = observed[0];
console.log(`  one draw: A ${a0}/${nPerArm}, B ${b0}/${nPerArm}`);
console.log(`  P(B>A) from that draw       ${pct(probBBeatsA(a0, nPerArm, b0, nPerArm, makeRng(SEED + 1), 20000))}`);

console.log();
console.log("=".repeat(76));
console.log("5. A HIGHER-BASE-RATE PROXY INSTEAD OF THE FINAL CONVERSION");
console.log("   Form-start rate is far commoner than a booked call, so it needs less traffic.");
console.log("=".repeat(76));
for (const b of [0.10, 0.15, 0.25]) {
  let lo = 50, hi = 200000;
  for (let i = 0; i < 16; i += 1) {
    const mid = Math.floor((lo + hi) / 2);
    const { power: pw } = power({ baseline: b, relLift: 0.25, nPerArm: mid, trials: 500, seed: SEED });
    if (pw < 0.8) lo = mid; else hi = mid;
  }
  const months = (hi * 2) / MONTHLY;
  console.log(`  baseline ${pct(b).padStart(6)}  ->  ${int(hi).padStart(7)}/arm, ${months.toFixed(1)} months at ${MONTHLY}/mo`);
}

console.log();
console.log("=".repeat(76));
console.log("6. THE TEST THAT IS ALREADY RUNNING: THE PRE-REGISTRATION");
console.log("   20 clients, threshold 60% reaching a documented interest signal.");
console.log("   Decision rule: below 12 of 20, the method gets a new version.");
console.log("=".repeat(76));
function binomPmf(k, n, p) {
  let logC = 0;
  for (let i = 1; i <= k; i += 1) logC += Math.log((n - k + i) / i);
  return Math.exp(logC + k * Math.log(p) + (n - k) * Math.log(1 - p));
}
function pAtOrAbove(threshold, n, p) {
  let s = 0;
  for (let k = threshold; k <= n; k += 1) s += binomPmf(k, n, p);
  return s;
}
console.log("  true rate | P(observe >=12/20, i.e. passes) | reading");
for (const trueRate of [0.3, 0.45, 0.6, 0.75, 0.9]) {
  const pass = pAtOrAbove(12, 20, trueRate);
  const reading =
    trueRate < 0.6
      ? pass < 0.25 ? "correctly fails, usually" : "fails to fail: too often passes"
      : pass > 0.75 ? "correctly passes, usually" : "correctly passes, but not reliably";
  console.log(`  ${(trueRate * 100).toFixed(0).padStart(8)}% | ${(pass * 100).toFixed(1).padStart(28)}% | ${reading}`);
}
console.log();
console.log("  Same question as a two-arm page test would ask, but the effect is");
console.log("  large and the base rate is high, which is why 20 is enough here and");
console.log("  thousands are not enough there.");
