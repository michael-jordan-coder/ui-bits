---
name: ui-bits-controls-tuner
description: Use when auditing, tuning, or strengthening the Customize **controls** of component demos in the ui bits library at `apps/website/`. Triggers on "the controls are weak/sparse", "improve the controls", "expose more props as controls", "add controls for X", "tune the demo controls", "audit the demos' controls", "make the controls more relevant", or any request to identify which demos under-expose their component's props and wire better ones. Encodes the weakness audit, the URL-backed-props (nuqs) scalar-vs-local-state rule, the relevant-controls principle, the Preview* control vocabulary, and a headless verification recipe with a reusable script.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(pnpm lint), Bash(node:*), Bash(grep:*), Bash(find:*)
---

# ui bits controls tuner

Each component demo (`apps/website/src/demo/<Category>/<Name>Demo.jsx`) renders
through the shared **`DemoShell`** and passes a `controls` render callback that
draws interactive knobs into the right "Customize" panel. This skill audits which
demos under-expose their component's props and wires **relevant** controls — not
padding. Work from `apps/website/`. Never `npm`; this is pnpm + turbo.

## The control vocabulary (reuse — never hand-roll a control)

All live in `src/components/common/Preview/`:

| Control | For | Key props |
|---|---|---|
| `PreviewSlider` | a number | `title, min, max, step, value, valueUnit, onChange` |
| `PreviewSelect` | a small enum | `title, options:[{value,label}], value, onChange` |
| `PreviewSwitch` | a boolean | `title, checked/value, onChange` |
| `PreviewInput` | free text | `title, value, placeholder, maxLength, onChange` |
| `PreviewFile` | a file (opens Finder) | `title, accept, onChange(file)` |

The controls callback gives you `{ props, updateProp, forceRerender }`. The house
helper is:

```js
const set = (name, val) => { updateProp(name, val); forceRerender(); };
```

`forceRerender` bumps the preview `key` (remount). **Skip it** when the prop is
read directly in the component's render every time AND you want to preserve the
component's internal state across the change (e.g. a drag/split position, a
scroll offset) — remounting would reset it. Keep it for props that seed
`useState` initializers (the component only reads them on mount).

## ⚠️ The one hard constraint: props are URL-backed via nuqs

`src/hooks/useComponentProps.js` backs every prop with `nuqs` query state. Parsers
are built **once** from the keys present in that demo's `DEFAULT_PROPS`. Consequences:

1. **`updateProp(name, …)` is a no-op for any `name` not in `DEFAULT_PROPS`.**
   To add a control for a prop, add that prop to `DEFAULT_PROPS` first (its value
   there is the demo's starting state, independent of the documented prop default
   in `propData`).
2. **Only scalars round-trip**: `number`, `boolean`, and hex-color strings
   (`#rrggbb`) serialize/parse cleanly. Use the matching control directly.
3. **Arrays, objects, blob URLs, and `File`-derived values do NOT round-trip** —
   nuqs serializes them with `String()` and they come back as a broken string.
   For those, hold the value in **local component state** in the demo and inject
   it via the `preview` callback (the escape hatch), NOT through `updateProp`.
   Precedents: `ColorPickerDemo` (`swatches` array → palette in local state),
   `ImageCompareDemo` (`before`/`after` blob URLs from `PreviewFile` → local state).

Hex casing tip: make the `PreviewSelect` option `value` and the `DEFAULT_PROPS`
value **identical casing** (CSS hex is case-insensitive, so render is unaffected,
but the select's active-state match and the updateProp default-compare are
string-equality).

## Step 1 — Audit: rank demos by control weakness

Inventory every demo's control count:

```bash
cd apps/website/src/demo
for f in $(find . -name '*Demo.jsx' | sort); do
  n=$(grep -oE "<Preview(Slider|Select|Switch|Input|File)" "$f" | wc -l | tr -d ' ')
  printf "%-34s ctrls=%s\n" "$(basename "$f" .jsx)" "$n"
done | sort -t= -k2 -n
```

