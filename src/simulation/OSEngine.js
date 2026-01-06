/**
 * Logic for the OS Simulation
 */

export class Process {
    constructor(id, burstTime = 10, priority = 1, arrivalTime = 0) {
        this.id = id;
        this.state = 'READY'; // READY, RUNNING, BLOCKED, TERMINATED
        this.totalBurstTime = burstTime;
        this.remainingTime = burstTime;
        this.priority = priority;
        this.arrivalTime = arrivalTime;
        this.completionTime = 0;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
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

    // Returns the process to run (if any) and handles preemption
    schedule(cpu) {
        if (this.readyQueue.length === 0 && cpu.isIdle()) return null;

        // ROUND ROBIN LOGIC
        if (this.algorithm === 'RR') {

            // 1. Handling Preemption (Time Slice Expiry)
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

            // 2. Assigning new process if CPU is idle
            if (cpu.isIdle() && this.readyQueue.length > 0) {
                const nextProc = this.readyQueue.shift();
                nextProc.state = 'RUNNING';
                cpu.currentProcess = nextProc;
                this.quantumTimer = 0;
            }
        }

        // FCFS (First Come First Serve)
        else if (this.algorithm === 'FCFS') {
            if (cpu.isIdle() && this.readyQueue.length > 0) {
                const nextProc = this.readyQueue.shift();
                nextProc.state = 'RUNNING';
                cpu.currentProcess = nextProc;
            }
        }

        return cpu.currentProcess;
    }
}
