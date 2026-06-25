import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://aibriefnote.com";
const maxItems = Number(process.env.AI_BRIEF_MAX_ITEMS || 24);
const maxAgeDays = Number(process.env.AI_BRIEF_MAX_AGE_DAYS || 45);
const today = process.env.AI_BRIEF_DATE || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date());

const slug = `ai-daily-${today}`;
const articlePath = resolve(root, "articles", `${slug}.html`);
const sourcesPath = resolve(root, "content", "sources.json");
const articlesDataPath = resolve(root, "src", "data", "articles.ts");
const sitemapPath = resolve(root, "sitemap.xml");
const publicSitemapPath = resolve(root, "public", "sitemap.xml");
const fallbackIndexPath = resolve(root, "articles", "index.html");

const aiTerms = [
  "ai", "artificial intelligence", "agent", "agents", "llm", "model", "openai",
  "anthropic", "gemini", "chatgpt", "claude", "copilot", "rag", "生成式",
  "人工智能", "大模型", "智能体", "多模态", "开源模型", "推理模型"
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function decodeEntities(value = "") {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " "
  };

  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (_, key) => named[key] || `&${key};`);
}

function stripHtml(value = "") {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textBetween(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripHtml(match[1]) : "";
}

function attr(block, tag, name) {
  const match = block.match(new RegExp(`<${tag}[^>]*\\s${name}=["']([^"']+)["'][^>]*>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function firstUrl(block) {
  return textBetween(block, "link") || attr(block, "link", "href") || textBetween(block, "guid");
}

function blocks(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "gi"))]
    .map((match) => match[0]);
}

function parseFeed(xml, source) {
  const rawItems = blocks(xml, "item").length ? blocks(xml, "item") : blocks(xml, "entry");

  return rawItems.map((block) => {
    const title = textBetween(block, "title");
    const summary = textBetween(block, "description") || textBetween(block, "summary") || textBetween(block, "content");
    const published = textBetween(block, "pubDate") || textBetween(block, "published") || textBetween(block, "updated");

    return {
      title,
      summary: summary.slice(0, 260),
      url: firstUrl(block),
      source: source.name,
      sourceCategory: source.category || "AI动态",
      publishedAt: published ? new Date(published) : new Date(0)
    };
  }).filter((item) => item.title && item.url);
}

function scoreItem(item) {
  const haystack = `${item.title} ${item.summary}`.toLowerCase();
  const termScore = aiTerms.reduce((score, term) => score + (haystack.includes(term.toLowerCase()) ? 1 : 0), 0);
  const recencyScore = Number.isFinite(item.publishedAt.getTime())
    ? Math.max(0, 14 - Math.floor((Date.now() - item.publishedAt.getTime()) / 86_400_000))
    : 0;

  return termScore * 10 + recencyScore;
}

function isFresh(item) {
  if (!Number.isFinite(item.publishedAt.getTime()) || item.publishedAt.getTime() === 0) return true;
  return Date.now() - item.publishedAt.getTime() <= maxAgeDays * 86_400_000;
}

function readableDate(value) {
  if (!Number.isFinite(value.getTime()) || value.getTime() === 0) return "来源未标注日期";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(value);
}

function getTakeaway(item) {
  const text = item.summary || item.title;
  if (!text) return "建议打开来源核对细节，再决定是否整理成教程或工具卡片。";
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 140 ? `${cleaned.slice(0, 138)}...` : cleaned;
}

function articleHtml(items) {
  const title = `AI 每日简报：${today}`;
  const description = `AI Brief Note 自动收录 ${today} 的 AI 工具、模型、产品和行业动态，保留来源链接并给出人工审核要点。`;

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AI Brief Note | ${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="google-adsense-account" content="ca-pub-6929744420910509">
    <link rel="canonical" href="${siteUrl}/articles/${slug}">
    <link rel="stylesheet" href="/src/styles/theme.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6929744420910509" crossorigin="anonymous"></script>
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="/" aria-label="AI Brief Note 首页">
        <span class="brand-mark" aria-hidden="true">A</span>
        <span>AI Brief Note</span>
      </a>
      <form class="header-search" action="/sites/" role="search">
        <input name="q" type="search" placeholder="搜索 AI 工具、场景或分类" aria-label="搜索 AI 工具、场景或分类" autocomplete="off">
        <button type="submit">搜索</button>
      </form>
      <nav class="nav" aria-label="主导航">
        <a href="/">首页</a>
        <a href="/sites/">AI站点导航</a>
        <a href="/articles/">文章</a>
        <a href="/updates/">每日新增</a>
        <button class="language-toggle" type="button" onclick="localStorage.setItem(&#39;aibriefnote-locale&#39;, localStorage.getItem(&#39;aibriefnote-locale&#39;) === &#39;en&#39; ? &#39;zh&#39; : &#39;en&#39;); location.href=&#39;/&#39;">EN / 中文</button>
      </nav>
    </header>
    <main>
      <article class="deep-dive guide-page">
        <div class="section-heading">
          <p class="kicker">Daily AI Brief</p>
          <h1>${escapeHtml(title)}</h1>
        </div>
        <div class="guide-summary">
          <p><strong>收录方式：</strong>脚本每天读取公开 RSS 来源，筛选 AI 相关条目，只保留标题、摘要、来源和原文链接。</p>
          <p><strong>发布原则：</strong>这里是每日线索池，不复制全文。真正教程仍需要人工核对、改写和补充实操步骤。</p>
        </div>
        <div class="prose">
          <h2>今日重点</h2>
          <ol class="steps-list">
            ${items.map((item) => `<li><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(getTakeaway(item))}</li>`).join("\n            ")}
          </ol>

          <h2>来源条目</h2>
          ${items.map((item) => `<section class="tool-guide">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(getTakeaway(item))}</p>
            <p><strong>来源：</strong>${escapeHtml(item.source)} · ${escapeHtml(item.sourceCategory)} · ${escapeHtml(readableDate(item.publishedAt))}</p>
            <p><a class="resource-link" href="${escapeHtml(item.url)}" target="_blank" rel="nofollow noopener noreferrer">打开原文</a></p>
          </section>`).join("\n\n          ")}

          <h2>人工复查清单</h2>
          <ul>
            <li>核对产品名称、公司名称、发布日期和官方链接。</li>
            <li>判断是否值得整理成独立教程、工具卡片或只保留为线索。</li>
            <li>避免使用未证实的融资、排行榜、性能和收益表述。</li>
            <li>如果要写成教程，补充真实使用步骤、限制条件和替代方案。</li>
          </ul>
        </div>
      </article>
    </main>
    <footer class="site-footer">
      <p>© 2026 AI Brief Note. 内容面向真实使用场景整理，外部链接仅作为资料来源。</p>
      <div>
        <a href="/about">关于</a>
        <a href="/contact">联系</a>
        <a href="/privacy">隐私政策</a>
        <a href="/ads.txt">ads.txt</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </footer>
  </body>
</html>
`;
}

function articleSummary(items) {
  const highlights = items.slice(0, 3).map((item) => item.title).join("；");
  return {
    href: `/articles/${slug}`,
    meta: `Daily AI Brief · ${today}`,
    title: `AI 每日简报：${today}`,
    summary: highlights ? `今日收录：${highlights}` : "自动整理公开来源中的 AI 工具、模型和行业动态。",
    date: today,
    category: "daily",
    generated: true
  };
}

async function writeArticlesData(newArticle) {
  const existing = await readFile(articlesDataPath, "utf8");
  const match = existing.match(/export const articles: ArticleSummary\[] = ([\s\S]*?);\s*$/);
  if (!match) throw new Error("Could not locate articles array in src/data/articles.ts");

  const current = Function(`"use strict"; return (${match[1]});`)();
  const next = [newArticle, ...current.filter((item) => item.href !== newArticle.href)]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const serialized = JSON.stringify(next, null, 2)
    .replace(/"([^"]+)":/g, "$1:");

  await writeFile(articlesDataPath, `${existing.slice(0, match.index)}export const articles: ArticleSummary[] = ${serialized};\n`);
}

