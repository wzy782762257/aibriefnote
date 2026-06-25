import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "zh" | "en";

const dictionaries = {
  zh: {
    navHome: "首页",
    navSites: "AI站点导航",
    navArticles: "文章",
    navUpdates: "每日新增",
    searchPlaceholder: "搜索 AI 工具、场景或分类",
    search: "搜索",
    switchLanguage: "切换语言",
    footer: "AI 工具导航和热门 AI 文章。",
    footerAbout: "关于",
    footerContact: "联系",
    footerPrivacy: "隐私政策",
    homeKicker: "AI Tools / Articles / Daily Picks",
    homeTitle: "发现、筛选并上手真正有用的 AI 工具",
    homeLead: "每天收集热门 AI 工具、使用教程和行业事件，按场景、来源和实用价值整理。",
    browseSites: "浏览AI站点导航",
    viewArticles: "查看文章",
    directoryKicker: "Directory",
    popularSites: "热门 AI 站点",
    popularSitesBody: "按实用价值、工具类型和可访问状态整理高频 AI 工具入口。",
    viewAll: "查看全部",
    sitesKicker: "AI Site Directory",
    sitesTitle: "AI 站点导航",
    sitesBody: "这里收录和维护可用的 AI 工具入口。每个站点都按场景、费用、登录要求和访问状态整理。",
    sitesSearchPlaceholder: "搜索工具、场景或分类",
    filter: "筛选",
    allTools: "全部工具",
    workflowsTitle: "工作流模板整理中",
    updatesKicker: "Daily Additions",
    updatesTitle: "每天新增的内容",
    updatesBody: "记录每天新收录的热门 AI 文章、使用教程和重要事件，方便回看新增内容。",
    articlesKicker: "Articles",
    articlesTitle: "文章",
    articlesBody: "收集每天各种热门的 AI 使用教程、工具实践和行业事件。",
    readArticle: "阅读文章",
    hotKicker: "Trending Now",
    hotTitle: "今日热门",
    hotBadge: "更新中",
    hotArticles: "热门文章",
    todayAdded: "今日新增",
    tutorials: "使用教程",
    events: "热门事件",
    collected: "已收集",
    viewCategory: "查看分类",
    allArticles: "全部文章",
    hotFallback: "每日内容生成后，这里展示可跳转的热门分类。",
    loadingSites: "正在读取 AI 站点数据库。",
    dbMissingSites: "D1 数据库未绑定。配置 DB binding 并导入 migrations/ 与 seeds/ 后，这里会显示 AI 站点导航。",
    noSites: "没有找到匹配的 AI 站点。",
    sitesFailed: "AI 站点读取失败，请稍后重试。",
    loadingUpdates: "正在读取每天新增内容。",
    noUpdates: "暂无新增内容。",
    available: "可访问",
    review: "待复查",
    loginRequired: "需登录",
    visitSite: "访问站点"
  },
  en: {
    navHome: "Home",
    navSites: "AI Directory",
    navArticles: "Articles",
    navUpdates: "Daily Adds",
    searchPlaceholder: "Search AI tools, use cases, or categories",
    search: "Search",
    switchLanguage: "Switch language",
    footer: "AI tool directory and trending AI articles.",
    footerAbout: "About",
    footerContact: "Contact",
    footerPrivacy: "Privacy",
    homeKicker: "AI Tools / Articles / Daily Picks",
    homeTitle: "Find, filter, and use genuinely useful AI tools",
    homeLead: "Daily picks of popular AI tools, tutorials, and industry events, organized by use case, source, and practical value.",
    browseSites: "Browse AI directory",
    viewArticles: "View articles",
    directoryKicker: "Directory",
    popularSites: "Popular AI Sites",
    popularSitesBody: "High-frequency AI tools organized by practical value, category, and access status.",
    viewAll: "View all",
    sitesKicker: "AI Site Directory",
    sitesTitle: "AI Site Directory",
    sitesBody: "A maintained directory of usable AI tools, organized by scenario, pricing, login requirements, and access status.",
    sitesSearchPlaceholder: "Search tools, use cases, or categories",
    filter: "Filter",
    allTools: "All tools",
    workflowsTitle: "Workflow templates are being curated",
    updatesKicker: "Daily Additions",
    updatesTitle: "Daily New Content",
    updatesBody: "Newly collected AI articles, practical tutorials, and important events for each day.",
    articlesKicker: "Articles",
    articlesTitle: "Articles",
    articlesBody: "Daily popular AI tutorials, tool practices, and important AI events.",
    readArticle: "Read article",
    hotKicker: "Trending Now",
    hotTitle: "Trending Today",
    hotBadge: "Live",
    hotArticles: "Hot articles",
    todayAdded: "Added today",
    tutorials: "Tutorials",
    events: "Hot events",
    collected: "Collected",
    viewCategory: "View category",
    allArticles: "All articles",
    hotFallback: "After daily content generation, this panel shows clickable trending categories.",
    loadingSites: "Reading AI site database.",
    dbMissingSites: "D1 database is not bound. Configure DB binding and import migrations/seeds to show the AI directory.",
    noSites: "No matching AI sites found.",
    sitesFailed: "AI sites failed to load. Please try again later.",
    loadingUpdates: "Loading daily additions.",
    noUpdates: "No daily additions yet.",
    available: "Available",
    review: "Review",
    loginRequired: "Login",
    visitSite: "Visit site"
  }
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof dictionaries.zh;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function browserLocale(): Locale {
  if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("zh")) {
    return "zh";
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("aibriefnote-locale");
    return saved === "zh" || saved === "en" ? saved : browserLocale();
  });

  const setLocale = (next: Locale) => {
    localStorage.setItem("aibriefnote-locale", next);
    setLocaleState(next);
  };

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: dictionaries[locale]
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
