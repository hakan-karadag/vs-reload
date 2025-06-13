<div align="center">
  <img src="logo.png" alt="vs-reload Logo" width="200" height="200">
  
# vs-reload

  🚀 **VS Code extension development tool** with automatic hot reload

  [![NPM Version](https://img.shields.io/npm/v/vs-reload.svg)](https://www.npmjs.com/package/vs-reload)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Platform Support](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://github.com/hakan-karadag/vs-reload)
  [![VS Code](https://img.shields.io/badge/VS%20Code-Extension%20Dev-007ACC.svg)](https://code.visualstudio.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14.0.0-green.svg)](https://nodejs.org/)
  [![Téléchargements](https://img.shields.io/npm/dt/vs-reload.svg?refresh=1)](https://www.npmjs.com/package/vs-reload)

  > **English Version (Current)** • [🇫🇷 **Version Française**](README.fr.md)

---

Compatible only with VS Code and forks that strictly respect the native architecture

## ✨ Features

- **🎯 VS Code native**: Optimized for VS Code and 100% compatible forks
- **🚀 Auto-launch**: Automatically launches VS Code with extension loaded
- **⚡ Ultra-fast reload**: Smart file change detection with temporary synchronization
- **📁 Flexible paths**: Use `--project-path` and `--vscode-path` for ultimate flexibility
- **🖥️ Cross-platform**: Native support for Windows, macOS, and Linux
- **🔧 Zero config**: Works out of the box in any VS Code extension directory

## 📦 Installation

```bash
npm install -g vs-reload
```

## 🚀 Quick Start

### Basic Usage (VS Code Auto-detection)
Navigate to your VS Code extension directory and run:

```bash
vs-reload
```
*Works automatically when you're in an extension directory with `package.json`*

### Custom Path Usage

**Specify VS Code path (when VS Code is not in PATH):**
```bash
vs-reload --vscode-path="/path/to/Code.exe"
```

**Specify extension path (when working from outside the extension directory):**
```bash
vs-reload --project-path="/path/to/extension"
```

**Both paths (complete custom setup):**
```bash
vs-reload --project-path="/remote/extension" --vscode-path="/custom/vscode"
```

**Work on any extension from anywhere:**
```bash
vs-reload --project-path="/path/to/my-extension"
```

## 💻 Usage

### Command Line Options

```bash
vs-reload [options]

Options:
  --project-path="/path/to/extension"   Use extension from specified path
  --vscode-path="/path/to/vscode"       Use specific VS Code executable
```

### Example Output
```bash
🚀 vs-reload - VS Code Extension Development Tool

[10:30:15] 🎯 Project path: /dev/my-extension
[10:30:15] 🎯 VS Code path: /Applications/Visual Studio Code.app/Contents/MacOS/Electron
[10:30:15] ✅ Extension detected: My Awesome Extension
[10:30:15] ✅ Code.exe
[10:30:16] 🚀 Launching...
[10:30:17] ✅ Launched (12345)
[10:30:18] 🔧 My Awesome Extension loaded
[10:30:18] 👀 Watching...

✅ Development mode active!
ℹ️ Press Ctrl+C to stop

[10:31:23] 📝 extension.js
[10:31:23] 🔄 Synced: extension.js
[10:31:23] 🔄 Reloaded
```

## 🎯 Compatibility

vs-reload is specifically designed for **VS Code** and works with:

| Editor | Compatibility | Status |
|--------|---------------|---------|
| **VS Code** | ✅ Full support | **Recommended** |
| **VS Code Insiders** | ✅ Full support | **Tested** |
| **Portable VS Code** | ✅ Full support | **Compatible** |
| **Third-party forks** | ⚠️ Depends on compatibility | **Not guaranteed** |

### ⚠️ Strict Compatibility Requirements

For an editor to work with vs-reload, it **MUST**:
- **Support** `--extensionDevelopmentPath` argument natively
- **Implement** `workbench.action.reloadWindow` API command
- **Respect** VS Code architecture for extension development
- **Maintain** compatibility with VS Code extension lifecycle

### 🚫 Incompatible Forks

Many VS Code-based editors do **NOT** fully support extension development and will cause malfunctions or crashes.

## 🔧 How It Works

vs-reload uses a sophisticated temporary injection system with JSON-based reload signals:

### Smart Reload System
- **JSON signal file**: Uses `reload.json` with metadata (timestamp, reason, tool info)
- **Intelligent watching**: Extension helper monitors for `reload.json` creation
- **Reliable reload**: Uses VS Code's native `workbench.action.reloadWindow` command
- **Cross-platform**: No fragile keyboard automation (Ctrl+R, SendKeys, xdotool)
- **Detailed logging**: Shows reload reason and timestamp in VS Code console

### Temporary Injection System
- **Temporary copy**: Creates a complete extension copy in `/tmp/`
- **Clean injection**: Reload code injected only in temporary copy
- **Automatic synchronization**: Real-time file updates from source to temp
- **No pollution**: Original source files are never touched

### Smart VS Code Detection
- **Auto-detection**: Finds VS Code in PATH and common installation directories
- **Custom paths**: Use `--vscode-path` to specify a VS Code installation
- **Strict validation**: Verifies compatibility before launch

### Flexible Project Handling  
- **Auto-detection**: Works in current directory by default
- **Custom paths**: Use `--project-path` to specify extension location
- **Remote development**: Perfect for Docker, WSL, or remote filesystems

## ⚙️ Configuration

vs-reload works with sensible defaults. Configuration can be modified in the source code:

```javascript
const CONFIG = {
  debounceMs: 150,          // File change debounce time
  launchDelay: 300,         // VS Code stabilization time
  watchPatterns: [          // Monitored file patterns
    '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.json'
  ],
  ignorePatterns: [         // Ignored directories
    '**/node_modules/**', '**/.git/**', '**/out/**', '**/reload.json'
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

| Platform | Auto-Detection | Custom Paths | Status |
|----------|---------------|--------------|---------|
| **Windows 10/11** | ✅ PATH + Registry + Program Files | ✅ Full support | **Fully Tested** |
| **macOS** | ✅ PATH + Applications folder | ✅ Full support | **Compatible** |  
| **Linux** | ✅ PATH + package managers | ✅ Full support | **Compatible** |

## 🛠️ Troubleshooting

### Common Issues

**vs-reload can't find VS Code**
```bash
# Use custom VS Code path
vs-reload --vscode-path="/path/to/Code.exe"

# Or ensure VS Code is in PATH
code --version
```

**Extension not in current directory**
```bash
# Specify extension path
vs-reload --project-path="/path/to/extension"
```

**Editor closes immediately**
```bash
# This indicates an editor incompatible with VS Code extension development
# Use official VS Code:
vs-reload --vscode-path="/path/to/official/Code.exe"
```

## 📊 Performance

- **🚀 Launch time**: ~300ms
- **⚡ Reload speed**: ~150ms  
- **💾 Memory usage**: <30MB
- **📁 File watching**: Native OS events
- **🔄 CPU impact**: Minimal (<1%)
- **🎯 JSON signal**: Ultra-reliable, cross-platform reload system

## 🤝 Contributing

Contributions are welcome! vs-reload has a clean, modular architecture:

```
src/
├── cli.js              # Main entry point & argument parsing
├── utils.js            # Configuration & shared utilities  
├── extension-detector.js # Extension validation with custom paths
├── vscode-manager.js   # VS Code discovery & path resolution
├── extension-manager.js # Process lifecycle & temporary injection
├── file-watcher.js     # Smart file monitoring with sync
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
  
**⭐ If VS-Reload helped you develop extensions faster, consider starring the repo!**

Built with ❤️ by [@hakan-karadag](https://github.com/hakan-karadag)

[⭐ Star](https://github.com/hakan-karadag/vs-reload) • [🐛 Report Bug](https://github.com/hakan-karadag/vs-reload/issues) • [💡 Request Feature](https://github.com/hakan-karadag/vs-reload/issues) • [📚 Documentation](https://github.com/hakan-karadag/vs-reload#readme)

</div>