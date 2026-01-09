use wasm_bindgen::prelude::*;

// RISC-V CPU module
pub mod cache;
pub mod cpu;
pub mod memory;

// Re-export main types
pub use cache::Cache;
pub use cpu::CPU;
pub use memory::Memory;

/// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn init() {
    // Set panic hook for better error messages in browser console
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();

    web_sys::console::log_1(&"🦀 Rust simulation engine initialized!".into());
}

/// Get version info
#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
