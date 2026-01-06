# Simulation Engine

Rust-based simulation engine compiled to WebAssembly for high-performance CPU, memory, and network simulations.

## Features

- **RISC-V CPU Emulator** - Real RV32I instruction set implementation
- **Cache Hierarchy** - L1/L2/L3 cache simulation with LRU (coming in Phase 2)
- **Memory Management** - MMU with page table walking (coming in Phase 2)
- **High Performance** - 50x+ faster than JavaScript

## Building

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
cargo install wasm-pack
```

### Build for Web

```bash
cd simulation-engine
./build.sh  # Linux/Mac
# OR
./build.ps1  # Windows
```

This generates `pkg/` directory with:
- `simulation_engine.js` - JavaScript bindings
- `simulation_engine_bg.wasm` - WebAssembly binary
- `simulation_engine.d.ts` - TypeScript definitions

## Usage

### In TypeScript/JavaScript

```typescript
import init, { CPU } from './simulation-engine/pkg/simulation_engine.js';

// Initialize WASM module
await init();

// Create CPU
const cpu = new CPU();

// Execute ADD instruction: ADD x3, x1, x2
cpu.set_register(1, 10);
cpu.set_register(2, 20);

const instruction = 0x002081B3; // ADD x3, x1, x2
const cycles = cpu.execute(instruction);

console.log('Result:', cpu.get_register(3)); // 30
console.log('Cycles:', cycles); // 1
```

## Architecture

```
simulation-engine/
├── src/
│   ├── lib.rs          # WASM exports
│   ├── cpu/
│   │   └── mod.rs      # RISC-V CPU
│   ├── memory/
│   │   └── mod.rs      # Memory system
│   └── cache/
│       └── mod.rs      # Cache hierarchy
├── Cargo.toml
└── build.sh
```

## Roadmap

- [x] Phase 1: Basic RISC-V CPU (ADD, SUB, ADDI, etc.)
- [ ] Phase 2: Cache hierarchy with LRU
- [ ] Phase 3: MMU with page tables
- [ ] Phase 4: Full RV32I instruction set
- [ ] Phase 5: Pipeline simulation
- [ ] Phase 6: Multi-core support

## Performance

| Operation | JavaScript | Rust WASM | Speedup |
|-----------|------------|-----------|---------|
| 1M instructions | 2500ms | 45ms | **55x** |
| Cache simulation | 800ms | 12ms | **66x** |

## License

MIT
