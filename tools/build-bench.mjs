// Writes every theme in themes/ into the bench as a starter, so the store and
// the bench's "Start from" list never drift apart. Run after editing a theme:
//   node tools/build-bench.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { listThemes, themeFiles } from './themes.mjs';

const BENCH = 'bench/index.html';

// Text assets travel with the starter; Inter is bundled in the bench and icon
// fonts are generated there, so neither is copied in.
const TEXT = /\.(svg|css|txt)$/i;
const SKIP = new Set(['theme.html', 'theme.json']);

// JSON is valid JS, but "</script>" inside a string would end the bench's script.
const js = (v) => JSON.stringify(v, null, 2).replace(/<\//g, '<\\/');

const themes = listThemes();
const starters = {};
for (const t of themes) {
  const assets = {};
  for (const path of themeFiles(t.id)) {
    if (SKIP.has(path) || !TEXT.test(path)) continue;
    assets[path] = readFileSync(join('themes', t.id, path), 'utf8');
  }
  starters[t.id] = { name: t.id, assets, html: readFileSync(join('themes', t.id, 'theme.html'), 'utf8') };
}

const esc = (s) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]);
const options = themes.map((t) => `        <option value="${t.id}">${esc(t.name)}${t.orientation === 'landscape' ? ' (landscape)' : ''}${t.overlay ? ' (overlay)' : ''}</option>`);

let bench = readFileSync(BENCH, 'utf8');
const swap = (begin, end, body) => {
  const a = bench.indexOf(begin), b = bench.indexOf(end);
  if (a < 0 || b < a) throw new Error(`Markers ${begin} / ${end} not found in ${BENCH}`);
  bench = bench.slice(0, a + begin.length) + '\n' + body + '\n' + bench.slice(b);
};
swap('// @@STARTERS-BEGIN@@', '// @@STARTERS-END@@', `const STARTERS = ${js(starters)};`);
swap('<!-- @@STARTER-OPTIONS-BEGIN@@ -->', '        <!-- @@STARTER-OPTIONS-END@@ -->', options.join('\n'));
writeFileSync(BENCH, bench);
console.log(`bench: ${themes.length} starters`);
