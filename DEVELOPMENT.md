# Development Scripts
scripts/
  build-wasm.sh
  test-all.sh
  deploy-local.sh

# Quick Commands Reference

## Local Development
```bash
# Start dev server
npm run dev

# Run all tests
make test

# Build everything
make build
```

## Testing
```bash
# Frontend tests
make test-frontend

# Rust tests  
make test-rust

# All tests with coverage
npm run test:coverage
```

## Building
```bash
# Build WASM only
make build-wasm

# Build frontend only
make build-frontend

# Build everything
make build
```

## Deployment
```bash
# Check deployment readiness
make deploy-check

# Manual deployment trigger
git push origin main
```

## Troubleshooting

### WASM build fails
- Check Rust is installed: `rustc --version`
- Install wasm-pack: `cargo install wasm-pack`
- Add WASM target: `rustup target add wasm32-unknown-unknown`

### Tests fail
- Clear cache: `npm run clean`
- Reinstall: `make install`
- Check node version: `node --version` (should be 18+ or 20+)
