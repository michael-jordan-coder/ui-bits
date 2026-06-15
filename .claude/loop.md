# Spell Component Scheduled Task

## Scheduling model

This prompt is designed for a **Claude Code Desktop Scheduled Task**, not a bare `/loop`.

Configure the scheduled task to run:

```txt
every 10 minutes
```

for a maximum intended window of:

```txt
3 hours
```

Use a fresh Claude Code Desktop scheduled-task session for each run.

Each run must create **at most ONE** new component.

Do not keep the session alive waiting for the next run.
Do not use `/loop` from inside this task.
Do not self-schedule another task.
Do not compensate for missed runs by creating multiple components.
If a previous scheduled run was missed, skipped, delayed, or caught up later, still create at most ONE component.

Recommended scheduled-task settings:

* Working folder: repo root
* Use isolated worktree: enabled, if available
* Permission mode: use the safest mode that can still run the pipeline without stalling
* First run: run manually once and approve required recurring permissions before leaving it unattended

## Autonomous task

Add ONE new, high-quality, genuinely useful component to the ui bits library in this repo:

```txt
apps/website/
```

The component must be sourced from a delightful interaction documented on:

```txt
https://designspells.com
```

Then run the full pipeline end-to-end and auto-merge to `main`.

Exactly one component per scheduled run.

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

If the stop check is unclear because commit timestamps are missing or ambiguous, do not guess. Run a more detailed git command such as:

```bash
git log --grep='\[spell-loop\]' --pretty=format:'%h %cI %s' origin/main
```

Then decide from the commit timestamps.

If the loop is still inside the 3-hour / 18-component window, continue.

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

If you truly cannot find a fresh high-quality spell on designspells.com, fall back to:

```txt
https://reactbits.dev
```

Record the source URL clearly.

The final commit message must include the source URL.

## 3) Build it

Use the `ui-bits-component-manager` skill / scaffolder as the source of truth.

From the repo root, run:

```bash
cd apps/website && node scripts/generateComponent.js <Category> <PascalName>
```

Use `Components` unless another category clearly fits better.

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

* `pnpm lint` must pass
* max warnings must be 0
* `pnpm build` must pass
* registry build must succeed
* Vite build must succeed

Then serve the app and curl the new component route.

The new route must return HTTP 200.

If the route does not return 200, fix it before shipping.

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

Open a PR to `main`.

Squash-merge the PR into `main`.

Do not leave the PR open.

Do not merge if anything is broken.

## Failure rule

If the component cannot be made green, abandon that idea and end the run cleanly.

Do not merge broken code.

Do not leave half-finished work on `main`.

Do not create a second component in the same run.

One scheduled run always means one component maximum.

## Final response format

At the end of each run, respond with one compact summary:

```txt
Status:
Component:
Source:
Branch:
PR:
Verification:
Merged:
Notes:
```

If the stop check triggered, respond with:

```txt
Status: stopped
Reason:
Components added in this loop:
Final notes:
```
