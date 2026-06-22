# Spell Component Scheduled Task

## Scheduling model

This prompt is designed for a **Claude Code Desktop Scheduled Task**.

Configure the scheduled task to run:

```txt
once (it loops internally until the stop conditions are met)
```

for a maximum intended window of:

```txt
3 hours
```

The task runs a continuous internal loop — it keeps building components back-to-back, compacting context between each one, until a stop condition triggers. Do not configure it to run on a repeating interval; one session is the full run.

Recommended scheduled-task settings:

* Working folder: repo root
* Use isolated worktree: disabled (the loop needs to push branches)
* Permission mode: use the safest mode that can still run the pipeline without stalling
* First run: run manually once and approve required recurring permissions before leaving it unattended

## Autonomous task

Continuously add new, high-quality, genuinely useful components to the ui bits library in this repo:

```txt
apps/website/
```

Each component must be sourced from a delightful interaction documented on:

```txt
https://designspells.com
```

Run the full pipeline end-to-end for each component, open a PR, then immediately compact context and start the next component. Repeat until the stop conditions trigger.

## Stop check

Do this FIRST, every run.

Run:

```bash
git fetch origin main
git log --grep='\[spell-loop\]' --oneline --decorate --date=iso origin/main
```

Then inspect the `[spell-loop]` commits on `origin/main`.

This scheduled loop is limited to:

```txt
3 hours / up to 18 successful component runs
```

Stop immediately if either condition is true:

1. There are already 18 or more `[spell-loop]` commits from the current loop window.
2. The oldest `[spell-loop]` commit from the current loop window is more than 3 hours old.

If either stop condition is true:

* build nothing
* create no branch
* open no PR
* merge nothing
* do not start a replacement task
* post a one-message final summary of every component the loop added
* if the scheduled-task management tool is available, pause or disable this scheduled task

If `git fetch` fails (network error, auth issue), do not proceed. End the run with:

```txt
Status: stopped
Reason: git fetch failed — cannot verify stop conditions
```

If the stop check is unclear because commit timestamps are missing or ambiguous, do not guess. Run a more detailed git command such as:

```bash
git log --grep='\[spell-loop\]' --pretty=format:'%h %cI %s' origin/main
```

Then decide from the commit timestamps.

If the loop is still inside the 3-hour / 18-component window, continue to the next component.

## 1) Avoid duplicates

Read these files before choosing an idea:

```txt
apps/website/src/constants/Information.js
apps/website/src/constants/Components.js
apps/website/src/constants/Categories.js
```

Use them to list every component that already exists.

Pick something conceptually new.

Never re-create, lightly re-skin, rename, or duplicate an existing component.

The new component must be meaningfully different in interaction model, use case, or behavior.

**Keep a candidate backlog** at the bottom of this file (`## Candidate backlog`).
Before building, pick the next unbuilt entry instead of re-deriving ideas from
scratch each loop; when you discover good interactions you won't build this round,
append them. This avoids re-reading the whole registry every loop and prevents
near-duplicate ideas across loops.

**Concurrency isolation.** If other agents may be working in this repo at the same
time (they share ONE working tree / HEAD), do all git + build work in a dedicated
worktree so you never disturb their checkout:
`git worktree add --detach <path> origin/main`, then symlink `node_modules` and
`apps/website/node_modules` into it. Never `git checkout` in the shared tree while
another agent holds a branch there.

## 2) Discover a spell

Find a fresh interaction on:

```txt
https://designspells.com
```

Use browser-first discovery if a browser/MCP tool is available.

If browser access is not available, fall back to WebSearch with:

```js
allowed_domains=["designspells.com"]
```

Example query:

```txt
site:designspells.com <topic>
```

Choose an interaction that maps to a self-contained, reusable, controllable UI component.

The component should be genuinely useful, not merely decorative.

If you truly cannot find a fresh high-quality spell on designspells.com, fall back in this order:

1. `https://60fps.design` — buttery-smooth micro-interactions and motion studies (great for Scroll/motion components)
2. `https://www.shapeof.ai` — world-class AI product UI interactions
3. `https://reactbits.dev` — component interactions and animation patterns
4. `https://mobbin.com` — real-world UI/UX flows from top-tier apps

Record the source URL clearly.

The final commit message must include the source URL.

## 3) Build it

Use the `ui-bits-component-manager` skill / scaffolder as the source of truth.

From the repo root, run:

