<div align="center">
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="apps/website/public/logo-color.svg">
    <img src="apps/website/public/logo.svg" alt="ui bits" width="92">
  </picture>
  <h1>ui bits</h1>
  <strong>Animated, interactive, copy-paste React components.</strong>
  <br />
  <sub>Drop-in motion for backgrounds, text, and UI — own the source, tweak the props, ship.</sub>
  <br />
  <br />
  <a href="https://github.com/michael-jordan-coder/ui-bits/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/michael-jordan-coder/ui-bits?style=flat&color=4d4dff"></a>
  <a href="https://github.com/michael-jordan-coder/ui-bits/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-4d4dff"></a>
  <br />
  <br />
  <a href="https://community-bits.vercel.app">🌐 Live site</a> · <a href="https://community-bits.vercel.app/components/index">🧩 Components</a> · <a href="https://community-bits.vercel.app/get-started/introduction">⚡ Get started</a>
</div>

<br />

<!-- Showcase: add a ~1000px GIF/PNG of 3–4 components animating here — the single most
     shareable README asset. Save to apps/website/public/og-showcase.png and reference it:
     <div align="center"><img src="apps/website/public/og-showcase.png" alt="ui bits components" width="1000"></div> -->

An open collection of animated, interactive React components — shipped as
copyable source, not an installable black box. Browse them, tweak the props
live, copy the variant you want, and own the code.

Every component ships in four interchangeable variants so it drops into any
React stack:

| Variant       | Language   | Styling          |
| ------------- | ---------- | ---------------- |
| JS + CSS      | JavaScript | plain CSS        |
| JS + Tailwind | JavaScript | Tailwind classes |
| TS + CSS      | TypeScript | plain CSS        |
| TS + Tailwind | TypeScript | Tailwind classes |

All four are visually and behaviourally identical — pick the one that matches
your codebase.

## Install a component

Components are distributed through [jsrepo](https://jsrepo.dev) as plain source
files. Grab any component by name:

```bash
npx jsrepo add @ui-bits/<Component>
```

Or just open the [live site](https://community-bits.vercel.app), find a
component, and copy the variant from the **Code** tab.

## What's inside

~45 components across five categories — **Components** (buttons, inputs, menus,
navs, cards…), **Backgrounds**, **Scroll**, **Text Animations**, and **3D**.
The registry constants are the always-current source of truth:

- `apps/website/src/constants/Information.js` — descriptions + tags
- `apps/website/src/constants/Categories.js` — sidebar order
- `apps/website/src/constants/Components.js` — route slugs

## Tech stack

- **pnpm + turbo** monorepo
- **Vite** + **React 19**
- **Chakra UI v3** + **Tailwind v4**
- **motion** / **GSAP** for animation
- **jsrepo** for the component registry

## Local development

```bash
pnpm install
pnpm dev          # registry watch + Vite dev server (http://localhost:5173)
```

Other commands:

```bash
pnpm build        # build the jsrepo registry, then the site
pnpm lint         # ESLint, zero-warnings policy
pnpm format       # Prettier
pnpm new:component -- <Category> <ComponentName>   # scaffold a new component
```

The scaffolder generates all eight files (four variants + demo + code metadata)
and registers the component in the three constants files. See
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full workflow.

## Contributing

Contributions are welcome. Outside contributors fork the repo and open a pull
request; `main` is maintained by the project owner. Start with
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

<a href="https://github.com/michael-jordan-coder/ui-bits/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=michael-jordan-coder/ui-bits" alt="Contributors" />
</a>

## License

[MIT](./LICENSE) © 2026 Daniel Gourarye.

Some components are ported from or inspired by other open-source work — see
[`NOTICE`](./NOTICE) for attribution.
