import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const articlesDir = path.join(root, "articles");
const siteName = "AI Brief Note";
const siteUrl = "https://aibriefnote.com";
const publisherId = "ca-pub-6929744420910509";
const updated = "2026-06-15";
const manualGuideDate = "2026-06-15";

const briefs = [
  {
    date: "2026-06-10",
    headline: "AI 编程工作台和 Agent Skill 开始升温",
    summary: "这一天 GitHub 新项目热度集中在 AI 编程工作台、coding-agent skill 和端侧模型资料库，适合整理成开发者工具选题。",
    repos: [
      ["alchaincyf/fanbox", "https://github.com/alchaincyf/fanbox", 525, "vibe coding 驾驶舱，把文件、终端和每次 agent 改动放到一个工作区里。"],
      ["BuilderIO/skills", "https://github.com/BuilderIO/skills", 307, "面向 coding agents 的 Skills 集合，说明 agent 能力正在从提示词走向可复用资产。"],
      ["orange2ai/orange-line-illustration", "https://github.com/orange2ai/orange-line-illustration", 156, "为 AI agents 准备的极简编辑插画 skill，可作为内容站视觉自动化素材。"],
      ["john-rocky/coreai-model-zoo", "https://github.com/john-rocky/coreai-model-zoo", 123, "Apple Core AI 社区模型库，聚焦 iOS/macOS 端侧模型转换和运行经验。"]
    ],
    news: [
      ["OpenAI models and Codex through Oracle Cloud", "https://openai.com/index/openai-on-oracle-cloud", "OpenAI 开放通过 Oracle 云承诺访问模型和 Codex，企业 AI 部署继续向云市场与既有采购合同靠拢。"],
      ["Google AI updates May 2026", "https://blog.google/innovation-and-ai/technology/ai/google-ai-updates-may-2026/", "Google 汇总 5 月 AI 更新，Gemini、AI Studio 与搜索体验仍是后续内容跟踪重点。"]
    ],
    angle: "适合写成“AI 编程工作台怎么选”和“手机/本地 AI 模型如何落地”的工具型文章。"
  },
  {
    date: "2026-06-11",
    headline: "Agent 编排层、企业 AI 和 Codex 场景成为主线",
    summary: "新项目里 agent harness、视频发布 agent、AI 测试 CLI 同时出现；新闻侧 OpenAI 连续发布企业、金融和 Codex 案例。",
    repos: [
      ["omnigent-ai/omnigent", "https://github.com/omnigent-ai/omnigent", 1224, "跨 Claude Code、Codex、Pi 等 agent 的 meta-harness，用策略、沙箱和协作层统一管理 agent。"],
      ["LearnPrompt/luban-skill", "https://github.com/LearnPrompt/luban-skill", 268, "把 agent skill 打磨成可安装、可验证、可传播公共资产的工作坊。"],
      ["taisly/agent", "https://github.com/taisly/agent", 180, "用于让 AI agents 发布视频的 SDK、CLI 和示例。"],
      ["TestSprite/testsprite-cli", "https://github.com/TestSprite/testsprite-cli", 168, "命令行 AI 自动化测试工具，适合开发团队接入 CI 前做冒烟验证。"]
    ],
    news: [
      ["OpenAI to acquire Ona", "https://openai.com/index/openai-to-acquire-ona", "OpenAI 计划收购 Ona，用安全持久的云环境扩展 Codex，强化长任务 agent 工作流。"],
      ["BBVA puts AI at the core of banking with OpenAI", "https://openai.com/index/bbva", "BBVA 将 ChatGPT Enterprise 扩展到 100,000 名员工，说明企业 AI 采用正在从试点进入组织级部署。"],
      ["How an astrophysicist uses Codex", "https://openai.com/index/using-codex-to-simulate-black-holes", "Codex 被用于黑洞模拟代码，给科研和工程自动化案例提供了可信素材。"]
    ],
    angle: "内容重点可放在“agent 不是单个聊天窗口，而是需要权限、沙箱、协作和评测的系统”。"
  },
  {
    date: "2026-06-12",
    headline: "新一轮 AI Agent 项目冲上 GitHub 热榜",
    summary: "6 月 12 日新增项目中，AI 编码风格、文本改写、本地角色扮演和可视化 motion skill 都拿到较高 star。",
    repos: [
      ["DietrichGebert/ponytail", "https://github.com/DietrichGebert/ponytail", 8302, "让 AI agent 像资深工程师一样先少写代码、少做无效改动，是本轮新增项目里最热的仓库。"],
      ["orange2ai/renwei-writing", "https://github.com/orange2ai/renwei-writing", 570, "强调保留作者个人声音的 AI 写作编辑 skill，适合内容站做“人味写作”专题。"],
      ["DanMcInerney/architect-loop", "https://github.com/DanMcInerney/architect-loop", 392, "跨模型 agent loop：Claude 做架构、Codex 做实现、repo 做记忆。"],
      ["nolangz/pixel2motion", "https://github.com/nolangz/pixel2motion", 316, "把 raster logo 转成 SVG 动效、HTML demo 和视频预览的 AI motion skill。"],
      ["newideas99/open-dungeon", "https://github.com/newideas99/open-dungeon", 136, "本地 AI 角色扮演应用，结合 Ollama/Gemma 与 FLUX 生成故事和图像。"]
    ],
    news: [
      ["New OpenAI Academy courses for the next era of work", "https://openai.com/index/academy-courses-applying-ai-at-work", "OpenAI Academy 新课程聚焦工作场景中的 AI 技能、可重复工作流和 agents。"],
      ["How Preply combines AI and human tutors", "https://openai.com/index/preply", "Preply 用 OpenAI 生成课后总结和个性化练习，教育场景继续成为 AI 应用落地样板。"]
    ],
    angle: "这天最适合做“AI agent skill 热榜”：写作、编程、动效、本地应用都可拆成独立教程。"
  },
  {
    date: "2026-06-13",
    headline: "开源 AI、低成本 AI 编程和 agent 风险被集中讨论",
    summary: "GitHub 新项目继续围绕 agent 行为规范和安全；社区新闻则把开源 AI、AI 编程成本和工具商业化风险推到前台。",
    repos: [
      ["mrtooher/fable-mode", "https://github.com/mrtooher/fable-mode", 333, "Claude skill，强调多阶段规划、子 agent 委派和自我验证。"],
      ["SihyeonJeon/why-was-fable-banned", "https://github.com/SihyeonJeon/why-was-fable-banned", 40, "用 spec-first 和 evidence-gated 流程约束 AI coding agents，避免无依据编辑。"],
      ["FighterRepresent/cursor-rules-generator", "https://github.com/FighterRepresent/cursor-rules-generator", 16, "为 Cursor/Next.js/React/FastAPI 等项目生成规则，反映 AI IDE 配置需求。"]
    ],
    news: [
      ["Open source AI must win", "https://opensourceaimustwin.com/?share=v2", "Hacker News 热门讨论，抓取时约 1,569 points，开源 AI 与闭源平台竞争成为高热话题。"],
      ["AI coding at home without going broke", "https://stephen.bochinski.dev/blog/2026/06/13/ai-coding-at-home-without-going-broke/", "个人开发者关注 AI coding 成本控制，抓取时约 333 points。"],
      ["TensorZero archived discussion", "https://github.com/tensorzero/tensorzero", "一个 AI OSS 工具融资后归档引发讨论，抓取时约 274 points，提醒开源商业化和依赖风险。"],
      ["Gemini-SQL2 tops text-to-SQL benchmarks", "https://the-decoder.com/google-researchs-gemini-sql2-tops-text-to-sql-benchmarks-by-a-wide-margin/", "Google Research 的 text-to-SQL 进展适合转化为企业数据分析/BI 自动化选题。"]
    ],
    angle: "适合产出“用 AI 编程如何控成本、控风险、控依赖”的实用指南。"
  },
  {
    date: "2026-06-14",
    headline: "AI Agent 的知识格式、空间记忆和企业合作继续升温",
    summary: "这一天热点从单个工具扩展到 agent 可读知识格式、视频生成空间记忆、企业合作网络和 AI 可信度。",
    repos: [
      ["001TMF/harness-forge", "https://github.com/001TMF/harness-forge", 38, "让 Claude Code 自我演化 meta-harness，围绕 memory、retrieval、context 和 prompt 做循环优化。"],
      ["sholajegede/openloops", "https://github.com/sholajegede/openloops", 16, "本地扫描浏览器历史，聚类用户未完成任务，用 AI 帮你 close the loop。"],
      ["G12789/mcp-quickstart", "https://github.com/G12789/mcp-quickstart", 14, "30 秒生成可测试、可发布的 MCP server，适合接入 AI agent 工具生态。"]
    ],
    news: [
      ["Introducing the OpenAI Partner Network", "https://openai.com/index/introducing-openai-partner-network", "OpenAI 推出 Partner Network，企业 AI 服务、集成和咨询生态会继续扩张。"],
      ["Google Cloud Open Knowledge Format", "https://the-decoder.com/google-clouds-open-knowledge-format-turns-scattered-docs-into-markdown-files-for-ai-agents/", "Google Cloud 的 Open Knowledge Format 把分散文档转成 AI agent 更容易读取的 Markdown 文件。"],
      ["Microsoft Research Mirage", "https://the-decoder.com/microsoft-researchs-mirage-gives-video-generation-a-persistent-spatial-memory-that-doesnt-forget-whats-around-the-corner/", "Mirage 为视频生成提供持久空间记忆，说明生成视频正在补齐一致性和场景理解。"],
      ["AI coding agents exact-line weakness", "https://the-decoder.com/ai-coding-agents-find-the-right-file-but-miss-the-exact-lines-that-matter-study-shows/", "研究指出 AI coding agents 常能找对文件却错过关键行，评测和约束层仍很重要。"]
    ],
    angle: "这天可以写“给 AI agent 喂知识”的内容结构，也可以做 MCP 快速入门。"
  },
  {
    date: "2026-06-15",
    headline: "AI 自动化工具怎么选：n8n、Dify、Langflow、Open WebUI 入门",
    summary: "按真实任务拆解 AI 自动化工具的选择、第一条工作流和上线前质量检查。",
    repos: [
      ["openclaw/openclaw", "https://github.com/openclaw/openclaw", 378721, "个人 AI assistant，高星且近期更新活跃，说明通用个人助手仍是流量入口。"],
      ["NousResearch/hermes-agent", "https://github.com/NousResearch/hermes-agent", 193575, "会随用户成长的 agent 项目，适合观察长期记忆与个人化 agent 方向。"],
      ["n8n-io/n8n", "https://github.com/n8n-io/n8n", 192535, "带原生 AI 能力的工作流自动化平台，连接业务工具和 agent 执行链。"],
      ["langflow-ai/langflow", "https://github.com/langflow-ai/langflow", 149669, "用于构建和部署 AI agents/workflows 的可视化平台。"],
      ["langgenius/dify", "https://github.com/langgenius/dify", 145210, "生产级 agentic workflow 平台，适合低代码 AI 应用落地。"],
      ["google-gemini/gemini-cli", "https://github.com/google-gemini/gemini-cli", 105277, "把 Gemini 带到终端的开源 AI agent，命令行入口竞争继续升温。"]
    ],
    news: [
      ["Not everyone is using AI for everything", "https://gabrielweinberg.com/p/people-are-consuming-ai-like-they", "Hacker News 热门讨论，抓取时约 425 points，提醒内容选题不要假设所有用户都在高频使用 AI。"],
      ["Police officer investigated for using AI to create evidence", "https://news.sky.com/story/derbyshire-police-officer-investigated-for-using-ai-to-create-evidence-in-multiple-cases-13553661", "AI 生成证据争议进入公共治理语境，适合写 AI 风险和合规提醒。"],
      ["KPMG fabricated AI case studies", "https://the-decoder.com/kpmg-fabricated-ai-case-studies-in-a-report-designed-to-sell-clients-on-ai-adoption/", "AI 营销材料真实性被质疑，内容站应坚持来源、链接和事实边界。"]
    ],
    angle: "今天的重点不是追单点模型，而是把高星平台拆成可执行工作流：自动化、agent 编排、本地 UI、终端助手。"
  }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function articleUrl(slugOrFile) {
  return `/articles/${slugOrFile.replace(/\.html$/, "")}`;
}

function isManualGuide(brief) {
  return brief.date === manualGuideDate;
}

function articleMeta(brief) {
  return isManualGuide(brief) ? `AI Automation Guide · ${brief.date}` : `AI GitHub Radar · ${brief.date}`;
}

function articleTitle(brief) {
  return isManualGuide(brief) ? brief.headline : `${brief.date} AI GitHub 热榜与新闻简报`;
}

function articleSummary(brief) {
  return isManualGuide(brief) ? brief.summary : brief.headline;
}

function renderLinkItem([title, href, detail]) {
  return `          <article class="source-item">
            <p class="meta">AI News · Verified Source</p>
            <h2><a href="${escapeHtml(href)}" rel="nofollow noopener">${escapeHtml(title)}</a></h2>
            <p>${escapeHtml(detail)}</p>
          </article>`;
}

function renderRepoItem([name, href, stars, detail]) {
  return `          <article class="source-item">
            <p class="meta">GitHub · ${escapeHtml(String(stars))} stars when collected</p>
            <h2><a href="${escapeHtml(href)}" rel="nofollow noopener">${escapeHtml(name)}</a></h2>
            <p>${escapeHtml(detail)}</p>
          </article>`;
}

function renderBrief(brief) {
  const slug = `ai-brief-${brief.date}`;
  const repos = brief.repos.map(renderRepoItem).join("\n");
  const news = brief.news.map(renderLinkItem).join("\n");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteName} | ${brief.date} AI GitHub 热榜与新闻简报</title>
    <meta name="description" content="${brief.date} AI GitHub 高星项目、agent 工具和近日日度 AI 新闻整理，附来源链接和编辑判断。">
    <meta name="robots" content="noindex,follow">
    <link rel="canonical" href="${siteUrl}${articleUrl(slug)}">
    <link rel="stylesheet" href="../styles.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>
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
        <a href="/about">关于</a>
        <a href="/contact">联系</a>
        <a href="/privacy">隐私</a>
      </nav>
    </header>
    <main>
      <article class="deep-dive">
        <div class="section-heading">
          <p class="kicker">AI GitHub Radar</p>
          <h1>${brief.date} AI GitHub 热榜与新闻简报</h1>
        </div>
        <div class="prose">
          <p><strong>今日主线：</strong>${escapeHtml(brief.headline)}</p>
          <p>${escapeHtml(brief.summary)}</p>
          <p><strong>编辑判断：</strong>${escapeHtml(brief.angle)}</p>
          <p>GitHub star 数为抓取时快照，后续可能变化；新闻条目优先保留官方、原文或社区讨论链接，便于回到来源核对。</p>
        </div>
        <div class="section-heading">
          <p class="kicker">GitHub</p>
          <h2>高热 AI 项目</h2>
        </div>
${repos}
        <div class="section-heading">
          <p class="kicker">News</p>
          <h2>近日日度 AI 新闻</h2>
        </div>
${news}
      </article>
    </main>
    <footer class="site-footer">
      <p>© 2026 ${siteName}. 内容整理自公开来源，并附原文链接与编辑判断。</p>
      <div>
        <a href="/about">关于</a>
        <a href="/contact">联系</a>
        <a href="/privacy">隐私政策</a>
        <a href="/ads.txt">ads.txt</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </footer>
  </body>
</html>`;
}

function articleCard(brief) {
  const slug = `ai-brief-${brief.date}`;
  return `            <article class="article-card">
              <p class="meta">${articleMeta(brief)}</p>
              <h3><a href="${articleUrl(slug)}">${escapeHtml(articleTitle(brief))}</a></h3>
              <p>${escapeHtml(articleSummary(brief))}</p>
            </article>`;
}

function homepageCard([name, href, stars, detail]) {
  return `            <article class="article-card">
              <p class="meta">GitHub · ${escapeHtml(String(stars))} stars</p>
              <h3><a href="${escapeHtml(href)}" rel="nofollow noopener">${escapeHtml(name)}</a></h3>
              <p>${escapeHtml(detail)}</p>
            </article>`;
}

function homepageGuideCards() {
  const cards = [
    ["Workflow", "n8n 适合做什么", "把 RSS、表格、Webhook 和 AI 节点串成可审核的内容流程。"],
    ["AI App", "Dify 适合做什么", "把知识库、提示词、日志和发布入口组合成可试用的 AI 应用。"],
    ["RAG Demo", "Langflow 适合做什么", "先用可视化流程验证检索、提示词和模型组合是否跑得通。"],
    ["Local AI", "Open WebUI 适合做什么", "给本地模型和云端模型一个统一入口，方便团队内部比较效果。"]
  ];

  return cards.map(([meta, title, body]) => `            <article class="article-card">
              <p class="meta">${meta}</p>
              <h3><a href="/articles/ai-brief-2026-06-15">${title}</a></h3>
              <p>${body}</p>
            </article>`).join("\n");
}

async function updateHome(latest) {
  const indexPath = path.join(root, "index.html");
  let html = await fs.readFile(indexPath, "utf8");
  const latestHref = articleUrl(`ai-brief-${latest.date}`);
  const latestMeta = isManualGuide(latest) ? "AI Automation Guide" : "AI GitHub Radar · 热点补刊";
  const latestTitle = articleTitle(latest);
  const latestDescription = isManualGuide(latest)
    ? "从真实任务出发，说明什么时候用 workflow、什么时候做 AI 应用、什么时候只需要本地模型界面。"
    : `${escapeHtml(latest.headline)}。重点跟踪高星 AI 仓库、agent 工具和近日日度 AI 新闻。`;
  const feature = `          <article class="feature-card">
            <div class="article-visual visual-indexing" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <div>
              <p class="meta">${latestMeta}</p>
              <h3><a href="${latestHref}">${escapeHtml(latestTitle)}</a></h3>
              <p>${latestDescription}</p>
            </div>
          </article>`;
  const cards = isManualGuide(latest) ? homepageGuideCards() : latest.repos.slice(0, 4).map(homepageCard).join("\n");

  html = html
    .replace(/          <article class="feature-card">[\s\S]*?          <\/article>/, feature)
    .replace(/<div class="article-grid">[\s\S]*?<\/div>\s*<\/div>\s*<aside class="sidebar"/, `<div class="article-grid">\n${cards}\n          </div>\n        </div>\n\n        <aside class="sidebar"`);

  await fs.writeFile(indexPath, html);
}

async function updateArticleIndex() {
  const existingFiles = (await fs.readdir(articlesDir))
    .filter((file) => file.endsWith(".html") && file !== "index.html")
    .sort()
    .reverse();
  const curatedDates = new Set(briefs.map((brief) => brief.date));
  const indexableExistingFiles = [];

  for (const file of existingFiles) {
    const html = await fs.readFile(path.join(articlesDir, file), "utf8");
    if (!html.includes('content="noindex,follow"')) {
      indexableExistingFiles.push(file);
    }
  }

  const cards = [
    ...briefs.slice().reverse().filter(isManualGuide).map(articleCard),
    ...indexableExistingFiles
      .filter((file) => !curatedDates.has(file.match(/(\d{4}-\d{2}-\d{2})/)?.[1]))
      .map((file) => {
        const date = file.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || file.replace(".html", "");
        const title = file === "ai-brief-2026-06-08.html" ? `${date} 公开来源记录` : `${date} AI 工具与搜索简报`;
        return `            <article class="article-card">
              <p class="meta">Daily Brief · ${date}</p>
              <h3><a href="${articleUrl(file)}">${title}</a></h3>
              <p>已完成整理和人工筛选的教程内容。</p>
            </article>`;
      })
  ].join("\n");

  const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteName} | 教程归档</title>
    <meta name="description" content="${siteName} 的 AI 工具教程、自动化工作流和内容运营指南归档。">
    <link rel="canonical" href="${siteUrl}/articles/">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="/" aria-label="${siteName} 首页"><span class="brand-mark" aria-hidden="true">A</span><span>${siteName}</span></a>
      <nav class="nav" aria-label="主导航"><a href="/">首页</a><a href="/about">关于</a><a href="/contact">联系</a><a href="/privacy">隐私</a></nav>
    </header>
    <main>
      <section class="deep-dive">
        <div class="section-heading">
          <p class="kicker">Archive</p>
          <h1>教程归档</h1>
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
  const files = (await fs.readdir(articlesDir))
    .filter((file) => file.endsWith(".html") && file !== "index.html")
    .sort();
  const indexableFiles = [];

  for (const file of files) {
    const html = await fs.readFile(path.join(articlesDir, file), "utf8");
    if (!html.includes('content="noindex,follow"')) {
      indexableFiles.push(file);
    }
  }

  const urls = [
    ["/", "weekly", "1.0"],
    ["/about", "yearly", "0.4"],
    ["/contact", "yearly", "0.4"],
    ["/privacy", "yearly", "0.3"],
    ["/articles/", "daily", "0.7"],
    ...indexableFiles.map((file) => [articleUrl(file.replace(/\.html$/, "")), "weekly", "0.6"])
  ];
  const body = urls.map(([url, freq, priority]) => `  <url>
    <loc>${siteUrl}${url}</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n");

  await fs.writeFile(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`);
}

await fs.mkdir(articlesDir, { recursive: true });
for (const brief of briefs) {
  if (isManualGuide(brief)) continue;
  await fs.writeFile(path.join(articlesDir, `ai-brief-${brief.date}.html`), renderBrief(brief));
}
await updateHome(briefs.at(-1));
await updateArticleIndex();
await updateSitemap();

console.log(`Generated ${briefs.length} curated AI GitHub briefs through ${updated}`);
