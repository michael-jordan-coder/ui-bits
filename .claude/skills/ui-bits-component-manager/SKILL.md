---
name: ui-bits-component-manager
description: Use this skill whenever the user wants to add, scaffold, create, rename, move, or register a component or a category in the ui bits library at `apps/website/`. Triggers on phrases like "add a component", "create a [Name] component", "scaffold X", "new category", "add [name] to [category]", "make a category called X", "register X", "move [component] to [category]". Handles the 4-variant scaffold, derives the TS variants with a codemod, picks the right folder/display-name pair, updates the three constants files, and preserves git history on moves.
---

# ui bits component manager

Every component ships in **four variants with identical visuals and behavior** —
JS+CSS, JS+Tailwind, TS+CSS, TS+Tailwind — plus a demo and a code-metadata file.
You never hand-write all of that: a scaffolder stamps the files and registers
them, and a codemod derives the TS variants from the JS ones. Author **two files
by hand**, run **two commands**, and you have a green component.

All paths below are relative to `apps/website/`. The repo is **pnpm + turbo**;
never `npm`. `cd apps/website` once at the start.

## Happy path — idea to green component

```bash
cd apps/website

# 1. Scaffold all 8 files + register in the three constants files.
node scripts/generateComponent.js <Category> <PascalName>     # e.g. Scroll ScrollStack

# 2. Author BY HAND (the only real work):
#    src/content/<Category>/<PascalName>/<PascalName>.jsx   ← the component (JS + CSS)
#    src/content/<Category>/<PascalName>/<PascalName>.css
#    src/tailwind/<Category>/<PascalName>/<PascalName>.jsx  ← same component, Tailwind classes
#    src/demo/<Category>/<PascalName>Demo.jsx               ← DemoShell demo + real controls
#    src/constants/code/<Category>/<camelName>Code.js       ← dependencies + usage example
#    src/constants/Information.js entry                      ← real description + tags

# 3. Derive the TS variants + byte-identical CSS copy (no hand-retyping):
node scripts/generateTsVariants.js <Category> <PascalName>
#    Read its output; if it warns about an inner helper component or a prop it
#    couldn't type, finish those types by hand in the two generated .tsx files.

# 4. Verify (real signal — see "Verify").
pnpm lint && pnpm build
SLUG=<kebab-slug>; NAME=<PascalName>
grep -rlq "$SLUG" dist/assets/ && ls dist/assets/ | grep -q "${NAME}Demo-" && echo OK
```

That's the whole loop. Everything below is detail for the steps.

## Categories

| Sidebar label | URL slug | Folder name | `Information.js` category | Use for |
|---|---|---|---|---|
| Components | `/components/` | `Components` | `Components` | Buttons, inputs, menus, overlays — interactive primitives |
| 3D | `/3d/` | `ThreeD` | `ThreeD` | 3D scenes, perspective/WebGL showpieces |
| Scroll | `/scroll/` | `Scroll` | `Scroll` | Scroll- and drag-driven interactions |
| Text Animations | `/text-animations/` | `TextAnimations` | `TextAnimations` | Glyph/character text effects, no interactive controls |
| Backgrounds | `/backgrounds/` | `Backgrounds` | `Backgrounds` | Full-bleed canvas / ambient backdrops |

Default to `Components` unless the fit is unambiguous. Don't invent categories.

**Two-name rule.** The **folder name** is the jsrepo lookup path — it MUST match
the directories under `src/content/<Folder>/`, `src/tailwind/<Folder>/`,
`src/ts-default/<Folder>/`, `src/ts-tailwind/<Folder>/`, and the `category` field
in `Information.js`. The Categories.js `name` is the sidebar label + URL slug and
may differ (folder `ThreeD`, label `'3D'`). Pass the **folder name** to both scripts.

## Authoring the variants

Author the two JS variants by hand; the codemod produces the rest.

- **`content/<Name>.jsx`** — the canonical component (JS + CSS classes).
- **`content/<Name>.css`** — its styles.
- **`tailwind/<Name>.jsx`** — the same component with Tailwind utility classes
  (and inline styles for dynamic values). Visually + behaviorally identical.
- **`generateTsVariants.js`** then writes `ts-default/<Name>.tsx` (typed copy of
  the content variant), `ts-default/<Name>.css` (byte-identical copy), and
  `ts-tailwind/<Name>.tsx` (typed copy of the tailwind variant).

Rules that keep the four in lockstep:

