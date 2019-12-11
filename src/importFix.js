const vscode = require('vscode');

module.exports = function (document, path, importStatement) {
    let exp = new RegExp(path);
    let currentDoc = document.getText();
    if (currentDoc.match(exp)) {
      return;
    } 
    const edit = new vscode.WorkspaceEdit();
    const pos = document.getText().lastIndexOf('import ')
    let insertPos = document.positionAt(pos).translate(pos === -1 ? 0 : 1, 0);
    insertPos = insertPos.with(insertPos.line, 0);
    edit.insert(document.uri, insertPos, `${importStatement};\n`);
    vscode.workspace.applyEdit(edit);
}