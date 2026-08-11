import { defineConfig } from "astro/config";

// Deployed to GitHub Pages under the org as a project site:
// https://comp4020-agentic-coding-studio.github.io/comp4020-crit2-SharmaKunal14/
// `base` must match that path exactly or every asset 404s on the live URL
// while looking fine in local dev (see CLAUDE.md, "Crit 2: stack decision").
export default defineConfig({
  base: "/comp4020-crit2-SharmaKunal14",
});
