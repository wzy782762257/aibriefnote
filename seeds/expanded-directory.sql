INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES
  ('AI技能', 'ai-skills', 70),
  ('模型与部署', 'model-platforms', 75),
  ('音频语音', 'audio-voice', 76);

INSERT OR IGNORE INTO tags (name, slug) VALUES
  ('多模态', 'multimodal'),
  ('搜索', 'search'),
  ('IDE', 'ide'),
  ('Stable Diffusion', 'stable-diffusion'),
  ('ComfyUI', 'comfyui'),
  ('LoRA', 'lora'),
  ('模型社区', 'model-community'),
  ('本地模型', 'local-model'),
  ('推理 API', 'inference-api'),
  ('提示词', 'prompt'),
  ('技能', 'skill'),
  ('语音', 'voice'),
  ('音乐', 'music');

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Gemini', 'gemini', 'https://gemini.google.com', 'Google 的 AI 助手和模型入口，适合搜索增强问答、文档处理和多模态任务。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-chat';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Poe', 'poe', 'https://poe.com', 'Quora 推出的多模型聊天平台，可以集中使用多种 AI bot 和自定义机器人。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-chat';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'NotebookLM', 'notebooklm', 'https://notebooklm.google.com', 'Google 的资料阅读和笔记助手，适合基于上传材料进行问答、摘要和学习整理。', id, '免费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'rag-knowledge-base';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Cursor', 'cursor', 'https://www.cursor.com', '面向开发者的 AI 代码编辑器，适合代码理解、修改、重构和多文件协作。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-coding';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Windsurf', 'windsurf', 'https://windsurf.com', 'Codeium 推出的 AI 编程环境，强调 agent 式代码修改和项目级上下文理解。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-coding';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'GitHub Copilot', 'github-copilot', 'https://github.com/features/copilot', 'GitHub 的 AI 编程助手，集成到主流编辑器和 GitHub 工作流中。', id, '付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-coding';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'v0', 'v0', 'https://v0.dev', 'Vercel 的 AI UI 生成工具，适合快速生成 React 页面、组件和前端原型。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-coding';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Lovable', 'lovable', 'https://lovable.dev', '用自然语言生成 Web 应用的 AI 开发工具，适合快速搭建产品原型和小型应用。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-coding';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'ComfyUI', 'comfyui', 'https://github.com/comfyanonymous/ComfyUI', '经典的节点式 Stable Diffusion 工作流工具，适合图片生成、ControlNet、批处理和高级可视化流程。', id, '开源', 1, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'image-generation';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Stable Diffusion WebUI', 'stable-diffusion-webui', 'https://github.com/AUTOMATIC1111/stable-diffusion-webui', 'AUTOMATIC1111 的经典 Stable Diffusion Web 界面，适合本地图片生成、插件和模型实验。', id, '开源', 1, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'image-generation';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Civitai', 'civitai', 'https://civitai.com', 'AI 图片模型和 LoRA 社区，适合查找 Stable Diffusion 模型、提示词和示例图。', id, '免费 + 付费', 0, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'image-generation';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Krea', 'krea', 'https://www.krea.ai', '面向设计和创意工作流的 AI 图像生成、实时绘制和增强工具。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'image-generation';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Leonardo AI', 'leonardo-ai', 'https://leonardo.ai', 'AI 图像生成和素材平台，常用于游戏资产、概念图、产品视觉和营销素材。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'image-generation';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Pika', 'pika', 'https://pika.art', 'AI 视频生成工具，适合从文本或图片生成短视频和创意镜头。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'video-generation';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Luma Dream Machine', 'luma-dream-machine', 'https://lumalabs.ai/dream-machine', 'Luma 的 AI 视频生成工具，适合生成动态镜头、产品短片和视觉探索。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'video-generation';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Coze', 'coze', 'https://www.coze.com', '字节跳动推出的 AI bot 和 agent 构建平台，适合配置插件、知识库和自动化对话流程。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'automation-agent';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Flowise', 'flowise', 'https://flowiseai.com', '开源低代码 LLM 应用构建工具，适合可视化搭建 LangChain 流程、聊天机器人和 RAG 应用。', id, '开源', 1, 0, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'automation-agent';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Langflow', 'langflow', 'https://www.langflow.org', '可视化 LLM 流程和 agent 编排工具，适合快速验证 RAG、工具调用和多模型流程。', id, '开源 + 云服务', 1, 0, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'automation-agent';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'LangChain', 'langchain', 'https://www.langchain.com', 'LLM 应用开发框架和生态，适合构建 agent、RAG、工具调用和复杂链路应用。', id, '开源 + 云服务', 1, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'rag-knowledge-base';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'LlamaIndex', 'llamaindex', 'https://www.llamaindex.ai', '面向私有数据和知识库的 LLM 数据框架，适合 RAG、文档索引和数据连接。', id, '开源 + 云服务', 1, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'rag-knowledge-base';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Hugging Face', 'hugging-face', 'https://huggingface.co', '模型、数据集和 Spaces 社区，适合查找开源模型、体验 demo、发布模型和数据集。', id, '免费 + 付费', 0, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'model-platforms';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Replicate', 'replicate', 'https://replicate.com', '模型托管和推理 API 平台，适合快速调用开源模型、图片视频模型和实验 demo。', id, '按量付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'model-platforms';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'OpenRouter', 'openrouter', 'https://openrouter.ai', '多模型 API 聚合平台，适合比较不同模型价格、能力和调用接口。', id, '按量付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'model-platforms';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Ollama', 'ollama', 'https://ollama.com', '本地运行大语言模型的经典工具，适合在电脑或服务器上拉取和运行开源模型。', id, '免费', 1, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'open-source-self-hosted';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'LM Studio', 'lm-studio', 'https://lmstudio.ai', '桌面端本地模型运行工具，适合下载、测试和本地调用开源 LLM。', id, '免费', 0, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'open-source-self-hosted';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'GPTs', 'gpts', 'https://chatgpt.com/gpts', 'ChatGPT 内的自定义 GPT 与技能入口，适合查找和配置特定任务助手。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-skills';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'FlowGPT', 'flowgpt', 'https://flowgpt.com', '提示词和 AI agent 分享社区，适合查找任务型提示词、角色 bot 和使用灵感。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-skills';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'PromptBase', 'promptbase', 'https://promptbase.com', '提示词市场，适合参考商业提示词结构、创意提示词和 AI 生成任务模板。', id, '付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-skills';

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'ElevenLabs', 'elevenlabs', 'https://elevenlabs.io', 'AI 语音合成、配音和声音克隆平台，适合播客、视频配音和多语言音频。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'audio-voice';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Suno', 'suno', 'https://suno.com', 'AI 音乐生成工具，适合用文本生成歌曲、旋律和创意音乐草稿。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'audio-voice';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Udio', 'udio', 'https://www.udio.com', 'AI 音乐生成平台，适合生成歌曲片段、延展音乐创意和探索不同风格。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'audio-voice';

INSERT OR IGNORE INTO maintenance_logs (entity_type, entity_id, action, note, created_at) VALUES
  ('site', NULL, 'expanded', '补充 ComfyUI、Stable Diffusion WebUI、Civitai、Hugging Face、Ollama、Cursor、LangChain、ElevenLabs 等经典 AI 工具。', CURRENT_TIMESTAMP);
