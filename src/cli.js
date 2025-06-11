const { log } = require('./utils');
const { detectExtension } = require('./extension-detector');
const { VSCodeManager } = require('./vscode-manager');
const { ExtensionManager } = require('./extension-manager');
const { FileWatcher } = require('./file-watcher');

const main = async () => {
  console.log('🚀 vs-reload - Ultra Fast & Simple\n');

  try {
    // 1. Detect extension
    const extension = detectExtension();
    
    // 2. Find VS Code
    const vscodeManager = new VSCodeManager();
    await vscodeManager.findVSCode();
    
    // 3. Launch VS Code with extension
    const extensionManager = new ExtensionManager(vscodeManager.vscodePath);
    await extensionManager.launch(extension);
    
    // 4. Start file watching for auto-reload
    const fileWatcher = new FileWatcher();
    fileWatcher.start(extension.path, () => extensionManager.reloadWindow());

    // 5. Ready message
    console.log('');
    log('✅ Ultra-fast mode active!');
    log('ℹ️ Press Ctrl+C to stop');
    console.log('');

    // 6. Handle shutdown gracefully
    process.on('SIGINT', () => {
      log('🛑 Stopping...');
      fileWatcher.stop();
      extensionManager.stop();
      process.exit(0);
    });

  } catch (error) {
    log(`❌ ${error.message}`);
    console.log('💡 https://code.visualstudio.com\n');
    process.exit(1);
  }
};

// Auto-execute when required directly or via index.js
main();

module.exports = { main };
