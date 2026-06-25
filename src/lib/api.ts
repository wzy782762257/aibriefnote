import { fallbackCategories, fallbackSites } from "../data/siteDirectory";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  siteCount: number;
};

export type AiSite = {
  id: number;
  name: string;
  slug: string;
  url: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  pricingType: string;
  isOpenSource: boolean;
  loginRequired: boolean;
  status: string;
  featured: boolean;
  tags: string[];
};

export type Workflow = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  difficulty: string;
  estimatedMinutes: number;
  toolsUsed: string[];
  content: string;
  featured: boolean;
  updatedAt: string;
};

export type MaintenanceLog = {
  id: number;
  action: string;
  entityType: string;
  note: string;
  createdAt: string;
};

export type MaintenanceStats = {
  totalSites: number;
  addedToday: number;
  brokenToday: number;
  reviewCount: number;
};

type ApiResult<T> = {
  configured: boolean;
  data?: T;
  message?: string;
};

async function readApi<T>(path: string): Promise<ApiResult<T>> {
  const response = await fetch(path, {
    headers: { accept: "application/json" }
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return {
      configured: false,
      message: "API endpoint did not return JSON."
    };
  }

  const payload = await response.json();

  if (!payload.configured) {
    return {
      configured: false,
      message: payload.message || "D1 database is not configured."
    };
  }

  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || "API request failed");
  }

  return {
    configured: true,
    data: payload as T
  };
}

export function getCategories() {
  return readApi<{ categories: Category[] }>("/api/categories").then((result) => {
    if (result.configured) return result;
    return {
      configured: true,
      data: { categories: fallbackCategories }
    };
  });
}

export function getSites(params: URLSearchParams) {
  return readApi<{ sites: AiSite[] }>(`/api/sites?${params}`).then((result) => {
    if (result.configured) return result;

    const category = params.get("category");
    const featured = params.get("featured");
    const query = params.get("q")?.trim().toLowerCase();
    const limit = Math.min(Number(params.get("limit") || 24), 60);

    const sites = fallbackSites.filter((site) => {
      if (category && site.category.slug !== category) return false;
      if (featured === "1" && !site.featured) return false;
      if (query) {
        const haystack = [
          site.name,
          site.description,
          site.category.name,
          site.pricingType,
          ...site.tags
        ].join(" ").toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    }).slice(0, limit);

    return {
      configured: true,
      data: { sites }
    };
  });
}

export function getWorkflows(params: URLSearchParams) {
  return readApi<{ workflows: Workflow[] }>(`/api/workflows?${params}`);
}

export function getUpdates() {
  return readApi<{ stats: MaintenanceStats; logs: MaintenanceLog[] }>("/api/updates");
}
