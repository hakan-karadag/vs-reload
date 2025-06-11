const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { CONFIG, log, sleep } = require('./utils');

class ExtensionManager {
  constructor(vscodePath) {
    this.vscodePath = vscodePath;
    this.isRestarting = false;
  }

  async launch(extension) {
    log('🚀 Launching...');
    
    this.vscodeProcess = spawn(this.vscodePath, [
      '--extensionDevelopmentPath', extension.path,
      '--disable-extensions',
      '--reuse-window'
    ], { detached: false, cwd: extension.path });

    if (!this.vscodeProcess.pid) throw new Error('Launch failed');
    
    log(`✅ Launched (${this.vscodeProcess.pid})`);
    await sleep(CONFIG.launchDelay);
    log(`🔧 ${extension.displayName} loaded`);
    
    // Simple monitoring
    setInterval(() => {
      try { 
        process.kill(this.vscodeProcess.pid, 0); 
      } catch { 
        log('🛑 VS Code closed'); 
        process.exit(0); 
      }
    }, 3000);
  }

  reloadWindow() {
    if (this.isRestarting) return;
    this.isRestarting = true;
    
    const signalFile = '.vs-reload-signal';
    fs.writeFileSync(signalFile, Date.now().toString());
    log('🔄 Reloaded');
    
    setTimeout(() => {
      try { fs.unlinkSync(signalFile); } catch {}
      this.isRestarting = false;
    }, 200);
  }

  stop() {
    try { this.vscodeProcess?.kill('SIGTERM'); } catch {}
  }
}

module.exports = { ExtensionManager }; 