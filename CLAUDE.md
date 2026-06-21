# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project name

The site under `apps/website/` is called **ui bits**. It is the canonical product name everywhere: the workspace package is `ui-bits-website`, the jsrepo registry namespace is `@ui-bits`, and the public GitHub repo is `michael-jordan-coder/ui-bits`. The earlier `community-bits` placeholder has been retired — do not reintroduce it. (The live Vercel domain is still `community-bits.vercel.app`; renaming that project is a separate, optional follow-up.)

## Workspace layout

This is a **pnpm + turbo monorepo**. Top-level `package.json` is `ui-bits-monorepo` (private, not published). Workspaces glob: `apps/*` and `packages/*`.

- `apps/website/` — **the build target.** Vite + React 19 + Chakra v3 + Tailwind v4 docs site for ui bits. All real development happens here.
- `packages/` — empty placeholder for future shared packages.
- `docs/` — **planning artifacts only.** Contains `PLAN.md` (the canonical spec that produced the `apps/website/` shell) and any future markdown briefs. No code.
- `branding/` — brand source artwork and standalone previews. Currently: `Logo.preview.jsx` (renders the mark at 16/24/48/128/512 on light + dark surfaces) and `explorations/` (source SVGs that fed the canonical assets in `apps/website/public/`).

The git remote (`origin`) is the public `michael-jordan-coder/ui-bits` repo (MIT-licensed; `main` is protected against force-push and deletion). Deployment is wired through `vercel.json` pointing `outputDirectory` at `apps/website/dist`.

## Commands

Two equivalent ways to run things — pick whichever:

**From repo root (preferred — turbo handles routing):**

| Command | What it does |
|---|---|
| `pnpm dev` | Concurrent `jsrepo build --watch` + `vite` for `apps/website` |
| `pnpm build` | `registry:build` → vite build |
| `pnpm lint` | ESLint over `.js,.jsx`. Max warnings = 0. |
| `pnpm format` | Prettier write |
| `pnpm new:component -- <Category> <ComponentName>` | Scaffold all 8 files + register in `Components.js`, `Categories.js`, `Information.js` |

**From `apps/website/`:**

| Command | What it does |
|---|---|
| `pnpm dev` | Same as above, scoped to this workspace |
| `pnpm build` | `registry:build` → vite build |
| `pnpm new:component -- <Category> <ComponentName>` | Scaffolder |
| `pnpm registry:build` | Build jsrepo registry to `public/r/` |
| `pnpm lint` | ESLint, max warnings = 0 |
| `pnpm format` | Prettier write |

No test script. No CI.

## Architecture (mirrored from react-bits)

Each component ships in **four variants that must be visually and behaviorally identical**:

| Variant | Path | Lang | Styling |
|---|---|---|---|
| JS + CSS | `src/content/<Category>/<Name>/<Name>.jsx` + `.css` | JS | CSS classes |
| JS + Tailwind | `src/tailwind/<Category>/<Name>/<Name>.jsx` | JS | Tailwind inline |
| TS + CSS | `src/ts-default/<Category>/<Name>/<Name>.tsx` + `.css` (byte-identical copy) | TS | CSS classes |
| TS + Tailwind | `src/ts-tailwind/<Category>/<Name>/<Name>.tsx` | TS | Tailwind inline |

Plus a **demo file** (`src/demo/<Category>/<Name>Demo.jsx`) and a **code metadata file** (`src/constants/code/<Category>/<camelName>Code.js`) that uses Vite's `?raw` imports with the path aliases `@content`, `@tailwind`, `@ts-default`, `@ts-tailwind` (see `apps/website/vite.config.js`).

Three constants files act as the global registry, all auto-updated by `pnpm new:component`:
- `src/constants/Components.js` — lazy demo imports keyed by kebab-case slug
- `src/constants/Categories.js` — category → subcategories arrays (+ `NEW` / `UPDATED` arrays for sidebar badges)
- `src/constants/Information.js` — per-component metadata (description, category, name, tags)

Demo files render through a shared shell component, **`DemoShell`** (`src/components/common/Preview/DemoShell.jsx`). The shell owns `ComponentPropsProvider`, `TabsLayout` (`PreviewTab` / `CodeTab`), `useComponentProps` + `useForceRerender`, the preview `<Flex>` container, the `FullscreenButton` + `RefreshButton` toolbar, `Customize`, `PropTable`, `Dependencies`, and `CodeExample`. Individual demos pass static props (`defaultProps`, `propData`, `dependencies`, `codeObject`, `componentName`, optional `flexProps`, `demoOnlyProps`, `computedProps`) and two render callbacks:

- `preview={({ props, key, updateProp, forceRerender }) => <Component key={key} {...props} />}` — returns the component JSX. Caller applies `key={key}` directly so refresh works. Render-prop is the escape hatch for children-bearing components, sample data, or literal-string prop overrides (see `FillButtonDemo` and `PosterHelixDemo`).
- `controls={({ props, updateProp, forceRerender }) => <>...</>}` — returns the Customize controls. Rendered inside the shared `<Customize>` which portals into the right shell panel.

Optional `extraPreview` callback receives the same ctx and renders alongside the component inside the preview Flex (escape hatch for overlay elements, currently unused).

Demos always import the component from `content/` (the JS+CSS variant).

## Components currently shipped

