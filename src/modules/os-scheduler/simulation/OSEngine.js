/**
 * Logic for the OS Simulation
 */

export class Process {
    constructor(id, burstTime = 10, priority = 5, arrivalTime = 0) {
        this.id = id;
        this.state = 'READY'; // READY, RUNNING, BLOCKED, TERMINATED
        this.totalBurstTime = burstTime;
        this.remainingTime = burstTime;
        this.priority = priority; // 1 (highest) to 10 (lowest)
        this.arrivalTime = arrivalTime;
        this.completionTime = 0;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
        this.color = this.getRandomColor();
        this.resourcesHeld = []; // Resources currently held
        this.resourcesWaiting = []; // Resources waiting for
    }

    getRandomColor() {
        // Defined Pop Art Colors - vary by priority
        const highPriority = ['#FF6B6B', '#FF44CC']; // Red/Pink for high priority
        const medPriority = ['#4ECDC4', '#45B7D1']; // Cyan/Blue for medium
        const lowPriority = ['#96CEB4', '#FFEEAD']; // Green/Yellow for low

        const colors = this.priority <= 3 ? highPriority :
            this.priority <= 7 ? medPriority : lowPriority;

        return colors[Math.floor(Math.random() * colors.length)];
    }
}

export class CPU {
    constructor(id) {
        this.id = id;
        this.currentProcess = null;
    }

    isIdle() {
        return this.currentProcess === null;
    }

    assignProcess(process, time) {
        this.currentProcess = process;
        process.state = 'RUNNING';
    }

    tick() {
        if (this.currentProcess) {
            this.currentProcess.remainingTime--;
            if (this.currentProcess.remainingTime <= 0) {
                const finished = this.currentProcess;
                finished.state = 'TERMINATED';
                this.currentProcess = null;
                return { type: 'PROCESS_FINISHED', process: finished };
            }
        }
        return null;
    }
}

export class Scheduler {
    constructor(algorithm = 'RR', quantum = 3) {
        this.readyQueue = [];
        this.algorithm = algorithm;
        this.quantum = quantum;
        this.quantumTimer = 0;
    }

    addProcess(process) {
        process.state = 'READY';
        this.readyQueue.push(process);
    }

    schedule(cpu) {
        if (this.readyQueue.length === 0 && cpu.isIdle()) return null;

        // Sort queue based on algorithm
        if (this.algorithm === 'Priority') {
            this.readyQueue.sort((a, b) => a.priority - b.priority);
        } else if (this.algorithm === 'SJF') {
            this.readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);
        }

        // ROUND ROBIN LOGIC
        if (this.algorithm === 'RR') {
            // Handling Preemption (Time Slice Expiry)
            if (!cpu.isIdle()) {
                this.quantumTimer++;
                if (this.quantumTimer >= this.quantum) {
                    // Time slice expired, move current back to queue
                    const preempted = cpu.currentProcess;
                    preempted.state = 'READY';
                    this.readyQueue.push(preempted);
                    cpu.currentProcess = null;
                    this.quantumTimer = 0;
                }
            }

            // Assigning new process if CPU is idle
            if (cpu.isIdle() && this.readyQueue.length > 0) {
                const nextProc = this.readyQueue.shift();
                nextProc.state = 'RUNNING';
                cpu.currentProcess = nextProc;
                this.quantumTimer = 0;
            }
        }

        // PRIORITY, FCFS, SJF - Non-preemptive
        else {
            if (cpu.isIdle() && this.readyQueue.length > 0) {
                const nextProc = this.readyQueue.shift();
                nextProc.state = 'RUNNING';
                cpu.currentProcess = nextProc;
            }
        }

        return cpu.currentProcess;
    }
}
