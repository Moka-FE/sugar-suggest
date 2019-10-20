const vscode = require('vscode');
const cache = require('./cache');

function provideCompletionItems() {
    cache.init();
    return cache.getSuggestList();
}    

function resolveCompletionItem(item) {
  item.label = item.label.toUpperCase();
  item.insertText = item.insertText.toUpperCase();
  return item
}

module.exports = function(context) {
  let suggest = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'stylus' }, {
    provideCompletionItems,
    resolveCompletionItem,
  }, '#');
  context.subscriptions.push(suggest);
}