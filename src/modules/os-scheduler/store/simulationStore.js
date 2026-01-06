import { create } from 'zustand';
import { Process, CPU, Scheduler } from '../simulation/OSEngine';

/**
 * Global Simulation Store (OS Module)
 */
const useSimulationStore = create((set, get) => ({
    // Time & Playback
    isPlaying: false,
    speed: 1000,
    currentTime: 0,

    // Simulation Objects
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

    updateAlgorithm: (algo) => set(state => {
        state.scheduler.algorithm = algo;
        state.scheduler.quantumTimer = 0; // Reset timer when changing algorithm
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
        metrics: {
            cpuUtilization: 0,
            throughput: 0,
            completedProcesses: 0,
            avgWaitTime: 0,
            avgTurnaroundTime: 0,
            totalWaitTime: 0,
            totalTurnaroundTime: 0
        }
    }),

    // Sync from React Flow
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
                const newProc = new Process(id, 15);
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
        avgTurnaroundTime: 0,
        totalWaitTime: 0,
        totalTurnaroundTime: 0
    },

    // The "Tick" function
    tick: () => {
        const { currentTime, cpus, scheduler, processes, generators, metrics } = get();

        // Validation: Don't run if we don't have minimum components
        if (cpus.length === 0) {
            console.warn('Simulation requires at least one CPU to run');
            return;
        }

        const nextTime = currentTime + 1;

        // 0. Generator Logic
        generators.forEach(gen => {
            if ((nextTime - gen.lastSpawn) > 5) {
                const pid = `P${Math.floor(Math.random() * 1000)}`;
                const newProc = new Process(pid, Math.floor(Math.random() * 10) + 5, 1, nextTime);
                scheduler.addProcess(newProc);
                gen.lastSpawn = nextTime;
            }
        });

        // 1. Scheduler Logic
        let completedInThisTick = [];

        cpus.forEach(cpu => {
            scheduler.schedule(cpu);
            const event = cpu.tick(); // Tick returns event if process finishes

            if (event && event.type === 'PROCESS_FINISHED') {
                const finishedProc = event.process;
                finishedProc.completionTime = nextTime;
                finishedProc.turnaroundTime = finishedProc.completionTime - finishedProc.arrivalTime;
                finishedProc.waitingTime = finishedProc.turnaroundTime - finishedProc.totalBurstTime;
                completedInThisTick.push(finishedProc);
            }
        });


        // 2. Metrics Calculation
        const activeCpus = cpus.filter(c => !c.isIdle());
        const utilization = cpus.length > 0 ? (activeCpus.length / cpus.length) * 100 : 0;

        // Calculate new totals from completed processes this tick
        let newWaitTimeTotal = metrics.totalWaitTime;
        let newTurnaroundTotal = metrics.totalTurnaroundTime;

        completedInThisTick.forEach(proc => {
            newWaitTimeTotal += proc.waitingTime;
            newTurnaroundTotal += proc.turnaroundTime;
        });

        const newCompletedCount = metrics.completedProcesses + completedInThisTick.length;

        // BUG FIX: Calculate averages using ALL processes (completed + running), not just completed
        // This matches textbook formulas and prevents artificially low wait times
        const totalProcesses = scheduler.readyQueue.length + newCompletedCount + cpus.filter(c => !c.isIdle()).length;

        // Calculate averages (avoid division by zero)
        // OLD (WRONG): avgWait = totalWaitTime / completedProcesses
        // NEW (CORRECT): avgWait = totalWaitTime / totalProcesses
        const newAvgWait = totalProcesses > 0 ? Math.round(newWaitTimeTotal / totalProcesses) : 0;
        const newAvgTurnaround = totalProcesses > 0 ? Math.round(newTurnaroundTotal / totalProcesses) : 0;

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
                cpuUtilization: Math.round(utilization),
                throughput: newCompletedCount > 0 ? (newCompletedCount / nextTime).toFixed(2) : 0,
                completedProcesses: newCompletedCount,
                avgWaitTime: newAvgWait,
                avgTurnaroundTime: newAvgTurnaround,
                totalWaitTime: newWaitTimeTotal,
                totalTurnaroundTime: newTurnaroundTotal
            }
        }));
    }
}));

export default useSimulationStore;