function sitemapEntry(article) {
  return `  <url>
    <loc>${siteUrl}${article.href}</loc>
    <lastmod>${article.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
}

async function updateSitemap(article) {
  const sitemap = await readFile(sitemapPath, "utf8");
  const withoutExisting = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${siteUrl}${article.href}<\\/loc>[\\s\\S]*?<\\/url>`, "g"), "");
  const bumped = withoutExisting
    .replace(/<loc>https:\/\/aibriefnote\.com\/articles\/<\/loc>\s*<lastmod>[^<]+<\/lastmod>/, `<loc>${siteUrl}/articles/</loc>\n    <lastmod>${article.date}</lastmod>`)
    .replace("</urlset>", `${sitemapEntry(article)}\n</urlset>`);

  await writeFile(sitemapPath, bumped);
  await writeFile(publicSitemapPath, bumped);
}

async function updateFallbackIndex(article) {
  if (!existsSync(fallbackIndexPath)) return;
  const html = await readFile(fallbackIndexPath, "utf8");
  if (html.includes(article.href)) return;

  const item = `          <li><a href="${article.href}">${escapeHtml(article.title)}</a></li>`;
  const next = html.replace(/<ul class="crawler-fallback-list">\n/, `<ul class="crawler-fallback-list">\n${item}\n`);
  await writeFile(fallbackIndexPath, next);
}

async function fetchSource(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(source.url, {
      headers: {
        accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "user-agent": "AI Brief Note content collector (+https://aibriefnote.com)"
      },
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return parseFeed(await response.text(), source);
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const config = JSON.parse(await readFile(sourcesPath, "utf8"));
  const sources = config.sources || [];
  if (!sources.length) throw new Error("No RSS sources configured in content/sources.json");

  const batches = await Promise.allSettled(sources.map(fetchSource));
  const failures = batches
    .map((result, index) => result.status === "rejected" ? `${sources[index].name}: ${result.reason.message}` : "")
    .filter(Boolean);
  const items = batches
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .filter(isFresh)
    .map((item) => ({ ...item, score: scoreItem(item) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.publishedAt - a.publishedAt);

  const unique = [];
  const seen = new Set();
  for (const item of items) {
    const key = item.url.replace(/[#?].*$/, "");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
    if (unique.length >= maxItems) break;
  }

  if (!unique.length) {
    throw new Error(`No AI items collected. Failures: ${failures.join("; ") || "none"}`);
  }

  await mkdir(dirname(articlePath), { recursive: true });
  await writeFile(articlePath, articleHtml(unique));

  const summary = articleSummary(unique);
  await writeArticlesData(summary);
  await updateSitemap(summary);
  await updateFallbackIndex(summary);

  console.log(`Generated ${summary.href} with ${unique.length} sourced AI items.`);
  if (failures.length) {
    console.log(`Source warnings: ${failures.join("; ")}`);
  }
}

await main();
