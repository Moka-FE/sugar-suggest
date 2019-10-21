const vscode = require('vscode');

module.exports = function (document, path, importStatement) {
    let exp = new RegExp(path);
    let currentDoc = document.getText();
    if (currentDoc.match(exp)) {
      return;
    } 
    const edit = new vscode.WorkspaceEdit();
    const insertPos = document.positionAt(document.getText().lastIndexOf('import ')).translate(1, 0);
    edit.insert(document.uri, insertPos, `${importStatement};\n`);
    vscode.workspace.applyEdit(edit);
}