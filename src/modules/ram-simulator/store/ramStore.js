import { create } from 'zustand';
import { PhysicalMemory, PageTable, TLB } from '../simulation/MemoryEngine';

const useRAMStore = create((set, get) => ({
    // Time
    currentTick: 0,
    isRunning: false,

    // Memory Components
    physicalRAM: null,
    pageTable: null,
    tlb: null,

    // Processes
    processes: [],

    // Memory Accesses
    accessHistory: [],

    // Metrics
    metrics: {
        // Memory Usage
        totalRAM: 0,
        usedRAM: 0,
        freeRAM: 0,

        // Paging Stats
        pageFaults: 0,
        pageHits: 0,
        pageFaultRate: 0,

        // TLB Stats
        tlbHits: 0,
        tlbMisses: 0,
        tlbHitRate: 0,

        // Performance
        avgAccessTime: 0,
        effectiveAccessTime: 0,

        // Replacement
        evictions: 0,
        diskWrites: 0
    },

    // Actions
    initializeMemory: (ramSize = 16 * 1024 * 1024, pageSize = 4096) => {
        const ram = new PhysicalMemory(ramSize, pageSize);
        const pages = Math.floor(ramSize / pageSize) * 4; // Virtual space 4x physical
        const pageTable = new PageTable(pages);
        const tlb = new TLB(64, 4);

        set({
            physicalRAM: ram,
            pageTable,
            tlb,
            metrics: {
                ...get().metrics,
                totalRAM: ramSize,
                freeRAM: ramSize
            }
        });
    },

    accessMemory: (virtualAddress) => {
        const state = get();
        if (!state.physicalRAM || !state.pageTable || !state.tlb) return;

        const pageSize = state.physicalRAM.pageSize;
        const virtualPage = Math.floor(virtualAddress / pageSize);
        const offset = virtualAddress % pageSize;

        let accessTime = 0;

        // 1. Check TLB
        const tlbResult = state.tlb.lookup(virtualPage);

        if (tlbResult.hit) {
            // TLB Hit - fast path
            accessTime = 1 + 10; // 1ns TLB + 10ns RAM
            set(state => ({
                metrics: {
                    ...state.metrics,
                    tlbHits: state.metrics.tlbHits + 1,
                    pageHits: state.metrics.pageHits + 1
                }
            }));
        } else {
            // TLB Miss - check page table
            accessTime = 1 + 10 + 10; // TLB + Page Table + RAM

            const pageResult = state.pageTable.translate(virtualPage);

            if (pageResult.pageFault) {
                // Page Fault!
                accessTime += 1000000; // 1ms disk access

                // Allocate new frame
                const frame = state.physicalRAM.allocateFrame();

                if (frame >= 0) {
                    state.pageTable.map(virtualPage, frame);
                    state.tlb.insert(virtualPage, frame);
                }

                set(state => ({
                    metrics: {
                        ...state.metrics,
                        tlbMisses: state.metrics.tlbMisses + 1,
                        pageFaults: state.metrics.pageFaults + 1
                    }
                }));
            } else {
                // Page table hit, update TLB
                state.tlb.insert(virtualPage, pageResult.frameNumber);

                set(state => ({
                    metrics: {
                        ...state.metrics,
                        tlbMisses: state.metrics.tlbMisses + 1,
                        pageHits: state.metrics.pageHits + 1
                    }
                }));
            }
        }

        // Update metrics
        const totalAccesses = get().metrics.pageHits + get().metrics.pageFaults;
        const tlbTotal = get().metrics.tlbHits + get().metrics.tlbMisses;

        set(state => ({
            accessHistory: [...state.accessHistory.slice(-99), { virtualAddress, accessTime }],
            metrics: {
                ...state.metrics,
                pageFaultRate: totalAccesses > 0 ? (state.metrics.pageFaults / totalAccesses) * 100 : 0,
                tlbHitRate: tlbTotal > 0 ? (state.metrics.tlbHits / tlbTotal) * 100 : 0,
                avgAccessTime: accessTime
            }
        }));
    },

    // Simulation control
    play: () => set({ isRunning: true }),
    pause: () => set({ isRunning: false }),

    reset: () => {
        get().initializeMemory();
        set({
            currentTick: 0,
            isRunning: false,
            processes: [],
            accessHistory: [],
            metrics: {
                totalRAM: get().physicalRAM?.size || 0,
                usedRAM: 0,
                freeRAM: get().physicalRAM?.size || 0,
                pageFaults: 0,
                pageHits: 0,
                pageFaultRate: 0,
                tlbHits: 0,
                tlbMisses: 0,
                tlbHitRate: 0,
                avgAccessTime: 0,
                effectiveAccessTime: 0,
                evictions: 0,
                diskWrites: 0
            }
        });
    },

    tick: () => {
        if (!get().isRunning) return;

        // Simulate random memory access
        const virtualAddress = Math.floor(Math.random() * (16 * 1024 * 1024));
        get().accessMemory(virtualAddress);

        set(state => ({ currentTick: state.currentTick + 1 }));
    }
}));

export default useRAMStore;
