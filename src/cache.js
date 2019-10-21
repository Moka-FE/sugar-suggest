const vscode = require('vscode');
const stylus = require('stylus');
const fs = require('fs')
const path = require('path')
const camelCase = require('lodash/camelCase');

let jsSuggestList = [];
let stylusSuggestList = [];
const IDENT = 'Ident';
const EXPRESSION = 'Expression';

function setSuggestList (jsList, stylusList) {
  jsSuggestList = jsList;
  stylusSuggestList = stylusList;
  return true;
};

function getSuggestList() {
  return {
    jsSuggestList,
    stylusSuggestList,
  }
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

function getDisplayValue(name, value, isCamelCase) {
  name = isCamelCase ? camelCase(name) : name;
  return value ? `${name} (${value})` : `${name}`;
}

function init() {
  vscode.workspace.onDidChangeWorkspaceFolders((ev) => {
    load()
  });
  load()
}

function load() {
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
    const jsTempArray = [];
    const stylusTempArray = []; 
    variableNodes.forEach((node) => {
      const name =  node.name 
      let value;
      if (node.toJSON().__type === IDENT && node.val.toJSON().__type === EXPRESSION) {
         value = node.val.nodes[0].raw
      } 

      const stylusItem = new vscode.CompletionItem(getDisplayValue(name, value, false), vscode.CompletionItemKind.Value);
      stylusItem.insertText = name;
      stylusTempArray.push(stylusItem);
      const jsItem = new vscode.CompletionItem(getDisplayValue(name, value, true), vscode.CompletionItemKind.Value);
      jsItem.insertText = camelCase(name);
      jsTempArray.push(jsItem);
    });
    setSuggestList(jsTempArray, stylusTempArray);
    console.log('sugar-suggest load success')
  } catch(err) {
    console.error(err)
  }
}

module.exports = {
  setSuggestList,
  getSuggestList,
  init,
};

