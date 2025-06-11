const fs = require('fs');
const { log } = require('./utils');

const detectExtension = () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.engines?.vscode) throw new Error('Not a VS Code extension');
  log(`📦 ${pkg.displayName || pkg.name}`);
  return { 
    name: pkg.name, 
    displayName: pkg.displayName || pkg.name, 
    path: process.cwd() 
  };
};

module.exports = { detectExtension }; 