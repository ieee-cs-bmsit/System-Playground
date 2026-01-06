import { create } from 'zustand';
import { CPU, MemoryModule, Instruction } from '../simulation/ArchitectureEngine';
import { CacheHierarchy } from '../simulation/CacheEngine';
import { CPUPipeline } from '../simulation/PipelineEngine';

const useArchitectureStore = create((set, get) => ({
    // Time
    currentCycle: 0,
    isRunning: false,
    clockSpeed: 1.0, // GHz (for display)

    // Components
    cpus: [],
    memory: null,
    storage: null,
    buses: [],

    // Instructions
    instructionQueue: [],

    // Metrics
    metrics: {
        ipc: 0,                  // Instructions Per Cycle
        totalInstructions: 0,
        completedInstructions: 0,
        memoryAccesses: 0,
        memoryBandwidth: 0,      // GB/s
        cacheHitRate: 0,         // %
        powerConsumption: 0,     // Watts
        temperature: 25,         // °C
        totalCost: 0             // $
    },

    // Actions
    addCPU: (cpu) => set(state => ({
        cpus: [...state.cpus, cpu]
    })),

    setMemory: (memory) => set({ memory }),

    setStorage: (storage) => set({ storage }),

    addBus: (bus) => set(state => ({
        buses: [...state.buses, bus]
    })),

    // Simulation control
    play: () => set({ isRunning: true }),
    pause: () => set({ isRunning: false }),

    reset: () => set({
        currentCycle: 0,
        isRunning: false,
        instructionQueue: [],
        metrics: {
            ipc: 0,
            totalInstructions: 0,
            completedInstructions: 0,
            memoryAccesses: 0,
            memoryBandwidth: 0,
            cacheHitRate: 0,
            powerConsumption: 0,
            temperature: 25,
            totalCost: 0
        }
    }),

    // Simulation tick
    tick: () => set(state => {
        if (!state.isRunning) return state;

        const newCycle = state.currentCycle + 1;

        // Execute CPU cycles
        state.cpus.forEach(cpu => {
            cpu.tick();
        });

        // Update metrics
        const completedThisCycle = state.cpus.reduce((sum, cpu) =>
            sum + (cpu.instructionsCompleted || 0), 0
        );

        const newMetrics = {
            ...state.metrics,
            completedInstructions: state.metrics.completedInstructions + completedThisCycle,
            ipc: newCycle > 0 ? state.metrics.completedInstructions / newCycle : 0
        };

        return {
            currentCycle: newCycle,
            metrics: newMetrics
        };
    }),

    // Update component from node
    updateFromNode: (nodeId, nodeType, data) => {
        if (nodeType === 'cpu') {
            const cpu = new CPU(nodeId, data.clockSpeed || 3.0);
            get().addCPU(cpu);
        } else if (nodeType === 'ram') {
            const memory = new MemoryModule(data.size || 8192, 'RAM');
            set({ memory });
        } else if (nodeType === 'storage') {
            const storage = new MemoryModule(data.size || 512000, 'SSD');
            set({ storage });
        }
    }
}));

export default useArchitectureStore;
