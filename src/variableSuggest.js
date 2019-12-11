const vscode = require('vscode');
const fix = require('./importFix');

function provideCompletionItems(document) {
    const variableName = vscode.workspace.getConfiguration().get('sugar-suggest.variableName');
    const item = new vscode.CompletionItem(variableName, vscode.CompletionItemKind.Variable);
    item.command = {
      'title': 'auto import sugar foundation',
      command: 'extension.resolveSugarFoundationImport',
      arguments: [document],
    }
    return [item];
}

function resolveCompletionItem(item) {
  return item;
}

module.exports = function(context) {
  // 注册complete
  let suggest = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascript' }, {
    provideCompletionItems,
    resolveCompletionItem,
  }, '');
  // 注册command
  context.subscriptions.push(suggest);
};