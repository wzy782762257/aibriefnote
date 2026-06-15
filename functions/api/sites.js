import { databaseUnavailable, json, mapSite } from "./_shared.js";

export async function onRequestGet({ env, request }) {
  if (!env.DB) return databaseUnavailable();

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured");
  const q = url.searchParams.get("q")?.trim();
  const limit = Math.min(Number(url.searchParams.get("limit") || 24), 60);
  const params = [];
  const where = [];

  if (category) {
    where.push("c.slug = ?");
    params.push(category);
  }

  if (featured === "1") {
    where.push("s.featured = 1");
  }

  if (q) {
    where.push("(s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  params.push(limit);

  const { results } = await env.DB.prepare(`
    SELECT
      s.*,
      c.name AS category_name,
      c.slug AS category_slug,
      GROUP_CONCAT(DISTINCT t.name) AS tags,
      sc.status_code,
      sc.is_available,
      sc.latency_ms,
      sc.checked_at
    FROM ai_sites s
    JOIN categories c ON c.id = s.category_id
    LEFT JOIN site_tags st ON st.site_id = s.id
    LEFT JOIN tags t ON t.id = st.tag_id
    LEFT JOIN site_checks sc ON sc.id = (
      SELECT id FROM site_checks
      WHERE site_id = s.id
      ORDER BY checked_at DESC
      LIMIT 1
    )
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    GROUP BY s.id
    ORDER BY s.featured DESC, s.updated_at DESC, s.name ASC
    LIMIT ?
  `).bind(...params).all();

  return json({
    ok: true,
    configured: true,
    sites: results.map(mapSite)
  });
}
