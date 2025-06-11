// extension.js
const vscode = require('vscode');

const test = "test 2";

// Simple tree item for the test view
class TestTreeItem extends vscode.TreeItem {
  constructor(label, description) {
    super(label);
    this.description = description;
    this.tooltip = `${label} - ${description}`;
  }
}

// Simple data provider
class TestTreeDataProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  getTreeItem(element) {
    return element;
  }

  getChildren() {
    return [new TestTreeItem('vs-reload Example: ', test)];
  }
}

function activate(context) {
  console.log('Extension "VS Reload Example" activated');
  
  // Register simple hello world command
  let disposable = vscode.commands.registerCommand('vs-reload-example.helloWorld', function() {
    vscode.window.showInformationMessage('Hello World from vs-reload! 🚀');
  });

  // Register simple tree view
  const treeDataProvider = new TestTreeDataProvider();
  vscode.window.registerTreeDataProvider('vsReloadExampleView', treeDataProvider);

  context.subscriptions.push(disposable);
}

function deactivate() {
  console.log('Extension deactivated');
}

module.exports = {
  activate,
  deactivate
};
//# sourceMappingURL=extension.js.map
