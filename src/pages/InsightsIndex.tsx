import { Link } from "react-router-dom";
import { Reveal, RevealItem, RevealStagger } from "@/components/landing/Reveal";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { insights, formatDate } from "@/lib/insights";

/**
 * /insights — the article library index. Lists every article (newest first) as
 * a card linking to its own prerendered page. Grows automatically: drop a
 * markdown file in content/insights and it appears here and in the sitemap.
 */
const InsightsIndex = () => {
  useDocumentMeta({
    title: "תובנות — COR-SYS | ארז טל-שיר",
    description:
      "מאמרים על בידול, תמחור, וסנכרון בין מה שאתה יודע לבין מה שהלקוח משלם עליו. המתודולוגיה של COR-SYS, בכתב.",
    path: "/insights",
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <a href="#insights-main" className="skip-to-content">
        דלג לתוכן
      </a>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div dir="rtl" className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="text-base font-semibold tracking-wide text-foreground outline-none" aria-label="COR-SYS — לעמוד הבית">
            COR-SYS
          </Link>
          <Link to="/" className="cta-line inline-flex h-9 items-center rounded-md px-3.5 text-xs font-semibold md:px-4 md:text-sm">
            בוא נדבר
          </Link>
        </div>
      </header>

      <main id="insights-main" dir="rtl" className="mx-auto max-w-4xl px-6 pt-28 pb-16 md:pt-36">
        <Reveal className="max-w-2xl">
          <p className="cor-overline-he">תובנות</p>
          <h1 className="cor-display mt-4 text-foreground">
            מה שאתה יודע, בשפה שהלקוח משלם עליה
          </h1>
          <p className="cor-body-lg mt-4 text-foreground/80">
            מאמרים על בידול, תמחור, וסנכרון בין המשאב לתכלית — המתודולוגיה של
            COR-SYS, בכתב.
          </p>
        </Reveal>

        <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-2" as="ul">
          {insights.map((a) => (
            <RevealItem key={a.slug} as="li">
              <Link
                to={`/insights/${a.slug}`}
                className="cor-card group flex h-full flex-col p-6 md:p-7"
              >
                {a.date && (
                  <time
                    dateTime={a.date}
                    className="text-xs font-semibold tracking-wide text-muted-foreground"
                  >
                    {formatDate(a.date)}
                  </time>
                )}
                <h2 className="cor-heading mt-2 text-foreground group-hover:text-primary">
                  {a.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                  {a.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  לקריאה
                  <span aria-hidden="true">←</span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </main>

      <footer className="border-t border-border py-10">
        <div dir="rtl" className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="text-link">
            חזרה לעמוד הבית
          </Link>
          <p>© ארז טל-שיר — COR-SYS</p>
        </div>
      </footer>
    </div>
  );
};

export default InsightsIndex;
