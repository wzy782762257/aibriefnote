export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=120",
      ...init.headers
    }
  });
}

export function databaseUnavailable() {
  return json({
    ok: false,
    configured: false,
    message: "D1 database binding DB is not configured."
  });
}

export function splitTags(value) {
  if (!value) return [];
  return String(value).split(",").filter(Boolean);
}

export function toBoolean(value) {
  return Number(value) === 1;
}

export function mapSite(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    url: row.url,
    description: row.description,
    category: {
      name: row.category_name,
      slug: row.category_slug
    },
    pricingType: row.pricing_type,
    isOpenSource: toBoolean(row.is_open_source),
    loginRequired: toBoolean(row.login_required),
    status: row.status,
    featured: toBoolean(row.featured),
    lastCheckedAt: row.last_checked_at,
    latestCheck: {
      isAvailable: toBoolean(row.is_available),
      statusCode: row.status_code,
      latencyMs: row.latency_ms,
      checkedAt: row.checked_at
    },
    tags: splitTags(row.tags)
  };
}

export function mapWorkflow(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    difficulty: row.difficulty,
    estimatedMinutes: row.estimated_minutes,
    toolsUsed: splitTags(row.tools_used),
    content: row.content,
    featured: toBoolean(row.featured),
    updatedAt: row.updated_at
  };
}
