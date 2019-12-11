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

const FOUNDATION_AVAIlABLE_PATH = ['node_modules/sugar-design/foundation/variable.styl', 'lib/foundation/variable.styl'];

function findPath() {
  const workspaces = vscode.workspace.workspaceFolders;
  let isSugarSourceProject = false;
  const sugarWorkspace = workspaces.find((folder) => {
    const rootPath = folder.uri.fsPath
    for (const fPah of FOUNDATION_AVAIlABLE_PATH) {
      const foundationPath = path.resolve(rootPath, fPah);
      const isExists = fs.existsSync(foundationPath);
      if (isExists) {
        if (fPah === FOUNDATION_AVAIlABLE_PATH[1]) {
          isSugarSourceProject = true;
        }
        return true;
      }
    }
  })
  if (sugarWorkspace) {
    return path.resolve(sugarWorkspace.uri.fsPath,  FOUNDATION_AVAIlABLE_PATH[isSugarSourceProject ? 1 : 0]);
  }
}

function getDisplayValue(name, value, isCamelCase) {
  name = isCamelCase ? camelCase(name) : name;
  return value ? `${name} (${value})` : `${name}`;
}

function init() {
  vscode.workspace.onDidChangeWorkspaceFolders(() => {
    load()
  });
  load()
}

function load() {
  try {
    const foundationPath = findPath();
    if (!foundationPath) {
      console.log('没有找到sugar-design')
      return;
    };
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
         value = node.val.nodes[0].raw || node.val.nodes[0].val
      }

      const stylusItem = new vscode.CompletionItem(getDisplayValue(name, value, false), vscode.CompletionItemKind.Value);
      const label = stylusItem.label;
      stylusItem.label = value ?  `${label} (var)` : `${label} (mixin)` 
      stylusItem.insertText = value ? name : `${name}()`;
      stylusItem.filterText = value;
      stylusItem.sortText = value;
      stylusTempArray.push(stylusItem);
      if (value) {
        const item = new vscode.CompletionItem(getDisplayValue(name, value, false), vscode.CompletionItemKind.Value);
        item.label = `${label} (var)`
        item.insertText = name; 
        stylusTempArray.push(item);
      }
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

