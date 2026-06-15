import { databaseUnavailable, json } from "./_shared.js";

export async function onRequestGet({ env }) {
  if (!env.DB) return databaseUnavailable();

  const stats = await env.DB.prepare(`
    SELECT
      (SELECT COUNT(*) FROM ai_sites) AS total_sites,
      (SELECT COUNT(*) FROM ai_sites WHERE DATE(created_at) = DATE('now')) AS added_today,
      (SELECT COUNT(*) FROM ai_sites WHERE status = 'review') AS review_count,
      (SELECT COUNT(*) FROM site_checks WHERE is_available = 0 AND DATE(checked_at) = DATE('now')) AS broken_today
  `).first();

  const { results } = await env.DB.prepare(`
    SELECT id, entity_type, entity_id, action, note, created_at
    FROM maintenance_logs
    ORDER BY created_at DESC
    LIMIT 20
  `).all();

  return json({
    ok: true,
    configured: true,
    stats: {
      totalSites: stats.total_sites,
      addedToday: stats.added_today,
      reviewCount: stats.review_count,
      brokenToday: stats.broken_today
    },
    logs: results.map((row) => ({
      id: row.id,
      entityType: row.entity_type,
      entityId: row.entity_id,
      action: row.action,
      note: row.note,
      createdAt: row.created_at
    }))
  });
}