```bash
cd apps/website && node scripts/generateComponent.js <Category> <PascalName>
```

Use `Components` as the default. Only use another existing category if the component is an unambiguous fit:

| Category | Use when |
|---|---|
| `Components` | Interactive UI elements (buttons, inputs, menus, overlays) |
| `ThreeD` | Requires a 3D canvas or three.js/WebGL |
| `Scroll` | Primarily driven by scroll position |
| `TextAnimations` | Text-only animation with no interactive controls |
| `Backgrounds` | Full-bleed, non-interactive background layers |

Do NOT invent a new category. If nothing fits, use `Components`.

Then fully author all FOUR variants so they look and behave identically:

* JS + CSS
* JS + Tailwind
* TS + CSS
* TS + Tailwind

**Author the two JS variants by hand, then derive the rest mechanically.** The
TS variants differ from the JS variants only by type annotations, and the
`ts-default` CSS is a byte copy of the `content` CSS. Do not hand-retype them —
after writing `content/<Name>.{jsx,css}` and `tailwind/<Name>.jsx`, run:

```bash
cd apps/website && node scripts/generateTsVariants.js <Category> <Name>
```

It copies the CSS byte-identically and generates both `.tsx` variants (typed
props interface inferred from the prop defaults, typed refs, type-only imports).
Read its output and fix any prop the inference couldn't type confidently. This
roughly halves the per-component authoring volume.

Rules:

* Animate with the `motion` package using `motion/react`
* Do NOT use `framer-motion`
* Use icons from `lucide-react`
* The two CSS files in `content/` and `ts-default/` MUST be byte-identical (the codemod guarantees this; verify with `cmp`)
* Apply dynamic colors, sizes, and runtime styling through inline styles
* Registry component sources hardcode their own palettes (inline hex) on purpose — they are standalone copy-paste artifacts and cannot reference site tokens; this is correct, not a violation
* Keep the component polished, accessible, and reduced-motion-friendly where reasonable
* Avoid overbuilding; make one focused, excellent component

Write a real `DemoShell` demo.

The demo must include genuine Customize controls for every meaningful prop, using the available preview controls such as:

* `PreviewSlider`
* `PreviewSwitch`
* `PreviewSelect`

Never leave the controls stub empty.

Fill the code-metadata file with:

* real `dependencies`
* a real `usage` example

Update `Information.js`:

* replace placeholder description
* add real tags
* include a one-line description that names the inspiration/source interaction

## 4) Verify

From the repo root, run:

```bash
pnpm lint
pnpm build
```

Requirements:

* `pnpm lint` must exit 0 with zero warnings
* `pnpm build` must exit 0
* registry build must succeed
* Vite build must succeed

Then verify registration against the **build output**, not a route status. The app
is a SPA — every path rewrites to `index.html`, so `curl /…/<slug>` returns `200`
for any string and proves nothing. The real signal is that `pnpm build` compiled
the demo's lazy import into a chunk and the slug landed in the registry bundle:

```bash
# from apps/website, after `pnpm build`
SLUG="<kebab-slug>"                       # e.g. scroll-stack
NAME="<PascalName>"                        # e.g. ScrollStack
grep -rlq "$SLUG" dist/assets/ && echo "✓ slug registered" || echo "✗ slug MISSING"
ls dist/assets/ | grep -q "${NAME}Demo-"  && echo "✓ demo chunk built" || echo "✗ demo chunk MISSING"
```

Both checks must pass. If the slug is missing, fix the registration in
`Components.js` / `Information.js` / `Categories.js` before shipping. A dev-server
`200` is NOT acceptance — do not use it to declare the route working.

Also confirm the two CSS files are byte-identical: `cmp content/<…>.css ts-default/<…>.css`.

## 5) Ship

**Batch the loop's components into ONE branch/PR.** The three registry constants
files (`Components.js`, `Categories.js`, `Information.js`) are append-only, so two
concurrent single-component PRs ALWAYS collide there. Building N components on one
branch eliminates that conflict entirely and cuts PR/merge/deploy overhead.

Create a fresh branch off the latest `origin/main`. Branch name: `spell/<slug>`
(or `spell/<slugA>-<slugB>` for a batch).

Commit the completed work. The commit message MUST include the literal tag
`[spell-loop]`, the component name(s), and the source spell URL(s).

Push the branch and open a PR to `main`:

