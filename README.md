<div align="center">
  <img src="logo.png" alt="vs-reload Logo" width="200" height="200">
  
  # vs-reload

  [![NPM Version](https://img.shields.io/npm/v/vs-reload.svg)](https://www.npmjs.com/package/vs-reload)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Platform Support](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://github.com/hakan-karadag/vs-reload)
  [![VS Code](https://img.shields.io/badge/VS%20Code-Extension%20Dev-007ACC.svg)](https://code.visualstudio.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14.0.0-green.svg)](https://nodejs.org/)
  [![Downloads](https://img.shields.io/npm/dt/vs-reload.svg)](https://www.npmjs.com/package/vs-reload)

  🇺🇸 **English Version (Current)** • [🇫🇷 **Version Française**](README.fr.md)

  🚀 **Ultra-fast VS Code extension development tool** with automatic hot reload

  > Created by [@hakan-karadag](https://github.com/hakan-karadag)
</div> for seamless VS Code extension development

## ✨ Features

- **🚀 Auto-launch**: Automatically launches VS Code with your extension loaded
- **⚡ Ultra-fast reload**: Smart file change detection with instant window refresh  
- **🛡️ Clean testing**: Optional isolation mode with `--disable-extensions`
- **🖥️ Cross-platform**: Native support for Windows, macOS, and Linux
- **📁 Zero config**: Works out of the box in any VS Code extension directory
- **🔧 Smart detection**: Automatically finds VS Code installation (even portable versions)

## 📦 Installation

```bash
npm install -g vs-reload
```

## 🚀 Quick Start

Navigate to your VS Code extension directory and run:

```bash
vs-reload
```

That's it! vs-reload will:

1. 📦 **Auto-detect** your VS Code extension
2. 🔍 **Locate** VS Code installation on your system  
3. 🚀 **Launch** VS Code with your extension in development mode
4. 👀 **Monitor** your files for changes
5. ⚡ **Reload** VS Code window automatically when you modify code

## 💻 Usage

### Basic Usage
```bash
vs-reload
```

### Options
```bash
vs-reload --disable-extensions   # Launch with clean extension environment
```

### Example Output
```bash
🚀 vs-reload - VS Code Extension Development Tool
Platform: Windows | Clean & Simple

[10:30:15] ✅ Extension detected: My Awesome Extension
[10:30:15] ℹ️ VS Code version required: ^1.60.0
[10:30:15] ℹ️ Extension path: C:\dev\my-extension
[10:30:16] 🔍 Searching for VS Code installation...
[10:30:16] ✅ Real VS Code found in PATH: C:\Program Files\Microsoft VS Code\Code.exe
[10:30:16] 🔥 Launching VS Code in extension development mode...
[10:30:17] ✅ VS Code launched (PID: 12345)
[10:30:18] ✅ Extension "My Awesome Extension" loaded successfully
[10:30:18] ✅ 🎉 vs-reload is active and ready!
[10:30:18] ✅ 📝 Modify your extension files → VS Code reloads automatically
[10:30:18] ℹ️ Extension file watching started
[10:30:18] ✅ Extension file watching active

[10:31:23] 🔥 File changed: extension.js
[10:31:23] ℹ️ 🔄 Reloading extension for: extension.js...
[10:31:24] ✅ Window reload successful!
```

## 🔧 How It Works

vs-reload uses a sophisticated multi-platform approach to provide seamless VS Code extension development:

### Smart VS Code Detection
- **PATH resolution**: Checks system PATH for VS Code executable
- **Fork filtering**: Automatically excludes Cursor, Windsurf, VSCodium, and other forks
- **Batch file resolution**: On Windows, resolves `code.cmd` to actual `Code.exe`
- **Fallback paths**: Searches common installation directories as backup

### Intelligent File Watching
- **Selective monitoring**: Watches only relevant extension files (JS, TS, JSON, etc.)
- **Debounced changes**: Prevents excessive reloads during rapid file modifications  
- **Cross-platform events**: Uses native file system events for optimal performance

### Native Window Reload
- **Windows**: VBScript automation for reliable window activation and reload
- **macOS**: AppleScript integration for seamless Cmd+R execution
- **Linux**: xdotool automation for window management and key simulation

## ⚙️ Configuration

vs-reload works with sensible defaults but can be customized by modifying the source:

```javascript
const CONFIG = {
  debounceMs: 500,          // File change debounce time
  monitorInterval: 3000,    // Process monitoring interval
  launchDelay: 1000,        // VS Code stabilization time
  
  watchPatterns: [          // Monitored file patterns
    '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx',
    '**/*.json', '**/*.vue', '**/*.svelte', '**/*.md',
    '**/*.css', '**/*.scss', '**/*.html'
  ],
  
  ignorePatterns: [         // Ignored directories
    '**/node_modules/**', '**/.git/**', '**/dist/**',
    '**/build/**', '**/out/**', '**/.vscode-test/**'
  ]
};
```

## 🧪 Testing

Test vs-reload with the included example extension:

```bash
git clone https://github.com/hakan-karadag/vs-reload.git
cd vs-reload
npm install
npm test
```

## 🌐 Platform Compatibility

| Platform | VS Code Detection | Window Reload | Status |
|----------|------------------|---------------|---------|
| **Windows 10/11** | ✅ PATH + Registry + Program Files | ✅ VBScript automation | **Fully Tested** |
| **macOS** | ✅ PATH + Applications folder | ✅ AppleScript | **Compatible** |  
| **Linux** | ✅ PATH + package managers | ✅ xdotool | **Compatible** |

### Supported VS Code Installations
- ✅ **Official VS Code** (Microsoft)
- ✅ **Portable VS Code** 
- ✅ **User/System installations**
- ❌ **Forks** (Cursor, Windsurf, VSCodium) - *Intentionally excluded for compatibility*

## 🛠️ Troubleshooting

### Common Issues

**vs-reload can't find VS Code**
```bash
# Ensure VS Code is in your PATH
code --version

# Or install VS Code from: https://code.visualstudio.com/
```

**Automatic reload not working**
```bash
# Try manual reload in VS Code
Ctrl+R (Windows/Linux) or Cmd+R (macOS)

# Or use Command Palette
Ctrl+Shift+P → "Reload Window"
```

**Permission errors on Linux**
```bash
# Install xdotool for window automation
sudo apt install xdotool  # Ubuntu/Debian
sudo dnf install xdotool  # Fedora
```

## 📊 Performance

- **🚀 Launch time**: ~1 second
- **⚡ Reload speed**: ~500ms  
- **💾 Memory usage**: <50MB
- **📁 File watching**: Native OS events
- **🔄 CPU impact**: Minimal (<1%)

## 🤝 Contributing

Contributions are welcome! vs-reload has a clean, modular architecture:

```
src/
├── cli.js              # Main entry point & orchestration
├── utils.js            # Configuration & shared utilities  
├── extension-detector.js # Extension validation & metadata
├── vscode-manager.js   # VS Code discovery & path resolution
├── extension-manager.js # Process lifecycle & reload automation
├── file-watcher.js     # Smart file monitoring
└── example/            # Test extension for development
```

### Development Setup
```bash
git clone https://github.com/hakan-karadag/vs-reload.git
cd vs-reload
npm install
npm link
```

## 📄 License

**MIT License** - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Built for the VS Code extension development community
- Inspired by the need for faster development workflows
- Tested with real-world VS Code extensions

---

<div align="center">
  
**⭐ Star this repo if vs-reload makes your VS Code extension development faster!**

Created with ❤️ by [@hakan-karadag](https://github.com/hakan-karadag)

[🐛 Report Bug](https://github.com/hakan-karadag/vs-reload/issues) • [✨ Request Feature](https://github.com/hakan-karadag/vs-reload/issues) • [📖 Documentation](https://github.com/hakan-karadag/vs-reload#readme)

</div>