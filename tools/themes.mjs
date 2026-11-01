// The theme folders under themes/ and their theme.json metadata.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

export const ID_RE = /^[a-z0-9][a-z0-9-]{0,30}$/;

// Every theme, in store order (theme.json "order", then name).
export function listThemes() {
  const out = [];
  for (const id of readdirSync('themes')) {
    const dir = join('themes', id);
    if (!statSync(dir).isDirectory()) continue;
    if (!ID_RE.test(id)) throw new Error(`Theme folder "${id}" is not a valid id (${ID_RE})`);
    if (!existsSync(join(dir, 'theme.html'))) throw new Error(`${dir} has no theme.html`);
    const meta = JSON.parse(readFileSync(join(dir, 'theme.json'), 'utf8'));
    const html = readFileSync(join(dir, 'theme.html'), 'utf8');
    const orientation = /data-kp-orientation\s*=\s*["']landscape/i.test(html) ? 'landscape' : 'portrait';
    const overlay = /<html[^>]*\sdata-kp-overlay\b/i.test(html);
    out.push({ id, order: 1000, ...meta, orientation, overlay });
  }
  return out.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

// Paths of every file in a theme folder, relative to it.
export function themeFiles(id) {
  const root = join('themes', id);
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name.startsWith('.')) continue;
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(relative(root, p).split('\\').join('/'));
    }
  };
  walk(root);
  return out;
}
