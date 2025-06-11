const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { log } = require('./utils');

class VSCodeManager {
  async findVSCode(customVSCodePath = null) {
    if (customVSCodePath) {
      const resolvedPath = path.resolve(customVSCodePath);
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Editor not found at: ${resolvedPath}`);
      }
      this.vscodePath = resolvedPath;
      log(`✅ Editor: ${path.basename(resolvedPath)}`);
      return;
    }

    log('🔍 Finding compatible editor...');
    
    // Try PATH first
    const commands = process.platform === 'win32' 
      ? ['where code', 'where code-insiders', 'where codium']
      : ['which code', 'which code-insiders', 'which codium'];
    
    for (const cmd of commands) {
      const pathResult = await this.tryCommand(cmd);
      if (pathResult) {
        this.vscodePath = pathResult;
        log(`✅ ${path.basename(pathResult)}`);
        return;
      }
    }

    // Fallback paths
    const paths = this.getFallbackPaths();
    for (const p of paths) {
      if (p && fs.existsSync(p)) {
        this.vscodePath = p;
        log(`✅ ${path.basename(p)}`);
        return;
      }
    }
    
    throw new Error('No compatible editor found. Please specify path with --vscode-path');
  }

  async tryCommand(cmd) {
    return new Promise(resolve => {
      exec(cmd, { timeout: 2000 }, (error, stdout) => {
        if (!error && stdout.trim()) {
          const execPath = stdout.trim().split('\n')[0];
          const resolved = this.resolveExecutable(execPath);
          resolve(fs.existsSync(resolved) ? resolved : null);
          return;
        }
        resolve(null);
      });
    });
  }

  getFallbackPaths() {
    const env = process.env;
    
    if (process.platform === 'win32') {
      return [
        'C:\\Program Files\\Microsoft VS Code\\Code.exe',
        'C:\\Program Files\\Microsoft VS Code Insiders\\Code - Insiders.exe',
        path.join(env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'Code.exe'),
        path.join(env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code Insiders', 'Code - Insiders.exe'),
        'C:\\Program Files\\VSCodium\\VSCodium.exe'
      ];
    }
    
    if (process.platform === 'darwin') {
      return [
        '/Applications/Visual Studio Code.app/Contents/MacOS/Electron',
        '/Applications/Visual Studio Code - Insiders.app/Contents/MacOS/Electron',
        '/Applications/VSCodium.app/Contents/MacOS/Electron'
      ];
    }
    
    return [
      '/usr/bin/code', '/usr/local/bin/code',
      '/usr/bin/code-insiders', '/usr/local/bin/code-insiders',
      '/usr/bin/codium', '/usr/local/bin/codium'
    ];
  }

  resolveExecutable(execPath) {
    if (process.platform === 'win32' && execPath.includes('\\bin\\code')) {
      const codeExe = execPath.replace(/\\bin\\code$/, '\\Code.exe');
      return fs.existsSync(codeExe) ? codeExe : execPath;
    }
    return execPath;
  }
}

module.exports = { VSCodeManager }; 