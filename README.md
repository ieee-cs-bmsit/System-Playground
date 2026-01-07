# Visual System Builder

[![CI](https://github.com/ieee-cs-bmsit/visual-system-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/ieee-cs-bmsit/visual-system-builder/actions/workflows/ci.yml)
[![Release](https://github.com/ieee-cs-bmsit/visual-system-builder/actions/workflows/release.yml/badge.svg)](https://github.com/ieee-cs-bmsit/visual-system-builder/actions/workflows/release.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> An interactive visual system builder for learning operating system concepts through hands-on simulation and experimentation.

## ✨ Features

- 🎨 **Visual Node-Based Interface** - Build complex system architectures with an intuitive drag-and-drop interface
- ⚡ **High-Performance Simulation Engine** - Rust/WebAssembly powered simulation for real-time execution
- 📱 **Cross-Platform** - Available as desktop app (Windows, macOS, Linux) and Android mobile app
- 🎓 **Educational Levels** - Structured learning path from basics to advanced OS concepts
- 🔍 **Real-Time Visualization** - See how processes, memory, and scheduling work in real-time
- 💾 **Memory Management** - Visualize paging, segmentation, and virtual memory
- 🔄 **Process Scheduling** - Experiment with different scheduling algorithms
- 🔐 **Deadlock Detection** - Understand and resolve deadlock scenarios
- 📊 **Performance Metrics** - Track and analyze system performance

## 📥 Installation

### Desktop Application

Download the latest release for your platform:

- **Windows**: [Download .exe or .msi](https://github.com/ieee-cs-bmsit/visual-system-builder/releases/latest)
- **macOS**: [Download .dmg](https://github.com/ieee-cs-bmsit/visual-system-builder/releases/latest)
- **Linux**: [Download .AppImage or .deb](https://github.com/ieee-cs-bmsit/visual-system-builder/releases/latest)

### Android App

[Download APK](https://github.com/ieee-cs-bmsit/visual-system-builder/releases/latest) and install on your Android device.

### Build from Source

```bash
# Clone the repository
git clone https://github.com/ieee-cs-bmsit/visual-system-builder.git
cd visual-system-builder

# Install dependencies
npm install

# Build the simulation engine (Rust/WASM)
cd simulation-engine
wasm-pack build --target web --release
cd ..

# Run in development mode
npm run dev

# Build for production
npm run build

# Build desktop app
npm run tauri build

# Build Android app (requires Android Studio)
npm run tauri android build
```

## 🚀 Quick Start

1. **Launch the application** - Open the desktop app or Android app
2. **Choose a level** - Select from beginner to advanced scenarios
3. **Build your system** - Drag and drop components to create your OS architecture
4. **Run simulation** - Click "Start" to see your system in action
5. **Analyze results** - Review performance metrics and behavior

## 🏗️ Architecture

```
visual-system-builder/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── modules/           # OS module simulation logic
│   ├── levels/            # Educational scenarios
│   └── simulation/        # Simulation state management
├── simulation-engine/     # Rust/WASM backend
│   ├── src/
│   │   ├── memory/        # Memory management
│   │   ├── process/       # Process scheduling
│   │   └── lib.rs         # WASM bindings
│   └── Cargo.toml
├── src-tauri/             # Tauri desktop/mobile app
│   ├── src/main.rs        # Tauri main process
│   └── tauri.conf.json    # App configuration
└── .github/workflows/     # CI/CD pipelines
```

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, ReactFlow, Zustand
- **Simulation Engine**: Rust, WebAssembly (wasm-pack)
- **Desktop/Mobile**: Tauri
- **Styling**: Tailwind CSS
- **Testing**: Jest, Playwright, Cargo Test
- **CI/CD**: GitHub Actions

## 📚 Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Development Setup

```bash
# Install dependencies
npm install
cd simulation-engine && cargo build && cd ..

# Run tests
npm test                    # Frontend tests
cd simulation-engine && cargo test && cd ..  # Rust tests

# Run linters
npm run lint
cd simulation-engine && cargo clippy && cd ..
```

## 📊 Project Status

This project is actively maintained by the IEEE Computer Society, BMSIT&M Chapter.

- ✅ Desktop applications for Windows, macOS, Linux
- ✅ Android mobile app
- ✅ Comprehensive testing suite
- ✅ Automated CI/CD pipeline
- 🚧 iOS app (planned)
- 🚧 Web-based version (planned)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by the Visual System Builder Team
- IEEE Computer Society, BMSIT&M Chapter
- All our amazing [contributors](https://github.com/ieee-cs-bmsit/visual-system-builder/graphs/contributors)

## 📞 Support

- 🐛 [Report a Bug](https://github.com/ieee-cs-bmsit/visual-system-builder/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/ieee-cs-bmsit/visual-system-builder/issues/new?template=feature_request.md)
- 💬 [Discussions](https://github.com/ieee-cs-bmsit/visual-system-builder/discussions)

---

<p align="center">Made with ❤️ for operating systems education</p>
