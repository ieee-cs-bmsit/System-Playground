import { create } from 'zustand';
import { Process, CPU, Scheduler } from '../simulation/OSEngine';

/**
 * Global Simulation Store
 * Handles the "Game Loop", Time, and System Metrics.
 */
const useSimulationStore = create((set, get) => ({
    // Time & Playback
    isPlaying: false,
    speed: 1000,
    currentTime: 0,

    // Simulation Objects (The "Physical" System)
    cpus: [],
    scheduler: new Scheduler('RR', 3),
    processes: [],
    generators: [],
    history: [],

    // Controls
    togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),
    setSpeed: (speed) => set({ speed }),
    step: () => get().tick(), // Step forward one tick

    // Configuration
    updateQuantum: (q) => set(state => {
        state.scheduler.quantum = q;
        return { scheduler: state.scheduler };
    }),

    reset: () => set({
        currentTime: 0,
        isPlaying: false,
        cpus: [],
        scheduler: new Scheduler('RR', 3),
        processes: [],
        generators: [],
        history: [],
        metrics: { cpuUtilization: 0, throughput: 0, completedProcesses: 0 }
    }),

    // Sync from React Flow (Logic Initialization)
    // When a user drops a node, we register it here logically
    registerNode: (type, id, data) => {
        set(state => {
            if (type === 'cpu') {
                return { cpus: [...state.cpus, new CPU(id)] };
            }
            if (type === 'scheduler') {
                return { scheduler: state.scheduler };
            }
            if (type === 'generator') {
                return { generators: [...state.generators, { id, lastSpawn: 0 }] };
            }
            if (type === 'process') {
                // Processes usually spawned dynamically, but drag-dropped ones count too
                const newProc = new Process(id, 15); // Default burst 15
                state.scheduler.addProcess(newProc);
                return { processes: [...state.processes, newProc] };
            }
            return {};
        })
    },

    // System Metrics
    metrics: {
        cpuUtilization: 0,
        throughput: 0,
        completedProcesses: 0,
        avgWaitTime: 0,
        avgTurnaroundTime: 0
    },

    // The "Tick" function
    tick: () => {
        const { currentTime, cpus, scheduler, processes, generators } = get();
        const nextTime = currentTime + 1;

        // 0. Generator Logic
        // Every 5 ticks, spawn a new process if a generator exists
        generators.forEach(gen => {
            if ((nextTime - gen.lastSpawn) > 5) {
                const pid = `P${Math.floor(Math.random() * 1000)}`;
                const newProc = new Process(pid, Math.floor(Math.random() * 10) + 5);
                scheduler.addProcess(newProc);
                gen.lastSpawn = nextTime;
            }
        });

        // 1. Scheduler Logic: Assign processes to CPUs
        cpus.forEach(cpu => {
            scheduler.schedule(cpu);
            cpu.tick();
        });


        // 2. Metrics Calculation
        const activeCpus = cpus.filter(c => !c.isIdle());
        const utilization = cpus.length > 0 ? (activeCpus.length / cpus.length) * 100 : 0;

        // Record History
        const newHistoryLogs = activeCpus.map(cpu => ({
            time: currentTime,
            cpuId: cpu.id,
            processId: cpu.currentProcess.id,
            color: cpu.currentProcess.color
        }));

        set(state => ({
            currentTime: nextTime,
            history: [...state.history, ...newHistoryLogs].slice(-100),
            metrics: {
                ...state.metrics,
                cpuUtilization: Math.round(utilization)
            }
        }));
    }
}));

export default useSimulationStore;
