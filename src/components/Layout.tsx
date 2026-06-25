import type { ReactNode } from "react";
import { useI18n } from "../lib/i18n";

export function Layout({ children }: { children: ReactNode }) {
  const { locale, setLocale, t } = useI18n();
  const nextLocale = locale === "zh" ? "en" : "zh";
  const navItems = [
    [t.navHome, "/"],
    [t.navSites, "/sites/"],
    [t.navArticles, "/articles/"],
    [t.navUpdates, "/updates/"]
  ];

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="AI Brief Note">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>AI Brief Note</span>
        </a>
        <form className="header-search" action="/sites/" role="search">
          <input
            name="q"
            type="search"
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            autoComplete="off"
          />
          <button type="submit">{t.search}</button>
        </form>
        <nav className="nav" aria-label="主导航">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <button
            className="language-toggle"
            type="button"
            aria-label={t.switchLanguage}
            onClick={() => setLocale(nextLocale)}
          >
            {locale === "zh" ? "EN" : "中文"}
          </button>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>© 2026 AI Brief Note. {t.footer}</p>
        <div>
          <a href="/about">{t.footerAbout}</a>
          <a href="/contact">{t.footerContact}</a>
          <a href="/privacy">{t.footerPrivacy}</a>
          <a href="/ads.txt">ads.txt</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </footer>
    </>
  );
}
