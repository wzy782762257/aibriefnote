import { CategoryChips, CategoryFilter, MaintenancePanel, SitesGrid, UpdateCards } from "./components/DataSections";
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
          <p className="eyebrow">AI Tools / Tutorials / Daily Checks</p>
          <h1 id="page-title">发现、筛选并上手真正有用的 AI 工具</h1>
          <p className="lead-text">每天维护 AI 站点导航和工具教程，按场景、费用、登录要求和可访问状态整理。</p>

          <div className="hero-actions">
            <a className="button primary" href="/sites/">浏览AI站点导航</a>
            <a className="button secondary" href="/articles/">查看工具教程</a>
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
        <h1>工作流模板整理中</h1>
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
  const articles = [
    {
      href: "/articles/ai-brief-2026-06-15",
      meta: "AI Automation Guide · 2026-06-15",
      title: "AI 自动化工具怎么选：n8n、Dify、Langflow、Open WebUI 入门",
      summary: "按真实任务拆解 AI 自动化工具的选择、第一条工作流和上线前质量检查。"
    },
    {
      href: "/articles/n8n-rss-ai-review-workflow",
      meta: "Workflow Tutorial · 2026-06-18",
      title: "用 n8n 搭建 RSS → AI 摘要 → 人工审核工作流",
      summary: "从输入字段、提示词到失败重试，搭建一条不会自动误发布的内容整理流程。"
    },
    {
      href: "/articles/rag-knowledge-base-quality-checklist",
      meta: "RAG Guide · 2026-06-18",
      title: "RAG 知识库上线前检查：切分、召回、引用与拒答",
      summary: "用一套可执行测试判断知识库问答是否真的可靠，而不只是在演示里看起来聪明。"
    },
    {
      href: "/articles/ai-content-human-review-checklist",
      meta: "Content Operations · 2026-06-18",
      title: "AI 辅助内容发布前，人工审核到底要检查什么",
      summary: "覆盖事实、来源、结构、版权、时效和用户价值，适合内容站建立发布清单。"
    },
    {
      href: "/articles/local-vs-cloud-ai-models",
      meta: "Model Selection · 2026-06-18",
      title: "本地模型还是云端 API：按隐私、成本和维护难度选择",
      summary: "不追模型排行榜，直接从数据敏感度、调用规模、延迟和团队能力做判断。"
    },
    {
      href: "/articles/ai-tool-evaluation-checklist",
      meta: "Tool Evaluation · 2026-06-18",
      title: "评估一个 AI 工具值不值得长期使用的 12 项清单",
      summary: "从数据出口、价格变化、可替代性到团队协作，避免只看一次演示就做采购决定。"
    }
  ];

  return (
    <>
      <section className="page-title">
        <p className="eyebrow">Archive</p>
        <h1>教程归档</h1>
        <p>围绕真实工具选择、搭建步骤和上线检查整理的教程文章。</p>
      </section>
      <div className="article-grid">
        {articles.map((article) => (
          <article className="article-card" key={article.href}>
            <p className="meta">{article.meta}</p>
            <h3><a href={article.href}>{article.title}</a></h3>
            <p>{article.summary}</p>
            <a className="article-link" href={article.href}>阅读教程</a>
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
