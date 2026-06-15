import { databaseUnavailable, json } from "./_shared.js";

export async function onRequestGet({ env }) {
  if (!env.DB) return databaseUnavailable();

  const { results } = await env.DB.prepare(`
    SELECT
      c.id,
      c.name,
      c.slug,
      c.sort_order,
      COUNT(s.id) AS site_count
    FROM categories c
    LEFT JOIN ai_sites s ON s.category_id = c.id
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
  `).all();

  return json({
    ok: true,
    configured: true,
    categories: results.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      sortOrder: row.sort_order,
      siteCount: row.site_count
    }))
  });
}
