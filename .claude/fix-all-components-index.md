# Prompt: make the "All components" page show every component

## Problem

The "All components" catalog page (`apps/website/src/pages/IndexPage.jsx`, reachable at
`/components/index`, also linked from the landing-hero "All components →" button) is driven by
`apps/website/src/constants/showcaseItems.jsx`, which is a **hand-curated set of only 8 cards**.

The actual library has **58 components** (the registry — `src/constants/Components.js`,
`Information.js`, `Categories.js` — is the source of truth). So the page silently shows 8 of 58.
It also drifts every time a component is added, because new components never get appended to
`showcaseItems`.

Goal: the index page must list **every component in the registry**, grouped by category, and keep
doing so automatically as new components land — never again a hand-maintained subset.

## Root cause / why it drifts

`showcaseItems` couples two unrelated concerns:
1. **The landing-hero bento** (Gallery) — genuinely wants a small curated set with bespoke
   live previews and `gridArea` placement.
2. **The full catalog** (IndexPage) — wants *completeness*, sourced from the registry.

Fix = separate them. Catalog completeness comes from the registry; curated live previews become an
*optional override* keyed by slug, shared by both surfaces.

## Registry facts you need (verify before coding)

- `src/constants/Categories.js` → `CATEGORIES`: ordered `{ name, subcategories: [displayName] }`.
  Skip `'Get Started'`. The other 5 categories hold all 58 components, in sidebar order. This is the
  completeness source.
- `src/constants/Information.js` → `componentMetadata`: keyed by `"<Folder>/<PascalName>"`, each
  `{ description, category, name, tags }`. Source of `tags` for the cards.
- `src/constants/Components.js` → `componentMap`: keyed by **kebab slug** → lazy demo import. The
  slug is the route's `:subcategory` param and the demo lookup key.
- Slug helper: `slug` in `src/utils/utils.js` = `str.replace(/\s+/g, '-').toLowerCase()`.
  - Route for a component = `` `/${slug(category.name)}/${slug(displayName)}` ``
    (e.g. `Poster Helix` in `3D` → `/3d/poster-helix`). The `:category` segment is cosmetic —
    `CategoryPage` resolves purely on the `:subcategory` slug — so any correct slug works.
  - `slug(displayName)` (display names have spaces, e.g. `"Fill Button"`) === the `componentMap` key
    (`"fill-button"`). Do NOT derive the slug from `componentMetadata.name` (PascalCase, no spaces) —
    `slug("FillButton")` = `"fillbutton"`, wrong.
- **Category display name → content folder** mapping (needed to build the `componentMetadata` key):
  `3D → ThreeD`, `Text Animations → TextAnimations`, everything else identical
  (`Components`, `Scroll`, `Backgrounds`). The metadata key for a card =
  `` `${folder}/${displayName.replace(/\s+/g, '')}` ``.
- `ComponentCard` (`src/components/common/ComponentCard.jsx`) needs `item = { key, name, category,
  route, tags, render }` and calls `item.render()` inside the preview box.

## Required design

### 1. Slug-keyed preview registry (single source of truth for live previews)
Create `src/constants/componentPreviews.jsx`. Export `componentPreviews`: a map of
`slug → () => JSX` containing the **8 existing bespoke previews** moved verbatim out of
`showcaseItems.jsx` (poster-helix, honeycomb-grid, poster-drum, fill-button, dropdown, sidebar,
scramble-text, dot-grid), including the `HELIX_POSTERS` sample data and the `.component-card-center`
/ `.component-card-sidebar` wrappers. This is the override map both surfaces read from.

### 2. Auto live preview from `content/` with graceful fallback
Most components have no bespoke preview. Render them live from their real implementation:
- Lazy-import `content/<Folder>/<Name>/<Name>.jsx` for each slug and render with no/minimal props.
- Wrap **every** preview in a real React **ErrorBoundary** (none exists yet — create
  `src/components/common/PreviewErrorBoundary.jsx`, a class component using
  `getDerivedStateFromError`) plus `<Suspense>`. If a component throws, returns null, or renders
  empty, the boundary shows a clean **typographic fallback**: the component name centered in the
  card using existing type/color tokens (NO emoji, NO uppercase, sentence case, no placeholder
  imagery). The fallback must look intentional, not like a broken tile.
- Resolution order per card: `componentPreviews[slug]` if present → else lazy `content/` render →
  ErrorBoundary fallback. Curated previews always win.
- Performance: 58 live previews on one page — lazy-import + only mount when near viewport
  (`react-intersection-observer` already a dep? check `package.json`; if not,
  a small `IntersectionObserver` hook). Backgrounds/3D/canvas pieces must NOT all animate at once —
  pause off-screen ones (respect the existing reduced-motion conventions in those components).

### 3. Rebuild `IndexPage.jsx` off the registry
- Iterate `CATEGORIES` (skip `'Get Started'`) in declared order → that IS the section order; drop
  the now-redundant hardcoded `CATEGORY_ORDER`.
- For each `category.subcategories` displayName, build the card item
  (`key`/`name`/`category`/`route`/`tags`/`render`) using the mappings above.
- Render through the existing `ComponentCard` + `.index-grid` / `.index-section` markup. Keep the
  `<h2 className="sub-category">All components</h2>` heading and `BackToTopButton`.

### 4. Keep the landing Gallery curated
`Gallery.jsx` keeps showing its 8-tile bento. Refactor `showcaseItems.jsx` so each item's `render`
pulls from `componentPreviews` (no duplicated preview code). `AREA_BY_KEY` placement stays in
`Gallery.jsx`. Do not bloat the hero with 58 tiles.

## Constraints (project rules)
- Follow `design-token-discipline`: existing tokens only, no new color/spacing values, no inline
  hex/raw px where a token exists, sentence case, no uppercase, no emoji, sans-only.
- No `TODO`/placeholder strings left in code paths; no swallowed errors except the deliberate
  ErrorBoundary fallback (which renders a real fallback, not silence).
- Match existing file/styling conventions (`.css` files alongside, the `index-*` class names).
- `pnpm lint` must pass with max-warnings 0.

## Verification (must do, not optional)
1. Run `pnpm dev` and open `/components/index`. **Count the cards = 58** and confirm every category
   section is present (Components 42, 3D 7, Scroll 1, Text Animations 4, Backgrounds 4).
2. Add a quick guard so drift is caught: the rendered card count must equal the total number of
   registry components. Either a tiny runtime assertion in dev, or a comment documenting the
   invariant — at minimum confirm by eye that the number matches `Object.keys(componentMap).length`.
3. Spot-check ~6 cards across categories: each links to its working detail route, curated previews
   render live, auto-previews render live where possible, and the rest show the clean typographic
   fallback (no broken/blank tiles, no console errors).
4. Confirm the landing-hero Gallery still shows exactly its 8 curated tiles, unchanged.
5. `pnpm lint`.

Report: total cards rendered, how many are live vs fallback, and any component whose auto-preview
needs a bespoke entry added to `componentPreviews` later.
