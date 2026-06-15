CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  pricing_type TEXT NOT NULL DEFAULT 'unknown',
  is_open_source INTEGER NOT NULL DEFAULT 0,
  login_required INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  featured INTEGER NOT NULL DEFAULT 0,
  last_checked_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS site_tags (
  site_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (site_id, tag_id),
  FOREIGN KEY (site_id) REFERENCES ai_sites(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tutorials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  published_status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES ai_sites(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS workflow_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  estimated_minutes INTEGER NOT NULL DEFAULT 30,
  tools_used TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  status_code INTEGER,
  final_url TEXT,
  is_available INTEGER NOT NULL DEFAULT 0,
  latency_ms INTEGER,
  error_message TEXT,
  checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (site_id) REFERENCES ai_sites(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  action TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_sites_category ON ai_sites(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_sites_status ON ai_sites(status);
CREATE INDEX IF NOT EXISTS idx_ai_sites_featured ON ai_sites(featured);
CREATE INDEX IF NOT EXISTS idx_tutorials_status ON tutorials(published_status);
CREATE INDEX IF NOT EXISTS idx_workflows_featured ON workflow_templates(featured);
CREATE INDEX IF NOT EXISTS idx_site_checks_site_time ON site_checks(site_id, checked_at);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_time ON maintenance_logs(created_at);
