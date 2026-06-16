import { CategoryChips, CategoryFilter, MaintenancePanel, SitesGrid, UpdateCards, WorkflowGrid } from "./components/DataSections";
import { Layout } from "./components/Layout";

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
  return (
    <>
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">AI Tools / Workflows / Tutorials</p>
          <h1 id="page-title">发现、筛选并上手真正有用的 AI 工具</h1>
          <p className="lead-text">每天维护 AI 站点导航、工具教程和可复制工作流，帮你从收集链接走到实际使用。</p>

          <div className="search-panel">
            <form className="search-row" action="/sites/">
              <input name="q" type="search" placeholder="搜索 AI 工具、场景或工作流，例如：知识库问答、RSS摘要、图片生成" autoComplete="off" />
              <button className="button primary" type="submit">搜索</button>
            </form>
            <div className="quick-actions">
              <a className="button primary" href="/sites/">浏览AI站点导航</a>
              <a className="button secondary" href="/articles/">查看工具教程</a>
              <a className="button secondary" href="/workflows/">复制工作流模板</a>
            </div>
          </div>

          <CategoryChips />
        </div>
        <MaintenancePanel />
      </section>

      <section>
        <SectionHead
          kicker="Directory"
          title="热门 AI 站点"
          body="站点卡片来自数据库，状态和分类会随每日维护更新。"
          action={{ href: "/sites/", label: "查看全部" }}
        />
        <SitesGrid featured limit={6} />
      </section>

      <section>
        <SectionHead
          kicker="Workflow Templates"
          title="可复制工作流模板"
          body="每个模板都围绕一个真实任务：收集、摘要、分类、通知或知识库问答。"
          action={{ href: "/workflows/", label: "浏览模板" }}
        />
        <WorkflowGrid featured limit={3} />
      </section>
    </>
  );
}

function SitesPage() {
  const params = searchParams();
  const category = params.get("category") || "";
  const query = params.get("q") || "";

  return (
    <>
      <section className="page-title">
        <p className="eyebrow">AI Site Directory</p>
        <h1>AI 站点导航</h1>
        <p>这里收录和维护可用的 AI 工具入口。每个站点都按场景、费用、登录要求和访问状态整理。</p>
      </section>

      <section className="directory-shell">
        <CategoryFilter category={category} />
        <div>
          <form className="toolbar" action="/sites/">
            <input name="q" type="search" placeholder="搜索工具、场景或分类" defaultValue={query} />
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <button className="button primary" type="submit">筛选</button>
          </form>
          <SitesGrid limit={30} category={category} query={query} />
        </div>
      </section>
    </>
  );
}

function WorkflowsPage() {
  return (
    <>
      <section className="page-title">
        <p className="eyebrow">Workflow Library</p>
        <h1>可复制工作流模板</h1>
        <p>围绕真实任务组织模板：内容收集、AI 摘要、知识库问答、站点维护和结果通知。</p>
      </section>
      <WorkflowGrid limit={30} />
    </>
  );
}

function UpdatesPage() {
  return (
    <>
      <section className="page-title">
        <p className="eyebrow">Maintenance Log</p>
        <h1>每日更新与维护状态</h1>
        <p>记录新增站点、失效复查、分类调整和教程更新。这个页面用于证明导航站不是一次性链接仓库。</p>
      </section>
      <UpdateCards />
    </>
  );
}

function ArticlesPage() {
  return (
    <>
      <section className="page-title">
        <p className="eyebrow">Archive</p>
        <h1>教程归档</h1>
        <p>围绕真实工具选择、搭建步骤和上线检查整理的教程文章。</p>
      </section>
      <div className="article-grid">
        <article className="article-card">
          <p className="meta">AI Automation Guide · 2026-06-15</p>
          <h3><a href="/articles/ai-brief-2026-06-15">AI 自动化工具怎么选：n8n、Dify、Langflow、Open WebUI 入门</a></h3>
          <p>按真实任务拆解 AI 自动化工具的选择、第一条工作流和上线前质量检查。</p>
          <a className="article-link" href="/articles/ai-brief-2026-06-15">阅读教程</a>
        </article>
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
