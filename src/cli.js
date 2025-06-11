const { log, parseArgs } = require('./utils');
const { detectExtension } = require('./extension-detector');
const { VSCodeManager } = require('./vscode-manager');
const { ExtensionManager } = require('./extension-manager');
const { FileWatcher } = require('./file-watcher');

const main = async () => {
  console.log('🚀 vs-reload - Universal Extension Development Tool\n');
  console.log('⭐ If you like this project, please leave a star on GitHub: https://github.com/hakan-karadag/vs-reload\n');

  let extensionManager = null;
  let fileWatcher = null;

  const cleanup = () => {
    log('🛑 Stopping...');
    fileWatcher?.stop();
    extensionManager?.stop();
    process.exit(0);
  };

  try {
    const options = parseArgs();
    
    if (options.projectPath) log(`🎯 Project path: ${options.projectPath}`);
    if (options.vscodePath) log(`🎯 Editor path: ${options.vscodePath}`);

    // 1. Detect extension
    const extension = detectExtension(options.projectPath);
    
    // 2. Find compatible editor
    const vscodeManager = new VSCodeManager();
    await vscodeManager.findVSCode(options.vscodePath);
    
    // 3. Launch editor with extension
    extensionManager = new ExtensionManager(vscodeManager.vscodePath);
    await extensionManager.launch(extension);
    
    // 4. Start file watching for auto-reload
    fileWatcher = new FileWatcher();
    fileWatcher.start(extension.path, (changedFilePath) => {
      extensionManager.syncChangedFile(changedFilePath);
      extensionManager.reloadWindow();
    });

    // 5. Ready message
    console.log('');
    log('✅ Development mode active!');
    log('ℹ️ Press Ctrl+C to stop');
    console.log('');

    // 6. Handle shutdown gracefully
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

  } catch (error) {
    log(`❌ ${error.message}`);
    console.log('💡 Usage: vs-reload [--project-path=/path/to/extension] [--vscode-path=/path/to/editor]');
    console.log('   Alternative: --editor-path can be used instead of --vscode-path');
    console.log('   Works with: VS Code, VS Code Insiders, VSCodium, and compatible forks\n');
    
    cleanup();
    process.exit(1);
  }
};

main();

module.exports = { main };
