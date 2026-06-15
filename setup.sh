#!/usr/bin/env bash
set -euo pipefail

# Run from the repo root (this script's own directory).
cd "$(dirname "$0")"

# Honor the pnpm version pinned in package.json ("packageManager": "pnpm@10.15.1").
corepack enable
corepack prepare pnpm@10.15.1 --activate

# Install all workspace dependencies so `pnpm lint` and `pnpm build` work immediately.
# Prefer `install` over `--frozen-lockfile`/`ci` so the container's dependency cache is reused.
pnpm install
