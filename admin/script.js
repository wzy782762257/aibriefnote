const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2
});

const currency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency"
});

const form = document.querySelector("#roiForm");
const saved = JSON.parse(localStorage.getItem("aibriefnote-admin-metrics") || "{}");
let sourceHistory = [];

function numberValue(formData, key) {
  return Number(formData.get(key) || 0);
}

function normalizeData(payload) {
  const current = payload.current || {};
  const localOverride = JSON.parse(localStorage.getItem("aibriefnote-admin-metrics") || "{}");
  const values = Object.keys(localOverride).length ? localOverride : current;

  return {
    history: payload.history || [],
    lastUpdated: payload.lastUpdated || "-",
    sources: payload.sources || {},
    values
  };
}

function renderSourceStatus(sources, lastUpdated) {
  const setText = (id, value) => {
    const node = document.querySelector(id);
    if (node) node.textContent = value || "-";
  };

  setText("#cloudflareStatus", sources.cloudflare);
  setText("#adsenseStatus", sources.adsense);
  setText("#searchStatus", sources.searchConsole);
  setText("#automationStatus", sources.automation);
  setText("#lastUpdatedOutput", lastUpdated);
}

function renderMetrics(values, history = sourceHistory) {
  sourceHistory = history;
  const pageviews = Number(values.pageviews || 0);
  const impressions = Number(values.impressions || 0);
  const clicks = Number(values.clicks || 0);
  const revenue = Number(values.revenue || 0);
  const cost = Number(values.cost || 0);
  const pageRpm = pageviews > 0 ? (revenue / pageviews) * 1000 : 0;
  const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  document.querySelector("#pvOutput").textContent = formatter.format(pageviews);
  document.querySelector("#impressionOutput").textContent = formatter.format(impressions);
  document.querySelector("#rpmOutput").textContent = currency.format(pageRpm);
  document.querySelector("#roiOutput").textContent = `${formatter.format(roi)}%`;

  form.dataset.ctr = `${formatter.format(ctr)}%`;
  renderCharts(values);
}

function buildHistory(values) {
  const pageviews = Number(values.pageviews || 0);
  const revenue = Number(values.revenue || 0);
  const base = sourceHistory.slice(-6);
  const today = {
    date: new Date().toISOString().slice(5, 10),
    pageviews,
    revenue
  };

  if (!base.length) {
    return Array.from({ length: 6 }, (_, index) => ({
      date: `D-${6 - index}`,
      pageviews: Math.max(0, Math.round(pageviews * (0.35 + index * 0.1))),
      revenue: Math.max(0, Number((revenue * (0.3 + index * 0.11)).toFixed(2)))
    })).concat(today);
  }

  return base.concat(today);
}

