const fs = require('fs');
const path = require('path');
const { log } = require('./utils');

const detectExtension = (projectPath = null) => {
  const extensionPath = projectPath ? path.resolve(projectPath) : process.cwd();
  const packagePath = path.join(extensionPath, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    throw new Error(`package.json not found in: ${extensionPath}`);
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (!pkg.engines?.vscode) throw new Error('Not a VS Code extension');
  log(`📦 ${pkg.displayName || pkg.name}`);
  return { 
    name: pkg.name, 
    displayName: pkg.displayName || pkg.name, 
    path: extensionPath
  };
};

module.exports = { detectExtension }; 