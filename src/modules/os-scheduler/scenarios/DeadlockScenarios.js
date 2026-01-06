/**
 * Pre-built Deadlock Scenarios
 * Educational examples demonstrating different deadlock situations
 */

export const deadlockScenarios = {
    // Scenario 1: Classic Circular Wait (2 processes, 2 resources)
    circularWait: {
        name: "Circular Wait Example",
        description: "Two processes waiting for each other's resources",
        nodes: [
            // Processes
            { id: 'process_1', type: 'process', position: { x: 150, y: 100 }, data: { priority: 5 } },
            { id: 'process_2', type: 'process', position: { x: 150, y: 250 }, data: { priority: 5 } },

            // Resources
            { id: 'mutex_1', type: 'mutex', position: { x: 400, y: 100 }, data: {} },
            { id: 'mutex_2', type: 'mutex', position: { x: 400, y: 250 }, data: {} },

            // Scheduler & CPU
            { id: 'scheduler_1', type: 'scheduler', position: { x: 650, y: 175 }, data: {} },
            { id: 'cpu_1', type: 'cpu', position: { x: 850, y: 175 }, data: {} }
        ],
        edges: [
            // P1 holds M1, requests M2
            { id: 'e1', source: 'process_1', target: 'mutex_1', type: 'smoothstep', label: 'holds' },
            { id: 'e2', source: 'mutex_2', target: 'process_1', type: 'smoothstep', label: 'requests', animated: true },

            // P2 holds M2, requests M1
            { id: 'e3', source: 'process_2', target: 'mutex_2', type: 'smoothstep', label: 'holds' },
            { id: 'e4', source: 'mutex_1', target: 'process_2', type: 'smoothstep', label: 'requests', animated: true },

            // Scheduler connections
            { id: 'e5', source: 'process_1', target: 'scheduler_1', type: 'smoothstep' },
            { id: 'e6', source: 'process_2', target: 'scheduler_1', type: 'smoothstep' },
            { id: 'e7', source: 'scheduler_1', target: 'cpu_1', type: 'smoothstep' }
        ]
    },

    // Scenario 2: Dining Philosophers (5 processes, 5 resources)
    diningPhilosophers: {
        name: "Dining Philosophers Problem",
        description: "Classic synchronization problem with potential deadlock",
        nodes: [
            // Philosophers (Processes) - arranged in circle
            { id: 'process_1', type: 'process', position: { x: 400, y: 50 }, data: { priority: 5 } },
            { id: 'process_2', type: 'process', position: { x: 550, y: 150 }, data: { priority: 5 } },
            { id: 'process_3', type: 'process', position: { x: 500, y: 300 }, data: { priority: 5 } },
            { id: 'process_4', type: 'process', position: { x: 300, y: 300 }, data: { priority: 5 } },
            { id: 'process_5', type: 'process', position: { x: 250, y: 150 }, data: { priority: 5 } },

            // Forks (Mutexes) - between philosophers
            { id: 'mutex_1', type: 'mutex', position: { x: 475, y: 100 }, data: {} },
            { id: 'mutex_2', type: 'mutex', position: { x: 525, y: 225 }, data: {} },
            { id: 'mutex_3', type: 'mutex', position: { x: 400, y: 300 }, data: {} },
            { id: 'mutex_4', type: 'mutex', position: { x: 275, y: 225 }, data: {} },
            { id: 'mutex_5', type: 'mutex', position: { x: 325, y: 100 }, data: {} },
        ],
        edges: [
            // Each philosopher holds left fork and requests right fork
            { id: 'e1', source: 'process_1', target: 'mutex_1', label: 'holds' },
            { id: 'e2', source: 'mutex_2', target: 'process_1', label: 'requests', animated: true },

            { id: 'e3', source: 'process_2', target: 'mutex_2', label: 'holds' },
            { id: 'e4', source: 'mutex_3', target: 'process_2', label: 'requests', animated: true },

            { id: 'e5', source: 'process_3', target: 'mutex_3', label: 'holds' },
            { id: 'e6', source: 'mutex_4', target: 'process_3', label: 'requests', animated: true },

            { id: 'e7', source: 'process_4', target: 'mutex_4', label: 'holds' },
            { id: 'e8', source: 'mutex_5', target: 'process_4', label: 'requests', animated: true },

            { id: 'e9', source: 'process_5', target: 'mutex_5', label: 'holds' },
            { id: 'e10', source: 'mutex_1', target: 'process_5', label: 'requests', animated: true }
        ]
    },

    // Scenario 3: Banker's Algorithm Safe State
    bankersSafe: {
        name: "Banker's Algorithm - Safe State",
        description: "Resource allocation that avoids deadlock",
        nodes: [
            { id: 'process_1', type: 'process', position: { x: 100, y: 100 }, data: { priority: 3 } },
            { id: 'process_2', type: 'process', position: { x: 100, y: 200 }, data: { priority: 5 } },
            { id: 'process_3', type: 'process', position: { x: 100, y: 300 }, data: { priority: 7 } },

            { id: 'memory_1', type: 'memory', position: { x: 350, y: 150 }, data: {} },
            { id: 'iodevice_1', type: 'iodevice', position: { x: 350, y: 250 }, data: {} },

            { id: 'scheduler_1', type: 'scheduler', position: { x: 600, y: 200 }, data: {} },
            { id: 'cpu_1', type: 'cpu', position: { x: 800, y: 200 }, data: {} }
        ],
        edges: [
            // Safe allocation
            { id: 'e1', source: 'process_1', target: 'memory_1' },
            { id: 'e2', source: 'process_2', target: 'iodevice_1' },
            { id: 'e3', source: 'process_1', target: 'scheduler_1' },
            { id: 'e4', source: 'process_2', target: 'scheduler_1' },
            { id: 'e5', source: 'process_3', target: 'scheduler_1' },
            { id: 'e6', source: 'scheduler_1', target: 'cpu_1' }
        ]
    }
};

/**
 * Load a scenario onto the canvas
 */
export function loadScenario(scenarioKey, setNodes, setEdges) {
    const scenario = deadlockScenarios[scenarioKey];

    if (!scenario) {
        console.error(`Scenario ${scenarioKey} not found`);
        return;
    }

    setNodes(scenario.nodes);
    setEdges(scenario.edges);

    return scenario;
}
