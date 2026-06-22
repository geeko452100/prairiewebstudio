const fs = require('fs');
const path = require('path');

const { sourceHtmlPath, outputHtmlPath } = require('./prepare-html');
const cssPath = path.join(__dirname, '..', 'assets', 'css', 'main.css');

const html = fs.readFileSync(sourceHtmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const start = html.indexOf('  <!-- BUILD:CSS-START -->');
const end = html.indexOf('  <!-- BUILD:CSS-END -->');

if (start === -1 || end === -1) {
  console.error('Missing BUILD:CSS-START or BUILD:CSS-END markers in index.html');
  process.exit(1);
}

const replacement = `  <!-- BUILD:CSS-START -->\n  <style>${css}</style>\n  <!-- BUILD:CSS-END -->`;

const next = html.slice(0, start) + replacement + html.slice(end + '  <!-- BUILD:CSS-END -->'.length);

fs.writeFileSync(outputHtmlPath, next);
console.log(`Inlined ${css.length} bytes of CSS into index.html (from src/index.html)`);