- Animate with **`motion`** via `import { ... } from 'motion/react'`. Never `framer-motion`.
- Icons from **`lucide-react`**.
- Dynamic colors/sizes/positions go through **inline styles** (or CSS custom
  properties), so the same values drive every variant.
- **Registry sources legitimately hardcode their palettes (inline hex).** They are
  standalone copy-paste artifacts and can't reference site design tokens — the
  `design-guard` hook is scoped to skip these dirs, so inline hex here is correct,
  not a violation. (Uppercase/serif/breakpoint rules still apply.)
- Polished, accessible, **reduced-motion-friendly** (`useReducedMotion`): paint a
  static frame / disable loops when reduced motion is on.
- One focused component. No overbuilding, no speculative props.

### The codemod (`generateTsVariants.js`)

Reliably types: the default-export props interface (inferred from the prop
defaults — scalars, `children`, `...rest` → `HTMLAttributes`, and identifier
defaults via `typeof`), the refs (`canvas*` → `HTMLCanvasElement`, else
`HTMLDivElement`), the `join`/`hexToRgb` helpers, and the type-only React imports.

It **warns** (does not guess) when it can't confidently type a prop — typically an
object-array prop (e.g. `items`, `sections`) — or when there's an **inner helper
component** (e.g. a per-row sub-component). When it warns: in both `.tsx` files,
add an exported item interface (`export interface <Name>Item { ... }`), point the
prop at it (`items?: <Name>Item[]`), and type the inner component's props. Skim the
output every time regardless.

## Demo (`DemoShell`)

The demo imports the component from `content/` and renders through `DemoShell`
(`src/components/common/Preview/DemoShell.jsx`), which owns the tabs, preview
`<Flex>`, fullscreen/refresh toolbar, `Customize`, `PropTable`, `Dependencies`,
and `CodeExample`. You pass static props (`defaultProps`, `propData`,
`dependencies`, `codeObject`, `componentName`, optional `flexProps`,
`demoOnlyProps`, `computedProps`) and two render callbacks:

- `preview={({ props, key }) => <Component key={key} {...props} />}` — caller
  applies `key` so refresh re-mounts. Use this for children-bearing components,
  sample data, or literal-string prop overrides.
- `controls={({ props, updateProp, forceRerender }) => <>…</>}` — Customize controls.

**Always ship real controls** — the scaffolder emits an empty `controls` stub, and
an empty right panel is a bug. One control per meaningful prop. Use the `set`
helper so rAF/canvas/observer components re-init on change:

```jsx
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

controls={({ props, updateProp, forceRerender }) => {
  const set = (name, val) => { updateProp(name, val); forceRerender(); };
  return (
    <>
      <PreviewSlider title="Gap" min={16} max={64} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
      <PreviewSwitch title="Streaks" isChecked={props.streak} onChange={v => set('streak', v)} />
      <PreviewSelect title="Direction" options={[{ value: 'up', label: 'Up' }, { value: 'down', label: 'Down' }]} value={props.direction} onChange={v => set('direction', v)} />
    </>
  );
}}
```

Control-API gotchas (read the source if unsure):
- **`PreviewSlider`** `{ title, min, max, step?, value, valueUnit?, onChange }` —
  **`displayValue` is a FUNCTION**, not a string. For a unit suffix use
  `valueUnit="px"`; `displayValue={`${x}px`}` throws.
- **`PreviewSwitch`** `{ title, isChecked, onChange }` — `onChange` gets the next boolean.
- **`PreviewSelect`** `{ title, options, value, onChange }` — `options` is
  `[{ value, label }]`; `onChange` gets the chosen `value`.

**Full-bleed components (backgrounds, canvas, 3D)** must fill fullscreen: make the
root `width:100%; height:100%`, drive the canvas with a `ResizeObserver`, and pass
`flexProps={{ padding: 0, overflow: 'hidden' }}` — never wrap them in a fixed-height
`<div>` (it breaks `FullscreenButton`).

Reference demos: `src/demo/Components/SidebarDemo.jsx` (plain + `flexProps`),
`src/demo/Components/FillButtonDemo.jsx` (children + `demoOnlyProps`),
`src/demo/ThreeD/PosterHelixDemo.jsx` (sample data + literal prop),
`src/demo/Components/DropdownDemo.jsx` (select + switch),
`src/demo/Backgrounds/ParticlesDemo.jsx` (full-bleed canvas).

## Code-metadata + Information.js

- **`constants/code/<Category>/<camelName>Code.js`** — replace the empty
  `dependencies` and the stub `usage` with the real dependency string (e.g.
  `'motion'`) and a real, copy-paste usage example.
