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
  return readApi<{ categories: Category[] }>("/api/categories");
}

export function getSites(params: URLSearchParams) {
  return readApi<{ sites: AiSite[] }>(`/api/sites?${params}`);
}

export function getWorkflows(params: URLSearchParams) {
  return readApi<{ workflows: Workflow[] }>(`/api/workflows?${params}`);
}

export function getUpdates() {
  return readApi<{ stats: MaintenanceStats; logs: MaintenanceLog[] }>("/api/updates");
}
