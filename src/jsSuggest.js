const vscode = require('vscode');
const cache = require('./cache');
const camelCase = require('lodash/camelCase');

function provideCompletionItems(document, position) {
    const line  = document.lineAt(position);
    cache.init();

   // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);
    const reg = /sdf\.(w*)/;
    const match = lineText.match(reg);
    // 简单匹配，只要当前光标前的字符串为`this.dependencies.`都自动带出所有的依赖
    return match ? cache.getSuggestList().jsSuggestList : [];
   }

function resolveCompletionItem(item) {
  // const insertText = camelCase(item.insertText);
  // const label = item.label.replace(item.insertText, insertText);
  // item.filterText = item.label;
  // item.insertText = insertText;
  // return {
  //   label, 
  //   filterText: label, 
  //   insertText
  // }
  return item;
}

module.exports = function(context) {
  let suggest = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascript' }, {
    provideCompletionItems,
    resolveCompletionItem,
  }, '.');
  context.subscriptions.push(suggest);
};