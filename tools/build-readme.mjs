// Writes the screenshot gallery into README.md, between the gallery markers,
// from themes/*/theme.json and the compiled previews in dist/. Run after
// tools/compile.mjs so every preview exists.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { listThemes } from './themes.mjs';

const START = '<!-- gallery:start -->';
const END = '<!-- gallery:end -->';
const BUILD = '800x480'; // X4 / X4 Pro / X4C; the X3 previews sit beside them
const X3 = '792x528';
const PER_ROW = { portrait: 4, landscape: 2 };
const WIDTH = { portrait: 180, landscape: 380 };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function cell(t) {
  const img = `dist/${BUILD}/${t.id}/preview.png`;
  if (!existsSync(img)) throw new Error(`${img} is missing: run tools/compile.mjs first`);
  const tag = t.overlay ? ' <sub>overlay</sub>' : '';
  return [
    `<td align="center" valign="top" width="${Math.round(100 / PER_ROW[t.orientation])}%">`,
    `<a href="${img}"><img src="${img}" width="${WIDTH[t.orientation]}" alt="${esc(t.name)}"></a><br>`,
    `<b>${esc(t.name)}</b>${tag}<br><code>${t.id}</code> · <a href="dist/${X3}/${t.id}/preview.png">X3</a><br>`,
    `<sub>${esc(t.description || '')}</sub>`,
    '</td>',
  ].join('\n');
}

function table(themes, orientation) {
  const list = themes.filter((t) => t.orientation === orientation);
  if (!list.length) return '';
  const rows = [];
  for (let i = 0; i < list.length; i += PER_ROW[orientation]) {
    rows.push('<tr>\n' + list.slice(i, i + PER_ROW[orientation]).map(cell).join('\n') + '\n</tr>');
  }
  return `<table>\n${rows.join('\n')}\n</table>`;
}

const themes = listThemes();
const gallery = [
  START,
  '',
  `Rendered at 480×800 (X4, X4 Pro and X4C, which share a screen) with sample values; tap an`,
  `image for full size, or **X3** for the 528×792 build. Overlay themes are shown on a stand-in`,
  `book page: on the reader they sit on whatever page you were reading.`,
  '',
  '### Portrait',
  '',
  table(themes, 'portrait'),
  '',
  '### Landscape',
  '',
  table(themes, 'landscape'),
  '',
  END,
].join('\n');

const readme = readFileSync('README.md', 'utf8');
const a = readme.indexOf(START);
const b = readme.indexOf(END);
if (a < 0 || b < a) throw new Error(`README.md needs ${START} and ${END}`);
const next = readme.slice(0, a) + gallery + readme.slice(b + END.length);
if (next !== readme) writeFileSync('README.md', next);
console.log(`README.md gallery: ${themes.length} themes`);
