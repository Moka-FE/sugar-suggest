const vscode = require('vscode');
const cache = require('./cache');
const fix = require('./importFix');

function provideCompletionItems(document) {
  return cache.getSuggestList().lessSuggestList.map((item) => {
    item.command = {
      title: 'auto import stylus variable',
      command: 'extension.resolveSugarVariableImport',
      arguments: [document],
    }
    return item;
  })
}    

function resolveCompletionItem(item) {
  return item
}

module.exports = function(context) {
  let suggest = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'less' }, {
    provideCompletionItems,
    resolveCompletionItem,
  }, '');

  let fixer = vscode.commands.registerCommand('extension.resolveSugarVariableImport', (document) => {
    const path = vscode.workspace.getConfiguration().get('sugar-suggest.variablePath')
    const importStatement = `@import '${path}'`;
    return fix(document, path, importStatement);
  })
  context.subscriptions.push(suggest);
  context.subscriptions.push(fixer);
}