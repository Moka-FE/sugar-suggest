const jsSuggest = require('./src/jsSuggest');
const stylusSuggest = require('./src/stylusSuggest');
const autoImport = require('./src/autoImport');
const cache = require('./src/cache');
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  cache.init();
  jsSuggest(context);
  stylusSuggest(context);
  autoImport(context);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
