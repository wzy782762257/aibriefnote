import type { AiSite } from "../lib/api";
import { useMemo, useState } from "react";
import { useI18n } from "../lib/i18n";

function statusClass(site: AiSite) {
  if (site.status === "review") return "review";
  if (site.loginRequired) return "login";
  return "active";
}

export function SiteCard({ site }: { site: AiSite }) {
  const { t } = useI18n();
  const label = site.status === "review" ? t.review : site.loginRequired ? t.loginRequired : t.available;
  const [iconFailed, setIconFailed] = useState(false);
  const faviconUrl = useMemo(() => {
    return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(site.url)}&sz=64`;
  }, [site.url]);

  return (
    <article className="tool-card">
      <div className="tool-card-header">
        <div className="tool-logo" aria-hidden="true">
          {iconFailed ? site.name.slice(0, 1).toUpperCase() : (
            <img src={faviconUrl} alt="" loading="lazy" onError={() => setIconFailed(true)} />
          )}
        </div>
        <span className={`status ${statusClass(site)}`}>{label}</span>
      </div>
      <div>
        <h3>{site.name}</h3>
        <p>{site.description}</p>
      </div>
      <div className="tool-meta">
        <span className="tag">{site.category.name}</span>
        <span className="tag">{site.pricingType}</span>
        {site.isOpenSource ? <span className="tag">开源</span> : null}
        {site.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <div className="card-actions">
        <a href={site.url} target="_blank" rel="nofollow noopener noreferrer">{t.visitSite}</a>
      </div>
    </article>
  );
}
