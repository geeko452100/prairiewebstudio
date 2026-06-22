// Source of truth: src/index.html. Production output: index.html (inlined CSS).
// This module is used by inline-css.js; kept separate for clarity.

const path = require('path');

module.exports = {
  sourceHtmlPath: path.join(__dirname, '..', 'src', 'index.html'),
  outputHtmlPath: path.join(__dirname, '..', 'index.html'),
};
