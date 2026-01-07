import { create } from 'zustand';
import { Process, CPU, Scheduler } from '../simulation/OSEngine';
import { ResourceManager } from '../resources/ResourceManager';

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
    resourceManager: new ResourceManager(), // ADD: Resource manager for deadlock detection
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
            // ADD: Register MUTEX resources
            if (type === 'mutex') {
                state.resourceManager.registerResource(id, 'mutex', 1);
                console.log(`🔒 Registered MUTEX: ${id}`);
                return { resourceManager: state.resourceManager };
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
        totalTurnaroundTime: 0,
        deadlockCount: 0, // ADD: Deadlock counter
        deadlockDetected: false // ADD: Current deadlock status
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


        // 1.5 Resource Allocation Logic (NEW: for deadlock detection)
        const resourceManager = get().resourceManager;
        const allProcesses = [...scheduler.readyQueue, ...cpus.map(c => c.currentProcess).filter(Boolean)];

        // Handle resource requests from processes
        allProcesses.forEach(process => {
            // For demonstration: processes randomly request mutexes based on their ID
            // In a full implementation, this would come from process configuration
            if (process && process.resourcesHeld.length === 0 && process.resourcesWaiting.length === 0) {
                // Assign mutex requirements based on process ID pattern
                const mutexes = Array.from(resourceManager.resources.keys());
                if (mutexes.length >= 2) {
                    const isOddProcess = parseInt(process.id.replace(/\D/g, '')) % 2 === 0;
                    const [mutex1, mutex2] = isOddProcess ? [mutexes[0], mutexes[1]] : [mutexes[1], mutexes[0]];

                    // Try to acquire first mutex
                    const resource1 = resourceManager.getResource(mutex1);
                    const request1 = resource1.request(process, 1);

                    if (request1.success) {
                        process.holdResource(mutex1);
                    } else {
                        process.requestResource(mutex1);
                        process.state = 'BLOCKED';
                    }
                }
            }
            // If holding one resource, try to get the second
            else if (process && process.resourcesHeld.length === 1 && process.resourcesWaiting.length === 0) {
                const mutexes = Array.from(resourceManager.resources.keys());
                const heldMutex = process.resourcesHeld[0];
                const neededMutex = mutexes.find(m => m !== heldMutex);

                if (neededMutex) {
                    const resource2 = resourceManager.getResource(neededMutex);
                    const request2 = resource2.request(process, 1);

                    if (request2.success) {
                        process.holdResource(neededMutex);
                    } else {
                        process.requestResource(neededMutex);
                        process.state = 'BLOCKED'; // DEADLOCK HAPPENS HERE
                    }
                }
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

        // ADD: Check for deadlocks (reuse resourceManager from line 138)
        // FIX: Use allProcesses that includes processes holding/waiting for resources
        const deadlockDetected = resourceManager.detectDeadlock(allProcesses);
        const newDeadlockCount = deadlockDetected ? (metrics.deadlockCount || 0) + 1 : (metrics.deadlockCount || 0);

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
                totalTurnaroundTime: newTurnaroundTotal,
                deadlockCount: newDeadlockCount, // ADD: Update deadlock count
                deadlockDetected // ADD: Current status
            }
        }));
    }
}));

export default useSimulationStore;
