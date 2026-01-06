/**
 * PC Architecture Simulation Engine
 * Core logic for simulating computer components
 */

export class Instruction {
    constructor(type, operands = {}) {
        this.type = type; // 'LOAD', 'STORE', 'ADD', 'SUB', 'JMP', 'HALT'
        this.operands = operands; // { dest, src1, src2, address }
        this.stage = 'FETCH'; // FETCH, DECODE, EXECUTE, MEMORY, WRITEBACK
        this.cyclesInStage = 0;
    }

    advance() {
        const stages = ['FETCH', 'DECODE', 'EXECUTE', 'MEMORY', 'WRITEBACK', 'COMPLETE'];
        const currentIndex = stages.indexOf(this.stage);

        if (currentIndex < stages.length - 1) {
            this.stage = stages[currentIndex + 1];
            this.cyclesInStage = 0;
        }

        return this.stage === 'COMPLETE';
    }
}

export class CPU {
    constructor(id, clockSpeed = 3.0, cores = 1) {
        this.id = id;
        this.clockSpeed = clockSpeed; // GHz
        this.cores = cores;

        // Registers
        this.registers = {
            PC: 0,      // Program Counter
            IR: null,   // Instruction Register
            ACC: 0,     // Accumulator
            MAR: 0,     // Memory Address Register
            MDR: 0,     // Memory Data Register
            R0: 0, R1: 0, R2: 0, R3: 0 // General purpose
        };

        // Pipeline
        this.pipeline = [];
        this.maxPipelineDepth = 5;

        // State
        this.state = 'IDLE'; // IDLE, RUNNING, STALLED
        this.currentInstruction = null;

        // Stats
        this.instructionsCompleted = 0;
        this.cyclesExecuted = 0;
        this.stallCycles = 0;
    }

    fetch(memory) {
        if (!memory) return null;

        const address = this.registers.PC;
        const result = memory.read(address);

        this.registers.IR = result.data;
        this.registers.PC++;

        return new Instruction(result.data.type, result.data.operands);
    }

    decode(instruction) {
        if (!instruction) return;

        // Decode operands and prepare for execution
        instruction.stage = 'DECODE';
    }

    execute(instruction, memory) {
        if (!instruction) return;

        switch (instruction.type) {
            case 'LOAD':
                // Load from memory to register
                if (memory) {
                    const result = memory.read(instruction.operands.address);
                    this.registers[instruction.operands.dest] = result.data;
                }
                break;

            case 'STORE':
                // Store from register to memory
                if (memory) {
                    memory.write(
                        instruction.operands.address,
                        this.registers[instruction.operands.src]
                    );
                }
                break;

            case 'ADD':
                this.registers[instruction.operands.dest] =
                    this.registers[instruction.operands.src1] +
                    this.registers[instruction.operands.src2];
                break;

            case 'SUB':
                this.registers[instruction.operands.dest] =
                    this.registers[instruction.operands.src1] -
                    this.registers[instruction.operands.src2];
                break;

            case 'JMP':
                this.registers.PC = instruction.operands.address;
                break;

            case 'HALT':
                this.state = 'IDLE';
                break;
        }

        instruction.stage = 'EXECUTE';
    }

    tick() {
        this.cyclesExecuted++;

        // Simple pipeline: advance current instruction
        if (this.currentInstruction) {
            this.currentInstruction.cyclesInStage++;

            // After 1 cycle per stage, advance
            if (this.currentInstruction.cyclesInStage >= 1) {
                const completed = this.currentInstruction.advance();

                if (completed) {
                    this.instructionsCompleted++;
                    this.currentInstruction = null;
                }
            }
        }
    }

    getIPC() {
        return this.cyclesExecuted > 0
            ? this.instructionsCompleted / this.cyclesExecuted
            : 0;
    }
}

export class MemoryModule {
    constructor(size, type = 'RAM') {
        this.size = size; // in MB
        this.type = type; // RAM, ROM, CACHE
        this.data = new Map(); // Sparse array

        // Access characteristics
        this.accessTime = type === 'RAM' ? 10 :
            type === 'CACHE' ? 1 :
                100; // nanoseconds

        // Stats
        this.reads = 0;
        this.writes = 0;
    }

    read(address) {
        this.reads++;

        const data = this.data.has(address)
            ? this.data.get(address)
            : { type: 'NOP', operands: {} };

        return {
            data,
            latency: this.accessTime
        };
    }

    write(address, value) {
        this.writes++;
        this.data.set(address, value);

        return {
            latency: this.accessTime
        };
    }

    load(address, instructions) {
        // Load program into memory
        instructions.forEach((inst, offset) => {
            this.data.set(address + offset, inst);
        });
    }

    getBandwidth() {
        // Simplified: accesses * data size / time
        const totalAccesses = this.reads + this.writes;
        return totalAccesses * 64 / 1000; // MB/s (assuming 64-byte cache lines)
    }
}

export class SystemBus {
    constructor(id, width = 64, speed = 100) {
        this.id = id;
        this.width = width; // bits
        this.speed = speed; // MHz

        this.transactions = 0;
        this.bandwidth = 0;
    }

    transfer(data) {
        this.transactions++;

        // Calculate transfer time based on data size and bus width
        const bytes = data.length || 8;
        const cycles = Math.ceil((bytes * 8) / this.width);

        return {
            cycles,
            latency: cycles * (1000 / this.speed) // nanoseconds
        };
    }

    getBandwidth() {
        // Bus bandwidth in GB/s
        return (this.width / 8) * this.speed / 1000;
    }
}
