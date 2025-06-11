const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { log } = require('./utils');

class VSCodeManager {
  async findVSCode() {
    log('🔍 Finding VS Code...');
    
    // Try PATH first
    const pathResult = await new Promise(resolve => {
      const cmd = process.platform === 'win32' ? 'where code' : 'which code';
      exec(cmd, { timeout: 2000 }, (error, stdout) => {
        if (!error && stdout.trim()) {
          const execPath = stdout.trim().split('\n')[0];
          const lower = execPath.toLowerCase();
          if (!lower.includes('cursor') && !lower.includes('codium')) {
            resolve(this.resolveExecutable(execPath));
            return;
          }
        }
        resolve(null);
      });
    });
    
    if (pathResult && fs.existsSync(pathResult)) {
      this.vscodePath = pathResult;
      log(`✅ ${path.basename(pathResult)}`);
      return;
    }

    // Fallback paths
    const paths = process.platform === 'win32' ? [
      'C:\\Program Files\\Microsoft VS Code\\Code.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'Code.exe')
    ] : process.platform === 'darwin' ? [
      '/Applications/Visual Studio Code.app/Contents/MacOS/Electron'
    ] : ['/usr/bin/code', '/usr/local/bin/code'];

    for (const p of paths) {
      if (p && fs.existsSync(p)) {
        this.vscodePath = p;
        log(`✅ ${path.basename(p)}`);
        return;
      }
    }
    
    throw new Error('VS Code not found');
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