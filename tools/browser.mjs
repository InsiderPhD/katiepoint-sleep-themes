// A local static server for the bench and the compiler page, and a Chrome to
// drive them. CHROME_PATH picks a Chrome already installed (puppeteer's own
// download is used otherwise, as in CI).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import puppeteer from 'puppeteer';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };

// Serves files under root; routes maps a URL path to a handler(req, res) first.
export async function serve(root, routes = {}) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (routes[path]) return routes[path](req, res);
    const file = normalize(join(root, path === '/' ? 'index.html' : path));
    if (!file.startsWith(normalize(root))) return res.writeHead(403).end();
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

export async function launch() {
  return puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });
}
