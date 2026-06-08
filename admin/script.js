const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2
});

const currency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency"
});

const form = document.querySelector("#roiForm");
const saved = JSON.parse(localStorage.getItem("aibriefnote-admin-metrics") || "{}");

function numberValue(formData, key) {
  return Number(formData.get(key) || 0);
}

function renderMetrics(values) {
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
}

if (form) {
  Object.entries(saved).forEach(([key, value]) => {
    const input = form.elements.namedItem(key);
    if (input) input.value = value;
  });

  renderMetrics(saved);

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
