import { CategoryChips, CategoryFilter, MaintenancePanel, SitesGrid, UpdateCards } from "./components/DataSections";
import { Layout } from "./components/Layout";
import { articles } from "./data/articles";
import { useI18n } from "./lib/i18n";

function page() {
  return document.documentElement.dataset.page || "home";
}

function searchParams() {
  return new URLSearchParams(window.location.search);
}

function SectionHead({ kicker, title, body, action }: {
  kicker: string;
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="section-head">
      <div>
        <p className="section-kicker">{kicker}</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      {action ? <a className="button secondary" href={action.href}>{action.label}</a> : null}
    </div>
  );
}

function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">{t.homeKicker}</p>
          <h1 id="page-title">{t.homeTitle}</h1>
          <p className="lead-text">{t.homeLead}</p>

          <div className="hero-actions">
            <a className="button primary" href="/sites/">{t.browseSites}</a>
            <a className="button secondary" href="/articles/">{t.viewArticles}</a>
          </div>

          <CategoryChips />
        </div>
        <MaintenancePanel />
      </section>

      <section>
        <SectionHead
          kicker={t.directoryKicker}
          title={t.popularSites}
          body={t.popularSitesBody}
          action={{ href: "/sites/", label: t.viewAll }}
        />
        <SitesGrid featured limit={6} />
      </section>
    </>
  );
}

function SitesPage() {
  const { t } = useI18n();
  const params = searchParams();
  const category = params.get("category") || "";
  const query = params.get("q") || "";

  return (
    <>
      <section className="page-title">
        <p className="eyebrow">{t.sitesKicker}</p>
        <h1>{t.sitesTitle}</h1>
        <p>{t.sitesBody}</p>
      </section>

      <section className="directory-shell">
        <CategoryFilter category={category} />
        <div>
          <form className="toolbar" action="/sites/">
            <input name="q" type="search" placeholder={t.sitesSearchPlaceholder} defaultValue={query} />
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <button className="button primary" type="submit">{t.filter}</button>
          </form>
          <SitesGrid limit={30} category={category} query={query} />
        </div>
      </section>
    </>
  );
}

function WorkflowsPage() {
  const { t } = useI18n();

  return (
    <>
      <section className="page-title">
        <p className="eyebrow">Workflow Library</p>
        <h1>{t.workflowsTitle}</h1>
        <p>这个栏目会等到每个模板都有可复制步骤、输入输出、工具配置和风险说明后再展示。</p>
      </section>
      <section className="holding-panel">
        <p className="meta">Not published yet</p>
        <h2>暂不展示占位模板</h2>
        <p>没有可直接复用的模板，放出来只会误导用户。当前先保留 AI 站点导航和教程，模板库整理完成后再上线。</p>
        <a className="button primary" href="/sites/">先浏览 AI 站点导航</a>
      </section>
    </>
  );
}

function UpdatesPage() {
  const { t } = useI18n();

  return (
    <>
      <section className="page-title">
        <p className="eyebrow">{t.updatesKicker}</p>
        <h1>{t.updatesTitle}</h1>
        <p>{t.updatesBody}</p>
      </section>
      <UpdateCards />
    </>
  );
}

function ArticlesPage() {
  const { t } = useI18n();
  const params = searchParams();
  const category = params.get("category") || "all";
  const filters = [
    { label: t.allArticles, value: "all", href: "/articles/" },
    { label: t.todayAdded, value: "daily", href: "/articles/?category=daily" },
    { label: t.tutorials, value: "tutorial", href: "/articles/?category=tutorial" },
    { label: t.events, value: "event", href: "/articles/?category=event" }
  ];
  const visibleArticles = articles.filter((article) => {
    if (category === "all") return true;
    if (category === "event") return article.category === "event" || article.category === "daily";
    return article.category === category;
  });

  return (
    <>
      <section className="page-title">
        <p className="eyebrow">{t.articlesKicker}</p>
        <h1>{t.articlesTitle}</h1>
        <p>{t.articlesBody}</p>
      </section>
      <nav className="article-filter" aria-label={t.articlesTitle}>
        {filters.map((filter) => (
          <a className={`filter-button ${category === filter.value ? "active" : ""}`} href={filter.href} key={filter.value}>
            {filter.label}
          </a>
        ))}
      </nav>
      <div className="article-grid">
        {visibleArticles.map((article) => (
          <article className="article-card" key={article.href}>
            <p className="meta">{article.meta}</p>
            <h3><a href={article.href}>{article.title}</a></h3>
            <p>{article.summary}</p>
            <a className="article-link" href={article.href}>{t.readArticle}</a>
          </article>
        ))}
      </div>
    </>
  );
}

function AppContent() {
  switch (page()) {
    case "sites":
      return <SitesPage />;
    case "workflows":
      return <WorkflowsPage />;
    case "updates":
      return <UpdatesPage />;
    case "articles":
      return <ArticlesPage />;
    default:
      return <HomePage />;
  }
}

export function App() {
  return (
    <Layout>
      <AppContent />
    </Layout>
  );
}
