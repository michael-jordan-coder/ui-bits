# Contributing to ui bits

Thanks for your interest in contributing. This guide covers how to set up the
project and add a component.

## Workflow

`main` is protected and maintained by the project owner. To contribute:

1. **Fork** the repository.
2. Create a branch off `main` (e.g. `add-myicon-button`).
3. Make your change and verify it locally (see below).
4. Open a **pull request** against `main`. CI runs lint + build on every PR.
5. A maintainer reviews and merges.

Please keep pull requests focused — one component or one fix per PR.

## Setup

```bash
pnpm install
pnpm dev          # registry watch + Vite dev server at http://localhost:5173
```

## Adding a component

Use the scaffolder rather than creating files by hand:

```bash
pnpm new:component -- <Category> <ComponentName>
```

This generates all eight files and registers the component:

- four variants — `src/content` (JS+CSS), `src/tailwind` (JS+Tailwind),
  `src/ts-default` (TS+CSS), `src/ts-tailwind` (TS+Tailwind)
- a demo file under `src/demo/<Category>/`
- a code-metadata file under `src/constants/code/<Category>/`
- entries in the three registry constants (`Components.js`, `Categories.js`,
  `Information.js`)

### Rules every component must follow

- **All four variants render identically.** The only differences are language
  (JS/TS) and styling syntax (CSS classes / Tailwind).
- The CSS files in `src/content/<Cat>/<Name>/<Name>.css` and
  `src/ts-default/<Cat>/<Name>/<Name>.css` must be **byte-identical** — copy
  one to the other, don't retype.
- Replace the scaffolder's placeholder description in `Information.js` with a
  real one-line description.
- Respect reduced-motion (`prefers-reduced-motion`) and keyboard interaction.
- Record the source of inspiration in the component's `Information.js` entry.

Naming: `PascalCase` for the component/file/folder, `kebab-case` for the route
slug and CSS class prefix, `camelCase` for the code-metadata export, and a
space-separated category display name.

## Before you open a PR

```bash
pnpm lint         # must pass with zero warnings
pnpm build        # must succeed
```

Then check the component in the browser at its route
(`/<category>/<component-slug>`) across all four variant tabs.

## Code style

- Real types end to end; no `any` / `@ts-ignore` without a cited reason.
- No placeholder/stub data, no `TODO`/`FIXME` left in shipped code.
- Naming should make comments unnecessary; comments explain *why*, not *what*.
- Match the conventions of the surrounding code.
