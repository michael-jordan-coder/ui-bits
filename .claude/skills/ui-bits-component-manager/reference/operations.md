# Operations reference — adding a category, moving a component

Load this only when the task is **adding a new category** or **moving a component
between categories**. The common case (adding a component) does not need it.

## Adding a category

1. Pick a **folder name** (PascalCase) and a **display name**. They're the same
   when plain (`Animations`); they differ when the label has digits or spaces
   (folder `ThreeD` → display `'3D'`; folder `TextEffects` → display `'Text Effects'`).
2. In `src/constants/Categories.js`, add an entry:
   ```js
   { name: 'Display Name', subcategories: [] }
   ```
   The `subcategories` array fills in as components are scaffolded.
3. No directory creation needed — the four variant dirs appear on first scaffold
   under that category.
4. **Scaffolder match quirk.** `scripts/generateComponent.js` finds the category by
   matching `name: '<FolderCategory>'` in Categories.js. If the display name differs
   from the folder name (e.g. folder `ThreeD`, display `'3D'`), the scaffolder warns
   "Category not found in Categories.js" — harmless; just add the subcategory line to
   the right entry by hand. To silence it long-term, add a `folder` field to the
   Categories entries and patch the scaffolder to read it.

## Moving a component between categories

Use `git mv` to preserve history, then update every reference.

```bash
git mv src/content/<Old>/<Name>     src/content/<New>/<Name>
git mv src/tailwind/<Old>/<Name>    src/tailwind/<New>/<Name>
git mv src/ts-default/<Old>/<Name>  src/ts-default/<New>/<Name>
git mv src/ts-tailwind/<Old>/<Name> src/ts-tailwind/<New>/<Name>
git mv src/demo/<Old>/<Name>Demo.jsx               src/demo/<New>/<Name>Demo.jsx
git mv src/constants/code/<Old>/<camelName>Code.js src/constants/code/<New>/<camelName>Code.js
```

Then update, in order:

1. **Moved demo** (`src/demo/<New>/<Name>Demo.jsx`): the two imports — the component
   and its code metadata — switch `<Old>` → `<New>`.
2. **Moved code-metadata** (`src/constants/code/<New>/<camelName>Code.js`): all five
   `?raw` imports (`@content/<Old>/`, `@tailwind/<Old>/`, `@ts-default/<Old>/`,
   `@ts-tailwind/<Old>/`, and the css import) switch category.
3. **`src/constants/Components.js`**: the demo import path
   `() => import('../demo/<Old>/<Name>Demo')` → `<New>`.
4. **`src/constants/Categories.js`**: remove `<Name>`'s display name from the old
   category's `subcategories`, add it to the new one.
5. **`src/constants/Information.js`**: rename the key `'<Old>/<Name>'` →
   `'<New>/<Name>'` and change the `category:` value.
6. **Grep clean** — must return nothing:
   ```bash
   grep -rn "<Old>/<Name>\|<Old>/<camelName>" src/
   ```

Then rebuild and run `node scripts/verifyComponent.js <New> <Name>`.
