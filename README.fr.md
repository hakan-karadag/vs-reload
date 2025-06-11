<div align="center">
  <img src="logo.png" alt="vs-reload Logo" width="200" height="200">
  
  # vs-reload

  [![NPM Version](https://img.shields.io/npm/v/vs-reload.svg)](https://www.npmjs.com/package/vs-reload)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Support Plateforme](https://img.shields.io/badge/plateforme-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://github.com/hakan-karadag/vs-reload)
  [![VS Code](https://img.shields.io/badge/VS%20Code-Extension%20Dev-007ACC.svg)](https://code.visualstudio.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14.0.0-green.svg)](https://nodejs.org/)
  [![Téléchargements](https://img.shields.io/npm/dt/vs-reload.svg)](https://www.npmjs.com/package/vs-reload)

  🇫🇷 **Version Française (Current)** • [🇺🇸 **English Version**](README.md)

  🚀 **Outil de développement ultra-rapide pour extensions VS Code** avec rechargement automatique à chaud

  > Créé par [@hakan-karadag](https://github.com/hakan-karadag)
</div> pour un développement d'extensions VS Code sans friction

## ✨ Fonctionnalités

- **🚀 Lancement automatique** : Lance automatiquement VS Code avec votre extension chargée
- **⚡ Rechargement ultra-rapide** : Détection intelligente des changements de fichiers avec actualisation instantanée  
- **🛡️ Tests propres** : Mode isolation optionnel avec `--disable-extensions`
- **🖥️ Multi-plateforme** : Support natif pour Windows, macOS et Linux
- **📁 Zéro configuration** : Fonctionne immédiatement dans n'importe quel répertoire d'extension VS Code
- **🔧 Détection intelligente** : Trouve automatiquement l'installation VS Code (même les versions portables)

## 📦 Installation

```bash
npm install -g vs-reload
```

## 🚀 Démarrage rapide

Naviguez vers le répertoire de votre extension VS Code et exécutez :

```bash
vs-reload
```

C'est tout ! vs-reload va :

1. 📦 **Auto-détecter** votre extension VS Code
2. 🔍 **Localiser** l'installation VS Code sur votre système  
3. 🚀 **Lancer** VS Code avec votre extension en mode développement
4. 👀 **Surveiller** vos fichiers pour les changements
5. ⚡ **Recharger** la fenêtre VS Code automatiquement quand vous modifiez le code

## 💻 Utilisation

### Utilisation basique
```bash
vs-reload
```

### Options
```bash
vs-reload --disable-extensions   # Lance avec un environnement d'extensions propre
```

### Exemple de sortie
```bash
🚀 vs-reload - Outil de Développement d'Extensions VS Code
Plateforme : Windows | Propre & Simple

[10:30:15] ✅ Extension détectée : Mon Extension Géniale
[10:30:15] ℹ️ Version VS Code requise : ^1.60.0
[10:30:15] ℹ️ Chemin de l'extension : C:\dev\mon-extension
[10:30:16] 🔍 Recherche de l'installation VS Code...
[10:30:16] ✅ VS Code réel trouvé dans PATH : C:\Program Files\Microsoft VS Code\Code.exe
[10:30:16] 🔥 Lancement de VS Code en mode développement d'extension...
[10:30:17] ✅ VS Code lancé (PID : 12345)
[10:30:18] ✅ Extension "Mon Extension Géniale" chargée avec succès
[10:30:18] ✅ 🎉 vs-reload est actif et prêt !
[10:30:18] ✅ 📝 Modifiez vos fichiers d'extension → VS Code se recharge automatiquement
[10:30:18] ℹ️ Surveillance des fichiers d'extension démarrée
[10:30:18] ✅ Surveillance des fichiers d'extension active

[10:31:23] 🔥 Fichier modifié : extension.js
[10:31:23] ℹ️ 🔄 Rechargement de l'extension pour : extension.js...
[10:31:24] ✅ Rechargement de fenêtre réussi !
```

## 🔧 Comment ça fonctionne

vs-reload utilise une approche multi-plateforme sophistiquée pour fournir un développement d'extensions VS Code sans friction :

### Détection intelligente de VS Code
- **Résolution PATH** : Vérifie le PATH système pour l'exécutable VS Code
- **Filtrage des forks** : Exclut automatiquement Cursor, Windsurf, VSCodium et autres forks
- **Résolution des fichiers batch** : Sur Windows, résout `code.cmd` vers le vrai `Code.exe`
- **Chemins de secours** : Recherche dans les répertoires d'installation communs en sauvegarde

### Surveillance intelligente des fichiers
- **Surveillance sélective** : Surveille uniquement les fichiers d'extension pertinents (JS, TS, JSON, etc.)
- **Changements avec anti-rebond** : Empêche les rechargements excessifs pendant les modifications rapides de fichiers  
- **Événements multi-plateformes** : Utilise les événements natifs du système de fichiers pour une performance optimale

### Rechargement natif de fenêtre
- **Windows** : Automatisation VBScript pour activation et rechargement fiables de fenêtre
- **macOS** : Intégration AppleScript pour exécution transparente de Cmd+R
- **Linux** : Automatisation xdotool pour gestion de fenêtre et simulation de touches

## ⚙️ Configuration

vs-reload fonctionne avec des paramètres par défaut sensés mais peut être personnalisé en modifiant le source :

```javascript
const CONFIG = {
  debounceMs: 500,          // Temps d'anti-rebond pour changement de fichier
  monitorInterval: 3000,    // Intervalle de surveillance du processus
  launchDelay: 1000,        // Temps de stabilisation VS Code
  
  watchPatterns: [          // Motifs de fichiers surveillés
    '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx',
    '**/*.json', '**/*.vue', '**/*.svelte', '**/*.md',
    '**/*.css', '**/*.scss', '**/*.html'
  ],
  
  ignorePatterns: [         // Répertoires ignorés
    '**/node_modules/**', '**/.git/**', '**/dist/**',
    '**/build/**', '**/out/**', '**/.vscode-test/**'
  ]
};
```

## 🧪 Tests

Testez vs-reload avec l'extension d'exemple incluse :

```bash
git clone https://github.com/hakan-karadag/vs-reload.git
cd vs-reload
npm install
npm test
```

## 🌐 Compatibilité des plateformes

| Plateforme | Détection VS Code | Rechargement fenêtre | Statut |
|----------|------------------|---------------|---------|
| **Windows 10/11** | ✅ PATH + Registre + Program Files | ✅ Automatisation VBScript | **Entièrement testé** |
| **macOS** | ✅ PATH + Dossier Applications | ✅ AppleScript | **Compatible** |  
| **Linux** | ✅ PATH + gestionnaires de paquets | ✅ xdotool | **Compatible** |

### Installations VS Code supportées
- ✅ **VS Code officiel** (Microsoft)
- ✅ **VS Code portable** 
- ✅ **Installations utilisateur/système**
- ❌ **Forks** (Cursor, Windsurf, VSCodium) - *Intentionnellement exclus pour la compatibilité*

## 🛠️ Dépannage

### Problèmes courants

**vs-reload ne trouve pas VS Code**
```bash
# Assurez-vous que VS Code est dans votre PATH
code --version

# Ou installez VS Code depuis : https://code.visualstudio.com/
```

**Le rechargement automatique ne fonctionne pas**
```bash
# Essayez le rechargement manuel dans VS Code
Ctrl+R (Windows/Linux) ou Cmd+R (macOS)

# Ou utilisez la Palette de Commandes
Ctrl+Shift+P → "Reload Window"
```

**Erreurs de permissions sur Linux**
```bash
# Installez xdotool pour l'automatisation de fenêtre
sudo apt install xdotool  # Ubuntu/Debian
sudo dnf install xdotool  # Fedora
```

## 📊 Performance

- **🚀 Temps de lancement** : ~1 seconde
- **⚡ Vitesse de rechargement** : ~500ms  
- **💾 Utilisation mémoire** : <50MB
- **📁 Surveillance fichiers** : Événements OS natifs
- **🔄 Impact CPU** : Minimal (<1%)

## 🤝 Contribution

Les contributions sont les bienvenues ! vs-reload a une architecture propre et modulaire :

```
src/
├── cli.js              # Point d'entrée principal & orchestration
├── utils.js            # Configuration & utilitaires partagés  
├── extension-detector.js # Validation d'extension & métadonnées
├── vscode-manager.js   # Découverte VS Code & résolution de chemin
├── extension-manager.js # Cycle de vie processus & automatisation rechargement
├── file-watcher.js     # Surveillance intelligente de fichiers
└── example/            # Extension de test pour développement
```

### Configuration de développement
```bash
git clone https://github.com/hakan-karadag/vs-reload.git
cd vs-reload
npm install
npm link
```

## 📄 Licence

**Licence MIT** - voir [LICENSE](LICENSE) pour les détails

## 🙏 Remerciements

- Construit pour la communauté de développement d'extensions VS Code
- Inspiré par le besoin de workflows de développement plus rapides
- Testé avec des extensions VS Code du monde réel

---

<div align="center">
  
**⭐ Mettez une étoile à ce repo si vs-reload accélère votre développement d'extensions VS Code !**

Créé avec ❤️ par [@hakan-karadag](https://github.com/hakan-karadag)

[🐛 Signaler un Bug](https://github.com/hakan-karadag/vs-reload/issues) • [✨ Demander une Fonctionnalité](https://github.com/hakan-karadag/vs-reload/issues) • [📖 Documentation](https://github.com/hakan-karadag/vs-reload#readme)

</div>