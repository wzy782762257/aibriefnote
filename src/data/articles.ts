export type ArticleSummary = {
  href: string;
  meta: string;
  title: string;
  summary: string;
  date: string;
  category: "daily" | "tutorial" | "event" | "guide";
  generated?: boolean;
};

export const articles: ArticleSummary[] = [
  {
    href: "/articles/ai-daily-2026-06-25",
    meta: "Daily AI Brief · 2026-06-25",
    title: "AI 每日简报：2026-06-25",
    summary: "今日收录：Anthropic drops ‘workplace AI agents’ directly inside Slack；How agents are transforming work；OpenAI says ChatGPT Instant now better understands what users actually want",
    date: "2026-06-25",
    category: "daily",
    generated: true
  },
  {
    href: "/articles/n8n-rss-ai-review-workflow",
    meta: "Workflow Tutorial · 2026-06-18",
    title: "用 n8n 搭建 RSS → AI 摘要 → 人工审核工作流",
    summary: "从输入字段、提示词到失败重试，搭建一条不会自动误发布的内容整理流程。",
    date: "2026-06-18",
    category: "tutorial"
  },
  {
    href: "/articles/rag-knowledge-base-quality-checklist",
    meta: "RAG Guide · 2026-06-18",
    title: "RAG 知识库上线前检查：切分、召回、引用与拒答",
    summary: "用一套可执行测试判断知识库问答是否真的可靠，而不只是在演示里看起来聪明。",
    date: "2026-06-18",
    category: "tutorial"
  },
  {
    href: "/articles/ai-content-human-review-checklist",
    meta: "Content Operations · 2026-06-18",
    title: "AI 辅助内容发布前，人工审核到底要检查什么",
    summary: "覆盖事实、来源、结构、版权、时效和用户价值，适合内容站建立发布清单。",
    date: "2026-06-18",
    category: "guide"
  },
  {
    href: "/articles/local-vs-cloud-ai-models",
    meta: "Model Selection · 2026-06-18",
    title: "本地模型还是云端 API：按隐私、成本和维护难度选择",
    summary: "不追模型排行榜，直接从数据敏感度、调用规模、延迟和团队能力做判断。",
    date: "2026-06-18",
    category: "guide"
  },
  {
    href: "/articles/ai-tool-evaluation-checklist",
    meta: "Tool Evaluation · 2026-06-18",
    title: "评估一个 AI 工具值不值得长期使用的 12 项清单",
    summary: "从数据出口、价格变化、可替代性到团队协作，避免只看一次演示就做采购决定。",
    date: "2026-06-18",
    category: "guide"
  },
  {
    href: "/articles/ai-brief-2026-06-15",
    meta: "AI Automation Guide · 2026-06-15",
    title: "AI 自动化工具怎么选：n8n、Dify、Langflow、Open WebUI 入门",
    summary: "按真实任务拆解 AI 自动化工具的选择、第一条工作流和上线前质量检查。",
    date: "2026-06-15",
    category: "guide"
  }
];
