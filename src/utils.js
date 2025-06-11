const CONFIG = {
  debounceMs: 200,
  launchDelay: 400,
  watchPatterns: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.json'],
  ignorePatterns: ['**/node_modules/**', '**/.git/**', '**/out/**']
};

const log = msg => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = { CONFIG, log, sleep }; 