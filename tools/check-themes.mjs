// Loads every theme in the bench at both screen sizes, prints the bench's own
// checks (errors fail the run) and saves a screenshot of each preview to
// out/check/<device>/<id>.png.
//   node tools/check-themes.mjs [id ...]
import { mkdirSync } from 'node:fs';
import { serve, launch } from './browser.mjs';
import { listThemes } from './themes.mjs';

const only = process.argv.slice(2);
const themes = listThemes().filter((t) => !only.length || only.includes(t.id));
const server = await serve('bench');
const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1200 });
page.on('pageerror', (e) => console.error('bench error:', e.message));
await page.goto(server.url + '/index.html', { waitUntil: 'networkidle0' });

let failed = 0;
for (const device of ['x4', 'x3']) {
  mkdirSync(`out/check/${device}`, { recursive: true });
  for (const t of themes) {
    await page.evaluate((id, dev) => {
      state.device = dev;
      state.mode = 'live';
      state.outline = false;
      $('device').value = dev;
      loadStarter(STARTERS[id]);
    }, t.id, device);
    await new Promise((r) => setTimeout(r, 1200));
    const checks = await page.evaluate(async () => {
      await frame.contentDocument.fonts.ready;
      runChecksNow();
      return lastChecks.map((c) => ({ level: c.level, msg: c.html.replace(/<[^>]+>/g, '') }));
    });
    const errors = checks.filter((c) => c.level === 'error');
    failed += errors.length ? 1 : 0;
    const tag = errors.length ? 'FAIL' : checks.length ? 'warn' : 'ok  ';
    console.log(`${tag} ${device} ${t.id}`);
    for (const c of checks) console.log(`     ${c.level}: ${c.msg}`);
    const screen = await page.$('#screen');
    await screen.screenshot({ path: `out/check/${device}/${t.id}.png` });
  }
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
