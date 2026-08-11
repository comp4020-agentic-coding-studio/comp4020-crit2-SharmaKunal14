# Crit 2 reflection

**What was the breakthrough that moved the work forward?**

The moment that mattered wasn't a design choice, it was finding that the
deployed site would have shipped with no CSS at all. Everything looked
correct in `pnpm dev` and `pnpm build` exited clean, so there was no obvious
signal anything was wrong. The breakthrough was distrusting that and checking
the actual build output directly — `find dist -iname "*.css"` came back
empty, which meant Astro had never bundled the stylesheet because the layout
linked to it with a raw `<link>` tag instead of an `import`. That one check
reframed the rest of the week: a green build and a correct-looking dev server
are not evidence the deployed artefact is right, only that the source
compiles. It's also why the grid overflow bug on the contact page only
appeared *after* that fix — the broken CSS had been silently hiding a second,
real layout bug the whole time. Fixing the import didn't just add styling,
it turned on the sensor that caught the next problem.

**What did this work change about who I want to be as a developer?**

I want to be someone who checks the artefact, not the process that produced
it. A build succeeding is a claim about syntax, not about what a user
receives. This week reinforced a specific habit: after any framework
migration, inspect what actually lands in the output directory before
trusting the dev-server experience — because a static generator's implicit
bundling rules are exactly the kind of thing that looks fine until the one
case where it silently isn't.
