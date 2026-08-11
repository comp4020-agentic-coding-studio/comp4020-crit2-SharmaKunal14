# Process overview

## What I built

An unsolicited redesign of [ANU Mountaineering Club's real site](https://anumc.org.au/):
five Astro pages (home, about, trips, gear store, contact) that keep the
club's real information but fix the things the live site gets wrong — a
fake-urgency password-reset banner sitting above the fold, trip listings
duplicated across the page, and contact details hidden behind a login.

## The moments that mattered

1. **What happened**: before writing any content, I opened the real
   anumc.org.au in a browser rather than trusting an automated page summary,
   because the summary had flagged the site's password-reset link as a
   phishing-shaped external auth URL. I checked the actual `href` via
   `read_page` and found it was same-domain — still a bad pattern (it looks
   exactly like phishing regardless of intent), but not what the summary
   claimed. **What I did instead**: reported both facts to the user —
   same-domain, but still worth calling out as bad UX — rather than repeating
   an unverified claim or dismissing the concern outright. **How I knew it
   was right**: I read the resolved `href` directly from the DOM rather than
   an LLM's gloss of it, and never clicked the link or entered credentials.
   That analysis (the fake-urgency banner, duplicated trip listings, the
   login-gated contact page, an external Google Doc standing in for a
   handbook) became the concrete "what's wrong with the original" list this
   redesign answers directly in
   [`eaef53e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-SharmaKunal14/commit/eaef53e).

2. **What happened**: after building all five pages and wiring up a
   `<link rel="stylesheet" href={...}>` in the layout, `pnpm build` succeeded
   and every page rendered correctly in `pnpm dev`. I nearly called the build
   done at that point. **What I did instead**: before moving on, I checked
   `dist/` directly for a shipped CSS file, per the carried-forward
   `CLAUDE.md` lesson that a build succeeding locally doesn't mean the
   deployed artefact is right. There was no CSS anywhere in `dist/` — Astro
   only bundles stylesheets it sees an `import` for, and a raw `<link>` to a
   source-tree path doesn't count, so the deployed site would have shipped
   completely unstyled while looking fine in dev. I fixed it by importing the
   stylesheet from the layout's frontmatter instead. **How I knew it was
   right**: `find dist -iname "*.css"` before and after — nothing, then a
   `<style>` block inlined into every page's `<head>`
   ([`eaef53e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-SharmaKunal14/commit/eaef53e)).

3. **What happened**: measuring every page at 390px with the iframe technique
   from `CLAUDE.md` (`scrollWidth > innerWidth`), the trips page overflowed
   by 42px even after the CSS-import fix, and separately the contact page
   started overflowing once the CSS actually loaded. **What I did instead**:
   rather than patching each page individually, I traced both to the same
   root cause — `dl.spec-list { grid-template-columns: max-content 1fr }` — a
   plain `max-content` track never shrinks below the single-line width of its
   widest item, so a long FAQ question on the contact page pushed the whole
   grid past the viewport. I fixed the shared component (`minmax(0,
   max-content)`, plus a stacked layout under 30rem) rather than a one-off
   override on the offending page, and updated `CLAUDE.md`'s existing
   overflow section to note it's a general trap, not just the flex case it
   already described. **How I knew it was right**: re-ran the same iframe
   check against all five pages after the fix; all five now report
   `scrollWidth === innerWidth === 390`
   ([`eaef53e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-SharmaKunal14/commit/eaef53e)).

4. **What happened**: I needed the crit-2 spec's checkable lines turned into
   tests, but a naive approach (checking every visible string) would be
   brittle and wouldn't survive a content rewrite. **What I did instead**: I
   wrote [`spec/crit-2.test.ts`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-SharmaKunal14/blob/135100b/spec/crit-2.test.ts)
   against the *contract* each spec line actually names — a real link out to
   anumc.org.au present on every page (not just claimed in prose), no
   server-side file extensions shipped in `dist/`, a trip table with no
   duplicate rows, contact info reachable with no password field on the page,
   and the deployed URL responding (expected red pre-ship). **How I knew it
   was right**: ran it against the built site — 6 of 7 assertions pass now,
   and the 7th (the live-URL check) fails with exactly the message `CLAUDE.md`
   predicts for a private, not-yet-deployed repo, not a surprise failure
   ([`135100b`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-SharmaKunal14/commit/135100b)).

## Directing, grounding and correcting the agent

Every content decision (which trips to list, the gear rates, the FAQ
answers) is invented, rewritten sample content — not scraped from the live
anumc.org.au, per the spec's "restructured and rewritten, not pasted"
requirement — but shaped directly by what I found wrong on the real site
during live verification (moment 1). Every layout and CSS decision was
checked against a real measurement (`pnpm build` + the dist inspection in
moment 2, the 390px iframe check in moment 3) rather than accepted on the
agent's say-so that it "should work." The harness itself
([`9e66899`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit2-SharmaKunal14/commit/9e66899))
carried forward the specific lessons — the intrinsic-overflow trap, this
machine's Node version mismatch — that made moments 2 and 3 catchable in the
first place, rather than shipped blind.
