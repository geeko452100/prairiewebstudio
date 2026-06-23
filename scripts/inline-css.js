const fs = require('fs');
const path = require('path');

const { pages } = require('./prepare-html');
const cssPath = path.join(__dirname, '..', 'assets', 'css', 'main.css');
const css = fs.readFileSync(cssPath, 'utf8');
const endMarker = '  <!-- BUILD:CSS-END -->';

pages.forEach(({ sourceHtmlPath, outputHtmlPath }) => {
  const html = fs.readFileSync(sourceHtmlPath, 'utf8');
  const start = html.indexOf('  <!-- BUILD:CSS-START -->');
  const end = html.indexOf(endMarker);

  if (start === -1 || end === -1) {
    console.error(`Missing BUILD:CSS markers in ${sourceHtmlPath}`);
    process.exit(1);
  }

  const replacement = `  <!-- BUILD:CSS-START -->\n  <style>${css}</style>\n  <!-- BUILD:CSS-END -->`;
  const next = html.slice(0, start) + replacement + html.slice(end + endMarker.length);

  fs.writeFileSync(outputHtmlPath, next);
  console.log(`Inlined ${css.length} bytes of CSS into ${path.basename(outputHtmlPath)} (from ${path.basename(sourceHtmlPath)})`);
});
