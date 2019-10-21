const vscode = require('vscode');
const cache = require('./cache');

function provideCompletionItems(document, position) {
    const line  = document.lineAt(position);
    const variableName = vscode.workspace.getConfiguration().get('sugar-suggest.variableName')

   // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);
    const reg = new RegExp(`${variableName}\\.(w*)`)
    const match = lineText.match(reg);
    // 简单匹配，只要当前光标前的字符串为`this.dependencies.`都自动带出所有的依赖
    return match ? cache.getSuggestList().jsSuggestList : [];
   }

function resolveCompletionItem(item) {
  return item;
}

module.exports = function(context) {
  let suggest = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascript' }, {
    provideCompletionItems,
    resolveCompletionItem,
  }, '.');
  context.subscriptions.push(suggest);
};