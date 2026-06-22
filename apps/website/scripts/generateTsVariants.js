#!/usr/bin/env node
/**
 * generateTsVariants.js <Category> <PascalName>
 *
 * Derives the two TypeScript variants from the two hand-authored JS variants of a
 * ui-bits component, and copies the CSS byte-identically. The TS variants differ
 * from the JS variants only by type annotations, so this removes the mechanical
 * half of the 4-variant authoring tax.
 *
 *   content/<Cat>/<Name>/<Name>.css   --cp-->  ts-default/<Cat>/<Name>/<Name>.css
 *   content/<Cat>/<Name>/<Name>.jsx   --ts-->  ts-default/<Cat>/<Name>/<Name>.tsx
 *   tailwind/<Cat>/<Name>/<Name>.jsx  --ts-->  ts-tailwind/<Cat>/<Name>/<Name>.tsx
 *
 * What it types reliably: the top-level component's props interface (from the
 * destructured defaults), refs, and the React type imports. What it cannot infer
 * (object-array props with inline-literal defaults, inner helper components) it
 * reports as warnings for you to finish by hand. Always read the output and the
 * generated files before shipping.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'src');

const [, , category, name] = process.argv;
if (!category || !name) {
  console.error('Usage: node scripts/generateTsVariants.js <Category> <PascalName>');
  process.exit(1);
}

const warnings = [];

/** Find the body of the default-export function's destructured props object. */
function findPropsBlock(src) {
  const marker = 'export default function';
  const fnIdx = src.indexOf(marker);
  if (fnIdx === -1) return null;
  const openParen = src.indexOf('(', fnIdx);
  const openBrace = src.indexOf('{', openParen);
  if (openBrace === -1 || openBrace > src.indexOf(')', openParen) + 1) {
    // No destructuring (e.g. `function F(props)`) — nothing to infer.
    return null;
  }
  // Walk to the matching brace of the destructuring object.
  let depth = 0;
  let i = openBrace;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const closeBrace = i;
  const closeParen = src.indexOf(')', closeBrace);
  return {
    inner: src.slice(openBrace + 1, closeBrace),
    fnIdx,
    signatureStart: openBrace,
    signatureEnd: closeParen
  };
}

/** Split a destructuring body on top-level commas (ignores nested braces/brackets/parens). */
function splitTopLevel(inner) {
  const parts = [];
  let depth = 0;
  let buf = '';
  for (const ch of inner) {
    if ('{[('.includes(ch)) depth++;
    else if ('}])'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) {
      parts.push(buf);
      buf = '';
    } else buf += ch;
  }
  if (buf.trim()) parts.push(buf);
  return parts.map(p => p.trim()).filter(Boolean);
}

