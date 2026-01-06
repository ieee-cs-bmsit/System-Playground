/**
 * RAM Simulator Module - 20 Progressive Levels
 * Focus: Paging, Virtual Memory, TLB, Page Replacement, Memory Management
 */

const RAM_SIMULATOR_LEVELS = [
    // ========== BEGINNER LEVELS (1-5) ==========
    {
        id: 'ram-1-intro',
        title: 'First Virtual Memory System',
        difficulty: 'beginner',
        estimatedTime: '5 min',
        module: 'ram-simulator',

        objective: {
            description: 'Set up basic virtual memory with paging',
            requirements: [
                'Create page table',
                'Map 4 virtual pages',
                'Perform 10 memory accesses',
                'Hit rate > 60%'
            ]
        },

        constraints: {
            minComponents: 3,
            allowedComponents: ['page-table', 'physical-memory', 'mmu'],
            requiredMetrics: {
                memoryAccesses: { min: 10 },
                hitRate: { min: 60 }
            }
        },

        starRating: {
            3: { hitRate: { min: 80 } },
            2: { hitRate: { min: 70 } },
            1: { hitRate: { min: 60 } }
        },

        hints: [
            'Page table maps virtual to physical',
            'Each page is fixed size (4KB typical)',
            'MMU translates addresses',
            'TLB will help later'
        ],

        tutorialSteps: [
            'Drag Page Table component',
            'Add Physical Memory',
            'Connect MMU (Memory Management Unit)',
            'Run simulation'
        ],

        unlocks: 'ram-2-tlb-intro'
    },

    {
        id: 'ram-2-tlb-intro',
        title: 'TLB Basics',
        difficulty: 'beginner',
        estimatedTime: '7 min',
        module: 'ram-simulator',

        objective: {
            description: 'Add TLB to speed up address translation',
            requirements: [
                'Add TLB component',
                'Configure 16 entries',
                'TLB hit rate > 85%'
            ]
        },

        constraints: {
            minComponents: 4,
            requiredComponents: ['tlb'],
            allowedComponents: ['page-table', 'physical-memory', 'mmu', 'tlb'],
            requiredMetrics: {
                tlbHitRate: { min: 85 }
            }
        },

        starRating: {
            3: { tlbHitRate: { min: 95 } },
            2: { tlbHitRate: { min: 90 } },
            1: { tlbHitRate: { min: 85 } }
        },

        hints: [
            'TLB = Translation Lookaside Buffer',
            'Caches page table entries',
            'Fully associative is common',
            'Locality improves hit rate'
        ],

        unlocks: 'ram-3-page-faults'
    },

    {
        id: 'ram-3-page-faults',
        title: 'Handling Page Faults',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        module: 'ram-simulator',

        objective: {
            description: 'Set up demand paging with page fault handling',
            requirements: [
                'Limited physical memory (8 pages)',
                'Handle 5 page faults',
                'Page fault rate < 20%'
            ]
        },

        constraints: {
            physicalPages: { max: 8 },
            requiredMetrics: {
                pageFaults: { min: 5 },
                pageFaultRate: { max: 20 }
            }
        },

        starRating: {
            3: { pageFaultRate: { max: 10 } },
            2: { pageFaultRate: { max: 15 } },
            1: { pageFaultRate: { max: 20 } }
        },

        hints: [
            'Page fault = requested page not in memory',
            'OS loads page from disk',
            'Demand paging = load on-demand',
            'Thrashing happens if too many faults'
        ],

        unlocks: 'ram-4-fifo'
    },

    {
        id: 'ram-4-fifo',
        title: 'FIFO Page Replacement',
        difficulty: 'beginner',
        estimatedTime: '12 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement FIFO (First-In-First-Out) replacement',
            requirements: [
                'Use FIFO algorithm',
                '4 physical page frames',
                'Process 20 page references',
                'Page faults < 12'
            ]
        },

        constraints: {
            physicalPages: 4,
            replacementAlgorithm: 'fifo',
            requiredMetrics: {
                pageReferences: { min: 20 },
                pageFaults: { max: 12 }
            }
        },

        starRating: {
            3: { pageFaults: { max: 8 } },
            2: { pageFaults: { max: 10 } },
            1: { pageFaults: { max: 12 } }
        },

        hints: [
            'FIFO = replace oldest page',
            'Simple but suffers from Belady\'s anomaly',
            'Queue-based implementation',
            'Not always optimal'
        ],

        unlocks: 'ram-5-lru'
    },

    {
        id: 'ram-5-lru',
        title: 'LRU Page Replacement',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement LRU (Least Recently Used) replacement',
            requirements: [
                'Use LRU algorithm',
                '4 physical frames',
                'Same reference string as FIFO',
                'Fewer page faults than FIFO'
            ]
        },

        constraints: {
            physicalPages: 4,
            replacementAlgorithm: 'lru',
            requiredMetrics: {
                pageReferences: { min: 20 },
                pageFaults: { max: 10 }
            }
        },

        starRating: {
            3: { pageFaults: { max: 6 } },
            2: { pageFaults: { max: 8 } },
            1: { pageFaults: { max: 10 } }
        },

        hints: [
            'LRU = replace least recently used',
            'Better than FIFO in practice',
            'Approximates optimal',
            'Stack-based or timestamps'
        ],

        unlocks: 'ram-6-clock'
    },

    // ========== INTERMEDIATE LEVELS (6-10) ==========
    {
        id: 'ram-6-clock',
        title: 'Clock (Second Chance) Algorithm',
        difficulty: 'intermediate',
        estimatedTime: '18 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement Clock algorithm (approximates LRU)',
            challenge: 'Use reference bits efficiently!',
            requirements: [
                'Implement Clock algorithm',
                'Use reference bits',
                'Page faults between FIFO and LRU'
            ]
        },

        constraints: {
            physicalPages: 4,
            replacementAlgorithm: 'clock',
            requiredMetrics: {
                pageFaults: { max: 11 }
            }
        },

        starRating: {
            3: { pageFaults: { max: 7 } },
            2: { pageFaults: { max: 9 } },
            1: { pageFaults: { max: 11 } }
        },

        hints: [
            'Also called Second Chance',
            'Uses reference bit per page',
            'Circular list (like clock hand)',
            'Clear bit before eviction'
        ],

        unlocks: 'ram-7-multi-level'
    },

    {
        id: 'ram-7-multi-level',
        title: 'Multi-Level Page Tables',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement 2-level page table for large address space',
            challenge: 'Save memory with sparse addressing!',
            requirements: [
                'Create 2-level page table',
                'Support 32-bit virtual address',
                'Memory overhead < 1MB'
            ]
        },

        constraints: {
            requiredComponents: ['page-directory', 'page-table-2nd-level'],
            requiredMetrics: {
                addressSpace: { min: 4294967296 }, // 4GB
                memoryOverhead: { max: 1000000 }
            }
        },

        starRating: {
            3: { memoryOverhead: { max: 512000 } },
            2: { memoryOverhead: { max: 750000 } },
            1: { memoryOverhead: { max: 1000000 } }
        },

        hints: [
            'Divide virtual address into parts',
            'Page directory points topage tables',
            'Saves space for sparse memory',
            'x86 uses this approach'
        ],

        unlocks: 'ram-8-inverted'
    },

    {
        id: 'ram-8-inverted',
        title: 'Inverted Page Table',
        difficulty: 'intermediate',
        estimatedTime: '22 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement inverted page table (one entry per frame)',
            challenge: 'Minimize table size!',
            requirements: [
                'Create inverted page table',
                'Hash table for lookups',
                'Table size = # physical frames'
            ]
        },

        constraints: {
            requiredComponents: ['inverted-page-table', 'hash-anchor'],
            requiredMetrics: {
                lookupTime: { max: 5 },
                tableSize: { max: 1024 }
            }
        },

        starRating: {
            3: { lookupTime: { max: 3 } },
            2: { lookupTime: { max: 4 } },
            1: { lookupTime: { max: 5 } }
        },

        hints: [
            'One entry per physical frame, not page',
            'Saves memory for large address spaces',
            'Hashing required for lookup',
            'PowerPC uses this'
        ],

        unlocks: 'ram-9-working-set'
    },

    {
        id: 'ram-9-working-set',
        title: 'Working Set Model',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement working set based memory management',
            challenge: 'Prevent thrashing!',
            requirements: [
                'Track working set size',
                'Working set window = 10 references',
                'Detect thrashing',
                'Total page faults < 15'
            ]
        },

        constraints: {
            requiredMetrics: {
                workingSetSize: { min: 1 },
                pageFaults: { max: 15 },
                thrashingDetected: false
            }
        },

        starRating: {
            3: { pageFaults: { max: 8 }, workingSetSize: { min: 3 } },
            2: { pageFaults: { max: 12 }, workingSetSize: { min: 2 } },
            1: { pageFaults: { max: 15 }, workingSetSize: { min: 1 } }
        },

        hints: [
            'Working set = pages used recently',
            'Defined by window Δ',
            'Thrashing if ΣWS > total frames',
            'Suspend processes if thrashing'
        ],

        unlocks: 'ram-10-page-buffering'
    },

    {
        id: 'ram-10-page-buffering',
        title: 'Page Frame Buffering',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement free and modified page buffers',
            challenge: 'Reduce page fault latency!',
            requirements: [
                'Free page buffer (5 frames)',
                'Modified page buffer (5 frames)',
                'Average page fault latency < 50ms'
            ]
        },

        constraints: {
            requiredComponents: ['free-buffer', 'modified-buffer'],
            requiredMetrics: {
                avgPageFaultLatency: { max: 50 }
            }
        },

        starRating: {
            3: { avgPageFaultLatency: { max: 30 } },
            2: { avgPageFaultLatency: { max: 40 } },
            1: { avgPageFaultLatency: { max: 50 } }
        },

        hints: [
            'Keep pool of free frames ready',
            'Write modified pages in background',
            'Reduces I/O wait time',
            'Unix uses this technique'
        ],

        unlocks: 'ram-11-segmentation'
    },

    // ========== ADVANCED LEVELS (11-15) ==========
    {
        id: 'ram-11-segmentation',
        title: 'Segmentation',
        difficulty: 'advanced',
        estimatedTime: '28 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement segmentation (code, data, stack segments)',
            challenge: 'Logical memory protection!',
            requirements: [
                'Create 3 segments (code, data, stack)',
                'Segment table with base/limit',
                'Protection bits (r/w/x)',
                'Detect protection violations'
            ]
        },

        constraints: {
            requiredComponents: ['segment-table'],
            segmentCount: { min: 3 },
            requiredMetrics: {
                protectionViolations: { max: 0 }
            }
        },

        starRating: {
            3: { segmentCount: { min: 5 } },
            2: { segmentCount: { min: 4 } },
            1: { segmentCount: { min: 3 } }
        },

        hints: [
            'Segment = logical memory unit',
            'Each has base address and limit',
            'Protection: read/write/execute',
            'Intel x86 supports this'
        ],

        unlocks: 'ram-12-paged-segmentation'
    },

    {
        id: 'ram-12-paged-segmentation',
        title: 'Paged Segmentation',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        module: 'ram-simulator',

        objective: {
            description: 'Combine paging and segmentation',
            challenge: 'Best of both worlds!',
            requirements: [
                'Segment table',
                'Page table per segment',
                'Handle both segment and page faults',
                'Total translation time < 100ns'
            ]
        },

        constraints: {
            requiredComponents: ['segment-table', 'page-table'],
            requiredMetrics: {
                translationTime: { max: 100 }
            }
        },

        starRating: {
            3: { translationTime: { max: 60 } },
            2: { translationTime: { max: 80 } },
            1: { translationTime: { max: 100 } }
        },

        hints: [
            'Each segment is paged',
            'Two-step translation',
            'Combines advantages',
            'Multics used this'
        ],

        unlocks: 'ram-13-huge-pages'
    },

    {
        id: 'ram-13-huge-pages',
        title: 'Huge Pages (2MB)',
        difficulty: 'advanced',
        estimatedTime: '25 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement huge page support for large datasets',
            challenge: 'Reduce TLB pressure!',
            requirements: [
                'Support 4KB and 2MB pages',
                'TLB with huge page entries',
                'TLB coverage > 100MB',
                'TLB miss rate < 1%'
            ]
        },

        constraints: {
            requiredComponents: ['tlb-huge'],
            pageSizes: [4096, 2097152],
            requiredMetrics: {
                tlbCoverage: { min: 100000000 },
                tlbMissRate: { max: 1 }
            }
        },

        starRating: {
            3: { tlbMissRate: { max: 0.5 }, tlbCoverage: { min: 200000000 } },
            2: { tlbMissRate: { max: 0.75 }, tlbCoverage: { min: 150000000 } },
            1: { tlbMissRate: { max: 1 }, tlbCoverage: { min: 100000000 } }
        },

        hints: [
            'Huge pages reduce TLB entries needed',
            '2MB page covers 512x more than 4KB',
            'Less page table memory',
            'Databases love huge pages'
        ],

        unlocks: 'ram-14-numa'
    },

    {
        id: 'ram-14-numa',
        title: 'NUMA Memory',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        module: 'ram-simulator',

        objective: {
            description: 'Build NUMA (Non-Uniform Memory Access) system',
            challenge: 'Minimize remote memory access!',
            requirements: [
                '2 NUMA nodes',
                'Local and remote memory',
                'Remote access latency > local',
                'Local memory ratio > 80%'
            ]
        },

        constraints: {
            numaNodes: { min: 2 },
            requiredMetrics: {
                localMemoryRatio: { min: 80 }
            }
        },

        starRating: {
            3: { localMemoryRatio: { min: 95 } },
            2: { localMemoryRatio: { min: 90 } },
            1: { localMemoryRatio: { min: 80 } }
        },

        hints: [
            'Each CPU has local memory',
            'Remote access slower',
            'NUMA-aware allocation critical',
            'Modern servers are NUMA'
        ],

        unlocks: 'ram-15-memory-compression'
    },

    {
        id: 'ram-15-memory-compression',
        title: 'Memory Compression',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement transparent memory compression',
            challenge: 'Fit more in RAM!',
            requirements: [
                'Add compression engine',
                'Compress inactive pages',
                'Compression ratio > 2:1',
                'Decompression latency < 1μs'
            ]
        },

        constraints: {
            requiredComponents: ['compression-engine'],
            requiredMetrics: {
                compressionRatio: { min: 2 },
                decompressionLatency: { max: 1 }
            }
        },

        starRating: {
            3: { compressionRatio: { min: 3 }, decompressionLatency: { max: 0.5 } },
            2: { compressionRatio: { min: 2.5 }, decompressionLatency: { max: 0.75 } },
            1: { compressionRatio: { min: 2 }, decompressionLatency: { max: 1 } }
        },

        hints: [
            'Compress cold pages',
            'LZ4 is fast algorithm',
            'Transparent to applications',
            'macOS uses this'
        ],

        unlocks: 'ram-16-copy-on-write'
    },

    // ========== EXPERT LEVELS (16-20) ==========
    {
        id: 'ram-16-copy-on-write',
        title: 'Copy-on-Write (COW)',
        difficulty: 'expert',
        estimatedTime: '35 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement COW for fork() system call',
            challenge: 'Share pages until modification!',
            requirements: [
                'Shared pages after fork',
                'Copy pages on write',
                'Write fault handling',
                'Memory savings > 70%'
            ]
        },

        constraints: {
            requiredMetrics: {
                memorySavings: { min: 70 },
                writeFaults: { min: 1 }
            }
        },

        starRating: {
            3: { memorySavings: { min: 90 } },
            2: { memorySavings: { min: 80 } },
            1: { memorySavings: { min: 70 } }
        },

        hints: [
            'Share pages between parent/child',
            'Mark pages read-only',
            'Copy on first write',
            'Unix fork uses COW'
        ],

        unlocks: 'ram-17-ksm'
    },

    {
        id: 'ram-17-ksm',
        title: 'Kernel Samepage Merging',
        difficulty: 'expert',
        estimatedTime: '40 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement KSM to deduplicate identical pages',
            challenge: 'Find and merge duplicate pages!',
            requirements: [
                'Scan pages for duplicates',
                'Merge identical pages',
                'Handle writes to merged pages',
                'Memory savings > 30%'
            ]
        },

        constraints: {
            requiredComponents: ['ksm-scanner'],
            requiredMetrics: {
                memorySavings: { min: 30 },
                duplicatesFound: { min: 10 }
            }
        },

        starRating: {
            3: { memorySavings: { min: 50 }, duplicatesFound: { min: 20 } },
            2: { memorySavings: { min: 40 }, duplicatesFound: { min: 15 } },
            1: { memorySavings: { min: 30 }, duplicatesFound: { min: 10 } }
        },

        hints: [
            'VMs often have identical pages',
            'Hash pages to find duplicates',
            'Use COW for merged pages',
            'Linux KVM uses this'
        ],

        unlocks: 'ram-18-balloon'
    },

    {
        id: 'ram-18-balloon',
        title: 'Memory Ballooning',
        difficulty: 'expert',
        estimatedTime: '40 min',
        module: 'ram-simulator',

        objective: {
            description: 'Implement VM memory ballooning',
            challenge: 'Reclaim memory from VMs dynamically!',
            requirements: [
                'Balloon driver in guest',
                'Inflate to reclaim 20% memory',
                'Deflate on demand',
                'No guest performance drop > 10%'
            ]
        },

        constraints: {
            requiredComponents: ['balloon-driver'],
            requiredMetrics: {
                memoryReclaimed: { min: 20 },
                performanceDrop: { max: 10 }
            }
        },

        starRating: {
            3: { memoryReclaimed: { min: 40 }, performanceDrop: { max: 5 } },
            2: { memoryReclaimed: { min: 30 }, performanceDrop: { max: 7 } },
            1: { memoryReclaimed: { min: 20 }, performanceDrop: { max: 10 } }
        },

        hints: [
            'Balloon inflates to claim pages',
            'Guest thinks it has less RAM',
            'Hypervisor reclaims pages',
            'VMware uses this'
        ],

        unlocks: 'ram-19-persistent-memory'
    },

    {
        id: 'ram-19-persistent-memory',
        title: 'Persistent Memory (PMEM)',
        difficulty: 'expert',
        estimatedTime: '45 min',
        module: 'ram-simulator',

        objective: {
            description: 'Integrate persistent memory (Intel Optane)',
            challenge: 'Byte-addressable persistent storage!',
            requirements: [
                'Add PMEM device',
                'DAX (Direct Access) mode',
                'Flush/fence for durability',
                'Persistent data structures'
            ]
        },

        constraints: {
            requiredComponents: ['pmem-device', 'dax-mapping'],
            requiredMetrics: {
                persistentOps: { min: 100 },
                flushLatency: { max: 300 }
            }
        },

        starRating: {
            3: { flushLatency: { max: 200 } },
            2: { flushLatency: { max: 250 } },
            1: { flushLatency: { max: 300 } }
        },

        hints: [
            'PMEM = non-volatile + byte-addressable',
            'DAX bypasses page cache',
            'Need explicit flush/fence',
            'Databases love PMEM'
        ],

        unlocks: 'ram-20-ultimate'
    },

    {
        id: 'ram-20-ultimate',
        title: 'The Ultimate Memory System',
        difficulty: 'expert',
        estimatedTime: '60 min',
        module: 'ram-simulator',

        objective: {
            description: 'Build comprehensive modern memory system',
            challenge: 'MASTER ALL MEMORY MANAGEMENT!',
            requirements: [
                'Multi-level paging',
                'TLB with huge pages',
                'LRU page replacement',
                'NUMA awareness',
                'Memory compression',
                'Copy-on-write',
                'Page buffering'
            ]
        },

        constraints: {
            minComponents: 15,
            requiredComponents: [
                'page-table', 'tlb-huge', 'lru-engine',
                'numa-allocator', 'compression-engine',
                'cow-handler', 'page-buffer'
            ],
            requiredMetrics: {
                tlbHitRate: { min: 95 },
                pageFaultRate: { max: 5 },
                localMemoryRatio: { min: 85 },
                memoryUtilization: { min: 90 },
                compressionRatio: { min: 2 }
            }
        },

        starRating: {
            3: {
                tlbHitRate: { min: 98 },
                pageFaultRate: { max: 2 },
                localMemoryRatio: { min: 95 },
                memoryUtilization: { min: 95 },
                compressionRatio: { min: 3 },
                hint: '⭐⭐⭐ PERFECT! Memory wizard!'
            },
            2: {
                tlbHitRate: { min: 96 },
                pageFaultRate: { max: 3 },
                localMemoryRatio: { min: 90 },
                memoryUtilization: { min: 92 },
                compressionRatio: { min: 2.5 },
                hint: '⭐⭐ Excellent! Nearly perfect!'
            },
            1: {
                tlbHitRate: { min: 95 },
                pageFaultRate: { max: 5 },
                localMemoryRatio: { min: 85 },
                memoryUtilization: { min: 90 },
                compressionRatio: { min: 2 },
                hint: '⭐ Great! All systems go!'
            }
        },

        hints: [
            'Integrate all techniques',
            'Balance performance and overhead',
            'Real OS does all of this',
            'You are a memory expert now!'
        ],

        unlocks: null // Final level
    }
];

export default RAM_SIMULATOR_LEVELS;
