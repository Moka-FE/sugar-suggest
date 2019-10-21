// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const jsSuggest = require('./src/jsSuggest');
const stylusSuggest = require('./src/stylusSuggest');
const autoImport = require('./src/autoImport');
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  jsSuggest(context);
  stylusSuggest(context);
  autoImport(context);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
