import type { ReactNode } from "react";

const navItems = [
  ["首页", "/"],
  ["AI站点导航", "/sites/"],
  ["工具教程", "/articles/"],
  ["每日更新", "/updates/"]
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="AI Brief Note 首页">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>AI Brief Note</span>
        </a>
        <form className="header-search" action="/sites/" role="search">
          <input
            name="q"
            type="search"
            placeholder="搜索 AI 工具、场景或分类"
            aria-label="搜索 AI 工具、场景或分类"
            autoComplete="off"
          />
          <button type="submit">搜索</button>
        </form>
        <nav className="nav" aria-label="主导航">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <a className="nav-cta" href="/contact">提交工具</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <p>© 2026 AI Brief Note. AI 工具导航和实用教程。</p>
        <div>
          <a href="/about">关于</a>
          <a href="/contact">联系</a>
          <a href="/privacy">隐私政策</a>
          <a href="/ads.txt">ads.txt</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
      </footer>
    </>
  );
}
