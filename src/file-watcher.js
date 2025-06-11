const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { CONFIG, log } = require('./utils');

class FileWatcher {
  constructor() {
    this.fileHashes = new Map();
    this.lastChange = 0;
  }

  start(extensionPath, onChange) {
    log('👀 Watching...');
    
    this.watcher = chokidar.watch(CONFIG.watchPatterns, {
      cwd: extensionPath,
      ignored: CONFIG.ignorePatterns,
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 }
    });

    this.watcher.on('change', filePath => this.handleChange(path.join(extensionPath, filePath), onChange));
    this.watcher.on('add', filePath => this.handleChange(path.join(extensionPath, filePath), onChange));
  }

  handleChange(fullPath, onChange) {
    const now = Date.now();
    if (now - this.lastChange < CONFIG.debounceMs) return;
    
    // Fast content check
    if (!this.hasReallyChanged(fullPath)) return;
    
    this.lastChange = now;
    log(`📝 ${path.basename(fullPath)}`);
    
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(onChange, 100);
  }

  hasReallyChanged(filePath) {
    try {
      if (!fs.existsSync(filePath)) return true;
      
      const content = fs.readFileSync(filePath, 'utf8');
      const hash = this.simpleHash(content);
      const prev = this.fileHashes.get(filePath);
      
      this.fileHashes.set(filePath, hash);
      return prev !== hash;
    } catch {
      return true;
    }
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return hash;
  }

  stop() {
    this.watcher?.close();
    clearTimeout(this.debounceTimer);
    this.fileHashes.clear();
  }
}

module.exports = { FileWatcher }; 