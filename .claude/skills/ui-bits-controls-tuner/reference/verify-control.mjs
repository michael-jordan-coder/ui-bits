#!/usr/bin/env node
/**
 * Headless verification for a ui bits demo's Customize controls.
 *
 * Loads a demo route in a controlled Chromium, captures runtime page errors,
 * asserts the expected control labels are present, and (optionally) force-opens
 * a PreviewSelect and clicks an option to confirm the component's DOM changes.
 * It clicks through the DOM rather than via Playwright's visibility-gated click
 * because the Customize panel is frequently collapsed/offscreen ("not visible").
 *
 * Usage:
 *   node verify-control.mjs --base http://localhost:5174 --slug parallax-scroll \
 *     --labels "Background speed,Blob color" \
 *     [--switch "Blob color=Emerald" --expect-rgb "62,207,142" --selector ".parallax-blob"]
 *
 * Exits non-zero if a page error fires, a label is missing, or an assertion fails.
 */
import { existsSync, readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { homedir } from 'node:os'
import { join } from 'node:path'

const argv = process.argv.slice(2)
const opt = {}
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a.startsWith('--')) opt[a.slice(2)] = argv[i + 1]?.startsWith('--') || argv[i + 1] === undefined ? true : argv[++i]
}
const base = opt.base || 'http://localhost:5173'
if (!opt.slug) {
  console.error('Error: --slug <kebab-route> is required')
  process.exit(1)
}
const wantLabels = (opt.labels || '').split(',').map(s => s.trim()).filter(Boolean)

function findPlaywright() {
  const c = [join(process.cwd(), 'node_modules', 'playwright', 'index.js')]
  const r = join(homedir(), '.npm', '_npx')
  if (existsSync(r)) for (const d of readdirSync(r)) c.push(join(r, d, 'node_modules', 'playwright', 'index.js'))
  return c.find(existsSync)
}
const libPath = findPlaywright()
if (!libPath) {
  console.error('Playwright not found. Run: npx --yes playwright install chromium-headless-shell')
  process.exit(1)
}
const { chromium } = (await import(pathToFileURL(libPath).href)).default

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 })
const pageErrors = []
page.on('pageerror', e => pageErrors.push(String(e.message).slice(0, 160)))
const url = `${base.replace(/\/$/, '')}/components/${opt.slug}`
await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url))
await page.waitForTimeout(1200)

const labels = await page.$$eval('.scrubber-label', els => els.map(e => e.textContent.trim()))
const missingControls = wantLabels.filter(l => !labels.includes(l))

const result = { url, labels, missingControls, pageErrors }

if (opt.switch) {
  const [control, option] = String(opt.switch).split('=').map(s => s.trim())
  const before = opt.selector ? await computed(opt.selector) : null
  const opened = await page.evaluate(c => {
    const b = [...document.querySelectorAll('button[aria-label]')].find(x => x.getAttribute('aria-label') === c)
    if (!b) return false
    b.click()
    return true
  }, control)
  await page.waitForTimeout(250)
  const picked = await page.evaluate(o => {
    const i = [...document.querySelectorAll('.scrubber-dropdown-item')].find(x => x.textContent.trim() === o)
    if (!i) return false
    i.click()
    return true
  }, option)
  await page.waitForTimeout(600)
  const after = opt.selector ? await computed(opt.selector) : null
  result.switch = { control, option, opened, picked, before, after, changed: JSON.stringify(before) !== JSON.stringify(after) }
  if (opt['expect-rgb'] && opt.selector) {
    const want = `rgb(${String(opt['expect-rgb']).split(',').map(s => s.trim()).join(', ')})`
    result.switch.expected = want
    result.switch.matchesExpected = (after || []).some(c => c === want)
  }
}

async function computed(sel) {
  return page.$$eval(sel, els => els.slice(0, 6).map(e => getComputedStyle(e).backgroundColor))
}

await browser.close()
console.log(JSON.stringify(result, null, 2))

const failed =
  pageErrors.length > 0 ||
  missingControls.length > 0 ||
  (result.switch && (result.switch.opened === false || result.switch.picked === false || result.switch.changed === false)) ||
  (result.switch && result.switch.matchesExpected === false)
process.exit(failed ? 1 : 0)
