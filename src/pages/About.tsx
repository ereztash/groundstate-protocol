import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NoiseToCoherence from "@/components/about/NoiseToCoherence";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const SITE_ORIGIN = "https://ereztash.github.io/groundstate-protocol";

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

/**
 * The story, rewritten 2026-09-29 from Erez's own documents: his CV, his
 * self-description, the COR-SYS vision document and the method paper. The
 * previous version told the arc (human side, then structure) without a single
 * fact a reader could hold on to. Every step below is a fact from those
 * documents, or his own framing of it ("ראיתי פער. בניתי ממשק.").
 *
 * Deliberately left out: the bookstore revenue figure (self-reported, no
 * record; refutedClaims bans unattributed revenue increases), and personal
 * details from private documents that he has not published himself.
 */
const STEPS: Step[] = [
  {
    overline: "אודות",
    title: "ארז טל-שיר",
    body: "עובד סוציאלי טכנולוגי. יועץ עסקי לעצמאים.",
  },
  {
    lead: "איך הגעתי לכאן",
    body: "מ-2015 אני עובד עם נוער. למדתי עבודה סוציאלית בתל-חי, במסלול דחק וטראומה.",
  },
  {
    body: "במקביל ניהלתי סניף של צומת ספרים. שם ראיתי שמכירה נשענת על מבנה: מי במשמרת, מה מוזמן ומתי.",
  },
  {
    lead: "אוקטובר 2023",
    body: "ניהלתי את החינוך הבלתי פורמלי לנוער שדרות שפונה לים המלח, עד ינואר 2024. ראיתי מקרוב מה קורה כשמערכת אנושית נכנסת למשבר: שרשרת ניהולית שבורה, מידע שלא עובר, החלטות שמחכות.",
  },
  {
    body: "יצאתי משם עם מסקנה אחת: יעילות של מערכת היא תשתית. ראיתי פער. בניתי ממשק.",
  },
  {
    lead: "למה COR-SYS",
    body: "COR, על שם תיאוריית שימור המשאבים של הובפול: אנשים שומרים על משאבים, והפסד כואב יותר מרווח מקביל. SYS, כי ההתערבות תמיד מבנית.",
  },
  {
    body: "כשהתחלתי לייעץ לעצמאים ראיתי אותו דפוס: אנשים שיודעים דברים שאחרים לא, ואין להם משפט אחד שמסביר את זה ללקוח. נשמע מוכר?",
  },
  {
    // The million-shekel retail claim was removed from OriginStorySection
    // because no evidence exists for it, and the landing tells the visitor
    // every figure is "ניתנות לאימות". The same sentence was still live here.
    // Removed for the same reason, not rephrased.
    lead: "מה שיש",
    body: "את הרצף הזה לעצמאים בניתי השנה: ארבעה שלבים, מהסיפור ועד פניות שיוצאות בפועל.",
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
    title: "אודות, ארז טל-שיר | COR-SYS",
    description:
      "עובד סוציאלי טכנולוגי ויועץ עסקי לעצמאים. איך שני עולמות, נרטיב אנושי ומבנה עסקי, הפכו לשיטה אחת. הסיפור מאחורי COR-SYS.",
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
    url: `${SITE_ORIGIN}/about/`,
    jobTitle: "עובד סוציאלי טכנולוגי, יועץ עסקי לעצמאים",
    description:
      "עובד סוציאלי טכנולוגי ויועץ עסקי לעצמאים. משלב נרטיב אנושי עם מבנה עסקי, המתודולוגיה של COR-SYS.",
    knowsAbout: ["בידול", "תמחור", "מיצוב", "התערבות התנהגותית"],
    alumniOf: { "@type": "CollegeOrUniversity", name: "המכללה האקדמית תל-חי" },
    worksFor: { "@type": "Organization", name: "COR-SYS" },
  };

  return (
    // overflow-x-CLIP (not -hidden): hidden would make this wrapper a scroll
    // container, which silently disables position:sticky for the pinned scene.
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <a href="#about-main" className="skip-to-content">
        דילוג לתוכן
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
              רוצים לבדוק מאיפה נכון להתחיל?
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              שיחה בת 20 דקות, ללא עלות. בסופה הערכה מסודרת: מוקד החסימה, נקודת
              הפתיחה המומלצת, והאם קיימת התאמה לתוכנית.
            </p>
            <Link
              to="/#diagnostic-form"
              className="cta-warm-lg mt-6 inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
            >
              לתיאום שיחת התאמה, 20 דקות
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default About;