- **`constants/Information.js`** — replace the scaffolder's `"Foo component."`
  placeholder with a real one-line description that names the source interaction,
  and add real `tags`.

## Verify

`pnpm lint` (0 warnings) and `pnpm build` must pass. Then check **registration
against the build output**, not a dev route:

```bash
# from apps/website, after `pnpm build`
SLUG=<kebab-slug>; NAME=<PascalName>
grep -rlq "$SLUG" dist/assets/ && echo "✓ slug registered" || echo "✗ slug MISSING"
ls dist/assets/ | grep -q "${NAME}Demo-" && echo "✓ demo chunk built" || echo "✗ demo chunk MISSING"
cmp src/content/<Category>/<NAME>/<NAME>.css src/ts-default/<Category>/<NAME>/<NAME>.css && echo "✓ CSS byte-identical"
```

A dev-server `curl … → 200` is **not** acceptance: the SPA rewrites every path to
`index.html`, so any string returns 200. The slug + demo-chunk grep is the real
signal that the lazy import compiled and the registry wired up.

## Adding a category

1. Pick a **folder name** (PascalCase) and **display name**. Same when plain
   (`Animations`); differ when the label has digits/spaces (folder `ThreeD` →
   `'3D'`; folder `TextEffects` → `'Text Effects'`).
2. In `src/constants/Categories.js`, add `{ name: 'Display Name', subcategories: [] }`.
3. No directory creation needed — variant dirs appear on first scaffold.
4. **Scaffolder match quirk:** `generateComponent.js` finds the category by
   `name: '<FolderCategory>'` in Categories.js. If display ≠ folder, it warns
   "Category not found" — harmless; just add the subcategory line to the right
   entry by hand. To silence it long-term, add a `folder` field to Categories
   entries and patch the scaffolder.

## Moving a component between categories

Use `git mv` to preserve history; update every reference.

```bash
git mv src/content/<Old>/<Name>     src/content/<New>/<Name>
git mv src/tailwind/<Old>/<Name>    src/tailwind/<New>/<Name>
git mv src/ts-default/<Old>/<Name>  src/ts-default/<New>/<Name>
git mv src/ts-tailwind/<Old>/<Name> src/ts-tailwind/<New>/<Name>
git mv src/demo/<Old>/<Name>Demo.jsx              src/demo/<New>/<Name>Demo.jsx
git mv src/constants/code/<Old>/<camelName>Code.js src/constants/code/<New>/<camelName>Code.js
```

Then update:
1. Moved **demo**: the two imports (component + code metadata) switch `<Old>`→`<New>`.
2. Moved **code-metadata**: all five `?raw` imports (`@content`, `@tailwind`,
   `@ts-default`, `@ts-tailwind`, css) switch category.
3. **`Components.js`**: the demo import path `../demo/<Old>/…` → `<New>`.
4. **`Categories.js`**: remove from old `subcategories`, add to new.
5. **`Information.js`**: rename key `'<Old>/<Name>'` → `'<New>/<Name>'`, change `category`.
6. Grep clean: `grep -rn "<Old>/<Name>\|<Old>/<camelName>" src/` returns nothing.

## Naming conventions

| Context | Format | Example |
|---|---|---|
| Component / folder | PascalCase | `ScrollStack` |
| CSS class prefix | kebab-case | `.scroll-stack-*` |
| Route slug | kebab-case | `scroll-stack` |
| Code-metadata file / export | `<camel>Code.js` / camelCase | `scrollStackCode.js` / `scrollStack` |
| Categories display name | space-separated | `Scroll Stack` |
| Category folder | PascalCase | `Scroll`, `ThreeD` |

## Hard rules

- The two CSS files (`content/` + `ts-default/`) are **byte-identical** — the
  codemod copies them; if you edit CSS later, re-copy (`cp`) and re-`cmp`.
- All four variants render identically; differences are language + styling syntax only.
- Let the scaffolder write the registration entries; never hand-add them on first scaffold.
- No placeholders in shipped code: no `// TODO`, no `"Foo bar"` demo strings, no
  stub data unless it's curated sample data the demo needs.
- On move: `git mv` (preserve history), update every `?raw` import, grep clean.

## Reference

- Scaffolder: `scripts/generateComponent.js` (source of truth for files + registration)
- TS codemod: `scripts/generateTsVariants.js`
- Demo shell API: `src/components/common/Preview/DemoShell.jsx`
- Registry constants: `src/constants/{Components,Categories,Information}.js`
- Repo conventions: root `CLAUDE.md` and `apps/website/CLAUDE.md`
