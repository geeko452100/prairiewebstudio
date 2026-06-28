// Injects shared layout partials (header, footer) into each source page.
// Source of truth: src/partials/*.html. Runs before SEO/CSS so the injected
// markup is present when those steps process the page. Idempotent — re-running
// replaces the content between the PARTIAL markers in place.

const fs = require('fs');
const path = require('path');

const { pages } = require('./prepare-html');

const root = path.join(__dirname, '..');
const partialsDir = path.join(root, 'src', 'partials');

const partials = [
  { name: 'header', start: '<!-- PARTIAL:HEADER-START -->', end: '<!-- PARTIAL:HEADER-END -->' },
  { name: 'footer', start: '<!-- PARTIAL:FOOTER-START -->', end: '<!-- PARTIAL:FOOTER-END -->' },
];

const partialCache = {};
function loadPartial(name) {
  if (!(name in partialCache)) {
    partialCache[name] = fs.readFileSync(path.join(partialsDir, `${name}.html`), 'utf8').trim();
  }
  return partialCache[name];
}

function replaceBlock(content, startMarker, endMarker, replacement) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  // A page is free to omit a partial — only inject where both markers exist.
  if (start === -1 || end === -1) return content;
  const block = `${startMarker}\n  ${replacement}\n  ${endMarker}`;
  return content.slice(0, start) + block + content.slice(end + endMarker.length);
}

pages.forEach(({ sourceHtmlPath }) => {
  let html = fs.readFileSync(sourceHtmlPath, 'utf8');
  partials.forEach((partial) => {
    html = replaceBlock(html, partial.start, partial.end, loadPartial(partial.name));
  });
  fs.writeFileSync(sourceHtmlPath, html);
  console.log(`Applied partials to ${path.basename(sourceHtmlPath)}`);
});
