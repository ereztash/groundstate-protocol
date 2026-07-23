import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NoiseToCoherence from "@/components/about/NoiseToCoherence";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const SITE_ORIGIN = "https://ereztalshir.co.il";

/**
 * /about — an experiential, scroll-driven telling of who Erez is. A single
 * "coherence" visual stays pinned while the story steps scroll past it; the
 * visual resolves from noise to aligned rows as you read (the same "two worlds
 * becoming one shape" the copy describes).
 *
 * The scroll handler writes a 0→1 progress to `--p` on the pinned container
 * (rAF-throttled, GPU transforms only — see `.about-shard` in index.css) and
 * tracks the active step for text emphasis. Under prefers-reduced-motion the
 * visual is pinned to its coherent end-state and no scroll animation runs; the
 * prerenderer captures the static (noise) top-of-page state. A Person JSON-LD
 * block is rendered inline so it bakes into the static HTML.
 */

type Step = {
  overline?: string;
  title?: string;
  body: string;
  lead?: string;
  link?: { to: string; label: string };
};

const STEPS: Step[] = [
  {
    overline: "אודות",
    title: "ארז טל-שיר",
    body: "עובד סוציאלי בהכשרה. יועץ עסקי לעצמאים בפועל.",
  },
  {
    lead: "איך הגעתי לכאן",
    body: "שנים החזקתי רק צד אחד — הצד האנושי. סיפור, נרטיב, אנשים.",
  },
  {
    body: "כשנכנסתי לעולם העסקי גיליתי שאני יודע דברים שאחרים לא — ואין לי מושג איך להסביר אותם ללקוח. נשמע מוכר?",
  },
  {
    body: "ואז זה התחבר: המבנה הוא החצי השני של אותה צורה. מי שמשלב שני עולמות לא צריך לבחור אחד מהם — הוא צריך משפט אחד שמסביר למה דווקא הצירוף הזה הוא היתרון.",
  },
  {
    lead: "וזה לא תיאוריה",
    body: "תיעדתי גידול של מיליון ₪ בהכנסות בהקשר קמעונאי דרך התערבות התנהגותית. את הרצף הזה לעצמאים בניתי השנה.",
  },
  {
    lead: "יש גם סיפור מתחת לסיפור",
    body: "למה בכלל משמעות אחת, ולמה דווקא אני. כתבתי עליו בנפרד.",
    link: { to: "/insights/one-source-of-meaning", label: "מסעותיו של ארז" },
  },
];

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

const About = () => {
  useDocumentMeta({
    title: "אודות — ארז טל-שיר | COR-SYS",
    description:
      "עובד סוציאלי בהכשרה, יועץ עסקי לעצמאים. איך שני עולמות — נרטיב אנושי ומבנה עסקי — הפכו לשיטה אחת. הסיפור מאחורי COR-SYS.",
    path: "/about",
  });

  const reduced = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    // Reduced motion: pin the coherent end-state, reveal all steps, no scrubbing.
    if (reduced) {
      sticky.style.setProperty("--p", "1");
      setActive(STEPS.length - 1);
      return;
    }
    // Prerender: leave the default (noise) static state baked in.
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return;

    let raf = 0;
    const update = () => {
      const scene = sceneRef.current;
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p =
        total > 0
          ? clamp(-rect.top / total, 0, 1)
          : rect.top <= 0
            ? 1
            : 0;
      sticky.style.setProperty("--p", p.toFixed(4));

      const idx = clamp(Math.floor(p * STEPS.length), 0, STEPS.length - 1);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "ארז טל-שיר",
    url: `${SITE_ORIGIN}/about`,
    jobTitle: "יועץ עסקי לעצמאים",
    description:
      "עובד סוציאלי בהכשרה, יועץ עסקי לעצמאים. משלב נרטיב אנושי עם מבנה עסקי — המתודולוגיה של COR-SYS.",
    knowsAbout: ["בידול", "תמחור", "מיצוב", "התערבות התנהגותית"],
    worksFor: { "@type": "Organization", name: "COR-SYS" },
  };

  return (
    // overflow-x-CLIP (not -hidden): hidden would make this wrapper a scroll
    // container, which silently disables position:sticky for the pinned scene.
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <a href="#about-main" className="skip-to-content">
        דלג לתוכן
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main id="about-main" dir="rtl">
        {/* Scrollytelling scene: pinned visual + stepped copy scrolling over it. */}
        <section
          ref={sceneRef}
          className="about-scene dark relative bg-background text-foreground"
          aria-label="הסיפור מאחורי COR-SYS"
        >
          <div
            ref={stickyRef}
            className="pointer-events-none sticky top-0 flex h-screen items-center justify-center overflow-hidden"
          >
            <NoiseToCoherence className="h-[min(78vh,78vw)] w-[min(78vh,78vw)] opacity-90" />
          </div>

          {/* Steps are pulled up over the pinned visual (inline styles so the
              overlap/scrub length don't depend on arbitrary Tailwind classes). */}
          <div className="relative z-10" style={{ marginTop: "-100vh" }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-center justify-center px-6"
                style={{ minHeight: "100vh" }}
              >
                <div
                  data-dim={reduced || active === i ? undefined : ""}
                  className={`about-step max-w-xl rounded-2xl border border-border/60 bg-background/70 p-7 text-center shadow-sm backdrop-blur-md transition-all duration-500 md:p-9 ${
                    reduced || active === i ? "translate-y-0" : "translate-y-1"
                  }`}
                >
                  {step.overline && <p className="cor-overline-he">{step.overline}</p>}
                  {step.lead && !step.overline && (
                    <p className="cor-overline-he">{step.lead}</p>
                  )}
                  {step.title && (
                    <h1 className="cor-display mt-3 text-foreground">{step.title}</h1>
                  )}
                  <p
                    className={`${
                      step.title ? "mt-4 cor-body-lg text-foreground/80" : "cor-title text-foreground"
                    }`}
                  >
                    {step.body}
                  </p>
                  {step.link && (
                    <Link
                      to={step.link.to}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                    >
                      {step.link.label}
                      <span aria-hidden="true">←</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Single CTA — the whole site funnels to the fit call. */}
        <section dir="rtl" className="mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-accent/25 bg-card/60 p-6 text-center md:p-8">
            <p className="cor-heading text-foreground">
              רוצה לבדוק איפה הזרימה שלך נעצרת?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              מפת סנכרון של 20 דקות: נקודת חנק אחת שסומנה, אומדן למה שהיא עולה לך
              בשנה, וצעד תיקון אחד. במספר, לא בתחושה.
            </p>
            <Link
              to="/#diagnostic-form"
              className="cta-warm-lg mt-6 inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
            >
              קבע שיחת התאמה — 20 דקות, בלי לחץ
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default About;
