# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project name

The site under `website/` is called **ui bits**. The placeholder `community-bits` still appears in `website/package.json` and as the GitHub repo name (`michael-jordan-coder/community-bits`, private) until Daniel renames them. Treat "ui bits" as the canonical product name in any user-facing copy, docs, and new code; do not propagate the `community-bits` placeholder further.

## Workspace layout

There is no top-level package.json. Four sibling trees, each with a distinct role:

- `website/` — **the build target.** Vite + React 19 + Chakra v3 + Tailwind v4 docs site for ui bits. Has its own git repo (initial commit pushed to a private GitHub). All real development happens here. Run all commands from this directory.
- `docs/` — **planning artifacts only.** Contains `PLAN.md` (the canonical spec used to scaffold `website/`) and any future markdown briefs / context for future Claude sessions. No code.
- `reactbits-clone/react-bits/` — read-only reference clone of the upstream [react-bits](https://reactbits.dev) library. `website/` was scaffolded by mirroring its architecture. Open it to look up patterns; do not modify it.
- `components/` — work-in-progress single-file extractions lifted from Daniel's other projects (`apple-watch/HoneycombGrid.tsx` + `.module.css`, `gsap-button/fill-button.tsx`). Some have broken imports against modules that don't exist here. These are reference material to be ported into `website/`'s 4-variant structure, not edited standalone.

## Working inside `website/`

Commands (always `cd website/` first):

| Command | What it does |
|---|---|
| `npm run dev` | Concurrent: `jsrepo build --watch` (registry) + `vite` (docs site, defaults to :5173, falls back if busy) |
| `npm run build` | `registry:build` → vite build |
| `npm run new:component -- <Category> <ComponentName>` | Scaffold all 8 files + register in `Components.js`, `Categories.js`, `Information.js` |
| `npm run registry:build` | Build jsrepo registry to `public/r/` |
| `npm run lint` | ESLint over `.js,.jsx`. Max warnings = 0. |
| `npm run format` | Prettier write |

No test script. No CI. The git remote (`origin`) is the private `michael-jordan-coder/community-bits` repo.

## Architecture (mirrored from react-bits)

Each component ships in **four variants that must be visually and behaviorally identical**:

| Variant | Path | Lang | Styling |
|---|---|---|---|
| JS + CSS | `src/content/<Category>/<Name>/<Name>.jsx` + `.css` | JS | CSS classes |
| JS + Tailwind | `src/tailwind/<Category>/<Name>/<Name>.jsx` | JS | Tailwind inline |
| TS + CSS | `src/ts-default/<Category>/<Name>/<Name>.tsx` + `.css` (byte-identical copy) | TS | CSS classes |
| TS + Tailwind | `src/ts-tailwind/<Category>/<Name>/<Name>.tsx` | TS | Tailwind inline |

Plus a **demo file** (`src/demo/<Category>/<Name>Demo.jsx`) and a **code metadata file** (`src/constants/code/<Category>/<camelName>Code.js`) that uses Vite's `?raw` imports with the path aliases `@content`, `@tailwind`, `@ts-default`, `@ts-tailwind` (see `website/vite.config.js`).

Three constants files act as the global registry, all auto-updated by `npm run new:component`:
- `src/constants/Components.js` — lazy demo imports keyed by kebab-case slug
- `src/constants/Categories.js` — category → subcategories arrays (+ `NEW` / `UPDATED` arrays for sidebar badges)
- `src/constants/Information.js` — per-component metadata (description, category, name, tags)

Demo files render through a shared shell component, **`DemoShell`** (`src/components/common/Preview/DemoShell.jsx`). The shell owns `ComponentPropsProvider`, `TabsLayout` (`PreviewTab` / `CodeTab`), `useComponentProps` + `useForceRerender`, the preview `<Flex>` container, the `FullscreenButton` + `RefreshButton` toolbar, `Customize`, `PropTable`, `Dependencies`, and `CodeExample`. Individual demos pass static props (`defaultProps`, `propData`, `dependencies`, `codeObject`, `componentName`, optional `flexProps`, `demoOnlyProps`, `computedProps`) and two render callbacks:

- `preview={({ props, key, updateProp, forceRerender }) => <Component key={key} {...props} />}` — returns the component JSX. Caller applies `key={key}` directly so refresh works. Render-prop is the escape hatch for children-bearing components, sample data, or literal-string prop overrides (see `FillButtonDemo` and `PosterHelixDemo`).
- `controls={({ props, updateProp, forceRerender }) => <>...</>}` — returns the Customize controls. Rendered inside the shared `<Customize>` which portals into the right shell panel.

Optional `extraPreview` callback receives the same ctx and renders alongside the component inside the preview Flex (escape hatch for overlay elements, currently unused).

Demos always import the component from `content/` (the JS+CSS variant).

## Components currently shipped

- `Components/FillButton` (`/components/fill-button`) — pill button with a radial GSAP fill that reveals from the cursor entry point. Uses `gsap`, `@gsap/react`, `motion` (not `framer-motion`), `tailwind-merge`.
- `Components/Sidebar` (`/components/sidebar`) — collapsible icon-rail sidebar with resize handle, accent + surface color tokens, badge support.
- `Scroll/HoneycombGrid` (`/scroll/honeycomb-grid`) — infinite drag-tilable hex grid with fisheye scaling.
- `ThreeD/PosterDrum` (`/3-d/poster-drum`) — cylindrical poster carousel with idle drift, drag inertia, HUD.
- `ThreeD/PosterHelix` (`/3-d/poster-helix`) — vertical helix of posters with grain/vignette/axis overlays and twist drag.

## Authoritative recipe for adding components

The scaffolder at `website/scripts/generateComponent.js` is the source of truth. It generates all 8 files and patches the three constants registries. The generated demo file uses `DemoShell` directly — see `src/components/common/Preview/DemoShell.jsx` for the API and any ported demo (e.g. `src/demo/Components/SidebarDemo.jsx`, `src/demo/ThreeD/PosterHelixDemo.jsx`) for examples covering plain spread, children-bearing, and sample-data overrides.

`reactbits-clone/react-bits/.context/new-component.md` is the upstream react-bits recipe and still useful for variant rules, naming, and the byte-identical CSS rule across content/ts-default — but its inline demo pattern is intentionally **not** followed here; this codebase has diverged in favor of the `DemoShell` wrapper.

Naming: `PascalCase` for component/file/folder, `kebab-case` for route slug and CSS class prefix, `camelCase` for the code metadata export, category display name is space-separated.

## Source of the planning spec

`docs/PLAN.md` is the spec that produced the current `website/` shell. If you need to understand a design decision (provider stack ordering, route table, why a context exists), check it first — it predates the codebase and explains the why.
