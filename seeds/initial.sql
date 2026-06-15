INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES
  ('AI聊天', 'ai-chat', 10),
  ('AI编程', 'ai-coding', 20),
  ('图片生成', 'image-generation', 30),
  ('视频生成', 'video-generation', 40),
  ('自动化Agent', 'automation-agent', 50),
  ('RAG知识库', 'rag-knowledge-base', 60),
  ('内容运营', 'content-ops', 70),
  ('开源自托管', 'open-source-self-hosted', 80);

INSERT OR IGNORE INTO tags (name, slug) VALUES
  ('聊天', 'chat'),
  ('编程', 'coding'),
  ('工作流', 'workflow'),
  ('知识库', 'knowledge-base'),
  ('自托管', 'self-hosted'),
  ('图片', 'image'),
  ('视频', 'video'),
  ('内容运营', 'content-ops');

INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'ChatGPT', 'chatgpt', 'https://chatgpt.com', 'OpenAI 的通用 AI 助手，适合问答、写作、资料整理和轻量工作流。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-chat';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Claude', 'claude', 'https://claude.ai', 'Anthropic 的 AI 助手，适合长文档阅读、写作和代码解释。', id, '免费 + 付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-chat';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Dify', 'dify', 'https://dify.ai', '用于构建 AI 应用、知识库问答和 agent 工作流的平台。', id, '免费 + 付费', 1, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'automation-agent';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'n8n', 'n8n', 'https://n8n.io', '可视化工作流自动化平台，适合连接 API、表格、Webhook 和 AI 节点。', id, '免费 + 付费', 1, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'automation-agent';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Open WebUI', 'open-webui', 'https://openwebui.com', '本地和云端模型的统一 Web 界面，适合团队内部试用和提示词管理。', id, '开源', 1, 0, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'open-source-self-hosted';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Midjourney', 'midjourney', 'https://www.midjourney.com', '高质量图片生成工具，适合视觉概念、海报和素材探索。', id, '付费', 0, 1, 'active', 1, CURRENT_TIMESTAMP FROM categories WHERE slug = 'image-generation';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Perplexity', 'perplexity', 'https://www.perplexity.ai', '面向检索和问答的 AI 搜索工具，适合快速查资料和追踪来源。', id, '免费 + 付费', 0, 1, 'active', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'ai-chat';
INSERT OR IGNORE INTO ai_sites (name, slug, url, description, category_id, pricing_type, is_open_source, login_required, status, featured, last_checked_at)
SELECT 'Runway', 'runway', 'https://runwayml.com', 'AI 视频生成和编辑平台，适合短视频、动态素材和创意实验。', id, '免费 + 付费', 0, 1, 'review', 0, CURRENT_TIMESTAMP FROM categories WHERE slug = 'video-generation';

INSERT OR IGNORE INTO site_tags (site_id, tag_id)
SELECT s.id, t.id FROM ai_sites s, tags t WHERE s.slug IN ('dify', 'n8n') AND t.slug IN ('workflow', 'knowledge-base');
INSERT OR IGNORE INTO site_tags (site_id, tag_id)
SELECT s.id, t.id FROM ai_sites s, tags t WHERE s.slug = 'open-webui' AND t.slug IN ('self-hosted', 'chat');
INSERT OR IGNORE INTO site_tags (site_id, tag_id)
SELECT s.id, t.id FROM ai_sites s, tags t WHERE s.slug IN ('chatgpt', 'claude', 'perplexity') AND t.slug = 'chat';

INSERT OR IGNORE INTO tutorials (site_id, title, slug, summary, content, difficulty)
SELECT id, 'Dify 怎么做一个知识库问答机器人', 'dify-knowledge-base-qa', '从文档上传到发布测试，搭建第一个可试用的知识库问答应用。', '准备文档，创建知识库，配置应用提示词，限制回答引用资料来源，邀请内部成员试用。', 'beginner'
FROM ai_sites WHERE slug = 'dify';
INSERT OR IGNORE INTO tutorials (site_id, title, slug, summary, content, difficulty)
SELECT id, 'n8n 怎么搭一个 RSS 摘要工作流', 'n8n-rss-summary-workflow', '把 RSS、AI 摘要和表格草稿串起来，先做可审核的内容流。', '创建定时触发器，读取 RSS，调用模型生成结构化摘要，把结果写入表格并发送审核提醒。', 'beginner'
FROM ai_sites WHERE slug = 'n8n';

INSERT OR IGNORE INTO workflow_templates (title, slug, summary, difficulty, estimated_minutes, tools_used, content, featured) VALUES
  ('RSS -> AI摘要 -> 表格草稿', 'rss-ai-summary-sheet-draft', '每天读取来源，生成摘要和选题草稿，写入表格等待人工审核。', 'beginner', 35, 'n8n, ChatGPT, Google Sheets', '触发器读取 RSS，模型输出标题、摘要、标签和原文链接，写入表格。', 1),
  ('文档 -> 知识库问答', 'docs-to-knowledge-base-qa', '把内部文档整理成可测试的 AI 问答应用。', 'beginner', 45, 'Dify, OpenAI', '上传文档，创建知识库，配置回答边界并发布内部测试链接。', 1),
  ('表单 -> AI分类 -> 邮件通知', 'form-ai-classify-email', '把用户提交内容自动分类，并推送给对应负责人。', 'intermediate', 40, 'n8n, AI model, Email', '接收表单 webhook，调用模型分类，按类别发送邮件。', 1),
  ('GitHub Repo -> 选题草稿', 'github-repo-topic-draft', '从仓库 README 和更新记录生成可审核的工具教程选题。', 'intermediate', 50, 'Gemini CLI, n8n', '读取仓库信息，提取用途、安装方式和教程角度，生成草稿。', 0);

INSERT OR IGNORE INTO maintenance_logs (entity_type, entity_id, action, note, created_at) VALUES
  ('site', NULL, 'added', '新增 Dify、n8n、Open WebUI 等自动化与自托管工具入口。', CURRENT_TIMESTAMP),
  ('site', NULL, 'checked', '完成首批 AI 站点可访问状态检查。', CURRENT_TIMESTAMP),
  ('workflow', NULL, 'added', '新增 RSS 摘要和知识库问答工作流模板。', CURRENT_TIMESTAMP);