Then read each candidate's component (`src/content/<Category>/<Name>/<Name>.jsx`)
for its **full prop surface**. A demo has **weak controls** when any of:

- 0–1 controls, or its *signature* interaction prop is not adjustable.
- The component has experience-relevant props (color, size, speed/duration,
  count, intensity, variant, direction, a toggle-able behavior) with no control.
- Wrong control type (free text where a small enum fits; a slider for a boolean;
  an unbounded range).
- Poor range/step/`valueUnit`, or controls driving cosmetic props while the
  signature interaction is fixed.

Severity: **HIGH** = 0–1 controls or signature prop unadjustable. **MED** = 2 but
a meaningful prop is missing. Skip demos already well-covered — **do not pad a
genuinely thin component** (some have only one meaningful prop, and that's fine).

## Step 2 — Decide the *relevant* controls

For each weak demo, list the component's props and keep only the ones that change
the **experience**: the signature parameter (e.g. `bgSpeed` for a parallax,
`panels` for a snap scroller, `swatches` for a color picker), color accents,
size/height, count, speed. Ignore `className`, `onChange`, refs. Pick the control
type from the table above. Prefer 2–4 tight controls over a wall of knobs.

## Step 3 — Implement

Scalar prop (the common case):

```jsx
// 1) register it so updateProp works
const DEFAULT_PROPS = { /* …existing… */, accent: '#3ecf8e', height: 460 };
const ACCENTS = [{ value: '#3ecf8e', label: 'Emerald' }, /* … */];
// 2) wire controls (wrap multiple in a fragment)
<PreviewSelect title="Accent" options={ACCENTS} value={props.accent} onChange={v => set('accent', v)} />
<PreviewSlider title="Height" min={360} max={560} step={10} value={props.height} valueUnit="px" onChange={v => set('height', v)} />
```

Non-scalar prop (array / object / file → escape hatch):

```jsx
const [palette, setPalette] = useState('vibrant');           // local state
// preview injects it OVER the spread props:
preview={({ props, key }) => <ColorPicker key={key} {...props} swatches={PALETTES[palette]} />}
// control drives local state, not updateProp:
<PreviewSelect title="Swatch palette" options={PALETTE_OPTIONS} value={palette} onChange={setPalette} />
```

The `preview` callback already spreads `{...props}`; injected props go after the
spread to override. Keep `propData` (the docs table) accurate — add rows for any
newly demonstrated prop, but its `default` column documents the component's true
default, not the demo's `DEFAULT_PROPS` starting value.

## Step 4 — Verify (don't trust curl-200)

```bash
pnpm lint            # max-warnings 0
```

Then drive it headlessly. `reference/verify-control.mjs` loads a route, captures
page errors, asserts each expected control label is present, and (optionally)
force-opens a `PreviewSelect` and clicks an option to confirm the component's DOM
actually changes. It force-clicks through the DOM because the Customize panel is
often collapsed/offscreen (Playwright reports the control "not visible"):

```bash
# dev server must be running (note the real port — vite hops 5173→5174…)
node .claude/skills/ui-bits-controls-tuner/reference/verify-control.mjs \
  --base http://localhost:5174 --slug parallax-scroll \
  --labels "Background speed,Blob color" \
  --switch "Blob color=Emerald" --expect-rgb "62,207,142" --selector ".parallax-blob"
```

Verification gotchas:
- A hex set via a **CSS custom property** stays a literal hex in `outerHTML`; a hex
  set via an inline `background:`/`color:` is serialized to `rgb(...)`. Assert on
  `getComputedStyle().backgroundColor` (rgb), not a literal-hex string search.
- Route slugs are kebab-case in `src/constants/Components.js`.

## Definition of done

Lint clean, page renders with no `pageerror`, every new control present, and at
least one new control verified to change the component end-to-end. Report what
changed per demo and what's verified vs not. Do not commit/push without an
explicit go — these are visible changes the user reviews in the browser first.
