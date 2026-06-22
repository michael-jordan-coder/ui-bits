---
name: ui-bits-component-manager
description: Use this skill whenever the user wants to add, scaffold, create, rename, move, or register a component or a category in the ui bits library at `apps/website/`. Triggers on phrases like "add a component", "create a [Name] component", "scaffold X", "new category", "add [name] to [category]", "make a category called X", "register X", "move [component] to [category]". Handles the 4-variant scaffold, derives the TS variants with a codemod, picks the right folder/display-name pair, updates the three constants files, and preserves git history on moves.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(node scripts/generateComponent.js:*), Bash(node scripts/generateTsVariants.js:*), Bash(node scripts/verifyComponent.js:*), Bash(pnpm new:component:*), Bash(pnpm lint), Bash(pnpm build), Bash(cmp:*), Bash(grep:*), Bash(git mv:*), Bash(cp:*)
---

# ui bits component manager

Every component ships in **four variants with identical visuals and behavior** —
JS+CSS, JS+Tailwind, TS+CSS, TS+Tailwind — plus a demo and a code-metadata file.
You never hand-write all of that: a scaffolder stamps the files and registers
them, a codemod derives the TS variants from the JS ones, and a verifier confirms
the build. Author **two files by hand**, run **three commands**, ship.

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
#    Read its output; finish any prop/inner-component types it warns it couldn't infer.

# 4. Verify (real signal, not curl-200):
pnpm lint && pnpm build
node scripts/verifyComponent.js <Category> <PascalName>
```

That's the whole loop. Everything below is detail; deep recipes live in
`reference/` and load only when you need them (see **Deeper references**).

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
may differ (folder `ThreeD`, label `'3D'`). Pass the **folder name** to all scripts.

## Authoring the variants

Author the two JS variants by hand; the codemod produces the rest.

- **`content/<Name>.jsx`** + **`content/<Name>.css`** — the canonical component (JS + CSS classes).
- **`tailwind/<Name>.jsx`** — the same component with Tailwind utilities + inline
  styles for dynamic values. Visually + behaviorally identical.
- **`generateTsVariants.js`** then writes `ts-default/<Name>.tsx` (typed copy of the
  content variant), `ts-default/<Name>.css` (byte-identical copy), and
  `ts-tailwind/<Name>.tsx` (typed copy of the tailwind variant).

Rules that keep the four in lockstep:

- Animate with **`motion`** via `import { ... } from 'motion/react'`. Never `framer-motion`.
- Icons from **`lucide-react`**.
- Dynamic colors/sizes/positions go through **inline styles** or CSS custom
  properties, so the same values drive every variant.
- **Registry sources legitimately hardcode their palettes (inline hex).** They are
  standalone copy-paste artifacts and can't reference site design tokens — the
  `design-guard` hook is scoped to skip these dirs, so inline hex here is correct,
  not a violation. (Uppercase/serif/breakpoint rules still apply.)
- Polished, accessible, **reduced-motion-friendly** (`useReducedMotion`): paint a
  static frame / disable loops when reduced motion is on.
- One focused component. No overbuilding, no speculative props.

**Codemod warn-then-finish.** `generateTsVariants.js` reliably types the
default-export props interface (from the prop defaults), the refs, the
`join`/`hexToRgb` helpers, and the React type imports. It **warns** (never guesses)
when it can't type a prop — usually an object-array prop like `items`/`sections` —
or when there's an **inner helper component**. On a warning: add an exported item
interface (`export interface <Name>Item { … }`), point the prop at it
(`items?: <Name>Item[]`), and type the inner component's props. Skim the output
every time regardless.

## Demo (DemoShell)

The demo imports the component from `content/` and renders through `DemoShell`.
**Always ship real controls** — the scaffolder emits an empty `controls` stub, and
an empty right panel is a bug. One control per meaningful prop, using the `set`
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

Three control gotchas that bite:
- **`PreviewSlider.displayValue` is a FUNCTION**, not a string. Use `valueUnit="px"`
  for a unit suffix; `displayValue={`${x}px`}` throws.
- **`PreviewSwitch`** uses `isChecked` (not `checked`); `onChange` gets the next boolean.
- **`PreviewSelect`** `options` is `[{ value, label }]`; `onChange` gets the `value`.

**Full-bleed components** (backgrounds/canvas/3D): root `width:100%; height:100%`,
canvas driven by `ResizeObserver`, demo passes `flexProps={{ padding: 0, overflow:
'hidden' }}`. Never wrap them in a fixed-height `<div>` (breaks `FullscreenButton`).

Full `DemoShell` prop table, worked example demos, and full-bleed detail:
**`reference/demos.md`**.

## Code-metadata + Information.js

- **`constants/code/<Category>/<camelName>Code.js`** — replace the empty
  `dependencies` and stub `usage` with the real dependency string (e.g. `'motion'`)
  and a real, copy-paste usage example.
- **`constants/Information.js`** — replace the `"Foo component."` placeholder with a
  real one-line description that names the source interaction, and add real `tags`.

## Verify

`pnpm lint` (0 warnings) and `pnpm build` must pass, then:

```bash
node scripts/verifyComponent.js <Category> <PascalName>
```

It confirms — against the real build output — that the route slug is in
`dist/assets`, the `<Name>Demo-*.js` chunk was emitted, and the content/ts-default
CSS are byte-identical. Exits non-zero on any failure. A dev-server `curl … → 200`
is **not** acceptance: the SPA rewrites every path to `index.html`, so any string
returns 200.

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

## Deeper references

Load these only for the matching task — they stay out of context otherwise:

- **`reference/operations.md`** — adding a category, and moving a component between
  categories (the `git mv` recipe + every reference to update).
- **`reference/demos.md`** — the full `DemoShell` prop table, control-primitive
  API, worked example demos to copy, and full-bleed handling.

Other source of truth:
- Scaffolder: `scripts/generateComponent.js` · TS codemod: `scripts/generateTsVariants.js` · Verifier: `scripts/verifyComponent.js`
- Demo shell: `src/components/common/Preview/DemoShell.jsx`
- Registry constants: `src/constants/{Components,Categories,Information}.js`
- Repo conventions: root `CLAUDE.md` and `apps/website/CLAUDE.md`
