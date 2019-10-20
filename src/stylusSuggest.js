const vscode = require('vscode');
const cache = require('./cache');

function provideCompletionItems() {
    cache.init();
    return cache.getSuggestList().stylusSuggestList;
}    

function resolveCompletionItem(item) {
  return item
}

module.exports = function(context) {
  let suggest = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'stylus' }, {
    provideCompletionItems,
    resolveCompletionItem,
  }, '');
  context.subscriptions.push(suggest);
}