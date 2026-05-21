---
name: ui-bits-component-manager
description: Use this skill whenever the user wants to add, scaffold, create, rename, move, or register a component or a category in the ui bits library at `website/`. Triggers on phrases like "add a component", "create a [Name] component", "scaffold X", "new category", "add [name] to [category]", "make a category called X", "register X", "move [component] to [category]". Handles the 4-variant scaffold, picks the right folder/display-name pair, updates the three constants files, and preserves git history on moves.
---

# ui bits component manager

ui bits ships every component in **four variants that must produce identical visuals and behavior**: JS+CSS, JS+Tailwind, TS+CSS, TS+Tailwind. There is a scaffolder — never hand-write the 8 files from scratch.

## Trigger checklist

Invoke this skill silently the moment you read any of these in the user's message:
- "add a component" / "new component" / "create [a/the] [Name] component" / "scaffold X"
- "add a category" / "new category" / "make a category called X"
- "move [component] to [category]" / "put X under Y" / "reorganize"
- "register" / "wire up X" in the context of components

Then do the work. Don't ask permission to start — only ask if the category is ambiguous.

## Current categories

| Sidebar label | URL slug | Folder name | Information.js `category` | Purpose |
|---|---|---|---|---|
| Components | `/components/` | `Components` | `Components` | Buttons, interactive primitives |
| 3D | `/3d/` | `ThreeD` | `ThreeD` | 3D scenes, cinematic showpieces |
| Scroll | `/scroll/` | `Scroll` | `Scroll` | Drag- and scroll-driven interactions |

**Two-name rule.** The folder name is the jsrepo lookup path — it MUST match the actual directory under `src/content/<Folder>/`, `src/tailwind/<Folder>/`, `src/ts-default/<Folder>/`, `src/ts-tailwind/<Folder>/`, and the `category` field in `src/constants/Information.js`. The Categories.js `name` is the sidebar display + URL slug; it can differ (e.g., folder `ThreeD`, display `'3D'`).

## Adding a component

1. **Pick the category.** If unclear, ask one sharp question. Default-map by purpose:
   - Buttons / hover / click micro-interactions → `Components`
   - Anything with `rotateY`, perspective, helix, drum, tunnel → `ThreeD`
   - Drag-scroll, scroll-jacking, parallax, scroll-progress → `Scroll`

2. **Run the scaffolder** from `website/`:
   ```bash
   cd website && npm run new:component -- <FolderCategory> <ComponentName>
   ```
   - `<FolderCategory>`: PascalCase folder (e.g. `Components`, `ThreeD`, `Scroll`).
   - `<ComponentName>`: PascalCase (e.g. `MagneticCard`).

   The scaffolder creates:
   - `src/content/<Cat>/<Name>/<Name>.jsx` + `.css`
   - `src/tailwind/<Cat>/<Name>/<Name>.jsx`
   - `src/ts-default/<Cat>/<Name>/<Name>.tsx` + `.css`
   - `src/ts-tailwind/<Cat>/<Name>/<Name>.tsx`
   - `src/demo/<Cat>/<Name>Demo.jsx`
   - `src/constants/code/<Cat>/<camelName>Code.js`
   - Entries in `Components.js`, `Categories.js`, `Information.js`

3. **Fill the 8 files** per `reactbits-clone/react-bits/.context/new-component.md`. The four variants must produce identical visuals and behavior.

4. **Demo file** uses `DemoShell` (`src/components/common/Preview/DemoShell.jsx`). The shell owns `ComponentPropsProvider`, `TabsLayout`, `useComponentProps` + `useForceRerender`, the preview `<Flex>`, `FullscreenButton` + `RefreshButton`, `Customize`, `PropTable`, `Dependencies`, and `CodeExample`. The demo passes static props (`defaultProps`, `propData`, `dependencies`, `codeObject`, `componentName`, optional `flexProps`, `demoOnlyProps`, `computedProps`) and two render callbacks:
   - `preview={({ props, key }) => <Component key={key} {...props} />}` — caller applies `key` so refresh works. Use this to handle children-bearing components (`<Component>{props.label}</Component>`), sample data, or literal-string overrides.
   - `controls={({ props, updateProp, forceRerender }) => <>...</>}` — Customize controls (`PreviewSlider` / `PreviewSwitch` / `PreviewSelect`). Rendered inside the shell's `<Customize>` which portals into the right shell panel.
   Demo imports the component from `content/` (the JS+CSS variant). Reference: `src/demo/Components/SidebarDemo.jsx` (plain spread + `flexProps` override), `src/demo/Components/FillButtonDemo.jsx` (children-bearing + `demoOnlyProps`), `src/demo/ThreeD/PosterHelixDemo.jsx` (sample data + literal accent prop).