function pointPath(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function renderTrendChart(values) {
  const svg = document.querySelector("#trendChart");
  if (!svg) return;

  const data = buildHistory(values);
  const width = 720;
  const height = 280;
  const pad = { left: 52, right: 26, top: 24, bottom: 42 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const maxPv = Math.max(1, ...data.map((item) => Number(item.pageviews || 0)));
  const maxRevenue = Math.max(1, ...data.map((item) => Number(item.revenue || 0)));

  const pointsPv = data.map((item, index) => ({
    x: pad.left + (innerWidth / (data.length - 1)) * index,
    y: pad.top + innerHeight - (Number(item.pageviews || 0) / maxPv) * innerHeight
  }));

  const pointsRevenue = data.map((item, index) => ({
    x: pad.left + (innerWidth / (data.length - 1)) * index,
    y: pad.top + innerHeight - (Number(item.revenue || 0) / maxRevenue) * innerHeight
  }));

  svg.innerHTML = `
    <line class="grid-line" x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + innerHeight}"></line>
    <line class="grid-line" x1="${pad.left}" y1="${pad.top + innerHeight}" x2="${pad.left + innerWidth}" y2="${pad.top + innerHeight}"></line>
    <line class="grid-line" x1="${pad.left}" y1="${pad.top + innerHeight / 2}" x2="${pad.left + innerWidth}" y2="${pad.top + innerHeight / 2}"></line>
    <path class="pv-line" d="${pointPath(pointsPv)}"></path>
    <path class="revenue-line" d="${pointPath(pointsRevenue)}"></path>
    ${pointsPv.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="5" fill="#23684d"></circle>`).join("")}
    ${pointsRevenue.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="5" fill="#b8852f"></circle>`).join("")}
    ${data.map((item, index) => `<text x="${pointsPv[index].x}" y="${height - 14}" text-anchor="middle">${item.date}</text>`).join("")}
    <text x="8" y="${pad.top + 6}">PV</text>
    <text x="${width - 78}" y="${pad.top + 6}">收入</text>
  `;
}

function renderFunnelChart(values) {
  const svg = document.querySelector("#funnelChart");
  if (!svg) return;

  const pageviews = Math.max(0, Number(values.pageviews || 0));
  const impressions = Math.max(0, Number(values.impressions || 0));
  const clicks = Math.max(0, Number(values.clicks || 0));
  const maxValue = Math.max(1, pageviews, impressions, clicks);
  const steps = [
    ["页面浏览", pageviews],
    ["广告展示", impressions],
    ["广告点击", clicks]
  ];

  svg.innerHTML = steps.map(([label, value], index) => {
    const y = 34 + index * 78;
    const ratio = Math.max(0.08, value / maxValue);
    const width = 420 * ratio;
    const x = 70 + (420 - width) / 2;
    return `
      <rect class="funnel-step" x="${x}" y="${y}" width="${width}" height="46" rx="8"></rect>
      <text x="280" y="${y + 30}" text-anchor="middle" fill="#fff">${label}：${formatter.format(value)}</text>
    `;
  }).join("");
}

function renderRoiChart(values) {
  const svg = document.querySelector("#roiChart");
  if (!svg) return;

  const revenue = Math.max(0, Number(values.revenue || 0));
  const cost = Math.max(0, Number(values.cost || 0));
  const maxValue = Math.max(1, revenue, cost);
  const revenueHeight = (revenue / maxValue) * 170;
  const costHeight = (cost / maxValue) * 170;

  svg.innerHTML = `
    <line class="grid-line" x1="80" y1="230" x2="500" y2="230"></line>
    <rect class="bar-revenue" x="150" y="${230 - revenueHeight}" width="92" height="${revenueHeight}" rx="8"></rect>
    <rect class="bar-cost" x="320" y="${230 - costHeight}" width="92" height="${costHeight}" rx="8"></rect>
    <text x="196" y="${216 - revenueHeight}" text-anchor="middle">${currency.format(revenue)}</text>
    <text x="366" y="${216 - costHeight}" text-anchor="middle">${currency.format(cost)}</text>
    <text x="196" y="258" text-anchor="middle">收入</text>
    <text x="366" y="258" text-anchor="middle">成本</text>
  `;
}

function renderCharts(values) {
  renderTrendChart(values);
  renderFunnelChart(values);
  renderRoiChart(values);
}

async function loadDashboard() {
  try {
    const response = await fetch("/admin/data.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`data source returned ${response.status}`);
    const data = normalizeData(await response.json());
    renderSourceStatus(data.sources, data.lastUpdated);
    hydrateForm(data.values);
    renderMetrics(data.values, data.history);
  } catch (error) {
    renderSourceStatus({
      cloudflare: "数据源读取失败",
      adsense: "数据源读取失败",
      searchConsole: "数据源读取失败",
      automation: "请检查 /admin/data.json"
    }, "-");
    hydrateForm(saved);
    renderMetrics(saved, []);
  }
}

function hydrateForm(values) {
  if (!form) return;
  Object.entries(values || {}).forEach(([key, value]) => {
    const input = form.elements.namedItem(key);
    if (input) input.value = value;
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = {
      clicks: numberValue(formData, "clicks"),
      cost: numberValue(formData, "cost"),
      impressions: numberValue(formData, "impressions"),
      pageviews: numberValue(formData, "pageviews"),
      revenue: numberValue(formData, "revenue")
    };

    localStorage.setItem("aibriefnote-admin-metrics", JSON.stringify(values));
    renderMetrics(values);
  });
}

loadDashboard();
