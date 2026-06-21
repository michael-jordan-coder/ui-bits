# ui bits

An open collection of animated, interactive React components — shipped as
copyable source, not an installable black box. Browse them, tweak the props
live, copy the variant you want, and own the code.

**Live site → https://community-bits.vercel.app**

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

## License

[MIT](./LICENSE) © 2026 Daniel Gourarye.

Some components are ported from or inspired by other open-source work — see
[`NOTICE`](./NOTICE) for attribution.