/** Infer a TS type from a prop's default-value expression. */
function inferType(defExpr, propName, src) {
  if (propName === 'children') return 'ReactNode';
  if (propName === 'className') return 'string';
  if (defExpr === undefined) return null; // bare prop, no default → can't infer
  const d = defExpr.trim();
  if (/^-?\d+(\.\d+)?$/.test(d)) return 'number';
  if (/^(true|false)$/.test(d)) return 'boolean';
  if (/^['"`]/.test(d)) return 'string';
  if (/^\[/.test(d)) return null; // inline array literal → shape unknown
  if (/^\{/.test(d)) return null; // inline object literal → shape unknown
  // Identifier default that points at an in-file const → use `typeof <ident>`.
  if (/^[A-Za-z_$][\w$]*$/.test(d)) {
    const re = new RegExp(`const\\s+${d}\\b`);
    if (re.test(src)) return `typeof ${d}`;
  }
  return null;
}

function transform(src, { isTailwind }) {
  const block = findPropsBlock(src);
  if (!block) {
    warnings.push('could not locate destructured props on the default export — wrote a pass-through; add types by hand');
    return src;
  }
  const props = splitTopLevel(block.inner);
  let hasRest = false;
  let hasChildren = false;
  const fields = [];
  for (const p of props) {
    if (p.startsWith('...')) {
      hasRest = true;
      continue;
    }
    const eq = p.indexOf('=');
    const propName = (eq === -1 ? p : p.slice(0, eq)).trim();
    const defExpr = eq === -1 ? undefined : p.slice(eq + 1);
    if (propName === 'children') hasChildren = true;
    const t = inferType(defExpr, propName, src);
    if (t) {
      fields.push(`  ${propName}?: ${t};`);
    } else {
      warnings.push(`prop \`${propName}\` — could not infer type; added as \`unknown\`, replace it`);
      fields.push(`  ${propName}?: unknown;`);
    }
  }
  if (hasChildren && !fields.some(f => f.startsWith('  children'))) fields.push('  children?: ReactNode;');

  const ext = hasRest
    ? hasChildren
      ? ` extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>`
      : ` extends HTMLAttributes<HTMLDivElement>`
    : '';
  const iface = `export interface ${name}Props${ext} {\n${fields.join('\n')}\n}\n\n`;

  let out = src;

  // 1) Type the function signature: `{ ... }` -> `{ ... }: NameProps`
  out = out.slice(0, block.signatureEnd) + `: ${name}Props` + out.slice(block.signatureEnd);

  // 2) Insert the interface immediately before the default export function.
  const fnMarkerIdx = out.indexOf('export default function');
  out = out.slice(0, fnMarkerIdx) + iface + out.slice(fnMarkerIdx);

  // 3) Type refs by variable-name heuristic.
  out = out.replace(/(\b(\w*[Cc]anvas\w*)\s*=\s*)useRef\(null\)/g, '$1useRef<HTMLCanvasElement>(null)');
  out = out.replace(/useRef\(null\)/g, 'useRef<HTMLDivElement>(null)');

  // 4) Ensure the React import carries the type-only names we used.
  const reactTypes = [];
  if (hasRest) reactTypes.push('type HTMLAttributes');
  if (hasChildren || /\bReactNode\b/.test(iface)) reactTypes.push('type ReactNode');
  if (/\bas CSSProperties\b/.test(out) || /['"]--/.test(out)) reactTypes.push('type CSSProperties');
  if (reactTypes.length) {
    if (/import\s+\{[^}]*\}\s+from\s+['"]react['"]/.test(out)) {
      out = out.replace(/import\s+\{([^}]*)\}\s+from\s+(['"])react\2/, (m, names, q) => {
        const have = names.split(',').map(s => s.trim());
        const add = reactTypes.filter(t => !have.includes(t));
        return `import {${names.replace(/\s*$/, '')}${add.length ? ', ' + add.join(', ') : ''} } from ${q}react${q}`;
      });
    } else {
      out = `import { ${reactTypes.join(', ')} } from 'react';\n` + out;
    }
  }

  // 4b) Type the two top-level helpers the loop reuses verbatim across components.
  out = out.replace(
    /const join = \(\.\.\.classes\) =>/,
    'const join = (...classes: Array<string | false | undefined>) =>'
  );
  out = out.replace(
    /const hexToRgb = hex =>/,
    'const hexToRgb = (hex: string): [number, number, number] =>'
  );

  // 5) Flag inner helper components — their props are not auto-typed.
  const inner = [...out.matchAll(/\nfunction ([A-Z]\w*)\s*\(/g)].map(m => m[1]);
  if (inner.length) {
    warnings.push(`inner helper component(s) ${inner.join(', ')} — type their props by hand (the codemod only types the default export)`);
  }

  if (isTailwind) {
    // ts-tailwind has no CSS import to carry over (none exists in tailwind variant).
  }
  return out;
}

function run() {
  const contentDir = join(SRC, 'content', category, name);
  const tailwindDir = join(SRC, 'tailwind', category, name);
  const tsDefaultDir = join(SRC, 'ts-default', category, name);
  const tsTailwindDir = join(SRC, 'ts-tailwind', category, name);

  const contentJsx = join(contentDir, `${name}.jsx`);
  const contentCss = join(contentDir, `${name}.css`);
  const tailwindJsx = join(tailwindDir, `${name}.jsx`);
  for (const f of [contentJsx, contentCss, tailwindJsx]) {
    if (!existsSync(f)) {
      console.error(`Missing source file: ${f}`);
      process.exit(1);
    }
  }

  // CSS: byte-identical copy.
  copyFileSync(contentCss, join(tsDefaultDir, `${name}.css`));

  const tsDefault = transform(readFileSync(contentJsx, 'utf8'), { isTailwind: false });
  writeFileSync(join(tsDefaultDir, `${name}.tsx`), tsDefault);

  const tsTailwind = transform(readFileSync(tailwindJsx, 'utf8'), { isTailwind: true });
  writeFileSync(join(tsTailwindDir, `${name}.tsx`), tsTailwind);

  console.log(`Generated TS variants for ${category}/${name}:`);
  console.log(`  ts-default/${category}/${name}/${name}.tsx`);
  console.log(`  ts-default/${category}/${name}/${name}.css  (byte copy)`);
  console.log(`  ts-tailwind/${category}/${name}/${name}.tsx`);
  if (warnings.length) {
    console.log('\n⚠ Review needed before shipping:');
    for (const w of [...new Set(warnings)]) console.log(`  - ${w}`);
  } else {
    console.log('\nNo warnings — top-level props fully typed. Still skim the output.');
  }
}

run();
