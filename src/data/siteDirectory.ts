import type { AiSite, Category } from "../lib/api";

const categoriesBase = [
  { id: 1, name: "AI聊天", slug: "ai-chat", description: "聊天、问答和资料整理", sortOrder: 10 },
  { id: 2, name: "AI编程", slug: "ai-coding", description: "代码生成、解释和协作", sortOrder: 20 },
  { id: 3, name: "图片生成", slug: "image-generation", description: "图像生成和视觉素材", sortOrder: 30 },
  { id: 4, name: "视频生成", slug: "video-generation", description: "视频生成和编辑", sortOrder: 40 },
  { id: 5, name: "自动化Agent", slug: "automation-agent", description: "工作流、agent 和自动化", sortOrder: 50 },
  { id: 6, name: "RAG知识库", slug: "rag-knowledge-base", description: "知识库问答和检索增强", sortOrder: 60 },
  { id: 7, name: "开源自托管", slug: "open-source-self-hosted", description: "开源模型和自部署工具", sortOrder: 80 }
];

export const fallbackSites: AiSite[] = [
  {
    id: 1,
    name: "ChatGPT",
    slug: "chatgpt",
    url: "https://chatgpt.com",
    description: "OpenAI 的通用 AI 助手，适合问答、写作、资料整理和轻量工作流。",
    category: { name: "AI聊天", slug: "ai-chat" },
    pricingType: "免费 + 付费",
    isOpenSource: false,
    loginRequired: true,
    status: "active",
    featured: true,
    tags: ["聊天"]
  },
  {
    id: 2,
    name: "Claude",
    slug: "claude",
    url: "https://claude.ai",
    description: "Anthropic 的 AI 助手，适合长文档阅读、写作和代码解释。",
    category: { name: "AI聊天", slug: "ai-chat" },
    pricingType: "免费 + 付费",
    isOpenSource: false,
    loginRequired: true,
    status: "active",
    featured: true,
    tags: ["聊天"]
  },
  {
    id: 3,
    name: "Dify",
    slug: "dify",
    url: "https://dify.ai",
    description: "用于构建 AI 应用、知识库问答和 agent 工作流的平台。",
    category: { name: "自动化Agent", slug: "automation-agent" },
    pricingType: "免费 + 付费",
    isOpenSource: true,
    loginRequired: false,
    status: "active",
    featured: true,
    tags: ["工作流", "知识库"]
  },
  {
    id: 4,
    name: "n8n",
    slug: "n8n",
    url: "https://n8n.io",
    description: "可视化工作流自动化平台，适合连接 API、表格、Webhook 和 AI 节点。",
    category: { name: "自动化Agent", slug: "automation-agent" },
    pricingType: "免费 + 付费",
    isOpenSource: true,
    loginRequired: false,
    status: "active",
    featured: true,
    tags: ["工作流", "知识库"]
  },
  {
    id: 5,
    name: "Open WebUI",
    slug: "open-webui",
    url: "https://openwebui.com",
    description: "本地和云端模型的统一 Web 界面，适合团队内部试用和提示词管理。",
    category: { name: "开源自托管", slug: "open-source-self-hosted" },
    pricingType: "开源",
    isOpenSource: true,
    loginRequired: false,
    status: "active",
    featured: true,
    tags: ["自托管", "聊天"]
  },
  {
    id: 6,
    name: "Midjourney",
    slug: "midjourney",
    url: "https://www.midjourney.com",
    description: "高质量图片生成工具，适合视觉概念、海报和素材探索。",
    category: { name: "图片生成", slug: "image-generation" },
    pricingType: "付费",
    isOpenSource: false,
    loginRequired: true,
    status: "active",
    featured: true,
    tags: ["图片"]
  },
  {
    id: 7,
    name: "Perplexity",
    slug: "perplexity",
    url: "https://www.perplexity.ai",
    description: "面向检索和问答的 AI 搜索工具，适合快速查资料和追踪来源。",
    category: { name: "AI聊天", slug: "ai-chat" },
    pricingType: "免费 + 付费",
    isOpenSource: false,
    loginRequired: true,
    status: "active",
    featured: false,
    tags: ["聊天"]
  },
  {
    id: 8,
    name: "Runway",
    slug: "runway",
    url: "https://runwayml.com",
    description: "AI 视频生成和编辑平台，适合短视频、动态素材和创意实验。",
    category: { name: "视频生成", slug: "video-generation" },
    pricingType: "免费 + 付费",
    isOpenSource: false,
    loginRequired: true,
    status: "review",
    featured: false,
    tags: ["视频"]
  }
];

export const fallbackCategories: Category[] = categoriesBase.map((category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  siteCount: fallbackSites.filter((site) => site.category.slug === category.slug).length
}));
