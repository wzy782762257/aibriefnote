import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const sourcesPath = path.join(root, "content", "sources.json");
const articlesDir = path.join(root, "articles");

const config = JSON.parse(await fs.readFile(sourcesPath, "utf8"));
const siteUrl = process.env.SITE_URL || config.site.url;
const siteName = config.site.name;
const slug = `ai-brief-${today}`;

await fs.mkdir(articlesDir, { recursive: true });

function decodeEntities(value) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function stripHtml(value) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripHtml(match[1]) : "";
}

function readAtomLink(block) {
  const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["']/i);
  return hrefMatch ? decodeEntities(hrefMatch[1]) : readTag(block, "link");
}

function parseFeed(xml, feed) {
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  const entryBlocks = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  const blocks = itemBlocks.length ? itemBlocks : entryBlocks;

  return blocks.map((block) => {
    const isAtom = block.startsWith("<entry");
    const title = readTag(block, "title");
    const link = isAtom ? readAtomLink(block) : readTag(block, "link");
    const summary = readTag(block, "description") || readTag(block, "summary") || readTag(block, "content");
    const published = readTag(block, "pubDate") || readTag(block, "published") || readTag(block, "updated");

    return {
      title,
      link,
      source: feed.name,
      category: feed.category,
      summary: summary.slice(0, 280),
      published
    };
  }).filter((item) => item.title && item.link);
}

async function fetchFeed(feed) {
  const response = await fetch(feed.url, {
    headers: {
      "User-Agent": `${siteName}/1.0 (${siteUrl})`
    }
  });

  if (!response.ok) {
    throw new Error(`${feed.name} returned ${response.status}`);
  }

  return parseFeed(await response.text(), feed);
}

async function loadItems() {
  const batches = await Promise.allSettled(config.feeds.map(fetchFeed));
  const failed = batches
    .map((result, index) => ({ result, feed: config.feeds[index] }))
    .filter(({ result }) => result.status === "rejected");

  for (const { result, feed } of failed) {
    console.warn(`Feed failed: ${feed.name} - ${result.reason.message}`);
  }

  const items = batches.flatMap((result) => result.status === "fulfilled" ? result.value : []);

  if (!items.length) {
    throw new Error("No live feed items were fetched. Refusing to publish fallback or seed content.");
  }

  const seen = new Set();
  return items
    .filter((item) => {
      const key = item.link.replace(/#.*$/, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const aTime = Date.parse(a.published || "") || 0;
      const bTime = Date.parse(b.published || "") || 0;
      return bTime - aTime;
    })
    .slice(0, 8);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function articleCard(item) {
  return `            <article class="article-card">
              <p class="meta">${escapeHtml(item.category)} · ${escapeHtml(item.source)}</p>
              <h3><a href="${escapeHtml(item.link)}" rel="nofollow noopener">${escapeHtml(item.title)}</a></h3>
              <p>${escapeHtml(item.summary || "这条更新值得关注，适合纳入今天的 AI 工具与搜索观察。")}</p>
            </article>`;
}

function renderDigest(items) {
  const rows = items.map((item) => `          <article class="source-item">
            <p class="meta">${escapeHtml(item.category)} · ${escapeHtml(item.source)}</p>
            <h2><a href="${escapeHtml(item.link)}" rel="nofollow noopener">${escapeHtml(item.title)}</a></h2>
            <p>${escapeHtml(item.summary || "暂无摘要。")}</p>
            <p><strong>编辑判断：</strong>${escapeHtml(makeTakeaway(item))}</p>
          </article>`).join("\n");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteName} | ${today} AI 工具与搜索简报</title>
    <meta name="description" content="${today} AI 工具、搜索、SEO 与 Web 基础设施简报，自动整理公开来源并附编辑判断。">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="${siteUrl}/articles/${slug}.html">
    <link rel="stylesheet" href="../styles.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.site.publisherId}" crossorigin="anonymous"></script>
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="/" aria-label="${siteName} 首页">
        <span class="brand-mark" aria-hidden="true">A</span>
        <span>${siteName}</span>
      </a>
      <nav class="nav" aria-label="主导航">
        <a href="/#guides">指南</a>
        <a href="/articles/">简报</a>
        <a href="/privacy.html">隐私</a>
      </nav>
    </header>
    <main>
      <article class="deep-dive">
        <div class="section-heading">
          <p class="kicker">Daily Brief</p>
          <h1>${today} AI 工具与搜索简报</h1>
        </div>
        <div class="prose">
          <p>本页由自动化脚本整理公开来源生成，保留原文链接，并加入简短编辑判断。内容用于帮助读者快速发现 AI 工具、搜索和网站运营相关更新。</p>
        </div>
        <div class="ad-inline">
          <span>Advertisement</span>
          <p>广告位由 Google AdSense 自动广告控制。</p>
        </div>
${rows}
      </article>
    </main>
    <footer class="site-footer">
      <p>© 2026 ${siteName}. Automated brief with source links.</p>
      <div>
        <a href="/privacy.html">隐私政策</a>
        <a href="/ads.txt">ads.txt</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </footer>
  </body>
</html>`;
}

function makeTakeaway(item) {
  const title = `${item.title} ${item.summary}`.toLowerCase();
  if (item.category === "SEO" || /\b(search|seo|index|crawl|ranking|schema)\b/.test(title)) {
    return "这类变化会影响内容站被发现和被理解的方式，适合后续转化为 SEO 检查清单。";
  }
  if (item.category === "AI" || /\b(ai|model|chatgpt|openai|agent|agents)\b/.test(title)) {
    return "这类 AI 更新适合沉淀成工具对比、使用教程和价格说明页面。";
  }
  if (item.category === "Web" || /\b(cloudflare|web|dns|waf|cdn|vite|security|infrastructure)\b/.test(title)) {
    return "这类基础设施更新可能影响静态站性能、安全和自动化部署。";
  }
  return "这条信息适合继续观察，并作为后续专题页的素材来源。";
}

async function updateIndex(items) {
  const indexPath = path.join(root, "index.html");
  let html = await fs.readFile(indexPath, "utf8");
  const cards = items.slice(0, 4).map(articleCard).join("\n");
  const latestHref = `articles/${slug}.html`;
  const latestTitle = `${today} AI 工具与搜索简报`;
  const feature = `          <article class="feature-card">
            <div class="article-visual visual-indexing" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <div>
              <p class="meta">每日简报 · 公开来源</p>
              <h3><a href="${latestHref}">${latestTitle}</a></h3>
              <p>自动整理 AI、搜索、SEO 与 Web 基础设施公开来源，并保留原文链接与编辑判断。</p>
            </div>
          </article>`;

  html = html
    .replace(/          <article class="feature-card">[\s\S]*?          <\/article>/, feature)
    .replace(/<div class="article-grid">[\s\S]*?<\/div>\s*<\/div>\s*<aside class="sidebar"/, `<div class="article-grid">\n${cards}\n          </div>\n        </div>\n\n        <aside class="sidebar"`);

  await fs.writeFile(indexPath, html);
}

async function renderArticleIndex() {
  const files = (await fs.readdir(articlesDir)).filter((file) => file.endsWith(".html") && file !== "index.html").sort().reverse();
  const cards = files.map((file) => {
    const date = file.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || file.replace(".html", "");
    const isSourceRecord = file === "ai-brief-2026-06-08.html";
    const title = isSourceRecord ? `${date} 公开来源记录` : `${date} AI 工具与搜索简报`;
    const summary = isSourceRecord ? "记录每日简报使用的公开来源和编辑规则。" : "自动整理 AI、搜索、SEO 与网站基础设施公开来源。";
    return `            <article class="article-card">
              <p class="meta">Daily Brief · ${date}</p>
              <h3><a href="/articles/${file}">${title}</a></h3>
              <p>${summary}</p>
            </article>`;
  }).join("\n");

  const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteName} | 每日简报</title>
    <meta name="description" content="${siteName} 的每日 AI 工具与搜索简报归档。">
    <link rel="canonical" href="${siteUrl}/articles/">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="/" aria-label="${siteName} 首页"><span class="brand-mark" aria-hidden="true">A</span><span>${siteName}</span></a>
      <nav class="nav" aria-label="主导航"><a href="/">首页</a><a href="/privacy.html">隐私</a></nav>
    </header>
    <main>
      <section class="deep-dive">
        <div class="section-heading">
          <p class="kicker">Archive</p>
          <h1>每日简报归档</h1>
        </div>
        <div class="article-grid">
${cards}
        </div>
      </section>
    </main>
  </body>
</html>`;

  await fs.writeFile(path.join(articlesDir, "index.html"), html);
}

async function updateSitemap() {
  const files = (await fs.readdir(articlesDir)).filter((file) => file.endsWith(".html") && file !== "index.html");
  const urls = [
    ["/", "weekly", "1.0"],
    ["/privacy.html", "yearly", "0.3"],
    ["/articles/", "daily", "0.7"],
    ...files.map((file) => [`/articles/${file}`, "weekly", "0.6"])
  ];

  const body = urls.map(([url, freq, priority]) => `  <url>
    <loc>${siteUrl}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n");

  await fs.writeFile(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`);
}

const items = await loadItems();
await fs.writeFile(path.join(articlesDir, `${slug}.html`), renderDigest(items));
await updateIndex(items);
await renderArticleIndex();
await updateSitemap();

console.log(`Generated ${items.length} items for ${slug}`);
