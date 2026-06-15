import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://aibriefnote.com";
const live = process.argv.includes("--live");
const errors = [];

function fail(message) {
  errors.push(message);
}

function publicPathForHtml(file) {
  const normalized = file.split(path.sep).join("/");
  if (normalized === "index.html") return "/";
  if (normalized === "articles/index.html") return "/articles/";
  return `/${normalized.replace(/\.html$/, "")}`;
}

function isPublicHtml(file) {
  return file.endsWith(".html") && !file.startsWith(`admin${path.sep}`);
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else {
      files.push(path.relative(root, fullPath));
    }
  }

  return files;
}

function extractHrefs(html) {
  return [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
}

function extractCanonical(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || "";
}

function isNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function isLocalHref(href) {
  return !/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href)
    && !href.startsWith("mailto:")
    && !href.startsWith("tel:")
    && !href.startsWith("#");
}

function stripFragment(href) {
  return href.split("#")[0].split("?")[0];
}

const files = await walk(root);
const htmlFiles = files.filter(isPublicHtml).sort();
const expectedLocs = new Set();

for (const file of htmlFiles) {
  const html = await fs.readFile(path.join(root, file), "utf8");
  const route = publicPathForHtml(file);
  const expectedCanonical = `${siteUrl}${route}`;
  const canonical = extractCanonical(html);
  const noindex = isNoindex(html);

  if (!noindex) {
    expectedLocs.add(expectedCanonical);
  }

  if (canonical !== expectedCanonical) {
    fail(`${file}: canonical should be ${expectedCanonical}, found ${canonical || "missing"}`);
  }

  for (const href of extractHrefs(html)) {
    if (!isLocalHref(href)) continue;
    const cleanHref = stripFragment(href);
    if (!cleanHref) continue;
    if (cleanHref.endsWith(".html") || cleanHref.endsWith("/index.html")) {
      fail(`${file}: local href should use the public route, found ${href}`);
    }
  }
}

const sitemap = await fs.readFile(path.join(root, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

for (const loc of locs) {
  if (loc.endsWith(".html") || loc.endsWith("/index.html")) {
    fail(`sitemap.xml: loc should use the public route, found ${loc}`);
  }
  if (!expectedLocs.has(loc)) {
    fail(`sitemap.xml: loc does not match a public HTML page, found ${loc}`);
  }
}

for (const loc of expectedLocs) {
  if (!locs.includes(loc)) {
    fail(`sitemap.xml: missing public page ${loc}`);
  }
}

if (live) {
  for (const loc of locs) {
    const response = await fetch(loc, { redirect: "manual" });
    if (response.status >= 300 && response.status < 400) {
      fail(`live: ${loc} redirects to ${response.headers.get("location") || "unknown"}`);
    } else if (response.status !== 200) {
      fail(`live: ${loc} returned ${response.status}`);
    }
  }
}

if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${htmlFiles.length} public HTML page(s) and ${locs.length} sitemap URL(s).`);
