# Contributing to Visual System Builder

First off, thank you for considering contributing to Visual System Builder! 🎉

It's people like you that make this project a great learning tool for operating systems concepts.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible using our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

**Great bug reports include:**
- A clear, descriptive title
- Exact steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots or recordings (if applicable)
- Your environment details (OS, app version, etc.)

### Suggesting Features

Feature suggestions are tracked as GitHub issues. Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:
- A clear use case
- Detailed description of the proposed feature
- Any alternative solutions considered
- Mockups or examples (if applicable)

### Contributing Code

1. **Find or create an issue** - Make sure there's an issue for what you're working on
2. **Fork the repository**
3. **Create a branch** - Use a descriptive name like `feature/add-scheduling-algorithm` or `fix/memory-leak`
4. **Make your changes** - Follow our coding standards
5. **Test thoroughly** - Add tests for new features
6. **Submit a pull request** - Use our PR template

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18.x or 20.x
- **Rust** 1.70+ with `cargo` and `wasm-pack`
- **Git**

For Android builds:
- **Android Studio**
- **Android SDK** (API 33+)
- **Android NDK** 25.2+

### Setup Steps

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/visual-system-builder.git
cd visual-system-builder

# 2. Install frontend dependencies
npm install

# 3. Build the Rust/WASM simulation engine
cd simulation-engine
cargo build
wasm-pack build --target web
cd ..

# 4. Run development server
npm run dev

# 5. Run tests
npm test
cd simulation-engine && cargo test && cd ..
```

### Building Tauri Desktop App

```bash
# Install Tauri CLI
npm install

# Initialize Tauri (first time only)
npm run tauri init

# Run Tauri in development
npm run tauri dev

# Build for production
npm run tauri build
```

### Building Android App

```bash
# Add Android platform
npm run tauri android init

# Run on emulator/device
npm run tauri android dev

# Build release APK
npm run tauri android build
```

## 📁 Project Structure

```
visual-system-builder/
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   │   ├── CanvasArea.jsx     # Main canvas for visual building
│   │   ├── Sidebar.jsx        # Component palette
│   │   └── ...
│   ├── modules/               # OS module implementations
│   │   ├── MemoryModule.jsx   # Memory management
│   │   ├── ProcessModule.jsx  # Process scheduling
│   │   └── ...
│   ├── levels/                # Educational scenarios
│   ├── simulation/            # Simulation orchestration
│   ├── store/                 # Zustand state management
│   └── App.jsx               # Main application
│
├── simulation-engine/         # Rust/WASM backend
│   ├── src/
│   │   ├── memory/           # Memory simulation
│   │   ├── process/          # Process simulation
│   │   ├── scheduler/        # Scheduling algorithms
│   │   └── lib.rs            # WASM bindings
│   └── Cargo.toml
│
├── src-tauri/                # Tauri app (auto-generated)
│   ├── src/main.rs
│   └── tauri.conf.json
│
├── tests/                    # Test files
│   ├── components/           # Component tests
│   └── e2e/                  # End-to-end tests
│
└── .github/                  # CI/CD and templates
    └── workflows/
```

## 💅 Coding Standards

### JavaScript/React

- Use **ES6+** features
- Use **functional components** with hooks
- Follow **React best practices**
- Use **meaningful variable names**
- Keep components **small and focused**
- Use **PropTypes** or TypeScript for type checking

```jsx
// ✅ Good
const ProcessNode = ({ id, data, onUpdate }) => {
  const [state, setState] = useState(data.initialState);
  
  useEffect(() => {
    onUpdate(id, state);
  }, [state]);
  
  return <div className="process-node">{/* ... */}</div>;
};

// ❌ Bad  
function pn(i,d,u){let s=d.is;return <div>{/* ... */}</div>;}
```

### Rust

- Follow **Rust API Guidelines**
- Use `cargo fmt` for formatting
- Address all `cargo clippy` warnings
- Add **documentation comments** for public APIs
- Write **unit tests** for all functionality

```rust
// ✅ Good
/// Allocates a page in memory and returns its frame number.
///
/// # Arguments
/// * `size` - The size of the page to allocate
///
/// # Returns
/// The frame number if successful, None if out of memory
pub fn allocate_page(&mut self, size: usize) -> Option<usize> {
    // Implementation
}

// ❌ Bad
pub fn ap(&mut self, s: usize) -> Option<usize> {
    // No docs, unclear names
}
```

### CSS/Tailwind

- Use **Tailwind utility classes** when possible
- Keep custom CSS minimal
- Use **responsive design** principles
- Follow **mobile-first** approach

## 🧪 Testing Guidelines

### Frontend Tests (Jest)

```bash
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

Test files should be co-located with components:
```
components/
├── ProcessNode.jsx
└── ProcessNode.test.jsx
```

### Rust Tests

```bash
cd simulation-engine
cargo test              # Run all tests
cargo test --release   # Optimized tests
wasm-pack test --headless --firefox  # WASM tests
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

### Testing Checklist

- [ ] Write tests for new features
- [ ] Update tests for modified features
- [ ] Ensure all tests pass locally
- [ ] Achieve >80% code coverage for new code
- [ ] Test on multiple platforms (if applicable)

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### Examples

```bash
feat(memory): add paging visualization

Implement visual representation of page tables and frames.
Includes animation for page faults.

Closes #123
```

```bash
fix(scheduler): correct round-robin time quantum calculation

The quantum was being calculated incorrectly for edge cases
where the process list was empty.

Fixes #456
```

## 🚀 Pull Request Process

1. **Update documentation** - Update README.md if needed
2. **Add tests** - Ensure adequate test coverage
3. **Run linters** - Fix all linting errors
4. **Update changelog** - Add entry to CHANGELOG.md
5. **Fill PR template** - Provide complete information
6. **Request review** - Tag relevant maintainers
7. **Address feedback** - Make requested changes
8. **Squash commits** - Clean up commit history if requested

### PR Checklist

Before submitting, ensure:

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added and passing
- [ ] Works on desktop and mobile (if applicable)

## 🏆 Recognition

Contributors are recognized in:
- GitHub contributors page
- CHANGELOG.md for significant contributions
- README.md acknowledgments section

## ❓ Questions?

- 💬 [GitHub Discussions](https://github.com/ieee-cs-bmsit/visual-system-builder/discussions)
- 📧 Contact the maintainers

Thank you for contributing! 🎉
