// Renders every route to static HTML after `vite build`, so each page ships
// with its real content and <head> tags (fast first paint, crawlable, link
// previews work) and React then hydrates it in the browser.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

// [url, output file]. Cloudflare Pages serves /faq from faq/index.html and
// uses 404.html for anything that doesn't match.
const ROUTES = [
  ['/', 'index.html'],
  ['/services', 'services/index.html'],
  ['/faq', 'faq/index.html'],
  ['/contact', 'contact/index.html'],
  ['/success', 'success/index.html'],
  ['/404', '404.html'],
];

const { render, headTags, headTagsToHtml } = await import(path.join(ssrDir, 'entry-server.js'));
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

for (const [url, file] of ROUTES) {
  // Function replacers, so "$$" etc. in the content isn't treated as a replacement pattern.
  const html = template
    .replace('<!--app-head-->', () => headTagsToHtml(headTags(url)))
    .replace('<!--app-html-->', () => render(url));
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`prerendered ${url} -> dist/${file}`);
}

fs.rmSync(ssrDir, { recursive: true, force: true });