```bash
gh pr create --title "Add <Names> [spell-loop]" --body "Source: <spell-url(s)>" --base main
```

**Merging & deploying (self-merging runs).** When no PR babysitter is running,
merge it yourself once Verify is green:

```bash
gh pr merge <branch> --squash --delete-branch
```

Then deploy production. Vercel git auto-deploy is BROKEN for this repo, and a
plain `vercel deploy --prod` from a worktree silently rebuilds a STALE git ref
(same bundle hash, new components absent) — `--force` does not fix it. Use the
prebuilt + explicit-alias recipe (build locally, upload the output, move the
domain alias):

```bash
# from a clean checkout of merged origin/main (a dedicated worktree is fine)
vercel build --prod --yes --scope dadas-projects-5692ffa9
grep -rlq "<slug>" .vercel/output/static/assets/   # confirm the build has it
URL=$(vercel deploy --prebuilt --prod --yes --scope dadas-projects-5692ffa9 | grep -oE 'https://community-bits-[a-z0-9]+-dadas-projects-5692ffa9\.vercel\.app' | tail -1)
vercel alias set "$URL" community-bits.vercel.app --scope dadas-projects-5692ffa9
```

Verify live: the served `/assets/index-*.js` hash must match your local
`apps/website/dist` hash and contain the slug; demo chunks return 200.

If a PR babysitter IS running, skip the merge/deploy — open the PR and stop.

## 6) Compact and continue

After the PR is open, emit this per-component summary:

```txt
✓ Component: <name>
  Source: <url>
  Branch: <branch>
  PR: <url>
```

Then immediately compact the conversation context to free up space for the next component:

```
/compact
```

After compacting, go directly back to **Stop check**. Do not pause, do not wait. If the stop conditions are not met, start the next component immediately.

This is a continuous loop. Keep building until the stop conditions trigger.

## 7) Improve this prompt every loop

Before starting the next component, spend one short reflection on **this file**:
note any friction you hit this loop (a repeated manual step, a misleading
instruction, a check that gave a false signal, a tool that fought you) and make a
small, concrete edit to `loop.md` that would have prevented it — tighten a step,
fix a stale command, add a guard, append to the candidate backlog, or record a
gotcha. Keep edits surgical and high-signal; do not bloat the prompt. The loop
should get sharper every iteration, not just longer. If nothing genuinely needs
changing this loop, say so in one line and move on — do not invent busywork.

## Failure rule

If a component cannot be made green:

* Abandon that idea
* Clean up any partial branch or uncommitted files
* Emit a one-line failure note: `✗ Skipped: <name> — <reason>`
* Compact the conversation context: `/compact`
* Go directly back to **Stop check** and start fresh on the next component

Do not leave half-finished work on `main`. Do not give up on the whole session because one component failed.

## Final response format

When the stop check triggers (session ends), emit one summary of everything the loop accomplished:

```txt
Status: stopped
Reason: <18 components reached | 3-hour window expired>
Components added this session:
  1. <name> — PR #<n> — <source>
  2. <name> — PR #<n> — <source>
  ...
Skipped: <list with reasons, or "none">
```

## Candidate backlog

Pick the next unbuilt entry; cross out / delete when shipped; append new finds.
Verify against the registry before building — the list is a hint, not a guarantee
the idea is still novel.

**Scroll**
- ScrollSnapCarousel — CSS scroll-snap gallery with active-dot sync (mobbin gallery pattern)
- ScrollMinimap — a side rail that maps section positions and scrolls-to on click
- ScrollSpyNav — sticky nav whose active item tracks the section in view
- ImageCompareScroll — before/after wipe driven by scroll progress

**Backgrounds**
- Spotlight — a single soft radial light drifting a slow path over a flat surface (distinct from Grid's bloom: no grid)
- Grain — animated film-grain/noise overlay over a flat or tinted surface
- Constellation — slow points linked by proximity lines (distinct from Particles' optional connect: graph-like, denser)
- Contour — animated topographic isolines (marching-squares of a moving noise field)
- Rays — soft volumetric light rays fanning from an off-screen point

**Already shipped this lineage (do NOT rebuild):** ScrollStack, ScrollVelocity,
ScrollReveal, HorizontalScroll, ScrollProgress, ParallaxScroll, Waves, Grid,
Beams, Threads, Starfield, Plasma, HoneycombGrid, DotGrid, Aurora, Particles, Ripple.
