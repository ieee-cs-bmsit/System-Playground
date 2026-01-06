/**
 * Rust WASM CPU Emulator Integration
 * TypeScript wrapper for the Rust RISC-V CPU
 */

import init, { CPU } from '../../simulation-engine/pkg/simulation_engine.js';

export class RustCPUEmulator {
    private cpu: CPU | null = null;
    private initialized = false;

    /**
     * Initialize the WASM module
     * Must be called before using the CPU
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            await init();
            this.cpu = new CPU();
            this.initialized = true;
            console.log('🦀 Rust CPU Emulator initialized!');
        } catch (error) {
            console.error('Failed to initialize Rust CPU:', error);
            throw error;
        }
    }

    /**
     * Execute a single RISC-V instruction
     * @param instruction - 32-bit encoded instruction
     * @returns Number of cycles taken
     */
    execute(instruction: number): number {
        if (!this.cpu) throw new Error('CPU not initialized. Call initialize() first.');
        return this.cpu.execute(instruction);
    }

    /**
     * Get value of a specific register
     * @param index - Register number (0-31)
     */
    getRegister(index: number): bigint {
        if (!this.cpu) throw new Error('CPU not initialized');
        return this.cpu.get_register(index);
    }

    /**
     * Set value of a specific register
     * @param index - Register number (1-31, x0 is always 0)
     * @param value - Value to set
     */
    setRegister(index: number, value: bigint): void {
        if (!this.cpu) throw new Error('CPU not initialized');
        this.cpu.set_register(index, value);
    }

    /**
     * Get all register values
     */
    getAllRegisters(): BigUint64Array {
        if (!this.cpu) throw new Error('CPU not initialized');
        return this.cpu.get_all_registers();
    }

    /**
     * Get current program counter
     */
    getPC(): bigint {
        if (!this.cpu) throw new Error('CPU not initialized');
        return this.cpu.pc;
    }

    /**
     * Set program counter
     */
    setPC(pc: bigint): void {
        if (!this.cpu) throw new Error('CPU not initialized');
        this.cpu.set_pc(pc);
    }

    /**
     * Get total cycle count
     */
    getCycleCount(): bigint {
        if (!this.cpu) throw new Error('CPU not initialized');
        return this.cpu.cycle_count;
    }

    /**
     * Reset CPU to initial state
     */
    reset(): void {
        if (!this.cpu) throw new Error('CPU not initialized');
        this.cpu.reset();
    }

    /**
     * Execute a simple program (array of instructions)
     * @param instructions - Array of 32-bit encoded instructions
     * @returns Total cycles taken
     */
    runProgram(instructions: number[]): number {
        if (!this.cpu) throw new Error('CPU not initialized');

        let totalCycles = 0;
        for (const instruction of instructions) {
            totalCycles += this.execute(instruction);
        }

        return totalCycles;
    }
}

// Helper functions for encoding RISC-V instructions

/**
 * Encode R-type instruction (ADD, SUB, XOR, OR, AND)
 */
export function encodeRType(
    opcode: number,
    rd: number,
    funct3: number,
    rs1: number,
    rs2: number,
    funct7: number
): number {
    return (
        (funct7 << 25) |
        (rs2 << 20) |
        (rs1 << 15) |
        (funct3 << 12) |
        (rd << 7) |
        opcode
    );
}

/**
 * Encode I-type instruction (ADDI, XORI, ORI, ANDI)
 */
export function encodeIType(
    opcode: number,
    rd: number,
    funct3: number,
    rs1: number,
    imm: number
): number {
    return (
        (imm << 20) |
        (rs1 << 15) |
        (funct3 << 12) |
        (rd << 7) |
        opcode
    );
}

// Pre-defined instruction encoders

export const Instructions = {
    /** ADD rd, rs1, rs2 */
    ADD: (rd: number, rs1: number, rs2: number) =>
        encodeRType(0x33, rd, 0x0, rs1, rs2, 0x00),

    /** SUB rd, rs1, rs2 */
    SUB: (rd: number, rs1: number, rs2: number) =>
        encodeRType(0x33, rd, 0x0, rs1, rs2, 0x20),

    /** XOR rd, rs1, rs2 */
    XOR: (rd: number, rs1: number, rs2: number) =>
        encodeRType(0x33, rd, 0x4, rs1, rs2, 0x00),

    /** OR rd, rs1, rs2 */
    OR: (rd: number, rs1: number, rs2: number) =>
        encodeRType(0x33, rd, 0x6, rs1, rs2, 0x00),

    /** AND rd, rs1, rs2 */
    AND: (rd: number, rs1: number, rs2: number) =>
        encodeRType(0x33, rd, 0x7, rs1, rs2, 0x00),

    /** ADDI rd, rs1, imm */
    ADDI: (rd: number, rs1: number, imm: number) =>
        encodeIType(0x13, rd, 0x0, rs1, imm),

    /** XORI rd, rs1, imm */
    XORI: (rd: number, rs1: number, imm: number) =>
        encodeIType(0x13, rd, 0x4, rs1, imm),

    /** ORI rd, rs1, imm */
    ORI: (rd: number, rs1: number, imm: number) =>
        encodeIType(0x13, rd, 0x6, rs1, imm),

    /** ANDI rd, rs1, imm */
    ANDI: (rd: number, rs1: number, imm: number) =>
        encodeIType(0x13, rd, 0x7, rs1, imm),
};

export default RustCPUEmulator;
