# Demo reference — DemoShell API and worked examples

Load this when you need the full `DemoShell` surface or a worked demo to copy.
The essentials (ship real controls, the `set` helper, the three control gotchas,
full-bleed handling) are already in SKILL.md — this is the deeper detail.

## DemoShell props

`DemoShell` (`src/components/common/Preview/DemoShell.jsx`) owns the tabs, the
preview `<Flex>`, the fullscreen/refresh toolbar, `Customize`, `PropTable`,
`Dependencies`, and `CodeExample`. The demo passes:

| Prop | Purpose |
|---|---|
| `defaultProps` | Initial Customize state — the live prop values. |
| `propData` | The `PropTable` rows: `{ name, type, default, description }[]`. |
| `dependencies` | Array of npm dep names shown in the Dependencies block (e.g. `['motion']`). |
| `codeObject` | The `<camelName>Code` object from `constants/code/<Cat>/`. |
| `componentName` | PascalCase name, used for headings/labels. |
| `flexProps` | Overrides on the preview `<Flex>` — `padding`, `height`/`h`, `minH`, `overflow`. |
| `demoOnlyProps` | Props the demo injects but that aren't part of the live Customize state. |
| `computedProps` | Props derived from other props at render time. |
| `preview` | `({ props, key, updateProp, forceRerender }) => JSX` — the component. Caller applies `key` so refresh re-mounts. |
| `controls` | `({ props, updateProp, forceRerender }) => JSX` — the Customize controls. |
| `extraPreview` | Optional; renders alongside the component inside the preview Flex (overlay escape hatch). |

The demo imports the component from `content/` (the JS+CSS variant), never from a
TS or Tailwind variant.

## Control primitives

```jsx
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
```

- **`PreviewSlider`** `{ title, min, max, step?, value, valueUnit?, displayValue?, onChange }`
  — `displayValue` is a **function** `(value) => string`, not a string. For a plain
  unit suffix use `valueUnit="px"`; `displayValue={`${x}px`}` throws.
- **`PreviewSwitch`** `{ title, isChecked, onChange }` — `onChange` gets the next boolean.
- **`PreviewSelect`** `{ title, options, value, onChange }` — `options` is
  `[{ value, label }]`; `onChange` gets the chosen `value`.

Always use the `set` helper so rAF/canvas/observer components re-init on change:

```jsx
const set = (name, val) => { updateProp(name, val); forceRerender(); };
```

## Worked example demos to copy

| File | Demonstrates |
|---|---|
| `src/demo/Components/SidebarDemo.jsx` | Plain spread + `flexProps` height override |
| `src/demo/Components/FillButtonDemo.jsx` | Children-bearing component + `demoOnlyProps` |
| `src/demo/ThreeD/PosterHelixDemo.jsx` | Sample data + a literal accent prop via `preview` |
| `src/demo/Components/DropdownDemo.jsx` | `PreviewSelect` + `PreviewSwitch` together |
| `src/demo/Backgrounds/ParticlesDemo.jsx` | Full-bleed canvas (`flexProps={{ padding: 0, overflow: 'hidden' }}`) |
| `src/demo/Scroll/ScrollStackDemo.jsx` | Self-contained scroll panel with many sliders |

## Full-bleed components

Backgrounds, canvas, and 3D scenes must fill fullscreen. Make the component root
`width:100%; height:100%`, drive the canvas with a `ResizeObserver`, and pass
`flexProps={{ padding: 0, overflow: 'hidden' }}` (plus a fixed `height` for the
normal view). Never wrap them in a fixed-height `<div>` inside the demo — that
breaks the `FullscreenButton`.
