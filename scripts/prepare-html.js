// Source of truth: src/*.html. Production output: root *.html (inlined CSS).

const path = require('path');

const root = path.join(__dirname, '..');

const pageDefinitions = [
  { source: 'src/index.html', output: 'index.html' },
  { source: 'src/success.html', output: 'success.html' },
];

const pages = pageDefinitions.map((page) => ({
  sourceHtmlPath: path.join(root, page.source),
  outputHtmlPath: path.join(root, page.output),
}));

module.exports = {
  pages,
  sourceHtmlPath: pages[0].sourceHtmlPath,
  outputHtmlPath: pages[0].outputHtmlPath,
};
