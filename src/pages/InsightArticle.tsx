import { Link, useParams } from "react-router-dom";
import { marked } from "marked";
import { Reveal } from "@/components/landing/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProofStrip from "@/components/ProofStrip";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { getInsight, insights, formatDate } from "@/lib/insights";

const SITE_ORIGIN = "https://ereztalshir.co.il";

/**
 * /insights/:slug — a single article. The markdown body is rendered to HTML
 * (marked) inside a Tailwind `prose` container styled to the brand. Per-article
 * <title>/description/canonical come from useDocumentMeta, and an Article
 * JSON-LD block is rendered inline so the prerenderer bakes it into the static
 * HTML for search + AI engines. Ends in the single site CTA.
 */
const InsightArticle = () => {
  const { slug } = useParams();
  const article = getInsight(slug);

  useDocumentMeta({
    title: article
      ? `${article.title} | COR-SYS`
      : "מאמר לא נמצא | COR-SYS",
    description: article?.description,
    path: article ? `/insights/${article.slug}` : "/insights",
  });

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center" dir="rtl">
        <p className="cor-title text-foreground">המאמר לא נמצא</p>
        <Link to="/insights" className="text-link">
          חזרה לכל התובנות
        </Link>
      </div>
    );
  }

  const html = marked.parse(article.body, { async: false }) as string;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: "he",
    author: { "@type": "Person", name: "ארז טל-שיר" },
    publisher: { "@type": "Person", name: "ארז טל-שיר" },
    mainEntityOfPage: `${SITE_ORIGIN}/insights/${article.slug}`,
  };

  // Breadcrumb trail (בית › תובנות › <article>) so Google can render a
  // breadcrumb in the result instead of a bare URL — better SERP presence.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "תובנות", item: `${SITE_ORIGIN}/insights` },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${SITE_ORIGIN}/insights/${article.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <a href="#article-main" className="skip-to-content">
        דלג לתוכן
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <SiteHeader />

      <main id="article-main" dir="rtl" className="mx-auto max-w-3xl px-6 pt-28 pb-16 md:pt-36">
        <Reveal as="article">
          <p className="cor-overline-he">תובנה</p>
          <h1 className="cor-display mt-4 text-foreground">{article.title}</h1>
          {article.subtitle && (
            <p className="cor-body-lg mt-4 text-foreground/70">{article.subtitle}</p>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            <span>ארז טל-שיר</span>
            {article.date && (
              <>
                <span aria-hidden="true"> · </span>
                <time dateTime={article.date}>{formatDate(article.date)}</time>
              </>
            )}
          </p>

          <div className="hairline my-8" />

          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-headings:tracking-tight prose-p:text-foreground/85 prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Reveal>

        {/* Keep readers who aren't conversion-ready inside the library: up to
            two other articles (newest first) before the CTA dead-ends them. */}
        {insights.filter((i) => i.slug !== article.slug).length > 0 && (
          <Reveal className="mt-14">
            <p className="cor-overline-he">עוד תובנות</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {insights
                .filter((i) => i.slug !== article.slug)
                .slice(0, 2)
                .map((i) => (
                  <li key={i.slug}>
                    <Link
                      to={`/insights/${i.slug}`}
                      className="cor-card group flex h-full flex-col p-5"
                    >
                      <span className="cor-subheading text-foreground group-hover:text-primary">
                        {i.title}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        לקריאה
                        <span aria-hidden="true">←</span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </Reveal>
        )}

        {/* Single CTA — the whole site funnels to the fit call. */}
        <Reveal className="mt-14 rounded-xl border border-accent/25 bg-card/60 p-6 text-center md:p-8">
          <p className="cor-heading text-foreground">
            רוצה לבדוק איפה הזרימה שלך נעצרת?
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            מפת סנכרון של 20 דקות: נקודת חנק אחת שסומנה, אומדן למה שהיא עולה לך בשנה,
            וצעד תיקון אחד. במספר, לא בתחושה.
          </p>
          <Link
            to="/#diagnostic-form"
            className="cta-warm-lg mt-6 inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
          >
            קבע שיחת התאמה — 20 דקות, בלי לחץ
          </Link>
        </Reveal>

        <ProofStrip className="mt-14" />
      </main>

      <SiteFooter />
    </div>
  );
};

export default InsightArticle;
