const vscode = require('vscode');
const stylus = require('stylus');
const less = require('less');
const fs = require('fs')
const path = require('path')
const camelCase = require('lodash/camelCase');

let jsSuggestList = [];
let stylusSuggestList = [];
let lessSuggestList = [];
const IDENT = 'Ident';
const EXPRESSION = 'Expression';

function getSuggestList() {
  return {
    jsSuggestList,
    stylusSuggestList,
    lessSuggestList,
  }
}

const FOUNDATION_PATH = {
  stylus: ['node_modules/sugar-design/foundation/variable.styl', 'lib/foundation/variable.styl'],
  less: ['node_modules/sugar-design/foundation/variable.less'],
}

function findPath(type) {
  const workspaces = vscode.workspace.workspaceFolders;
  let isSugarSourceProject = false;
  const sugarWorkspace = workspaces.find((folder) => {
    const rootPath = folder.uri.fsPath
    for (const fPah of FOUNDATION_PATH[type]) {
      const foundationPath = path.resolve(rootPath, fPah);
      const isExists = fs.existsSync(foundationPath);
      if (isExists) {
        if (fPah === FOUNDATION_PATH[type][1]) {
          isSugarSourceProject = true;
        }
        return true;
      }
    }
  })
  if (sugarWorkspace) {
    return path.resolve(sugarWorkspace.uri.fsPath,  FOUNDATION_PATH[type][isSugarSourceProject ? 1 : 0]);
  }
}

function getDisplayValue(name, value, isCamelCase) {
  name = isCamelCase ? camelCase(name) : name;
  return value ? `${name} (${value})` : `${name}`;
}

function fillItem(name ,value, container) {
  const item = new vscode.CompletionItem(getDisplayValue(name, value, false), vscode.CompletionItemKind.Value);
  const label = item.label;
  item.label = value ?  `${label} (var)` : `${label} (mixin)` 
  item.insertText = value ? `${name}` : `${name}()`;
  item.filterText = value || undefined;
  item.sortText = value || undefined;
  container.push(item)
  if (value) {
    const item = new vscode.CompletionItem(getDisplayValue(name, value, false), vscode.CompletionItemKind.Value);
    item.label = `${label} (var)`
    item.insertText = name; 
    container.push(item);
  }
  return item;
}

function init() {
  vscode.workspace.onDidChangeWorkspaceFolders(() => {
    load()
  });
  load()
}

function initLessItem() {
  const foundationPath = findPath('less');
  if (!foundationPath) {
    console.log('没有找到sugar-design less')
    return;
  };
  const source = fs.readFileSync(foundationPath, { encoding: 'utf8' });

  const lessProcess = {
    Expression: expressionProcess,
    Declaration: declarationProcess,
    Value: valueProcess,
    Color: colorProcess,
    MixinDefinition: mixinDefinitionProcess,
    Keyword: keywordProcess,
    Quoted: quotedProcess,
    Anonymous: anonymousProcess,
  };

  function visit(node) {
    return lessProcess[node.type](node);
  }

  function anonymousProcess(node) {
    return node.value;
  }

  function quotedProcess(node) {
    return node.value;
  }

  function keywordProcess(node) {
    return node.value;
  }

  function mixinDefinitionProcess(node) {
    if (node.parent.root) {
      const name = node.name;
      const value = '';
      return { name: name, value, isVariable: false };
    } else {
      return visit(node.value);
    }
  }

  function colorProcess(node) {
    return node.value;
  }

  function valueProcess(node) {
    const value = node.value
      .map((v) => {
        return visit(v);
      })
      .join(', ');
    return value;
  }

  function expressionProcess(node) {
    const value = node.value
      .map((v) => {
        return visit(v);
      })
      .join(',');
    return value;
  }

  function declarationProcess(node) {
    if (node.parent.root) {
      const name = node.name;
      const value = visit(node.value);
      const isVariable = node.name.indexOf('@') === 0;
      return { name, value, isVariable };
    } else {
      return visit(node.value);
    }
  }
  less.parse(source, {}, (e, ast) => {
    const nodes = ast.rules;
    nodes.map((n) => {
      const { name, value } = visit(n);
      fillItem(name, value, lessSuggestList)
    });
    console.log(lessSuggestList)
  });
};

function initStylusAndJsItems() {
  try {
    const foundationPath = findPath('stylus');
    if (!foundationPath) {
      console.log('没有找到sugar-design')
      return;
    };
    const source = fs.readFileSync(foundationPath, { encoding: 'utf8' });
    const Parser = stylus.Parser;
    const parser = new Parser(source);
    const ast = parser.parse()
    const variableNodes = ast.nodes;
    variableNodes.forEach((node) => {
      const name =  node.name 
      let value;
      if (node.toJSON().__type === IDENT && node.val.toJSON().__type === EXPRESSION) {
         value = node.val.nodes[0].raw || node.val.nodes[0].val
      }
      fillItem(name, value, stylusSuggestList);
      const jsItem = new vscode.CompletionItem(getDisplayValue(name, value, true), vscode.CompletionItemKind.Value);
      jsItem.insertText = camelCase(name);
      jsSuggestList.push(jsItem);
    });
  } catch(err) {
    console.error(err)
  }
}

function load() {
  initStylusAndJsItems();
  initLessItem();
  console.log('sugar-suggest load success')
}

module.exports = {
  getSuggestList,
  init,
};

