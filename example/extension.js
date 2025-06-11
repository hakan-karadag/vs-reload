// extension.js
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

let reloadWatcher = null;

const test = "test 5451231545587545521";

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
  console.log('[vs-reload] Extension helper activated');
  
  const extensionPath = context.extensionPath;
  const signalFile = path.join(extensionPath, '.vs-reload-signal');
  
  // Setup file watcher for vs-reload signal
  if (fs.existsSync(extensionPath)) {
    reloadWatcher = fs.watch(extensionPath, (eventType, filename) => {
      if (filename === '.vs-reload-signal' && eventType === 'rename') {
        if (fs.existsSync(signalFile)) {
          console.log('[vs-reload] Reload signal detected');
          setTimeout(() => {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
          }, 100);
        }
      }
    });
    console.log('[vs-reload] File watching activated');
  }

  // Register simple hello world command
  let disposable = vscode.commands.registerCommand('vs-reload-example.helloWorld', function() {
    vscode.window.showInformationMessage('Hello World from vs-reload! 🚀');
  });

  // Register simple tree view
  const treeDataProvider = new TestTreeDataProvider();
  vscode.window.registerTreeDataProvider('vsReloadExampleView', treeDataProvider);

  context.subscriptions.push(disposable);
  context.subscriptions.push({
    dispose: () => {
      if (reloadWatcher) {
        reloadWatcher.close();
        reloadWatcher = null;
      }
    }
  });
}

function deactivate() {
  if (reloadWatcher) {
    reloadWatcher.close();
    reloadWatcher = null;
  }
  console.log('[vs-reload] Extension deactivated');
}

module.exports = {
  activate,
  deactivate
};
//# sourceMappingURL=extension.js.map
