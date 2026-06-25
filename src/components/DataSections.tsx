import { useEffect, useMemo, useState } from "react";
import { EmptyState, LoadingCards } from "./States";
import { SiteCard } from "./SiteCard";
import { WorkflowCard } from "./WorkflowCard";
import { articles } from "../data/articles";
import { useI18n } from "../lib/i18n";
import {
  getCategories,
  getSites,
  getWorkflows,
  type AiSite,
  type Category,
  type Workflow
} from "../lib/api";

export function CategoryChips() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((result) => {
      if (result.configured) setCategories(result.data?.categories || []);
    }).catch(() => setCategories([]));
  }, []);

  const visible = categories.length
    ? categories.slice(0, 8)
    : [
      { name: "AI聊天", slug: "ai-chat" },
      { name: "AI编程", slug: "ai-coding" },
      { name: "图片生成", slug: "image-generation" },
      { name: "视频生成", slug: "video-generation" },
      { name: "自动化Agent", slug: "automation-agent" },
      { name: "RAG知识库", slug: "rag-knowledge" }
    ];

  return (
    <div className="chip-row">
      {visible.map((category) => (
        <a className="chip" href={`/sites/?category=${category.slug}`} key={category.slug}>{category.name}</a>
      ))}
    </div>
  );
}

export function SitesGrid({ featured, limit = 24, category, query }: {
  featured?: boolean;
  limit?: number;
  category?: string;
  query?: string;
}) {
  const { t } = useI18n();
  const [sites, setSites] = useState<AiSite[]>([]);
  const [message, setMessage] = useState(t.loadingSites);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => {
    const next = new URLSearchParams();
    if (featured) next.set("featured", "1");
    if (category) next.set("category", category);
    if (query) next.set("q", query);
    next.set("limit", String(limit));
    return next;
  }, [category, featured, limit, query]);

  useEffect(() => {
    setLoading(true);
    getSites(params).then((result) => {
      if (!result.configured) {
        setSites([]);
        setMessage(t.dbMissingSites);
        return;
      }
      setSites(result.data?.sites || []);
      setMessage(t.noSites);
    }).catch(() => {
      setSites([]);
      setMessage(t.sitesFailed);
    }).finally(() => setLoading(false));
  }, [params, t]);

  if (loading) return <LoadingCards label={t.loadingSites} />;
  if (!sites.length) return <EmptyState>{message}</EmptyState>;

  return (
    <div className="tools-grid">
      {sites.map((site) => <SiteCard site={site} key={site.id} />)}
    </div>
  );
}

export function WorkflowGrid({ featured, limit = 24 }: { featured?: boolean; limit?: number }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [message, setMessage] = useState("正在读取工作流模板。");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (featured) params.set("featured", "1");
    params.set("limit", String(limit));

    getWorkflows(params).then((result) => {
      if (!result.configured) {
        setWorkflows([]);
        setMessage("D1 数据库未绑定。导入 workflow_templates 后，这里会显示工作流模板。");
        return;
      }
      setWorkflows(result.data?.workflows || []);
      setMessage("暂时没有工作流模板。");
    }).catch(() => {
      setWorkflows([]);
      setMessage("工作流模板读取失败，请稍后重试。");
    }).finally(() => setLoading(false));
  }, [featured, limit]);

  if (loading) return <LoadingCards label="正在读取工作流模板。" />;
  if (!workflows.length) return <EmptyState>{message}</EmptyState>;

  return (
    <div className="workflow-grid">
      {workflows.map((workflow) => <WorkflowCard workflow={workflow} key={workflow.id} />)}
    </div>
  );
}

export function MaintenancePanel() {
  const { t } = useI18n();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
  const cards = [
    {
      label: t.hotArticles,
      count: articles.length,
      href: "/articles/",
      meta: `${t.collected} · ${t.viewCategory}`
    },
    {
      label: t.todayAdded,
      count: articles.filter((article) => article.date === today || article.generated).length,
      href: "/updates/",
      meta: `${t.collected} · ${t.viewCategory}`
    },
    {
      label: t.tutorials,
      count: articles.filter((article) => article.category === "tutorial").length,
      href: "/articles/?category=tutorial",
      meta: `${t.collected} · ${t.viewCategory}`
    },
    {
      label: t.events,
      count: articles.filter((article) => article.category === "daily" || article.category === "event").length,
      href: "/articles/?category=event",
      meta: `${t.collected} · ${t.viewCategory}`
    }
  ];

  return (
    <aside className="hero-panel" aria-label={t.hotTitle}>
      <div className="hero-panel-top">
        <div>
          <p className="meta">{t.hotKicker}</p>
          <h2>{t.hotTitle}</h2>
        </div>
        <span className="status active">{t.hotBadge}</span>
      </div>
      <div className="metric-grid">
        {cards.map((card) => (
          <a className="metric metric-link" href={card.href} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.count}</strong>
            <em>{card.meta}</em>
          </a>
        ))}
      </div>
    </aside>
  );
}

export function CategoryFilter({ category }: { category: string }) {
  const { t } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((result) => {
      if (result.configured) setCategories(result.data?.categories || []);
    }).catch(() => setCategories([]));
  }, []);

  return (
    <aside className="filter-panel">
      <a className={`filter-button ${category ? "" : "active"}`} href="/sites/">{t.allTools}</a>
      {categories.map((item) => (
        <a
          className={`filter-button ${category === item.slug ? "active" : ""}`}
          href={`/sites/?category=${item.slug}`}
          key={item.slug}
        >
          {item.name} <span>{item.siteCount}</span>
        </a>
      ))}
    </aside>
  );
}

export function UpdateCards() {
  const { t } = useI18n();
  const dailyArticles = articles.filter((article) => article.generated).length
    ? articles.filter((article) => article.generated)
    : articles;

  if (!dailyArticles.length) return <EmptyState>{t.noUpdates}</EmptyState>;

  return (
    <div className="update-grid">
      {dailyArticles.map((article) => (
        <article className="update-card" key={article.href}>
          <p className="meta">{article.meta}</p>
          <h3><a href={article.href}>{article.title}</a></h3>
          <p>{article.summary}</p>
          <a className="article-link" href={article.href}>{t.readArticle}</a>
        </article>
      ))}
    </div>
  );
}
