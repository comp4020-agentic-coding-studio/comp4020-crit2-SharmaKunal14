/**
 * Page-relative hrefs, not base-prefixed absolute ones.
 *
 * `pnpm dlx linkinator ./dist` (the CI/local links check) crawls the built
 * `dist/` directory as if it were the site root — it has no notion of the
 * Astro `base` the site is actually deployed under. A link like
 * `/${base}/about/` 404s under that crawl even though it's correct once
 * deployed, because `dist/${base}/about/` doesn't exist on disk (`dist/`
 * already *is* that base). Page-relative links (`../about/`) resolve
 * correctly both ways: on disk relative to the linking file, and in the
 * browser relative to the current URL (which already includes the base).
 *
 * `target` is a root-relative page path with no leading slash: "" for home,
 * "about/", "trips/", "gear/", "contact/".
 */
export function relativeLink(pathname: string, base: string, target: string): string {
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const rel = pathname.startsWith(trimmedBase) ? pathname.slice(trimmedBase.length) : pathname;
  const depth = rel.split("/").filter(Boolean).length;
  const prefix = "../".repeat(depth);
  return depth === 0 && target === "" ? "./" : prefix + target;
}
