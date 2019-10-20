const vscode = require('vscode');
const stylus = require('stylus');
const fs = require('fs')
const path = require('path')
const camelCase = require('lodash/camelCase');

let suggestList = [];
let isInit = false;
const IDENT = 'Ident';
const EXPRESSION = 'Expression';

function setSuggestList (list) {
  suggestList = list;
  isInit = true;
  return true;
};

function getSuggestList() {
  return suggestList;
}

function findPath() {
  const workspaces = vscode.workspace.workspaceFolders;
  const sugarWorkspace = workspaces.find((folder) => {
    const rootPath = folder.uri.fsPath
    const foundationPath = path.resolve(rootPath, 'node_modules/sugar-design/foundation/variable.styl');
    return fs.existsSync(foundationPath);
  })
  if (sugarWorkspace) {
    return sugarWorkspace.uri.fsPath;
  }
}

function init() {
  if (isInit) return;
  try {
    const rootPath = findPath();
    if (!rootPath) {
      console.log('没有找到sugar-design')
    };
    const foundationPath = path.resolve(rootPath, 'node_modules/sugar-design/foundation/variable.styl');
    const source = fs.readFileSync(foundationPath, { encoding: 'utf8' });
    const Parser = stylus.Parser;
    const parser = new Parser(source);
    const ast = parser.parse()
    const variableNodes = ast.nodes;
    const tempArray = [];
    variableNodes.forEach((node) => {
      const name = camelCase(node.name.toLocaleLowerCase())
      if (node.toJSON().__type === IDENT && node.val.toJSON().__type === EXPRESSION) {
        const value = node.val.nodes[0].raw
        const rawValue = `${name} (${value})`; 
        const completionItem = new vscode.CompletionItem(rawValue, vscode.CompletionItemKind.Value);
        completionItem.insertText = name;
        completionItem.sortText = value;
        completionItem.filterText = value;;
        tempArray.push(completionItem);
      }
    });
    setSuggestList(tempArray);
  } catch(err) {
    console.error(err)
  }
}

module.exports = {
  setSuggestList,
  isInit,
  getSuggestList,
  init,
};

