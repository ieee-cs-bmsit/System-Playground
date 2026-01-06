# Build script for Windows

Write-Host "🦀 Building Rust simulation engine..." -ForegroundColor Cyan

# Check if wasm-pack is installed
if (!(Get-Command wasm-pack -ErrorAction SilentlyContinue)) {
    Write-Host "❌ wasm-pack not found. Installing..." -ForegroundColor Red
    cargo install wasm-pack
}

# Build for web target
wasm-pack build --target web --release

Write-Host "✅ Build complete! Output in pkg/" -ForegroundColor Green
Write-Host "📦 Files generated:" -ForegroundColor Yellow
Get-ChildItem pkg/ | Format-Table Name, Length

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Import in TypeScript: import init, { CPU } from './simulation-engine/pkg/simulation_engine.js'"
Write-Host "2. await init() to initialize WASM"
Write-Host "3. Create CPU: const cpu = new CPU()"