5. **Update the Information.js description** — the scaffolder writes a placeholder like `"Foo component."`; replace with a real one-line description.

6. **Verify** the new route renders:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/<category-slug>/<component-slug>
   ```
   Expect `200`. The dev server hot-reloads — no rebuild needed.

## Adding a category

1. **Pick folder name (PascalCase) and display name.** Examples:
   - Folder `Animations`, display `'Animations'` (most common — same)
   - Folder `ThreeD`, display `'3D'` (when display has digits / special chars)
   - Folder `TextEffects`, display `'Text Effects'`

2. **Edit `src/constants/Categories.js`** — add an entry:
   ```js
   { name: 'Display Name', subcategories: [] }
   ```
   Subcategories list fills as components are scaffolded.

3. **No directory creation needed.** The variant directories appear on first scaffold under that category.

4. **Note the scaffolder mismatch.** `scripts/generateComponent.js` matches Categories.js entries by looking for `name: '<FolderCategory>'`. If your display name differs from the folder name (e.g. folder `ThreeD`, display `'3D'`), the scaffolder warns "Category not found in Categories.js" — this is harmless; manually add the new subcategory line to the correct entry. If you want to silence the warning long-term, add a `folder` field to Categories entries and patch the scaffolder.

## Moving a component between categories

Use `git mv` to preserve history. Update every reference.

1. **Move directories** for each of the 4 variants + the demo + the code-metadata file:
   ```bash
   git mv src/content/<OldCat>/<Name>     src/content/<NewCat>/<Name>
   git mv src/tailwind/<OldCat>/<Name>    src/tailwind/<NewCat>/<Name>
   git mv src/ts-default/<OldCat>/<Name>  src/ts-default/<NewCat>/<Name>
   git mv src/ts-tailwind/<OldCat>/<Name> src/ts-tailwind/<NewCat>/<Name>
   git mv src/demo/<OldCat>/<Name>Demo.jsx          src/demo/<NewCat>/<Name>Demo.jsx
   git mv src/constants/code/<OldCat>/<camelName>Code.js src/constants/code/<NewCat>/<camelName>Code.js
   ```

2. **Update the moved demo file**: the two imports of the component and its code metadata switch from `<OldCat>` to `<NewCat>`.

3. **Update the moved code-metadata file**: all five `?raw` imports change `@content/<OldCat>/`, `@tailwind/<OldCat>/`, `@ts-default/<OldCat>/`, `@ts-tailwind/<OldCat>/` to the new category.

4. **Update `src/constants/Components.js`**: change `'<kebab-name>': () => import('../demo/<OldCat>/<Name>Demo')` to the new category.

5. **Update `src/constants/Categories.js`**: remove from old category's `subcategories`, add to new.

6. **Update `src/constants/Information.js`**: rename the key from `'<OldCat>/<Name>'` to `'<NewCat>/<Name>'` and change the `category:` value.

7. **Sanity check**: grep for any leftover stale paths.
   ```bash
   grep -rn "<OldCat>/<Name>\|<OldCat>/<camelName>" src/
   ```
   Should return nothing.

## Naming conventions

| Context | Format | Example |
|---|---|---|
| Component name | PascalCase | `MagneticCard` |
| Component folder | matches component | `MagneticCard/` |
| CSS class prefix | kebab-case | `.magnetic-card-*` |
| Route slug | kebab-case | `magnetic-card` |
| Code metadata file | `<camel>Code.js` | `magneticCardCode.js` |
| Code metadata export | camelCase | `magneticCard` |
| Display name in Categories | Space-separated | `Magnetic Card` |
| Category folder | PascalCase | `Animations`, `ThreeD` |

## Hard rules

- **CSS files in `content/` and `ts-default/` are byte-identical.** Copy with `cp`, not retype.
- **All 4 variants render identically.** Differences are language and styling syntax only.
- **Never hand-write the registration entries on first scaffold** — let the scaffolder do it.
- **On move**: use `git mv` to preserve history; update every `?raw` import; verify with grep.
- **No placeholders** in shipped components: no `// TODO`, no demo strings like `"Foo bar"`, no hardcoded test data unless it's curated sample data the demo explicitly needs.

## Reference

- Demo shell API: `src/components/common/Preview/DemoShell.jsx`
- Scaffolder source: `scripts/generateComponent.js` (source of truth — generates a `DemoShell`-based demo)
- Upstream react-bits recipe (variant rules, naming): `reactbits-clone/react-bits/.context/new-component.md` — note the inline demo pattern there is intentionally **not** followed; this codebase uses `DemoShell` instead.
- Workspace + repo conventions: workspace CLAUDE.md and the website CLAUDE.md
