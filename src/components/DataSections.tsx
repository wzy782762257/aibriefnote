import { useEffect, useMemo, useState } from "react";
import { EmptyState, LoadingCards } from "./States";
import { SiteCard } from "./SiteCard";
import { WorkflowCard } from "./WorkflowCard";
import {
  getCategories,
  getSites,
  getUpdates,
  getWorkflows,
  type AiSite,
  type Category,
  type MaintenanceLog,
  type MaintenanceStats,
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
  const [sites, setSites] = useState<AiSite[]>([]);
  const [message, setMessage] = useState("正在读取 AI 站点数据库。");
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
        setMessage("D1 数据库未绑定。配置 DB binding 并导入 migrations/ 与 seeds/ 后，这里会显示 AI 站点导航。");
        return;
      }
      setSites(result.data?.sites || []);
      setMessage("没有找到匹配的 AI 站点。");
    }).catch(() => {
      setSites([]);
      setMessage("AI 站点读取失败，请稍后重试。");
    }).finally(() => setLoading(false));
  }, [params]);

  if (loading) return <LoadingCards label="正在读取 AI 站点数据库。" />;
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
  const [stats, setStats] = useState<MaintenanceStats | null>(null);
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const values = [
    stats?.totalSites ?? "--",
    stats?.addedToday ?? "--",
    stats?.brokenToday ?? "--",
    stats?.reviewCount ?? "--"
  ];

  useEffect(() => {
    getUpdates().then((result) => {
      if (!result.configured) return;
      setStats(result.data?.stats || null);
      setLogs(result.data?.logs || []);
    }).catch(() => undefined);
  }, []);

  return (
    <aside className="hero-panel" aria-label="维护状态概览">
      <div className="hero-panel-top">
        <div>
          <p className="meta">Daily Maintenance</p>
          <h2>今日维护</h2>
        </div>
        <span className="status active">公开</span>
      </div>
      <div className="metric-grid">
        {["已收录", "今日新增", "修复失效", "待复查"].map((label, index) => (
          <div className="metric" key={label}><span>{label}</span><strong>{values[index]}</strong></div>
        ))}
      </div>
      <ol className="updates-list">
        {logs.length
          ? logs.slice(0, 4).map((log) => <li key={log.id}>{log.note}</li>)
          : <li>D1 绑定完成后，这里显示每日维护记录。</li>}
      </ol>
    </aside>
  );
}

export function CategoryFilter({ category }: { category: string }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((result) => {
      if (result.configured) setCategories(result.data?.categories || []);
    }).catch(() => setCategories([]));
  }, []);

  return (
    <aside className="filter-panel">
      <a className={`filter-button ${category ? "" : "active"}`} href="/sites/">全部工具</a>
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
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [message, setMessage] = useState("正在读取维护记录。");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpdates().then((result) => {
      if (!result.configured) {
        setMessage("D1 数据库未绑定，维护记录暂不可用。");
        return;
      }
      setLogs(result.data?.logs || []);
      setMessage("暂无维护记录。");
    }).catch(() => {
      setMessage("维护记录读取失败，请稍后重试。");
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingCards label="正在读取维护记录。" />;
  if (!logs.length) return <EmptyState>{message}</EmptyState>;

  return (
    <div className="update-grid">
      {logs.map((log) => (
        <article className="update-card" key={log.id}>
          <p className="meta">{log.action} · {log.createdAt}</p>
          <h3>{log.entityType}</h3>
          <p>{log.note}</p>
        </article>
      ))}
    </div>
  );
}
