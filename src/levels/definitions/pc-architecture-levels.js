/**
 * PC Architecture Module - 20 Progressive Levels
 * Focus: CPU Pipeline, Cache Hierarchy, Branch Prediction, Pipelining Hazards
 */

const PC_ARCHITECTURE_LEVELS = [
    // ========== BEGINNER LEVELS (1-5) ==========
    {
        id: 'pc-1-intro',
        title: 'First CPU Build',
        difficulty: 'beginner',
        estimatedTime: '5 min',
        module: 'pc-architecture',

        objective: {
            description: 'Build a simple CPU with ALU and registers',
            requirements: [
                'Add 1 ALU component',
                'Add 2 register components',
                'Connect them with edges',
                'Run simulation for 10 cycles'
            ]
        },

        constraints: {
            minComponents: 3,
            maxComponents: 5,
            allowedComponents: ['alu', 'register', 'bus'],
            requiredMetrics: {
                cyclesCompleted: { min: 10 }
            }
        },

        initialSetup: {
            nodes: [],
            edges: []
        },

        starRating: {
            3: { hint: '⭐⭐⭐ Connect all components efficiently' },
            2: { hint: '⭐⭐ Create basic connections' },
            1: { hint: '⭐ Complete the objective' }
        },

        hints: [
            'Drag ALU from sidebar',
            'Add registers to store data',
            'Connect components with edges',
            'Click play to run'
        ],

        tutorialSteps: [
            'Drag an ALU component onto the canvas',
            'Add two Register components',
            'Connect them by dragging edges',
            'Press Play button',
            'Watch the simulation run for 10 cycles'
        ],

        unlocks: 'pc-2-cache-intro'
    },

    {
        id: 'pc-2-cache-intro',
        title: 'Cache Memory Basics',
        difficulty: 'beginner',
        estimatedTime: '7 min',
        module: 'pc-architecture',

        objective: {
            description: 'Add L1 cache to improve memory access speed',
            requirements: [
                'Add L1 Cache component',
                'Connect to CPU',
                'Achieve cache hit rate > 60%'
            ]
        },

        constraints: {
            minComponents: 4,
            allowedComponents: ['alu', 'register', 'cache-l1', 'memory', 'bus'],
            requiredMetrics: {
                cacheHitRate: { min: 60 }
            }
        },

        starRating: {
            3: { cacheHitRate: { min: 80 } },
            2: { cacheHitRate: { min: 70 } },
            1: { cacheHitRate: { min: 60 } }
        },

        hints: [
            'L1 cache is closest to CPU',
            'Hit rate improves with locality of reference',
            'Connect cache between CPU and memory'
        ],

        unlocks: 'pc-3-pipeline-intro'
    },

    {
        id: 'pc-3-pipeline-intro',
        title: 'Introduction to Pipelining',
        difficulty: 'beginner',
        estimatedTime: '8 min',
        module: 'pc-architecture',

        objective: {
            description: 'Build a 3-stage pipeline (Fetch, Decode, Execute)',
            requirements: [
                'Create 3 pipeline stages',
                'Process 5 instructions',
                'Achieve throughput > 0.8 IPC'
            ]
        },

        constraints: {
            minComponents: 5,
            allowedComponents: ['fetch-unit', 'decode-unit', 'execute-unit', 'register', 'bus'],
            requiredMetrics: {
                ipc: { min: 0.8 },
                instructionsCompleted: { min: 5 }
            }
        },

        starRating: {
            3: { ipc: { min: 1.2 } },
            2: { ipc: { min: 1.0 } },
            1: { ipc: { min: 0.8 } }
        },

        hints: [
            'Pipeline stages work in parallel',
            'Each stage processes different instruction',
            'IPC = Instructions Per Cycle'
        ],

        unlocks: 'pc-4-hazards'
    },

    {
        id: 'pc-4-hazards',
        title: 'Dealing with Hazards',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        module: 'pc-architecture',

        objective: {
            description: 'Handle data hazards in pipeline using forwarding',
            challenge: 'Minimize pipeline stalls!',
            requirements: [
                'Add forwarding unit',
                'Process 10 instructions',
                'Keep stalls < 3'
            ]
        },

        constraints: {
            minComponents: 6,
            allowedComponents: ['fetch-unit', 'decode-unit', 'execute-unit', 'forwarding-unit', 'register', 'bus'],
            requiredMetrics: {
                pipelineStalls: { max: 3 },
                instructionsCompleted: { min: 10 }
            }
        },

        starRating: {
            3: { pipelineStalls: { max: 0 } },
            2: { pipelineStalls: { max: 1 } },
            1: { pipelineStalls: { max: 3 } }
        },

        hints: [
            'Forwarding bypasses register write-back',
            'RAW hazards are most common',
            'Add forwarding paths between stages'
        ],

        unlocks: 'pc-5-branch-prediction'
    },

    {
        id: 'pc-5-branch-prediction',
        title: 'Branch Prediction 101',
        difficulty: 'beginner',
        estimatedTime: '12 min',
        module: 'pc-architecture',

        objective: {
            description: 'Add branch predictor to reduce control hazards',
            requirements: [
                'Add branch predictor',
                'Achieve prediction accuracy > 70%',
                'Process 15 instructions'
            ]
        },

        constraints: {
            minComponents: 7,
            allowedComponents: ['fetch-unit', 'decode-unit', 'execute-unit', 'branch-predictor', 'register', 'bus'],
            requiredMetrics: {
                branchAccuracy: { min: 70 },
                instructionsCompleted: { min: 15 }
            }
        },

        starRating: {
            3: { branchAccuracy: { min: 90 } },
            2: { branchAccuracy: { min: 80 } },
            1: { branchAccuracy: { min: 70 } }
        },

        hints: [
            'Static prediction always predicts same',
            'Dynamic prediction learns from history',
            '1-bit predictor is simplest'
        ],

        unlocks: 'pc-6-cache-hierarchy'
    },

    // ========== INTERMEDIATE LEVELS (6-10) ==========
    {
        id: 'pc-6-cache-hierarchy',
        title: 'Multi-Level Cache',
        difficulty: 'intermediate',
        estimatedTime: '15 min',
        module: 'pc-architecture',

        objective: {
            description: 'Build L1, L2, L3 cache hierarchy',
            challenge: 'Balance speed and capacity!',
            requirements: [
                'Add L1, L2, and L3 caches',
                'Configure sizes correctly',
                'Overall hit rate > 85%'
            ]
        },

        constraints: {
            minComponents: 8,
            requiredComponents: ['cache-l1', 'cache-l2', 'cache-l3'],
            allowedComponents: ['alu', 'register', 'cache-l1', 'cache-l2', 'cache-l3', 'memory', 'bus'],
            requiredMetrics: {
                overallHitRate: { min: 85 }
            }
        },

        starRating: {
            3: { overallHitRate: { min: 95 } },
            2: { overallHitRate: { min: 90 } },
            1: { overallHitRate: { min: 85 } }
        },

        hints: [
            'L1: Small but fast (4 cycles)',
            'L2: Medium size (12 cycles)',
            'L3: Large but slower (40 cycles)',
            'Inclusive hierarchy is common'
        ],

        unlocks: 'pc-7-superscalar'
    },

    {
        id: 'pc-7-superscalar',
        title: 'Superscalar Execution',
        difficulty: 'intermediate',
        estimatedTime: '18 min',
        module: 'pc-architecture',

        objective: {
            description: 'Build dual-issue superscalar CPU',
            challenge: 'Execute 2 instructions per cycle!',
            requirements: [
                'Add 2 ALU units',
                'Add 2 execution pipelines',
                'Achieve IPC > 1.5'
            ]
        },

        constraints: {
            minComponents: 10,
            requiredMetrics: {
                ipc: { min: 1.5 },
                instructionsCompleted: { min: 20 }
            }
        },

        starRating: {
            3: { ipc: { min: 1.9 } },
            2: { ipc: { min: 1.7 } },
            1: { ipc: { min: 1.5 } }
        },

        hints: [
            'Superscalar = multiple instructions/cycle',
            'Need multiple execution units',
            'Instruction-level parallelism (ILP)',
            'Dependency checking is critical'
        ],

        unlocks: 'pc-8-out-of-order'
    },

    {
        id: 'pc-8-out-of-order',
        title: 'Out-of-Order Execution',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        module: 'pc-architecture',

        objective: {
            description: 'Implement OOO execution with Tomasulo algorithm',
            challenge: 'Maximize instruction throughput!',
            requirements: [
                'Add reservation stations',
                'Add reorder buffer',
                'IPC > 2.0'
            ]
        },

        constraints: {
            minComponents: 12,
            requiredComponents: ['reservation-station', 'reorder-buffer'],
            requiredMetrics: {
                ipc: { min: 2.0 },
                instructionsCompleted: { min: 25 }
            }
        },

        starRating: {
            3: { ipc: { min: 2.5 } },
            2: { ipc: { min: 2.2 } },
            1: { ipc: { min: 2.0 } }
        },

        hints: [
            'OOO = execute when ready, not in order',
            'Reservation stations hold pending ops',
            'ROB ensures in-order commit',
            'Eliminates false dependencies'
        ],

        unlocks: 'pc-9-speculative'
    },

    {
        id: 'pc-9-speculative',
        title: 'Speculative Execution',
        difficulty: 'intermediate',
        estimatedTime: '22 min',
        module: 'pc-architecture',

        objective: {
            description: 'Add speculative execution with rollback',
            challenge: 'Predict and execute ahead!',
            requirements: [
                'Add branch predictor',
                'Add speculation buffer',
                'Misprediction recovery < 5 cycles'
            ]
        },

        constraints: {
            minComponents: 13,
            requiredComponents: ['branch-predictor', 'speculation-buffer'],
            requiredMetrics: {
                branchAccuracy: { min: 85 },
                mispredictionPenalty: { max: 5 }
            }
        },

        starRating: {
            3: { branchAccuracy: { min: 95 }, mispredictionPenalty: { max: 3 } },
            2: { branchAccuracy: { min: 90 }, mispredictionPenalty: { max: 4 } },
            1: { branchAccuracy: { min: 85 }, mispredictionPenalty: { max: 5 } }
        },

        hints: [
            'Speculate on branch outcomes',
            'Execute speculatively down predicted path',
            'Rollback if mispredicted',
            '2-bit predictors more accurate'
        ],

        unlocks: 'pc-10-prefetching'
    },

    {
        id: 'pc-10-prefetching',
        title: 'Hardware Prefetching',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        module: 'pc-architecture',

        objective: {
            description: 'Add hardware prefetcher to reduce cache misses',
            challenge: 'Predict future memory accesses!',
            requirements: [
                'Add prefetch unit',
                'Cache miss rate < 10%',
                'Prefetch accuracy > 70%'
            ]
        },

        constraints: {
            minComponents: 10,
            requiredComponents: ['prefetch-unit', 'cache-l1'],
            requiredMetrics: {
                cacheMissRate: { max: 10 },
                prefetchAccuracy: { min: 70 }
            }
        },

        starRating: {
            3: { cacheMissRate: { max: 5 }, prefetchAccuracy: { min: 85 } },
            2: { cacheMissRate: { max: 7 }, prefetchAccuracy: { min: 75 } },
            1: { cacheMissRate: { max: 10 }, prefetchAccuracy: { min: 70 } }
        },

        hints: [
            'Stride prefetching detects patterns',
            'Stream buffers for sequential access',
            'Balance coverage and accuracy',
            'Prefetch too early = cache pollution'
        ],

        unlocks: 'pc-11-simd'
    },

    // ========== ADVANCED LEVELS (11-15) ==========
    {
        id: 'pc-11-simd',
        title: 'SIMD Vector Processing',
        difficulty: 'advanced',
        estimatedTime: '25 min',
        module: 'pc-architecture',

        objective: {
            description: 'Add SIMD (Single Instruction Multiple Data) units',
            challenge: 'Process 4 data elements in parallel!',
            requirements: [
                'Add vector ALU unit',
                'Add vector registers',
                'Process 16 vector operations',
                'Achieve 4x speedup'
            ]
        },

        constraints: {
            minComponents: 11,
            requiredComponents: ['vector-alu', 'vector-register'],
            requiredMetrics: {
                vectorOpsCompleted: { min: 16 },
                speedup: { min: 4 }
            }
        },

        starRating: {
            3: { speedup: { min: 3.8 } },
            2: { speedup: { min: 3.5 } },
            1: { speedup: { min: 3.0 } }
        },

        hints: [
            'SIMD = data parallelism',
            'Example: SSE, AVX on x86',
            'Great for multimedia, ML',
            'Need aligned data'
        ],

        unlocks: 'pc-12-multi-core'
    },

    {
        id: 'pc-12-multi-core',
        title: 'Dual-Core Architecture',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        module: 'pc-architecture',

        objective: {
            description: 'Build 2-core system with shared cache',
            challenge: 'Coordinate multiple cores!',
            requirements: [
                '2 complete CPU cores',
                'Shared L3 cache',
                'Total IPC > 3.0'
            ]
        },

        constraints: {
            minComponents: 16,
            requiredComponents: ['cache-l3'],
            requiredMetrics: {
                totalIPC: { min: 3.0 },
                coreCount: { min: 2 }
            }
        },

        starRating: {
            3: { totalIPC: { min: 3.8 } },
            2: { totalIPC: { min: 3.4 } },
            1: { totalIPC: { min: 3.0 } }
        },

        hints: [
            'Each core needs own L1/L2',
            'Share L3 cache between cores',
            'Cache coherence is critical',
            'Independent execution streams'
        ],

        unlocks: 'pc-13-cache-coherence'
    },

    {
        id: 'pc-13-cache-coherence',
        title: 'Cache Coherence Protocol',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        module: 'pc-architecture',

        objective: {
            description: 'Implement MESI coherence protocol',
            challenge: 'Keep caches consistent!',
            requirements: [
                'Add coherence controller',
                '2+ cores with private caches',
                'Zero data races',
                'Coherence traffic < 20%'
            ]
        },

        constraints: {
            minComponents: 18,
            requiredComponents: ['coherence-controller'],
            requiredMetrics: {
                dataRaces: { max: 0 },
                coherenceOverhead: { max: 20 }
            }
        },

        starRating: {
            3: { coherenceOverhead: { max: 10 } },
            2: { coherenceOverhead: { max: 15 } },
            1: { coherenceOverhead: { max: 20 } }
        },

        hints: [
            'MESI: Modified, Exclusive, Shared, Invalid',
            'Snooping vs directory-based',
            'Invalidate or update?',
            'False sharing hurts performance'
        ],

        unlocks: 'pc-14-power-aware'
    },

    {
        id: 'pc-14-power-aware',
        title: 'Power-Aware Architecture',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        module: 'pc-architecture',

        objective: {
            description: 'Implement DVFS and clock gating',
            challenge: 'Minimize power while meeting performance!',
            requirements: [
                'Add power controller',
                'Dynamic voltage/frequency scaling',
                'Power consumption < 50W',
                'Performance within 90% of max'
            ]
        },

        constraints: {
            minComponents: 14,
            requiredComponents: ['power-controller'],
            requiredMetrics: {
                powerConsumption: { max: 50 },
                performanceRatio: { min: 0.9 }
            }
        },

        starRating: {
            3: { powerConsumption: { max: 40 }, performanceRatio: { min: 0.95 } },
            2: { powerConsumption: { max: 45 }, performanceRatio: { min: 0.92 } },
            1: { powerConsumption: { max: 50 }, performanceRatio: { min: 0.9 } }
        },

        hints: [
            'DVFS = dynamic voltage/frequency scaling',
            'Lower freq = lower power but slower',
            'Clock gating disables unused units',
            'Power gating for deeper sleep'
        ],

        unlocks: 'pc-15-memory-controller'
    },

    {
        id: 'pc-15-memory-controller',
        title: 'Advanced Memory Controller',
        difficulty: 'advanced',
        estimatedTime: '28 min',
        module: 'pc-architecture',

        objective: {
            description: 'Optimize memory controller for bandwidth and latency',
            challenge: 'Schedule memory requests efficiently!',
            requirements: [
                'Add memory controller',
                'Support row buffer hits',
                'Memory latency < 60ns',
                'Bandwidth > 20 GB/s'
            ]
        },

        constraints: {
            minComponents: 12,
            requiredComponents: ['memory-controller'],
            requiredMetrics: {
                memoryLatency: { max: 60 },
                memoryBandwidth: { min: 20 }
            }
        },

        starRating: {
            3: { memoryLatency: { max: 50 }, memoryBandwidth: { min: 25 } },
            2: { memoryLatency: { max: 55 }, memoryBandwidth: { min: 22 } },
            1: { memoryLatency: { max: 60 }, memoryBandwidth: { min: 20 } }
        },

        hints: [
            'Row buffer locality is key',
            'FR-FCFS scheduling common',
            'Bank-level parallelism',
            'Refresh overhead is real'
        ],

        unlocks: 'pc-16-heterogeneous'
    },

    // ========== EXPERT LEVELS (16-20) ==========
    {
        id: 'pc-16-heterogeneous',
        title: 'Heterogeneous Computing',
        difficulty: 'expert',
        estimatedTime: '40 min',
        module: 'pc-architecture',

        objective: {
            description: 'Build big.LITTLE-style heterogeneous system',
            challenge: 'Mix performance and efficiency cores!',
            requirements: [
                '2 high-performance cores',
                '4 efficiency cores',
                'Dynamic task migration',
                'Total power < 80W',
                'Performance within 95% of all-big'
            ]
        },

        constraints: {
            minComponents: 20,
            requiredMetrics: {
                powerConsumption: { max: 80 },
                performanceRatio: { min: 0.95 }
            }
        },

        starRating: {
            3: { powerConsumption: { max: 65 }, performanceRatio: { min: 0.97 } },
            2: { powerConsumption: { max: 72 }, performanceRatio: { min: 0.96 } },
            1: { powerConsumption: { max: 80 }, performanceRatio: { min: 0.95 } }
        },

        hints: [
            'Big cores: high performance, high power',
            'Little cores: low performance, low power',
            'Migrate tasks based on workload',
            'ARM big.LITTLE is example'
        ],

        unlocks: 'pc-17-noc'
    },

    {
        id: 'pc-17-noc',
        title: 'Network-on-Chip',
        difficulty: 'expert',
        estimatedTime: '45 min',
        module: 'pc-architecture',

        objective: {
            description: 'Design mesh NoC for 16-core system',
            challenge: 'Scalable interconnect!',
            requirements: [
                '4x4 mesh topology',
                'Routers at each node',
                'Average latency < 10 hops',
                'Network utilization > 70%'
            ]
        },

        constraints: {
            minComponents: 25,
            requiredComponents: ['noc-router'],
            requiredMetrics: {
                avgNetworkLatency: { max: 10 },
                networkUtilization: { min: 70 }
            }
        },

        starRating: {
            3: { avgNetworkLatency: { max: 7 }, networkUtilization: { min: 80 } },
            2: { avgNetworkLatency: { max: 8 }, networkUtilization: { min: 75 } },
            1: { avgNetworkLatency: { max: 10 }, networkUtilization: { min: 70 } }
        },

        hints: [
            'NoC scales better than shared bus',
            'XY routing is simple',
            'Virtual channels reduce blocking',
            'Wormhole routing common'
        ],

        unlocks: 'pc-18-gpu-basics'
    },

    {
        id: 'pc-18-gpu-basics',
        title: 'GPU-Style SIMT',
        difficulty: 'expert',
        estimatedTime: '50 min',
        module: 'pc-architecture',

        objective: {
            description: 'Build simple GPU with SIMT execution',
            challenge: 'Thousands of threads!',
            requirements: [
                'Add SIMT core (warp scheduler)',
                '32-wide SIMD units',
                'Process 1024 threads',
                'Throughput > 100 GFLOPs'
            ]
        },

        constraints: {
            minComponents: 18,
            requiredComponents: ['simt-core', 'warp-scheduler'],
            requiredMetrics: {
                threadsProcessed: { min: 1024 },
                throughput: { min: 100 }
            }
        },

        starRating: {
            3: { throughput: { min: 150 } },
            2: { throughput: { min: 125 } },
            1: { throughput: { min: 100 } }
        },

        hints: [
            'SIMT = Single Instruction Multiple Thread',
            'Warps execute in lockstep',
            'Branch divergence is costly',
            'High thread count hides latency'
        ],

        unlocks: 'pc-19-quantum'
    },

    {
        id: 'pc-19-quantum',
        title: 'Quantum-Inspired Computing',
        difficulty: 'expert',
        estimatedTime: '55 min',
        module: 'pc-architecture',

        objective: {
            description: 'Simulate quantum-inspired optimization accelerator',
            challenge: 'Solve optimization problems fast!',
            requirements: [
                'Add quantum annealer unit',
                'Solve 100-variable problem',
                'Speedup > 10x vs classical',
                'Energy efficiency > 100 GOPS/W'
            ]
        },

        constraints: {
            minComponents: 15,
            requiredComponents: ['quantum-annealer'],
            requiredMetrics: {
                speedup: { min: 10 },
                energyEfficiency: { min: 100 }
            }
        },

        starRating: {
            3: { speedup: { min: 20 }, energyEfficiency: { min: 150 } },
            2: { speedup: { min: 15 }, energyEfficiency: { min: 125 } },
            1: { speedup: { min: 10 }, energyEfficiency: { min: 100 } }
        },

        hints: [
            'Quantum annealing finds global minima',
            'Use superposition and tunneling',
            'Good for combinatorial optimization',
            'Not universal quantum computer'
        ],

        unlocks: 'pc-20-ultimate'
    },

    {
        id: 'pc-20-ultimate',
        title: 'The Ultimate PC Architecture',
        difficulty: 'expert',
        estimatedTime: '60 min',
        module: 'pc-architecture',

        objective: {
            description: 'Build a complete modern PC architecture',
            challenge: 'ALL CONSTRAINTS MUST BE MET!',
            requirements: [
                'Multi-core with cache hierarchy',
                'OOO superscalar execution',
                'SIMD vector units',
                'Advanced branch prediction',
                'Power management',
                'Hardware prefetching',
                'Cache coherence'
            ]
        },

        constraints: {
            minComponents: 30,
            requiredComponents: [
                'cache-l1', 'cache-l2', 'cache-l3',
                'reorder-buffer', 'reservation-station',
                'vector-alu', 'branch-predictor',
                'power-controller', 'prefetch-unit',
                'coherence-controller'
            ],
            requiredMetrics: {
                totalIPC: { min: 4.0 },
                powerConsumption: { max: 150 },
                overallHitRate: { min: 92 },
                branchAccuracy: { min: 90 },
                energyEfficiency: { min: 50 }
            }
        },

        starRating: {
            3: {
                totalIPC: { min: 5.0 },
                powerConsumption: { max: 120 },
                overallHitRate: { min: 95 },
                branchAccuracy: { min: 95 },
                energyEfficiency: { min: 70 },
                hint: '⭐⭐⭐ PERFECT! Elite PC architect!'
            },
            2: {
                totalIPC: { min: 4.5 },
                powerConsumption: { max: 135 },
                overallHitRate: { min: 93 },
                branchAccuracy: { min: 92 },
                hint: '⭐⭐ Great! Almost perfect balance!'
            },
            1: {
                totalIPC: { min: 4.0 },
                powerConsumption: { max: 150 },
                overallHitRate: { min: 92 },
                branchAccuracy: { min: 90 },
                hint: '⭐ Good! Met all requirements!'
            }
        },

        hints: [
            'Balance performance, power, and area',
            'All modern features required',
            'This is the final boss!',
            'Think like Intel/AMD engineers'
        ],

        unlocks: null // Final level
    }
];

export default PC_ARCHITECTURE_LEVELS;
