const vscode = require('vscode');
const fix = require('./importFix');


module.exports = function(context) {
  // 注册command
  let fixer = vscode.commands.registerCommand('extension.resolveSugarFoundationImport', (document) => {
    const path = vscode.workspace.getConfiguration().get('sugar-suggest.path');
    const variableName = vscode.workspace.getConfiguration().get('sugar-suggest.variableName');
    const importStatement = `import * as ${variableName} from '${path}'`;
    fix(document, path, importStatement);
  })
  context.subscriptions.push(fixer);
};