# Visual System Builder - Makefile
# Comprehensive build and test automation

.PHONY: help install build test lint clean dev deploy

# Default target
help:
	@echo "Visual System Builder - Available Commands:"
	@echo ""
	@echo "  make install       - Install all dependencies (npm + cargo)"
	@echo "  make build         - Build frontend and WASM"
	@echo "  make build-wasm    - Build only WASM module"
	@echo "  make build-frontend - Build only frontend"
	@echo "  make test          - Run all tests"
	@echo "  make test-frontend - Run frontend tests"
	@echo "  make test-rust     - Run Rust tests"
	@echo "  make lint          - Run all linters"
	@echo "  make lint-fix      - Fix linting issues"
	@echo "  make dev           - Start development server"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make deploy-check  - Verify deployment readiness"
	@echo ""

# Install dependencies
install:
	@echo "Installing npm dependencies..."
	npm ci
	@echo "Installing Rust toolchain..."
	rustup target add wasm32-unknown-unknown
	@echo "Installing wasm-pack..."
	cargo install wasm-pack
	@echo "All dependencies installed!"

# Build targets
build: build-wasm build-frontend
	@echo "Build complete!"

build-wasm:
	@echo "Building WASM module..."
	cd simulation-engine && wasm-pack build --target web --release
	@echo "WASM build complete!"

build-frontend:
	@echo "Building frontend..."
	npm run build
	@echo "Frontend build complete!"

# Test targets
test: test-frontend test-rust
	@echo "All tests passed!"

test-frontend:
	@echo "Running frontend tests..."
	npm run test

test-frontend-coverage:
	@echo "Running frontend tests with coverage..."
	npm run test:coverage

test-rust:
	@echo "Running Rust tests..."
	cd simulation-engine && cargo test --verbose

test-rust-wasm:
	@echo "Running WASM tests..."
	cd simulation-engine && wasm-pack test --headless --firefox

# Lint targets
lint: lint-frontend lint-rust
	@echo "Linting complete!"

lint-frontend:
	@echo "Linting frontend..."
	npm run lint

lint-rust:
	@echo "Linting Rust code..."
	cd simulation-engine && cargo clippy -- -D warnings
	cd simulation-engine && cargo fmt -- --check

lint-fix:
	@echo "Fixing linting issues..."
	cd simulation-engine && cargo fmt
	@echo "Lint fixes applied!"

# Development
dev:
	@echo "Starting development server..."
	npm run dev

# Clean
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf simulation-engine/pkg/
	rm -rf simulation-engine/target/
	rm -rf node_modules/.vite/
	@echo "Clean complete!"

# Deployment verification
deploy-check: lint test build
	@echo "Deployment readiness check complete!"
	@echo "All checks passed - ready to deploy!"

# CI/CD helpers
ci-test:
	@echo "Running CI tests..."
	npm run lint
	npm run test:coverage
	cd simulation-engine && cargo test --verbose
	cd simulation-engine && cargo clippy -- -D warnings

ci-build:
	@echo "Running CI build..."
	cd simulation-engine && wasm-pack build --target web --release
	npm ci
	npm run build
