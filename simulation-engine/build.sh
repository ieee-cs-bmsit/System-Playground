#!/bin/bash

# Build script for compiling Rust to WebAssembly

echo "🦀 Building Rust simulation engine..."

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack not found. Installing..."
    cargo install wasm-pack
fi

# Build for web target
wasm-pack build --target web --release

echo "✅ Build complete! Output in pkg/"
echo "📦 Files generated:"
ls -lh pkg/

echo ""
echo "Next steps:"
echo "1. Import in TypeScript: import init, { CPU } from './simulation-engine/pkg/simulation_engine.js'"
echo "2. await init() to initialize WASM"
echo "3. Create CPU: const cpu = new CPU()"
