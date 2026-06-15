const state = {
  category: new URLSearchParams(location.search).get("category") || "",
  query: new URLSearchParams(location.search).get("q") || ""
};

async function readApi(path) {
  const response = await fetch(path, {
    headers: { accept: "application/json" }
  });
  const payload = await response.json();
  if (!payload.configured) {
    return { configured: false, payload };
  }
  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || "API request failed");
  }
  return { configured: true, payload };
}

function emptyState(message) {
  return `<div class="empty-state">${message}</div>`;
}

function statusLabel(site) {
  if (site.status === "review") return ["待复查", "review"];
  if (site.loginRequired) return ["需登录", "login"];
  return ["可访问", "active"];
}

function toolCard(site) {
  const [label, statusClass] = statusLabel(site);
  const tags = site.tags.slice(0, 3).map((tag) => `<span class="tag">${tag}</span>`).join("");
  return `<article class="tool-card">
    <div class="tool-card-header">
      <div class="tool-logo" aria-hidden="true">${site.name.slice(0, 1).toUpperCase()}</div>
      <span class="status ${statusClass}">${label}</span>
    </div>
    <div>
      <h3>${site.name}</h3>
      <p>${site.description}</p>
    </div>
    <div class="tool-meta">
      <span class="tag">${site.category.name}</span>
      <span class="tag">${site.pricingType}</span>
      ${site.isOpenSource ? '<span class="tag">开源</span>' : ""}
      ${tags}
    </div>
    <div class="card-actions">
      <a href="${site.url}" target="_blank" rel="nofollow noopener">访问站点</a>
    </div>
  </article>`;
}

function workflowCard(workflow) {
  const tools = workflow.toolsUsed.slice(0, 3).map((tool) => `<span class="tag">${tool}</span>`).join("");
  return `<article class="workflow-card">
    <p class="meta">${workflow.difficulty} · ${workflow.estimatedMinutes} min</p>
    <h3>${workflow.title}</h3>
    <p>${workflow.summary}</p>
    <div class="tool-meta">${tools}</div>
    <a href="/workflows/#${workflow.slug}">查看模板</a>
  </article>`;
}

function updateStats(stats) {
  document.querySelectorAll("[data-update-stats]").forEach((container) => {
    const values = [
      stats.totalSites ?? "--",
      stats.addedToday ?? "--",
      stats.brokenToday ?? "--",
      stats.reviewCount ?? "--"
    ];
    container.querySelectorAll("strong").forEach((node, index) => {
      node.textContent = values[index];
    });
  });
}

async function renderCategories() {
  const filter = document.querySelector("[data-category-filter]");
  const chips = document.querySelector("[data-category-chips]");
  if (!filter && !chips) return;

  try {
    const { configured, payload } = await readApi("/api/categories");
    if (!configured) {
      if (filter) filter.insertAdjacentHTML("beforeend", emptyState("D1 数据库未绑定，分类暂不可用。"));
      return;
    }

    if (filter) {
      filter.insertAdjacentHTML("beforeend", payload.categories.map((category) => `
        <button class="filter-button ${state.category === category.slug ? "active" : ""}" type="button" data-category="${category.slug}">
          ${category.name} <span>${category.siteCount}</span>
        </button>
      `).join(""));
    }

    if (chips) {
      chips.innerHTML = payload.categories.slice(0, 8).map((category) => (
        `<a class="chip" href="/sites/?category=${category.slug}">${category.name}</a>`
      )).join("");
    }
  } catch (error) {
    if (filter) filter.insertAdjacentHTML("beforeend", emptyState("分类读取失败，请稍后重试。"));
  }
}

async function renderSites() {
  const grids = document.querySelectorAll("[data-sites-grid]");
  if (!grids.length) return;

  for (const grid of grids) {
    const params = new URLSearchParams();
    const featured = grid.dataset.featured;
    const limit = grid.dataset.limit || "24";
    if (featured) params.set("featured", featured);
    if (state.category) params.set("category", state.category);
    if (state.query) params.set("q", state.query);
    params.set("limit", limit);

    try {
      const { configured, payload } = await readApi(`/api/sites?${params}`);
      if (!configured) {
        grid.innerHTML = emptyState("D1 数据库未绑定。配置 DB binding 并导入 migrations/ 与 seeds/ 后，这里会显示 AI 站点导航。");
        continue;
      }
      grid.innerHTML = payload.sites.length
        ? payload.sites.map(toolCard).join("")
        : emptyState("没有找到匹配的 AI 站点。");
    } catch (error) {
      grid.innerHTML = emptyState("AI 站点读取失败，请稍后重试。");
    }
  }
}

async function renderWorkflows() {
  const grids = document.querySelectorAll("[data-workflow-grid]");
  if (!grids.length) return;

  for (const grid of grids) {
    const params = new URLSearchParams();
    if (grid.dataset.featured) params.set("featured", grid.dataset.featured);
    params.set("limit", grid.dataset.limit || "24");

    try {
      const { configured, payload } = await readApi(`/api/workflows?${params}`);
      if (!configured) {
        grid.innerHTML = emptyState("D1 数据库未绑定。导入 workflow_templates 后，这里会显示工作流模板。");
        continue;
      }
      grid.innerHTML = payload.workflows.length
        ? payload.workflows.map(workflowCard).join("")
        : emptyState("暂时没有工作流模板。");
    } catch (error) {
      grid.innerHTML = emptyState("工作流模板读取失败，请稍后重试。");
    }
  }
}

async function renderUpdates() {
  const list = document.querySelector("[data-update-list]");
  const cards = document.querySelector("[data-update-cards]");
  if (!list && !cards && !document.querySelector("[data-update-stats]")) return;

  try {
    const { configured, payload } = await readApi("/api/updates");
    if (!configured) {
      const message = "D1 数据库未绑定，维护记录暂不可用。";
      if (list) list.innerHTML = `<li>${message}</li>`;
      if (cards) cards.innerHTML = emptyState(message);
      return;
    }

    updateStats(payload.stats);
    const logs = payload.logs.length ? payload.logs : [];
    if (list) {
      list.innerHTML = logs.slice(0, 4).map((log) => `<li>${log.note}</li>`).join("") || "<li>暂无维护记录。</li>";
    }
    if (cards) {
      cards.innerHTML = logs.map((log) => `
        <article class="update-card">
          <p class="meta">${log.action} · ${log.createdAt}</p>
          <h3>${log.entityType}</h3>
          <p>${log.note}</p>
        </article>
      `).join("") || emptyState("暂无维护记录。");
    }
  } catch (error) {
    if (list) list.innerHTML = "<li>维护记录读取失败。</li>";
    if (cards) cards.innerHTML = emptyState("维护记录读取失败，请稍后重试。");
  }
}

function bindDirectoryFilters() {
  const panel = document.querySelector("[data-category-filter]");
  if (!panel) return;
  panel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    const url = new URL(location.href);
    if (button.dataset.category) {
      url.searchParams.set("category", button.dataset.category);
    } else {
      url.searchParams.delete("category");
    }
    location.href = url.toString();
  });
}

function bindNewsletter() {
  const form = document.querySelector(".signup");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.innerHTML = '<p class="thanks">已收到订阅请求。接入邮件服务后，这里会写入真实订阅列表。</p>';
  });
}

bindDirectoryFilters();
bindNewsletter();
await Promise.all([
  renderCategories(),
  renderSites(),
  renderWorkflows(),
  renderUpdates()
]);
