const vscode = require('vscode');

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
  let fixer = vscode.commands.registerCommand('extension.resolveSugarFoundationImport', (document) => {
    const path = vscode.workspace.getConfiguration().get('sugar-suggest.path');
    const variableName = vscode.workspace.getConfiguration().get('sugar-suggest.variableName');
    const importStatement = `import * as ${variableName} from '${path}'`;
    let exp = new RegExp(path);
    let currentDoc = document.getText();
    if (currentDoc.match(exp)) {
      return;
    } 
    const edit = new vscode.WorkspaceEdit();
    const insertPos = document.positionAt(document.getText().lastIndexOf('import')).translate(1, 0);
    edit.insert(document.uri, insertPos, `${importStatement};\n`);
    vscode.workspace.applyEdit(edit);
  })
  context.subscriptions.push(suggest);
  context.subscriptions.push(fixer);
};