import { databaseUnavailable, json, mapWorkflow } from "./_shared.js";

export async function onRequestGet({ env, request }) {
  if (!env.DB) return databaseUnavailable();

  const url = new URL(request.url);
  const featured = url.searchParams.get("featured");
  const limit = Math.min(Number(url.searchParams.get("limit") || 24), 60);
  const where = featured === "1" ? "WHERE featured = 1" : "";

  const { results } = await env.DB.prepare(`
    SELECT *
    FROM workflow_templates
    ${where}
    ORDER BY featured DESC, updated_at DESC, title ASC
    LIMIT ?
  `).bind(limit).all();

  return json({
    ok: true,
    configured: true,
    workflows: results.map(mapWorkflow)
  });
}
