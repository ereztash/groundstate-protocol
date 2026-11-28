import { Link } from "react-router-dom";
import { Reveal, RevealItem, RevealStagger } from "@/components/landing/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { insights, formatDate } from "@/lib/insights";
import { insightSections } from "@/data/insightSections";

/**
 * /insights — the article library, in four open sections by the reader's
 * question (28.11), one under the other, with a row of plain anchor links
 * under the intro. Each article card links to its own prerendered page. An
 * article joins a section from its frontmatter; see data/insightSections.ts.
 */
const InsightsIndex = () => {
  useDocumentMeta({
    title: "תובנות, COR-SYS | ארז טל-שיר",
    description:
      "מאמרים על בידול, תמחור, וסנכרון בין מה שאתם יודעים לבין מה שהלקוח משלם עליו. המתודולוגיה של COR-SYS, בכתב.",
    path: "/insights",
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <a href="#insights-main" className="skip-to-content">
        דילוג לתוכן
      </a>

      <SiteHeader />

      <main id="insights-main" dir="rtl" className="mx-auto max-w-4xl px-6 pt-28 pb-16 md:pt-36">
        <Reveal className="max-w-2xl">
          <p className="cor-overline-he">תובנות</p>
          <h1 className="cor-display mt-4 text-foreground">
            מה שאתם יודעים, בשפה שהלקוח משלם עליה
          </h1>
          <p className="cor-body-lg mt-4 text-foreground">
            מאמרים על בידול, תמחור, וסנכרון בין המשאב לתכלית, המתודולוגיה של
            COR-SYS, בכתב.
          </p>
          <nav aria-label="המאמרים לפי שאלה" className="mt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-base">
              {insightSections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="ld-link">
                    {s.question}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        {insightSections.map((s) => {
          const articles = insights
            .filter((a) => a.section === s.id)
            .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          return (
            <section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              className="mt-16 scroll-mt-20"
            >
              <Reveal className="max-w-2xl">
                <h2 id={`${s.id}-title`} className="cor-title text-foreground">
                  {s.title}
                </h2>
                <p className="mt-3 text-foreground">{s.subtitle}</p>
              </Reveal>

              <RevealStagger className="mt-8 grid gap-6 sm:grid-cols-2" as="ul">
                {articles.map((a) => (
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
                      <h3 className="cor-heading mt-2 text-foreground group-hover:text-primary">
                        {a.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-foreground">
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

              <p className="mt-6 text-sm text-foreground">
                {s.more.question}{" "}
                <Link to={s.more.to} className="ld-link whitespace-nowrap">
                  {s.more.label}
                  <span aria-hidden="true"> ←</span>
                </Link>
              </p>
            </section>
          );
        })}
      </main>

      <SiteFooter />
    </div>
  );
};

export default InsightsIndex;
