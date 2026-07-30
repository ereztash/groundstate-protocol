/**
 * Monte Carlo planning for the A/B tests currently on the table.
 *
 * What this answers, and what it cannot:
 *
 *   It CANNOT say which variant wins. Doing so would require assuming the
 *   effect size, which is the quantity the test exists to estimate. A simulation
 *   fed an assumed lift only ever returns that assumption.
 *
 *   It CAN say how much traffic a test needs, what the smallest detectable
 *   effect is at a given volume, and what early stopping does to the error rate.
 *   None of those depend on knowing the true effect, so they are answerable with
 *   zero visitors on record.
 *
 * Every rate below is a scenario input, not a measurement. The site has no
 * conversion data, so the honest move is to sweep a plausible range rather than
 * pick one number and dress it up as a baseline.
 *
 * Deterministic: a seeded PRNG, so a rerun reproduces the table exactly.
 */

/** xorshift128, seeded. Math.random would make the output unreproducible. */
export function makeRng(seed = 0x2545f491) {
  let x = seed >>> 0 || 1;
  let y = 0x9e3779b9;
  let z = 0x243f6a88;
  let w = 0xb7e15162;
  return function next() {
    const t = x ^ (x << 11);
    x = y; y = z; z = w;
    w = (w ^ (w >>> 19)) ^ (t ^ (t >>> 8));
    return (w >>> 0) / 0x100000000;
  };
}

/** Binomial draw. Sums Bernoulli trials: n here is small enough for that. */
export function binomial(n, p, rng) {
  let k = 0;
  for (let i = 0; i < n; i += 1) if (rng() < p) k += 1;
  return k;
}

/**
 * Two-proportion z test, pooled. Returns the two-sided p value.
 * Abramowitz and Stegun 26.2.17 for the normal tail.
 */
export function twoProportionP(convA, nA, convB, nB) {
  if (nA === 0 || nB === 0) return 1;
  const pA = convA / nA;
  const pB = convB / nB;
  const pooled = (convA + convB) / (nA + nB);
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / nA + 1 / nB));
  if (se === 0) return 1;
  const z = Math.abs((pB - pA) / se);
  const t = 1 / (1 + 0.2316419 * z);
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const tail =
    d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return 2 * tail;
}

/**
 * Posterior probability that B beats A, under Beta(1,1) priors. Reported
 * alongside the p value because at small n it is the more decision-useful
 * number: it answers "how sure am I" rather than "would this surprise me if
 * nothing were happening".
 */
export function probBBeatsA(convA, nA, convB, nB, rng, draws = 20000) {
  let wins = 0;
  for (let i = 0; i < draws; i += 1) {
    const a = betaSample(convA + 1, nA - convA + 1, rng);
    const b = betaSample(convB + 1, nB - convB + 1, rng);
    if (b > a) wins += 1;
  }
  return wins / draws;
}

/** Beta via two gammas (Marsaglia and Tsang). */
function betaSample(a, b, rng) {
  const x = gammaSample(a, rng);
  const y = gammaSample(b, rng);
  return x / (x + y);
}

function gammaSample(k, rng) {
  if (k < 1) return gammaSample(k + 1, rng) * Math.pow(rng(), 1 / k);
  const d = k - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do {
      x = normal(rng);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function normal(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Share of trials where a true lift is detected at alpha. This is power, and it
 * is a property of the design rather than of any result, which is why it can be
 * computed before a single visitor arrives.
 */
export function power({ baseline, relLift, nPerArm, alpha = 0.05, trials = 4000, seed }) {
  const rng = makeRng(seed);
  const pB = baseline * (1 + relLift);
  let detected = 0;
  let wrongDirection = 0;
  for (let t = 0; t < trials; t += 1) {
    const a = binomial(nPerArm, baseline, rng);
    const b = binomial(nPerArm, pB, rng);
    const p = twoProportionP(a, nPerArm, b, nPerArm);
    if (p < alpha) {
      detected += 1;
      if (b / nPerArm < a / nPerArm) wrongDirection += 1;
    }
  }
  return {
    power: detected / trials,
    /** Significant results that pointed the wrong way. */
    signErrorGivenSignificant: detected ? wrongDirection / detected : 0,
  };
}

/**
 * False positive rate when the operator checks repeatedly and stops at the
 * first significant reading. Same null world, same alpha; the only change is
 * looking more than once.
 */
export function peekingFalsePositive({ baseline, nPerArm, peeks, alpha = 0.05, trials = 4000, seed }) {
  const rng = makeRng(seed);
  const step = Math.floor(nPerArm / peeks);
  let falsePositives = 0;
  for (let t = 0; t < trials; t += 1) {
    let a = 0, b = 0;
    let stopped = false;
    for (let k = 1; k <= peeks && !stopped; k += 1) {
      const add = k === peeks ? nPerArm - step * (peeks - 1) : step;
      a += binomial(add, baseline, rng);
      b += binomial(add, baseline, rng);
      const n = step * (k - 1) + add;
      if (twoProportionP(a, n, b, n) < alpha) stopped = true;
    }
    if (stopped) falsePositives += 1;
  }
  return falsePositives / trials;
}

/** Smallest relative lift reaching `target` power at nPerArm, by bisection. */
export function minimumDetectableEffect({ baseline, nPerArm, target = 0.8, seed, trials = 2000 }) {
  let lo = 0.01, hi = 4.0;
  for (let i = 0; i < 18; i += 1) {
    const mid = (lo + hi) / 2;
    const { power: pw } = power({ baseline, relLift: mid, nPerArm, trials, seed });
    if (pw < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
