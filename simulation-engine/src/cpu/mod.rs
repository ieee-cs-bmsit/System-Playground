use wasm_bindgen::prelude::*;
// use serde::{Serialize, Deserialize};

/// RISC-V CPU Emulator
/// Implements RV32I base instruction set
#[wasm_bindgen]
#[derive(Clone)]
pub struct CPU {
    /// 32 general-purpose registers (x0-x31)
    /// x0 is always 0, x1 is return address, x2 is stack pointer
    registers: [u64; 32],

    /// Program counter
    pc: u64,

    /// Cycle counter for performance tracking
    cycle_count: u64,
}

#[wasm_bindgen]
impl CPU {
    /// Create a new CPU instance
    #[wasm_bindgen(constructor)]
    pub fn new() -> CPU {
        web_sys::console::log_1(&"Creating new RISC-V CPU".into());

        let mut cpu = CPU {
            registers: [0; 32],
            pc: 0x1000, // Start at 0x1000
            cycle_count: 0,
        };

        // x2 (sp) starts at top of stack
        cpu.registers[2] = 0x7FFFFFF0;

        cpu
    }

    /// Get current program counter
    #[wasm_bindgen(getter)]
    pub fn pc(&self) -> u64 {
        self.pc
    }

    /// Set program counter
    #[wasm_bindgen(setter)]
    pub fn set_pc(&mut self, pc: u64) {
        self.pc = pc;
    }

    /// Get register value
    #[wasm_bindgen]
    pub fn get_register(&self, index: usize) -> u64 {
        if index < 32 {
            self.registers[index]
        } else {
            0
        }
    }

    /// Set register value (except x0 which is always 0)
    #[wasm_bindgen]
    pub fn set_register(&mut self, index: usize, value: u64) {
        if index > 0 && index < 32 {
            self.registers[index] = value;
        }
    }

    /// Get all registers as array
    #[wasm_bindgen]
    pub fn get_all_registers(&self) -> Vec<u64> {
        self.registers.to_vec()
    }

    /// Get cycle count
    #[wasm_bindgen(getter)]
    pub fn cycle_count(&self) -> u64 {
        self.cycle_count
    }

    /// Execute a single instruction
    /// Returns the number of cycles taken
    #[wasm_bindgen]
    pub fn execute(&mut self, instruction: u32) -> u32 {
        let opcode = instruction & 0x7F;
        let rd = ((instruction >> 7) & 0x1F) as usize;
        let funct3 = (instruction >> 12) & 0x7;
        let rs1 = ((instruction >> 15) & 0x1F) as usize;
        let rs2 = ((instruction >> 20) & 0x1F) as usize;
        let funct7 = (instruction >> 25) & 0x7F;

        let cycles = match opcode {
            // R-type instructions (ADD, SUB, AND, OR, XOR, etc.)
            0x33 => {
                match (funct3, funct7) {
                    (0x0, 0x00) => {
                        // ADD rd, rs1, rs2
                        if rd != 0 {
                            self.registers[rd] =
                                self.registers[rs1].wrapping_add(self.registers[rs2]);
                        }
                    }
                    (0x0, 0x20) => {
                        // SUB rd, rs1, rs2
                        if rd != 0 {
                            self.registers[rd] =
                                self.registers[rs1].wrapping_sub(self.registers[rs2]);
                        }
                    }
                    (0x4, 0x00) => {
                        // XOR rd, rs1, rs2
                        if rd != 0 {
                            self.registers[rd] = self.registers[rs1] ^ self.registers[rs2];
                        }
                    }
                    (0x6, 0x00) => {
                        // OR rd, rs1, rs2
                        if rd != 0 {
                            self.registers[rd] = self.registers[rs1] | self.registers[rs2];
                        }
                    }
                    (0x7, 0x00) => {
                        // AND rd, rs1, rs2
                        if rd != 0 {
                            self.registers[rd] = self.registers[rs1] & self.registers[rs2];
                        }
                    }
                    _ => {
                        web_sys::console::warn_1(
                            &format!(
                                "Unknown R-type instruction: funct3={:x}, funct7={:x}",
                                funct3, funct7
                            )
                            .into(),
                        );
                    }
                }
                self.pc += 4;
                1 // 1 cycle for ALU operations
            }

            // I-type instructions (ADDI, XORI, ORI, ANDI, etc.)
            0x13 => {
                let imm = ((instruction as i32) >> 20) as i64 as u64;

                match funct3 {
                    0x0 => {
                        // ADDI rd, rs1, imm
                        if rd != 0 {
                            self.registers[rd] = self.registers[rs1].wrapping_add(imm);
                        }
                    }
                    0x4 => {
                        // XORI rd, rs1, imm
                        if rd != 0 {
                            self.registers[rd] = self.registers[rs1] ^ imm;
                        }
                    }
                    0x6 => {
                        // ORI rd, rs1, imm
                        if rd != 0 {
                            self.registers[rd] = self.registers[rs1] | imm;
                        }
                    }
                    0x7 => {
                        // ANDI rd, rs1, imm
                        if rd != 0 {
                            self.registers[rd] = self.registers[rs1] & imm;
                        }
                    }
                    _ => {
                        web_sys::console::warn_1(
                            &format!("Unknown I-type instruction: funct3={:x}", funct3).into(),
                        );
                    }
                }
                self.pc += 4;
                1 // 1 cycle for immediate operations
            }

            _ => {
                web_sys::console::error_1(&format!("Unknown opcode: {:x}", opcode).into());
                self.pc += 4;
                1
            }
        };

        self.cycle_count += cycles as u64;
        cycles
    }

    /// Reset CPU to initial state
    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.registers = [0; 32];
        self.registers[2] = 0x7FFFFFF0; // Reset stack pointer
        self.pc = 0x1000;
        self.cycle_count = 0;
        web_sys::console::log_1(&"CPU reset".into());
    }
}

impl Default for CPU {
    fn default() -> Self {
        Self::new()
    }
}
