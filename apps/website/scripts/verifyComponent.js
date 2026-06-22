#!/usr/bin/env node
/**
 * verifyComponent.js <Category> <PascalName>
 *
 * Deterministic post-build acceptance check for a ui-bits component. Run it after
 * `pnpm build`. Replaces the misleading dev-server `curl → 200` check (an SPA
 * rewrites every path to index.html, so any string returns 200 and proves nothing).
 *
 * Confirms, against the real build output:
 *   1. the route slug is present in dist/assets (the demo's lazy import compiled
 *      and the registry wired it up),
 *   2. the <Name>Demo-*.js chunk was emitted,
 *   3. the content/ and ts-default/ CSS files are byte-identical.
 *
 * Exits 0 only when all checks pass; non-zero otherwise.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const ASSETS = join(ROOT, 'dist', 'assets');

const [, , category, name] = process.argv;
if (!category || !name) {
  console.error('Usage: node scripts/verifyComponent.js <Category> <PascalName>');
  process.exit(2);
}

const slug = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();

const checks = [];
const ok = (label, pass, detail = '') => checks.push({ label, pass, detail });

if (!existsSync(ASSETS)) {
  console.error(`✗ ${ASSETS} not found — run \`pnpm build\` first.`);
  process.exit(2);
}

const assetFiles = readdirSync(ASSETS);

// 1) slug present in some built chunk
let slugFound = false;
for (const f of assetFiles) {
  if (!f.endsWith('.js')) continue;
  if (readFileSync(join(ASSETS, f), 'utf8').includes(slug)) {
    slugFound = true;
    break;
  }
}
ok(`slug "${slug}" registered in build`, slugFound, slugFound ? '' : 'check Components.js / Information.js / Categories.js');

// 2) demo chunk emitted
const demoChunk = assetFiles.find(f => f.startsWith(`${name}Demo-`) && f.endsWith('.js'));
ok(`${name}Demo chunk built`, !!demoChunk, demoChunk || 'demo import did not compile');

// 3) byte-identical CSS (only if the component uses a CSS variant)
const contentCss = join(SRC, 'content', category, name, `${name}.css`);
const tsDefaultCss = join(SRC, 'ts-default', category, name, `${name}.css`);
if (existsSync(contentCss) || existsSync(tsDefaultCss)) {
  let identical = false;
  let detail = 'one of the CSS files is missing';
  if (existsSync(contentCss) && existsSync(tsDefaultCss)) {
    const a = readFileSync(contentCss);
    const b = readFileSync(tsDefaultCss);
    identical = a.equals(b);
    detail = identical ? '' : 're-copy with `cp` (content → ts-default)';
  }
  ok('content/ + ts-default/ CSS byte-identical', identical, detail);
}

let failed = false;
for (const c of checks) {
  console.log(`${c.pass ? '✓' : '✗'} ${c.label}${c.pass || !c.detail ? '' : ` — ${c.detail}`}`);
  if (!c.pass) failed = true;
}

if (failed) {
  console.error('\nVerification FAILED — fix the above before shipping.');
  process.exit(1);
}
console.log('\nVerification passed.');
