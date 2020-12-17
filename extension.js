const jsSuggest = require('./src/jsSuggest');
const stylusSuggest = require('./src/stylusSuggest');
const lessSuggest = require('./src/lessSuggest');
const autoImport = require('./src/autoImport');
const variableSuggest = require('./src/variableSuggest');
const cache = require('./src/cache');
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  cache.init();
  autoImport(context);
  variableSuggest(context);
  jsSuggest(context);
  stylusSuggest(context);
  lessSuggest(context);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
