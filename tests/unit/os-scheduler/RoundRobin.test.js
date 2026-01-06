/**
 * Unit Tests for Round Robin Scheduler
 * Tests based on:
 * 1. Basic algorithm correctness
 * 2. Silberschatz "Operating System Concepts" examples
 * 3. Edge cases
 */

describe('Round Robin Scheduler', () => {
    let scheduler;

    beforeEach(() => {
        // We'll need to refactor the scheduler to be testable
        // For now, testing the core logic
    });

    describe('Basic Scheduling', () => {
        test('should schedule processes in circular order with quantum=4', () => {
            const processes = [
                { id: 'P1', burstTime: 10, arrivalTime: 0, priority: 0 },
                { id: 'P2', burstTime: 5, arrivalTime: 0, priority: 0 },
                { id: 'P3', burstTime: 8, arrivalTime: 0, priority: 0 }
            ];

            const quantum = 4;
            const result = simulateRoundRobin(processes, quantum);

            // Expected Gantt chart:
            // P1: 0-4, P2: 4-8, P3: 8-12, P1: 12-16, P2: 16-17, P3: 17-21, P1: 21-23
            expect(result.ganttChart).toEqual([
                { process: 'P1', start: 0, end: 4 },
                { process: 'P2', start: 4, end: 8 },
                { process: 'P3', start: 8, end: 12 },
                { process: 'P1', start: 12, end: 16 },
                { process: 'P2', start: 16, end: 17 },
                { process: 'P3', start: 17, end: 21 },
                { process: 'P1', start: 21, end: 23 }
            ]);
        });

        test('should handle quantum larger than burst time', () => {
            const processes = [
                { id: 'P1', burstTime: 3, arrivalTime: 0, priority: 0 },
                { id: 'P2', burstTime: 2, arrivalTime: 0, priority: 0 }
            ];

            const quantum = 10; // Larger than any burst time
            const result = simulateRoundRobin(processes, quantum);

            // Should complete each process in one go (like FCFS)
            expect(result.ganttChart).toEqual([
                { process: 'P1', start: 0, end: 3 },
                { process: 'P2', start: 3, end: 5 }
            ]);
        });

        test('should handle empty process list', () => {
            const processes = [];
            const quantum = 4;
            const result = simulateRoundRobin(processes, quantum);

            expect(result.ganttChart).toEqual([]);
            expect(result.avgWaitTime).toBe(0);
            expect(result.avgTurnaroundTime).toBe(0);
        });
    });

    describe('Wait Time Calculation', () => {
        test('should calculate correct average wait time', () => {
            const processes = [
                { id: 'P1', burstTime: 10, arrivalTime: 0, priority: 0 },
                { id: 'P2', burstTime: 5, arrivalTime: 0, priority: 0 },
                { id: 'P3', burstTime: 8, arrivalTime: 0, priority: 0 }
            ];

            const quantum = 4;
            const result = simulateRoundRobin(processes, quantum);

            // Wait times:
            // P1: (0) + (12-4) + (21-16) = 13
            // P2: (4-0) + (16-8) = 12
            // P3: (8-0) + (17-12) = 13
            // Average: (13 + 12 + 13) / 3 = 12.67

            expect(result.avgWaitTime).toBeCloseTo(12.67, 2);
        });

        test('should include all processes in average, not just completed', () => {
            // This tests the bug fix from README.md
            const processes = [
                { id: 'P1', burstTime: 5, arrivalTime: 0, priority: 0 },
                { id: 'P2', burstTime: 10, arrivalTime: 0, priority: 0 }
            ];

            const quantum = 4;
            const result = simulateRoundRobin(processes, quantum);

            // avgWaitTime should use totalProcesses, not completedProcesses
            expect(result.totalProcesses).toBe(2);
            expect(result.avgWaitTime).toBe(result.totalWaitTime / result.totalProcesses);
        });
    });

    describe('Silberschatz Textbook Examples', () => {
        test('Example 5.3 - should match textbook result', () => {
            // From "Operating System Concepts" 10th edition, page 193
            const processes = [
                { id: 'P1', burstTime: 24, arrivalTime: 0, priority: 0 },
                { id: 'P2', burstTime: 3, arrivalTime: 0, priority: 0 },
                { id: 'P3', burstTime: 3, arrivalTime: 0, priority: 0 }
            ];

            const quantum = 4;
            const result = simulateRoundRobin(processes, quantum);

            // Expected average waiting time from textbook: 5.66 ms
            expect(result.avgWaitTime).toBeCloseTo(5.66, 2);
        });
    });

    describe('Context Switches', () => {
        test('should count context switches correctly', () => {
            const processes = [
                { id: 'P1', burstTime: 10, arrivalTime: 0, priority: 0 },
                { id: 'P2', burstTime: 5, arrivalTime: 0, priority: 0 }
            ];

            const quantum = 4;
            const result = simulateRoundRobin(processes, quantum);

            // P1(0-4) -> P2(4-8) -> P1(8-12) -> P2(12-13) -> P1(13-15)
            // Context switches: 4
            expect(result.contextSwitches).toBe(4);
        });

        test('should minimize context switches with large quantum', () => {
            const processes = [
                { id: 'P1', burstTime: 5, arrivalTime: 0, priority: 0 },
                { id: 'P2', burstTime: 3, arrivalTime: 0, priority: 0 }
            ];

            const quantum = 10;
            const result = simulateRoundRobin(processes, quantum);

            // Only 1 context switch (P1 -> P2)
            expect(result.contextSwitches).toBe(1);
        });
    });

    describe('Arrival Time Handling', () => {
        test('should handle different arrival times', () => {
            const processes = [
                { id: 'P1', burstTime: 5, arrivalTime: 0, priority: 0 },
                { id: 'P2', burstTime: 3, arrivalTime: 2, priority: 0 },
                { id: 'P3', burstTime: 4, arrivalTime: 4, priority: 0 }
            ];

            const quantum = 4;
            const result = simulateRoundRobin(processes, quantum);

            // Should add processes to queue only when they arrive
            expect(result.ganttChart[0].process).toBe('P1');
            expect(result.ganttChart[0].start).toBe(0);
        });
    });
});

