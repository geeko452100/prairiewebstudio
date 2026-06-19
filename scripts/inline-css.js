const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'assets', 'css', 'main.css');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const start = html.indexOf('  <!-- BUILD:CSS-START -->');
const end = html.indexOf('  <!-- BUILD:CSS-END -->');

if (start === -1 || end === -1) {
  console.error('Missing BUILD:CSS-START or BUILD:CSS-END markers in index.html');
  process.exit(1);
}

const replacement = `  <!-- BUILD:CSS-START -->\n  <style>${css}</style>\n  <!-- BUILD:CSS-END -->`;

const next = html.slice(0, start) + replacement + html.slice(end + '  <!-- BUILD:CSS-END -->'.length);

fs.writeFileSync(htmlPath, next);
console.log(`Inlined ${css.length} bytes of CSS into index.html`);