The registry constants are the canonical, always-current inventory — `src/constants/Information.js` (descriptions + tags), `src/constants/Categories.js` (sidebar order), and `src/constants/Components.js` (route slugs). The snapshot below covers **45 components across 5 categories** as of this writing; consult those files rather than trusting this list for exhaustiveness.

The five live category folders are `Components`, `Backgrounds`, `Scroll`, `TextAnimations`, and `ThreeD` (sidebar display names: `Components`, `Backgrounds`, `Scroll`, `Text Animations`, `3D`).

- **Components** (35): `Accordion`, `AnimatedMenu`, `AvatarStack`, `BorderBeam`, `CommandPalette`, `ConfettiButton`, `CopyButton`, `Dock`, `Dropdown`, `FillButton`, `FloatingInput`, `HoldButton`, `LikeButton`, `MagneticButton`, `Marquee`, `MoodPicker`, `OtpInput`, `PeekPassword`, `PillNav`, `RadialProgress`, `RainbowButton`, `RangeSlider`, `ReorderList`, `RubberSlider`, `ScoreMeter`, `SegmentedToggle`, `Sidebar`, `SpotlightCard`, `StarRating`, `Stepper`, `SwipeAction`, `ThemeToggle`, `TiltCard`, `Toast`, `Tooltip`.
- **Backgrounds** (3): `Aurora`, `DotGrid`, `Particles`.
- **TextAnimations** (4): `NumberTicker`, `ScrambleText`, `ShinyText`, `TypewriterText`.
- **ThreeD** (2): `PosterDrum`, `PosterHelix`.
- **Scroll** (1): `HoneycombGrid`.

A few worth knowing the internals of: `Components/FillButton` (`gsap`, `@gsap/react`, `motion` — not `framer-motion` — `tailwind-merge`); `Scroll/HoneycombGrid` (virtualized fisheye hex grid); the two `ThreeD/Poster*` carousels (CSS-3D, single rAF loop). Most newer components are `motion`-driven micro-interactions ported from designspells.com / reactbits.dev — check each one's `Information.js` entry for its inspiration and dependency profile.

## Component automation (`.claude/`)

New components are typically added in batches by coordinated agent loops (the `[spell-loop]` commits in the history), driven by `.claude/loop.md`. The `.claude/skills/ui-bits-component-manager/SKILL.md` skill encodes the add/scaffold/rename/move recipe and is the preferred entry point for component work. `.claude/babysit-prs.md` documents the PR-babysitter flow that merges those component PRs and auto-resolves registry-only conflicts (the three constants files are append-only, so concurrent additions collide there predictably). `.claude/hooks/session-start.sh` runs on session start to prepare pnpm.

## Brand assets

The ui bits mark is a hand-authored line-art trefoil (three rounded-rectangle "bits" crossed at 0°/60°/120°, tilted -12° off vertical, with a center dot). It lives in two places:

- **Public deployment assets** at `apps/website/public/`:
  - `logo.svg` — canonical, currentColor
  - `logo-mono.svg` — alias for currentColor mark
  - `logo-color.svg` — pinned to `#fafafa` (the `--primary` token)
  - `logo-favicon.svg` — same geometry, stroke bumped to 1.4 for 16px legibility. Wired in `index.html` via `<link rel="icon" type="image/svg+xml" href="/logo-favicon.svg">`.
- **Shared inline-SVG component** at `apps/website/src/components/common/Logo.jsx` — used in the landing hero and the chrome sidebar footer. Props: `size`, `strokeWidth`, `dotRadius`, `className`, `ariaLabel`. Uses `currentColor` so it themes with the surrounding text color.
- **Source artwork** at `branding/explorations/v4-knot.svg` (currentColor) and `branding/explorations/v4-knot-on-dark.svg` (preview rendering). The chosen design only — earlier explorations were removed.
- **Standalone preview** at `branding/Logo.preview.jsx` — renders the mark at 16/24/48/128/512 on light and dark surfaces, plus the wordmark lockup. Not routed in the app; open it in a sandbox or temporary route to inspect.

When the mark needs to change, edit `apps/website/src/components/common/Logo.jsx` and the four files in `apps/website/public/` together — they must stay in sync.

## Authoritative recipe for adding components

The scaffolder at `apps/website/scripts/generateComponent.js` is the source of truth. It generates all 8 files and patches the three constants registries. The generated demo file uses `DemoShell` directly — see `src/components/common/Preview/DemoShell.jsx` for the API and any existing demo (e.g. `src/demo/Components/SidebarDemo.jsx`, `src/demo/Components/DropdownDemo.jsx`, `src/demo/ThreeD/PosterHelixDemo.jsx`) for examples covering plain spread, customize-controls, children-bearing, and sample-data overrides.

Naming: `PascalCase` for component/file/folder, `kebab-case` for route slug and CSS class prefix, `camelCase` for the code metadata export, category display name is space-separated.

**Variant rules to know:**
- CSS files in `src/content/<Cat>/<Name>/<Name>.css` and `src/ts-default/<Cat>/<Name>/<Name>.css` MUST be byte-identical (copy with `cp`, don't retype).
- All 4 variants render identically. Differences are language and styling syntax only.
- After scaffolding, replace the scaffolder's placeholder description in `Information.js` with a real one-line description.

## Source of the planning spec

`docs/PLAN.md` is the spec that produced the current `apps/website/` shell. If you need to understand a design decision (provider stack ordering, route table, why a context exists), check it first — it predates the codebase and explains the why.