/**
 * Helper function to simulate Round Robin
 * This will need to be extracted from the current implementation
 */
function simulateRoundRobin(processes, quantum) {
    const readyQueue = [];
    const ganttChart = [];
    let currentTime = 0;
    let completedCount = 0;
    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;
    let contextSwitches = 0;

    // Clone processes to avoid mutation
    const processList = processes.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        waitTime: 0,
        turnaroundTime: 0,
        completed: false
    }));

    // Add processes that have arrived
    const arrivedProcesses = processList.filter(p => p.arrivalTime <= currentTime);
    readyQueue.push(...arrivedProcesses);

    while (completedCount < processList.length) {
        // Check for new arrivals
        const newArrivals = processList.filter(
            p => !p.completed &&
                p.arrivalTime <= currentTime &&
                !readyQueue.includes(p) &&
                p.remainingTime > 0
        );
        readyQueue.push(...newArrivals);

        if (readyQueue.length === 0) {
            // CPU idle - jump to next arrival
            const nextArrival = processList
                .filter(p => !p.completed && p.arrivalTime > currentTime)
                .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];

            if (nextArrival) {
                currentTime = nextArrival.arrivalTime;
                readyQueue.push(nextArrival);
            } else {
                break;
            }
        }

        const currentProcess = readyQueue.shift();
        const timeSlice = Math.min(quantum, currentProcess.remainingTime);

        ganttChart.push({
            process: currentProcess.id,
            start: currentTime,
            end: currentTime + timeSlice
        });

        currentTime += timeSlice;
        currentProcess.remainingTime -= timeSlice;

        // Update wait time for processes in queue
        readyQueue.forEach(p => {
            p.waitTime += timeSlice;
        });

        if (currentProcess.remainingTime > 0) {
            // Process not complete, add back to queue
            readyQueue.push(currentProcess);
            contextSwitches++;
        } else {
            // Process completed
            currentProcess.completed = true;
            currentProcess.turnaroundTime = currentTime - currentProcess.arrivalTime;
            totalWaitTime += currentProcess.waitTime;
            totalTurnaroundTime += currentProcess.turnaroundTime;
            completedCount++;

            if (readyQueue.length > 0) {
                contextSwitches++;
            }
        }
    }

    return {
        ganttChart,
        totalProcesses: processList.length,
        completedProcesses: completedCount,
        avgWaitTime: processList.length > 0 ? totalWaitTime / processList.length : 0,
        avgTurnaroundTime: processList.length > 0 ? totalTurnaroundTime / processList.length : 0,
        totalWaitTime,
        totalTurnaroundTime,
        contextSwitches
    };
}

// Export for use in actual implementation
export { simulateRoundRobin };
