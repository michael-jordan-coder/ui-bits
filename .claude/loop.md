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

1. `https://reactbits.dev` — component interactions and animation patterns
2. `https://shapeof.ai` — world-class AI product UI interactions
3. `https://mobbin.com` — real-world UI/UX flows from top-tier apps

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

Rules:

* Animate with the `motion` package using `motion/react`
* Do NOT use `framer-motion`
* Use icons from `lucide-react`
* The two CSS files in `content/` and `ts-default/` MUST be byte-identical
* Copy the CSS file with `cp` to guarantee byte identity
* Apply dynamic colors, sizes, and runtime styling through inline styles
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

Then verify the new component route is registered correctly by running the Vite dev server in the background and curling its output:

```bash
pnpm --filter ui-bits-website dev &
DEV_PID=$!
sleep 8
SLUG=$(echo "<kebab-slug>" | tr '[:upper:]' '[:lower:]')
curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173/components/${SLUG}"
kill $DEV_PID 2>/dev/null
```

Replace `<kebab-slug>` with the actual route slug (e.g. `rubber-slider`).

The route must return HTTP 200.

If it returns anything other than 200, fix the registration in `Components.js` / `Information.js` / `Categories.js` before shipping. Do not kill the build loop to paper over a routing failure.

## 5) Ship

Create a fresh branch off the latest `origin/main`.

Branch name format:

```txt
spell/<slug>
```

Commit the completed work.

The commit message MUST include:

* the literal tag `[spell-loop]`
* the component name
* the source spell URL

Push the branch.

Open a PR to `main`:

```bash
gh pr create --title "<ComponentName> [spell-loop]" --body "Source: <spell-url>" --base main
```

Do not merge the PR yourself. The PR babysitter (`.claude/babysit-prs.md`) will merge it after verifying lint and build pass. Your job is done once the PR is open.

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
