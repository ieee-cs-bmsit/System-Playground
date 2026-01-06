/**
 * OS Scheduler Level Definitions
 * 20 progressively challenging levels
 */

export const OS_SCHEDULER_LEVELS = [
    // ========== BEGINNER LEVELS (1-5) ==========
    {
        id: 'os-1-intro',
        title: 'Introduction to Scheduling',
        difficulty: 'beginner',
        estimatedTime: '5 min',
        module: 'os-scheduler',

        objective: {
            description: 'Schedule 3 processes using Round Robin',
            requirements: [
                'Use Round Robin scheduler',
                'Create exactly 3 processes',
                'Average wait time < 20ms'
            ]
        },

        constraints: {
            maxProcesses: 3,
            minProcesses: 3,
            allowedSchedulers: ['RR'],
            allowedComponents: ['generator', 'scheduler', 'cpu', 'process'],
            requiredMetrics: {
                avgWaitTime: { max: 20 }
            }
        },

        initialSetup: {
            // Pre-place components for complete beginners
            nodes: [
                { id: 'gen-1', type: 'generator', position: { x: 100, y: 150 }, data: { spawnRate: 5 } },
                { id: 'sched-1', type: 'scheduler', position: { x: 300, y: 150 }, data: { algorithm: 'RR', quantum: 4 } },
                { id: 'cpu-1', type: 'cpu', position: { x: 500, y: 150 }, data: {} }
            ],
            edges: [
                { source: 'gen-1', target: 'sched-1' },
                { source: 'sched-1', target: 'cpu-1' }
            ]
        },

        starRating: {
            3: { avgWaitTime: 12, hint: '⭐⭐⭐ Excellent! Optimal quantum size!' },
            2: { avgWaitTime: 16, hint: '⭐⭐ Good! Try quantum=4 for better results.' },
            1: { avgWaitTime: 20, hint: '⭐ Complete! Adjust quantum to improve wait time.' }
        },

        hints: [
            { trigger: 'avgWaitTime > 18', message: 'Try reducing time quantum to 4' },
            { trigger: 'contextSwitches > 15', message: 'Too many context switches! Increase quantum.' },
            { trigger: 'cpuUtilization < 80', message: 'CPU is idle. Make sure processes are arriving.' }
        ],

        tutorialSteps: [
            'Components are already placed for you',
            'Click the play button (▶) to start simulation',
            'Watch processes move through the scheduler',
            'Observe metrics in the panel on the right',
            'Goal: Average wait time should be < 20ms'
        ],

        unlocks: 'os-2-multi-algo'
    },

    {
        id: 'os-2-multi-algo',
        title: 'Algorithm Comparison',
        difficulty: 'beginner',
        estimatedTime: '7 min',
        module: 'os-scheduler',
        locked: true,

        objective: {
            description: 'Find the best scheduler for 5 processes',
            challenge: 'Minimize average wait time below 10ms'
        },

        constraints: {
            maxProcesses: 5,
            minProcesses: 5,
            allowedSchedulers: ['RR', 'FCFS', 'SJF', 'Priority'],
            requiredMetrics: {
                avgWaitTime: { max: 10 }
            }
        },

        starRating: {
            3: { avgWaitTime: 6, scheduler: 'SJF', hint: '⭐⭐⭐ Perfect! SJF is optimal for this workload!' },
            2: { avgWaitTime: 8, hint: '⭐⭐ Good! Try SJF for even better results.' },
            1: { avgWaitTime: 10, hint: '⭐ Complete! Experiment with different algorithms.' }
        },

        hints: [
            { trigger: 'scheduler == "RR"', message: 'Round Robin works, but SJF is better for this workload' },
            { trigger: 'scheduler == "FCFS"', message: 'FCFS is simple but not optimal. Try SJF!' },
            { trigger: 'avgWaitTime > 12', message: 'SJF (Shortest Job First) minimizes average wait time' }
        ],

        unlocks: 'os-3-quantum-tuning'
    },

    {
        id: 'os-3-quantum-tuning',
        title: 'Quantum Tuning Challenge',
        difficulty: 'beginner',
        estimatedTime: '8 min',
        module: 'os-scheduler',
        locked: true,

        objective: {
            description: 'Find the optimal time quantum for Round Robin',
            challenge: 'Balance response time and context switches'
        },

        constraints: {
            maxProcesses: 6,
            allowedSchedulers: ['RR'],
            requiredMetrics: {
                avgWaitTime: { max: 12 },
                contextSwitches: { max: 30 }
            }
        },

        starRating: {
            3: { avgWaitTime: 8, contextSwitches: 20, hint: '⭐⭐⭐ Perfect balance! Quantum = 4 is ideal.' },
            2: { avgWaitTime: 10, contextSwitches: 25, hint: '⭐⭐ Good! Try quantum = 4-5.' },
            1: { avgWaitTime: 12, hint: '⭐ Complete! Experiment with quantum size.' }
        },

        hints: [
            { trigger: 'contextSwitches > 35', message: 'Too many switches! Increase quantum size' },
            { trigger: 'avgWaitTime > 15', message: 'Wait time too high! Decrease quantum size' }
        ],

        unlocks: 'os-4-priority-scheduling'
    },

    {
        id: 'os-4-priority-scheduling',
        title: 'Priority Scheduling',
        difficulty: 'intermediate',
        estimatedTime: '10 min',
        module: 'os-scheduler',
        locked: true,

        objective: {
            description: 'Schedule processes with different priorities',
            challenge: 'High priority processes should run first'
        },

        constraints: {
            maxProcesses: 8,
            allowedSchedulers: ['Priority'],
            requiredMetrics: {
                avgWaitTime: { max: 15 }
            }
        },

        starRating: {
            3: { avgWaitTime: 10, hint: '⭐⭐⭐ Excellent priority handling!' },
            2: { avgWaitTime: 12, hint: '⭐⭐ Good! Watch for starvation.' },
            1: { avgWaitTime: 15, hint: '⭐ Complete! Priority scheduling works!' }
        },

        unlocks: 'os-5-deadlock-intro'
    },

    {
        id: 'os-5-deadlock-intro',
        title: 'Deadlock Detection 101',
        difficulty: 'intermediate',
        estimatedTime: '12 min',
        module: 'os-scheduler',
        locked: true,

        objective: {
            description: 'Create a simple deadlock scenario',
            challenge: 'Make 2 processes wait for each other\'s resources'
        },

        constraints: {
            maxProcesses: 2,
            requiredComponents: ['scheduler', 'cpu', 'mutex'],
            customValidation: (state) => {
                const deadlockDetected = state.metrics.deadlockCount > 0;
                return {
                    passed: deadlockDetected,
                    violations: deadlockDetected ? [] : ['No deadlock detected. Create circular wait.']
                };
            }
        },

        starRating: {
            3: 'Deadlock created with minimal resources',
            2: 'Deadlock created',
            1: 'Deadlock eventually detected'
        },

        hints: [
            { trigger: 'deadlockCount == 0', message: 'Process 1 needs Resource A then B, Process 2 needs B then A' }
        ],

        unlocks: 'os-6-deadlock-resolution'
    },

    // ========== INTERMEDIATE LEVELS (6-15) ==========
    {
        id: 'os-6-deadlock-resolution',
        title: 'Breaking the Deadlock',
        difficulty: 'intermediate',
        estimatedTime: '15 min',
        module: 'os-scheduler',
        locked: true,

        objective: {
            description: 'Create a deadlock, then resolve it without killing processes',
            phases: [
                'Phase 1: Create valid deadlock with 4 resources',
                'Phase 2: Resolve gracefully using resource release'
            ]
        },

        constraints: {
            phasedValidation: true
        },

        phaseValidation: {
            phase1: {
                check: (sim) => sim.deadlockDetected === true,
                feedback: 'Deadlock detected! Now try to resolve it.'
            },
            phase2: {
                check: (sim) => sim.deadlockDetected === false && sim.processesKilled === 0,
                feedback: 'Excellent! Deadlock resolved gracefully.'
            }
        },

        starRating: {
            3: 'Resolve in < 5 resource operations',
            2: 'Resolve in < 10 operations',
            1: 'Resolve eventually'
        },

        unlocks: 'os-7-cpu-bound-vs-io'
    },

    {
        id: 'os-7-cpu-bound-vs-io',
        title: 'CPU-Bound vs I/O-Bound',
        difficulty: 'intermediate',
        estimatedTime: '12 min',
        module: 'os-scheduler',
        locked: true,

        objective: {
            description: 'Schedule a mix of CPU-intensive and I/O-intensive processes',
            challenge: 'Maximize CPU utilization while minimizing I/O wait'
        },

        constraints: {
            maxProcesses: 10,
            allowedSchedulers: ['RR', 'MLFQ'],
            requiredMetrics: {
                cpuUtilization: { min: 85 },
                avgWaitTime: { max: 15 }
            }
        },

        starRating: {
            3: { cpuUtilization: 95, avgWaitTime: 10, hint: '⭐⭐⭐ Perfect balance!' },
            2: { cpuUtilization: 90, avgWaitTime: 13, hint: '⭐⭐ Good! MLFQ handles mixed workloads well.' },
            1: { cpuUtilization: 85, avgWaitTime: 15, hint: '⭐ Complete! Try MLFQ for better results.' }
        },

        unlocks: 'os-8-multi-cpu'
    },

    // Levels 8-15: More intermediate challenges
    {
        id: 'os-8-multi-cpu',
        title: 'Multi-Core Scheduling',
        difficulty: 'intermediate',
        estimatedTime: '15 min',
        module: 'osto-scheduler',
        locked: true,
        objective: { description: 'Balance load across 2 CPUs' },
        constraints: { minCPUs: 2, maxProcesses: 12, requiredMetrics: { cpuUtilization: { min: 80 } } },
        unlocks: 'os-9-real-time-intro'
    },

    {
        id: 'os-9-real-time-intro',
        title: 'Real-Time Scheduling Basics',
        difficulty: 'intermediate',
        estimatedTime: '15 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Use EDF to meet deadlines' },
        constraints: { allowedSchedulers: ['EDF'], requiredMetrics: { deadlinesMissed: { max: 0 } } },
        unlocks: 'os-10-throughput-challenge'
    },

    {
        id: 'os-10-throughput-challenge',
        title: 'Maximize Throughput',
        difficulty: 'intermediate',
        estimatedTime: '12 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Process 20 jobs as fast as possible' },
        constraints: { maxProcesses: 20, requiredMetrics: { throughput: { min: 2.0 } } },
        starRating: { 3: { throughput: 3.0 }, 2: { throughput: 2.5 }, 1: { throughput: 2.0 } },
        unlocks: 'os-11-fairness'
    },

    // Levels 11-20: Advanced challenges
    {
        id: 'os-11-fairness',
        title: 'Fair Share Scheduling',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Ensure all processes get fair CPU time' },
        constraints: { allowedSchedulers: ['FairShare'], requiredMetrics: { fairnessIndex: { min: 0.9 } } },
        unlocks: 'os-12-starvation'
    },

    {
        id: 'os-12-starvation',
        title: 'Preventing Starvation',
        difficulty: 'advanced',
        estimatedTime: '18 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Ensure low-priority processes don\'t starve' },
        constraints: { requiredMetrics: { maxWaitTime: { max: 100 } } },
        unlocks: 'os-13-convoy-effect'
    },

    {
        id: 'os-13-convoy-effect',
        title: 'Avoiding Convoy Effect',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Minimize convoy effect with FCFS' },
        unlocks: 'os-14-aging'
    },

    {
        id: 'os-14-aging',
        title: 'Priority Aging',
        difficulty: 'advanced',
        estimatedTime: '22 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Implement priority aging to prevent starvation' },
        unlocks: 'os-15-lottery'
    },

    {
        id: 'os-15-lottery',
        title: 'Lottery Scheduling',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Use lottery scheduling for proportional share' },
        constraints: { allowedSchedulers: ['Lottery'] },
        unlocks: 'os-16-gang-scheduling'
    },

    {
        id: 'os-16-gang-scheduling',
        title: 'Gang Scheduling',
        difficulty: 'expert',
        estimatedTime: '25 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Schedule related processes together' },
        unlocks: 'os-17-cache-aware'
    },

    {
        id: 'os-17-cache-aware',
        title: 'Cache-Aware Scheduling',
        difficulty: 'expert',
        estimatedTime: '30 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Minimize cache misses with smart scheduling' },
        unlocks: 'os-18-power-aware'
    },

    {
        id: 'os-18-power-aware',
        title: 'Power-Aware Scheduling',
        difficulty: 'expert',
        estimatedTime: '25 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Minimize power consumption while meeting SLA' },
        unlocks: 'os-19-heterogeneous'
    },

    {
        id: 'os-19-heterogeneous',
        title: 'Heterogeneous Multi-Core',
        difficulty: 'expert',
        estimatedTime: '30 min',
        module: 'os-scheduler',
        locked: true,
        objective: { description: 'Schedule on big.LITTLE architecture' },
        unlocks: 'os-20-ultimate'
    },

    {
        id: 'os-20-ultimate',
        title: 'The Ultimate Scheduler',
        difficulty: 'expert',
        estimatedTime: '40 min',
        module: 'os-scheduler',
        locked: true,

        objective: {
            description: 'Handle a complex mixed workload optimally',
            challenge: 'Meet all constraints simultaneously'
        },

        constraints: {
            processes: 'Mix of CPU-bound, I/O-bound, real-time, and interactive',
            mustUse: ['Priority', 'Resources'],
            targetMetrics: {
                avgWaitTime: { max: 8 },
                avgTurnaroundTime: { max: 25 },
                cpuUtilization: { min: 85 },
                deadlinesMissed: { max: 0 },
                fairnessIndex: { min: 0.85 }
            }
        },

        starRating: 'Based on combined score of all metrics',

        unlocks: null // Final level
    }
];

export default OS_SCHEDULER_LEVELS;
