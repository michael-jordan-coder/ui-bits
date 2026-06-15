Autonomous task — add ONE new, high-quality, genuinely useful component to the
ui bits library in this repo (`apps/website/`), sourced from a delightful
interaction documented on designspells.com, then run the full pipeline
end-to-end and auto-merge to main. Exactly one component per run.

STOP CHECK (do this FIRST, every run): this loop is time-boxed to 3 hours /
~20 components. Run `git fetch origin main` then
`git log --grep='\[spell-loop\]' --oneline origin/main`. If there are already
≥20 such commits, OR the oldest one is more than 3 hours old, STOP NOW: build
nothing, cancel this loop, and post a one-message final summary of every
component the loop added. Otherwise continue.

1) AVOID DUPLICATES: read `apps/website/src/constants/Information.js`,
   `Components.js`, and `Categories.js` to list every component that already
   exists. Pick something conceptually NEW — never re-create or lightly re-skin
   an existing one.

2) DISCOVER A SPELL: find a fresh interaction on https://designspells.com.
   Browser-first if a browser/MCP tool is available; otherwise fall back to
   WebSearch with `allowed_domains=["designspells.com"]` (e.g.
   `site:designspells.com <topic>`) and reconstruct the interaction from the
   spell's title/description. Choose one that maps to a self-contained,
   reusable, controllable component. If you truly can't find a fresh
   high-quality spell, fall back to https://reactbits.dev for inspiration.
   Record the source URL.

3) BUILD IT using the `ui-bits-component-manager` skill / the scaffolder as the
   source of truth: `cd apps/website && node scripts/generateComponent.js
   <Category> <PascalName>` (use `Components` unless another category fits
   better). Then fully author all FOUR variants so they look and behave
   identically — JS+CSS, JS+Tailwind, TS+CSS, TS+Tailwind. Rules: animate with
   the `motion` package (`motion/react`), NOT framer-motion; icons via
   `lucide-react`; the two CSS files (`content/` and `ts-default/`) MUST be
   byte-identical (copy with `cp`); apply dynamic colors/sizes via inline
   style. Write a real DemoShell demo with genuine Customize controls
   (PreviewSlider/PreviewSwitch/PreviewSelect) for every meaningful prop —
   never leave the controls stub empty. Fill the code-metadata file's
   `dependencies` + a real `usage`, and replace the placeholder
   description/tags in `Information.js` with a real one-line description that
   names the inspiration. Keep it polished, accessible, and
   reduced-motion-friendly where reasonable.

4) VERIFY from repo root: `pnpm lint` (must pass, max-warnings 0) and
   `pnpm build` (registry + vite must succeed). Then serve and curl the new
   route expecting 200.

5) SHIP: create a fresh branch off the latest origin/main named `spell/<slug>`,
   commit with a message that INCLUDES the literal tag `[spell-loop]` and names
   the source spell URL, push, open a PR to main, and squash-merge it — don't
   leave it open.

If it can't be made green, abandon that idea and end the run cleanly — never
merge broken code.
