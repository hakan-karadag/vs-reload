const CONFIG = {
  debounceMs: 200,
  launchDelay: 400,
  watchPatterns: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.json'],
  ignorePatterns: ['**/node_modules/**', '**/.git/**', '**/out/**']
};

const log = msg => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Simplified argument parsing
const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = { projectPath: null, vscodePath: null };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--project-path=')) {
      options.projectPath = arg.split('=')[1];
    } else if (arg === '--project-path' && args[i + 1]) {
      options.projectPath = args[++i];
    } else if (arg.startsWith('--vscode-path=') || arg.startsWith('--editor-path=')) {
      options.vscodePath = arg.split('=')[1];
    } else if ((arg === '--vscode-path' || arg === '--editor-path') && args[i + 1]) {
      options.vscodePath = args[++i];
    }
  }

  return options;
};

module.exports = { CONFIG, log, sleep, parseArgs }; 