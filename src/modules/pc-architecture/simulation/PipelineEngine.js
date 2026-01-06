/**
 * CPU Pipeline Visualization
 * 5-stage pipeline: FETCH → DECODE → EXECUTE → MEMORY → WRITEBACK
 */

export class PipelineStage {
    constructor(name) {
        this.name = name;
        this.instruction = null;
        this.stalled = false;
        this.bubble = false;
    }

    clear() {
        this.instruction = null;
        this.stalled = false;
        this.bubble = false;
    }

    insertBubble() {
        this.bubble = true;
        this.instruction = null;
    }
}

export class CPUPipeline {
    constructor() {
        this.stages = {
            IF: new PipelineStage('FETCH'),
            ID: new PipelineStage('DECODE'),
            EX: new PipelineStage('EXECUTE'),
            MEM: new PipelineStage('MEMORY'),
            WB: new PipelineStage('WRITEBACK')
        };

        this.instructionQueue = [];
        this.completedInstructions = [];

        // Statistics
        this.cyclesExecuted = 0;
        this.instructionsCompleted = 0;
        this.stallCycles = 0;
        this.bubbles = 0;

        // Hazard detection
        this.dataHazards = [];
        this.controlHazards = [];
    }

    tick() {
        this.cyclesExecuted++;

        // Move instructions through pipeline (reverse order to avoid conflicts)

        // WRITEBACK → Complete
        if (this.stages.WB.instruction && !this.stages.WB.bubble) {
            this.completedInstructions.push(this.stages.WB.instruction);
            this.instructionsCompleted++;
        }
        this.stages.WB.clear();

        // MEMORY → WRITEBACK
        if (this.stages.MEM.instruction && !this.stages.MEM.stalled) {
            this.stages.WB.instruction = this.stages.MEM.instruction;
            this.stages.WB.bubble = this.stages.MEM.bubble;
            this.stages.MEM.clear();
        }

        // EXECUTE → MEMORY
        if (this.stages.EX.instruction && !this.stages.EX.stalled) {
            this.stages.MEM.instruction = this.stages.EX.instruction;
            this.stages.MEM.bubble = this.stages.EX.bubble;
            this.stages.EX.clear();
        }

        // DECODE → EXECUTE
        if (this.stages.ID.instruction && !this.stages.ID.stalled) {
            // Check for data hazards
            const hazard = this.detectDataHazard(this.stages.ID.instruction);

            if (hazard) {
                // Stall pipeline
                this.stages.ID.stalled = true;
                this.stages.IF.stalled = true;
                this.stallCycles++;
                this.dataHazards.push(hazard);
            } else {
                this.stages.EX.instruction = this.stages.ID.instruction;
                this.stages.EX.bubble = this.stages.ID.bubble;
                this.stages.ID.clear();
            }
        }

        // FETCH → DECODE
        if (this.stages.IF.instruction && !this.stages.IF.stalled) {
            // Check for control hazards (branches)
            if (this.stages.IF.instruction.type === 'BRANCH') {
                // Insert bubbles
                this.stages.ID.insertBubble();
                this.bubbles++;
                this.controlHazards.push({ instruction: this.stages.IF.instruction, cycle: this.cyclesExecuted });
            } else {
                this.stages.ID.instruction = this.stages.IF.instruction;
                this.stages.ID.bubble = this.stages.IF.bubble;
            }
            this.stages.IF.clear();
        }

        // Fetch new instruction
        if (this.instructionQueue.length > 0 && !this.stages.IF.stalled) {
            this.stages.IF.instruction = this.instructionQueue.shift();
        }

        // Clear stalls after one cycle
        Object.values(this.stages).forEach(stage => stage.stalled = false);
    }

    detectDataHazard(instruction) {
        // RAW (Read After Write) hazard detection
        if (instruction.type === 'ADD' || instruction.type === 'SUB') {
            // Check if source registers are being written in EX or MEM stage
            const exInst = this.stages.EX.instruction;
            const memInst = this.stages.MEM.instruction;

            if (exInst && exInst.dest === instruction.src1) {
                return { type: 'RAW', instruction: instruction.id, conflictsWith: exInst.id };
            }

            if (exInst && exInst.dest === instruction.src2) {
                return { type: 'RAW', instruction: instruction.id, conflictsWith: exInst.id };
            }

            if (memInst && memInst.dest === instruction.src1) {
                return { type: 'RAW', instruction: instruction.id, conflictsWith: memInst.id };
            }

            if (memInst && memInst.dest === instruction.src2) {
                return { type: 'RAW', instruction: instruction.id, conflictsWith: memInst.id };
            }
        }

        return null;
    }

    addInstruction(instruction) {
        this.instructionQueue.push({
            id: `I${this.instructionQueue.length + 1}`,
            ...instruction
        });
    }

    getCPI() {
        return this.instructionsCompleted > 0
            ? this.cyclesExecuted / this.instructionsCompleted
            : 0;
    }

    getIPC() {
        return this.cyclesExecuted > 0
            ? this.instructionsCompleted / this.cyclesExecuted
            : 0;
    }

    getPipelineEfficiency() {
        const idealCycles = this.instructionsCompleted; // Ideal = 1 CPI
        return this.cyclesExecuted > 0
            ? (idealCycles / this.cyclesExecuted) * 100
            : 0;
    }

    getStallRate() {
        return this.cyclesExecuted > 0
            ? (this.stallCycles / this.cyclesExecuted) * 100
            : 0;
    }

    getSnapshot() {
        return {
            IF: this.stages.IF.instruction ? { ...this.stages.IF.instruction, stalled: this.stages.IF.stalled, bubble: this.stages.IF.bubble } : null,
            ID: this.stages.ID.instruction ? { ...this.stages.ID.instruction, stalled: this.stages.ID.stalled, bubble: this.stages.ID.bubble } : null,
            EX: this.stages.EX.instruction ? { ...this.stages.EX.instruction, stalled: this.stages.EX.stalled, bubble: this.stages.EX.bubble } : null,
            MEM: this.stages.MEM.instruction ? { ...this.stages.MEM.instruction, stalled: this.stages.MEM.stalled, bubble: this.stages.MEM.bubble } : null,
            WB: this.stages.WB.instruction ? { ...this.stages.WB.instruction, stalled: this.stages.WB.stalled, bubble: this.stages.WB.bubble } : null
        };
    }
}
