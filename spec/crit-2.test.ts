import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Crit 2 ("Unsolicited redesign") checkable lines. The rest of the published
// spec — "you can say why you like them", "yours is better in some way you
// can articulate", "you can account for how you directed the agent" — is
// judged by a person at the crit, not by a test. See PROCESS.md and
// reflections/crit-2.md for those.
const DIST = resolve("dist");
const REAL_SITE = "https://anumc.org.au/";

function htmlFiles(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

const pages = htmlFiles().map((path) => ({
  name: relative(DIST, path),
  doc: new JSDOM(readFileSync(path, "utf8")).window.document,
}));

describe("links to the real organisation", () => {
  it("at least one page links to the real anumc.org.au site", () => {
    const linksOut = pages.some(({ doc }) =>
      [...doc.querySelectorAll("a[href]")].some((a) =>
        (a.getAttribute("href") ?? "").startsWith(REAL_SITE),
      ),
    );
    expect(linksOut).toBe(true);
  });

  it("the footer, present on every page, carries that link", () => {
    for (const { name, doc } of pages) {
      const footerLink = doc.querySelector(
        `footer a[href^="${REAL_SITE}"]`,
      );
      expect(footerLink, `${name} is missing the real-site link in its footer`).toBeTruthy();
    }
  });
});

describe("static, no backend", () => {
  it("ships no server-side code alongside the static output", () => {
    // A static build has no API routes or server entrypoints in dist/ —
    // only prerendered HTML plus assets.
    const nonPage = readdirSync(DIST, { withFileTypes: true }).filter(
      (e) => !e.isDirectory() && !e.name.endsWith(".html"),
    );
    for (const entry of nonPage) {
      expect(entry.name).not.toMatch(/\.(php|py|rb|go)$/);
    }
  });
});

describe("real content, restructured (not a single dumping page)", () => {
  it("covers who/what/how-to-find-them across more than one page", () => {
    expect(pages.length).toBeGreaterThanOrEqual(4);
  });

  it("has a trip listing with no duplicated entries", () => {
    const trips = pages.find(({ name }) => name === "trips/index.html");
    expect(trips).toBeTruthy();
    const rows = [...trips!.doc.querySelectorAll("tbody tr th")].map((th) =>
      th.textContent?.trim(),
    );
    expect(rows.length).toBeGreaterThan(0);
    expect(new Set(rows).size).toBe(rows.length);
  });

  it("gives contact information without requiring a login", () => {
    const contact = pages.find(({ name }) => name === "contact/index.html");
    expect(contact).toBeTruthy();
    expect(contact!.doc.body.textContent).toMatch(/@/);
    expect(
      contact!.doc.querySelector('input[type="password"]'),
    ).toBeFalsy();
  });
});

// "Deployed and live" isn't checked here: this file runs inside CI's `check`
// job, which gates `deploy` — the live URL can't exist yet when this suite
// runs on the push that first ships the site, so an assertion on it here
// would permanently block that first deploy. The `ship` skill verifies the
// live URL directly (curl) after `deploy` finishes instead.
