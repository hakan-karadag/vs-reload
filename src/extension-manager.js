const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { CONFIG, log, sleep } = require('./utils');

class ExtensionManager {
  constructor(vscodePath) {
    this.vscodePath = vscodePath;
    this.isRestarting = false;
    this.extensionPath = null;
    this.tempExtensionPath = null;
  }

  async launch(extension) {
    this.extensionPath = extension.path;
    this.startTime = Date.now();
    log('🚀 Launching...');
    
    await this.createTempExtension();
    
    const launchArgs = [
      '--extensionDevelopmentPath', this.tempExtensionPath,
      '--disable-extensions', '--reuse-window'
    ];
    
    this.vscodeProcess = spawn(this.vscodePath, launchArgs, { 
      detached: false, 
      cwd: this.tempExtensionPath,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    if (!this.vscodeProcess.pid) throw new Error('Launch failed');
    
    this.setupErrorHandling();
    
    log(`✅ Launched (${this.vscodeProcess.pid})`);
    await sleep(CONFIG.launchDelay);
    log(`🔧 ${extension.displayName} loaded`);
    
    this.monitorProcess();
  }

  setupErrorHandling() {
    let hasWarnings = false;
    
    const handleOutput = (data, source) => {
      const msg = data.toString().trim();
      if (msg && !msg.includes('DevTools') && 
          (msg.includes('DeprecationWarning') || msg.includes('Exception') || msg.includes('Error'))) {
        hasWarnings = true;
        log(`⚠️ Editor warning: ${msg}`);
        log(`⚠️ This may indicate compatibility issues with extension development`);
      }
    };
    
    this.vscodeProcess.stderr.on('data', data => handleOutput(data, 'stderr'));
    this.vscodeProcess.stdout.on('data', data => handleOutput(data, 'stdout'));
  }

  monitorProcess() {
    setInterval(() => {
      try { 
        process.kill(this.vscodeProcess.pid, 0); 
      } catch { 
        const runTime = Date.now() - this.startTime;
        log('🛑 Unable to close modified editor (Fork)');
        
        if (runTime < 10000) {
          this.handleIncompatibleEditor();
          return;
        }
        
        this.cleanup();
        process.exit(0); 
      }
    }, 3000);
  }

  async createTempExtension() {
    this.tempExtensionPath = path.join(require('os').tmpdir(), `vs-reload-${Date.now()}`);
    fs.mkdirSync(this.tempExtensionPath, { recursive: true });
    
    this.copyDirectory(this.extensionPath, this.tempExtensionPath);
    this.injectReloadCode();
  }

  injectReloadCode() {
    const originalExtensionJs = path.join(this.extensionPath, 'extension.js');
    const tempExtensionJs = path.join(this.tempExtensionPath, 'extension.js');
    
    if (!fs.existsSync(originalExtensionJs)) return;
    
    const originalCode = fs.readFileSync(originalExtensionJs, 'utf8');
    const reloadCode = this.generateReloadCode();
    
    fs.writeFileSync(tempExtensionJs, reloadCode + '\n' + originalCode);
  }

  generateReloadCode() {
    return `
// vs-reload auto-injected code (temporary - never saved to original)
const vs_reload_fs = require('fs');
const vs_reload_path = require('path');
let vs_reload_watcher = null;

const vs_reload_originalActivate = typeof activate !== 'undefined' ? activate : null;
if (typeof activate !== 'undefined') {
  activate = function(context) {
    if (vs_reload_originalActivate) vs_reload_originalActivate(context);
    
    const originalExtensionPath = '${this.extensionPath.replace(/\\/g, '\\\\')}';
    const signalFile = vs_reload_path.join(originalExtensionPath, '.vs-reload-signal');
    
    if (vs_reload_fs.existsSync(originalExtensionPath)) {
      vs_reload_watcher = vs_reload_fs.watch(originalExtensionPath, (eventType, filename) => {
        if (filename === '.vs-reload-signal' && eventType === 'rename' && vs_reload_fs.existsSync(signalFile)) {
          setTimeout(() => {
            try {
              require('vscode').commands.executeCommand('workbench.action.reloadWindow');
            } catch (error1) {
              try {
                require('vscode').commands.executeCommand('developer.reload');
              } catch (error2) {
                console.log('vs-reload: Could not reload editor - manual reload required');
              }
            }
          }, 100);
        }
      });
    }
    
    context.subscriptions.push({
      dispose: () => {
        if (vs_reload_watcher) {
          vs_reload_watcher.close();
          vs_reload_watcher = null;
        }
      }
    });
  };
}`;
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      
      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  syncChangedFile(originalFilePath) {
    if (!this.tempExtensionPath || !fs.existsSync(originalFilePath)) return;
    
    const relativePath = path.relative(this.extensionPath, originalFilePath);
    const tempFilePath = path.join(this.tempExtensionPath, relativePath);
    
    try {
      const tempDir = path.dirname(tempFilePath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      if (path.basename(originalFilePath) === 'extension.js') {
        const originalCode = fs.readFileSync(originalFilePath, 'utf8');
        const reloadCode = this.generateReloadCode();
        fs.writeFileSync(tempFilePath, reloadCode + '\n' + originalCode);
      } else {
        fs.copyFileSync(originalFilePath, tempFilePath);
      }
      
      log(`🔄 Synced: ${relativePath}`);
    } catch (error) {
      log(`❌ Sync failed: ${relativePath}`);
    }
  }

  reloadWindow() {
    if (this.isRestarting) return;
    this.isRestarting = true;
    
    const signalFile = path.join(this.extensionPath, '.vs-reload-signal');
    fs.writeFileSync(signalFile, Date.now().toString());
    log('🔄 Reloaded');
    
    setTimeout(() => {
      try { fs.unlinkSync(signalFile); } catch {}
      this.isRestarting = false;
    }, 200);
  }

  cleanup() {
    if (this.tempExtensionPath && fs.existsSync(this.tempExtensionPath)) {
      try {
        fs.rmSync(this.tempExtensionPath, { recursive: true, force: true });
      } catch {}
    }
  }

  stop() {
    this.cleanup();
    try { this.vscodeProcess?.kill('SIGTERM'); } catch {}
  }

  async handleIncompatibleEditor() {
    log(`❌ Cannot execute on this editor: this Fork is not compatible with VS Code extension development`);
    
    try {
      if (this.vscodeProcess?.pid) {
        this.vscodeProcess.kill('SIGTERM');
        await sleep(2000);
        
        try {
          process.kill(this.vscodeProcess.pid, 0);
          log(`⚠️ Forcing incompatible editor closure...`);
          
          if (process.platform === 'win32') {
            const { exec } = require('child_process');
            exec(`taskkill /F /T /PID ${this.vscodeProcess.pid}`);
            await sleep(1000);
          } else {
            this.vscodeProcess.kill('SIGKILL');
            await sleep(1000);
          }
        } catch {}
      }
    } catch {}
    
    // Try auto-retry with VS Code
    const { VSCodeManager } = require('./vscode-manager');
    const vscodeManager = new VSCodeManager();
    
    try {
      await vscodeManager.findVSCode(); 
      log(`🔄 Auto-retrying with VS Code...`);
      
      this.vscodePath = vscodeManager.vscodePath;
      const { detectExtension } = require('./extension-detector');
      const extension = detectExtension(this.extensionPath);
      
      await this.launch(extension);
      
    } catch (error) {
      log(`❌ VS Code not found - Download: https://code.visualstudio.com/download`);
      this.cleanup();
      process.exit(1);
    }
  }
}

module.exports = { ExtensionManager }; 