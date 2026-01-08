/**
 * Unit Tests for TLB (Translation Lookaside Buffer)
 * Based on README.md validation requirements
 */

describe('TLB (Translation Lookaside Buffer)', () => {
    describe('Basic Functionality', () => {
        test('should initialize with correct parameters', () => {
            const tlb = createTLB({
                size: 64,
                associativity: 4, // 4-way set associative
                replacementPolicy: 'LRU'
            });

            expect(tlb.size).toBe(64);
            expect(tlb.associativity).toBe(4);
            const numSets = 64 / 4; // 16 sets
            expect(tlb.numSets).toBe(16);
        });

        test('should handle page translation', () => {
            const tlb = createTLB({ size: 64, associativity: 4 });

            const virtualPage = 42;
            const physicalFrame = 100;

            // First access - TLB miss
            let result = tlb.lookup(virtualPage);
            expect(result.hit).toBe(false);
            expect(result.physicalFrame).toBeNull();

            // Add mapping
            tlb.insert(virtualPage, physicalFrame);

            // Second access - TLB hit
            result = tlb.lookup(virtualPage);
            expect(result.hit).toBe(true);
            expect(result.physicalFrame).toBe(physicalFrame);
        });
    });

    describe('Hit Rate with Locality', () => {
        test('should achieve >95% hit rate with sequential access', () => {
            const tlb = createTLB({ size: 64, associativity: 4 });
            const pageSize = 4096; // 4KB pages

            // Simulate array access (high temporal & spatial locality)
            for (let i = 0; i < 1000; i++) {
                const virtualAddress = i * 4; // 4-byte integers
                const virtualPage = Math.floor(virtualAddress / pageSize);

                let result = tlb.lookup(virtualPage);
                if (!result.hit) {
                    // Simulate page table walk
                    const physicalFrame = virtualPage + 1000; // Arbitrary mapping
                    tlb.insert(virtualPage, physicalFrame);
                }
            }

            const hitRate = (tlb.hits / tlb.accesses) * 100;
            expect(hitRate).toBeGreaterThan(95);
        });

        test('should perform poorly with random access', () => {
            const tlb = createTLB({ size: 64, associativity: 4 });

            // Random access pattern (poor locality)
            for (let i = 0; i < 1000; i++) {
                const randomPage = Math.floor(Math.random() * 10000);

                let result = tlb.lookup(randomPage);
                if (!result.hit) {
                    const physicalFrame = randomPage + 1000;
                    tlb.insert(randomPage, physicalFrame);
                }
            }

            const hitRate = (tlb.hits / tlb.accesses) * 100;
            expect(hitRate).toBeLessThan(20);
        });
    });

    describe('Set-Associative Organization', () => {
        test('should map pages to correct sets', () => {
            const tlb = createTLB({ size: 64, associativity: 4 });
            const numSets = 64 / 4; // 16 sets

            // Pages that map to same set
            const page1 = 0;           // Set 0
            const page2 = numSets;     // Set 0 (wraps around)
            const page3 = numSets * 2; // Set 0

            tlb.insert(page1, 100);
            tlb.insert(page2, 200);
            tlb.insert(page3, 300);

            // All should be in TLB (3 ways of set 0 used)
            expect(tlb.lookup(page1).hit).toBe(true);
            expect(tlb.lookup(page2).hit).toBe(true);
            expect(tlb.lookup(page3).hit).toBe(true);
        });

        test('should handle set conflicts with LRU', () => {
            const tlb = createTLB({ size: 64, associativity: 4 });
            const numSets = 64 / 4;

            // Fill all 4 ways of set 0
            const set0Pages = [0, numSets, numSets * 2, numSets * 3];
            set0Pages.forEach((page, idx) => {
                tlb.insert(page, 100 + idx);
            });

            // Touch first 3 to make them more recently used
            tlb.lookup(set0Pages[0]);
            tlb.lookup(set0Pages[1]);
            tlb.lookup(set0Pages[2]);

            // Insert new page to set 0 - should evict page3 (LRU)
            const newPage = numSets * 4;
            tlb.insert(newPage, 999);

            expect(tlb.lookup(set0Pages[0]).hit).toBe(true);
            expect(tlb.lookup(set0Pages[1]).hit).toBe(true);
            expect(tlb.lookup(set0Pages[2]).hit).toBe(true);
            expect(tlb.lookup(set0Pages[3]).hit).toBe(false); // Evicted
            expect(tlb.lookup(newPage).hit).toBe(true);
        });
    });

    describe('ASID (Address Space ID) Support', () => {
        test('should avoid flushes on context switch with ASID', () => {
            const tlb = createTLB({ size: 64, associativity: 4, asidSupport: true });

            // Process 1 mappings
            tlb.insert(0, 100, { asid: 1 });
            tlb.insert(1, 101, { asid: 1 });

            // Process 2 mappings (same virtual pages)
            tlb.insert(0, 200, { asid: 2 });
            tlb.insert(1, 201, { asid: 2 });

            // Lookup for process 1
            expect(tlb.lookup(0, { asid: 1 }).physicalFrame).toBe(100);
            expect(tlb.lookup(1, { asid: 1 }).physicalFrame).toBe(101);

            // Lookup for process 2
            expect(tlb.lookup(0, { asid: 2 }).physicalFrame).toBe(200);
            expect(tlb.lookup(1, { asid: 2 }).physicalFrame).toBe(201);
        });
    });

    describe('Performance Metrics', () => {
        test('should calculate hit rate correctly', () => {
            const tlb = createTLB({ size: 64, associativity: 4 });

            // 7 hits, 3 misses
            tlb.insert(0, 100);
            tlb.lookup(0); // hit
            tlb.lookup(0); // hit
            tlb.lookup(1); // miss
            tlb.insert(1, 101);
            tlb.lookup(1); // hit
            tlb.lookup(0); // hit
            tlb.lookup(2); // miss

            expect(tlb.hits).toBe(4);
            expect(tlb.misses).toBe(2); // Only 2 misses (lookup 1 and lookup 2)
            expect(tlb.accesses).toBe(6); // 6 lookups total (insert doesn't count)
            expect(tlb.getHitRate()).toBeCloseTo(66.67, 1); // 4/6 = 66.67%
        });
    });
});

/**
 * Helper: Create TLB simulator
 */
function createTLB(config) {
    const { size, associativity, replacementPolicy = 'LRU', asidSupport = false } = config;
    const numSets = size / associativity;

    const tlb = {
        size,
        associativity,
        numSets,
        asidSupport,

        sets: Array(numSets).fill(null).map(() => ({
            ways: Array(associativity).fill(null).map(() => ({
                valid: false,
                virtualPage: 0,
                physicalFrame: 0,
                asid: 0,
                lastAccess: 0
            }))
        })),

        hits: 0,
        misses: 0,
        accesses: 0,

        lookup(virtualPage, options = {}) {
            this.accesses++;
            const asid = options.asid || 0;

            const setIndex = virtualPage % this.numSets;
            const set = this.sets[setIndex];

            // Search for matching entry
            for (let way of set.ways) {
                if (way.valid && way.virtualPage === virtualPage) {
                    // If ASID support, check ASID match
                    if (this.asidSupport && way.asid !== asid) {
                        continue;
                    }

                    way.lastAccess = this.accesses;
                    this.hits++;
                    return {
                        hit: true,
                        physicalFrame: way.physicalFrame
                    };
                }
            }

            this.misses++;
            return {
                hit: false,
                physicalFrame: null
            };
        },

        insert(virtualPage, physicalFrame, options = {}) {
            const asid = options.asid || 0;
            const setIndex = virtualPage % this.numSets;
            const set = this.sets[setIndex];

            // Look for invalid way first
            let victimWay = -1;
            for (let i = 0; i < set.ways.length; i++) {
                if (!set.ways[i].valid) {
                    victimWay = i;
                    break;
                }
            }

            // If all valid, use LRU
            if (victimWay === -1) {
                let oldestAccess = Infinity;
                for (let i = 0; i < set.ways.length; i++) {
                    if (set.ways[i].lastAccess < oldestAccess) {
                        oldestAccess = set.ways[i].lastAccess;
                        victimWay = i;
                    }
                }
            }

            // Insert
            set.ways[victimWay].valid = true;
            set.ways[victimWay].virtualPage = virtualPage;
            set.ways[victimWay].physicalFrame = physicalFrame;
            set.ways[victimWay].asid = asid;
            set.ways[victimWay].lastAccess = this.accesses;
        },

        getHitRate() {
            return this.accesses > 0 ? (this.hits / this.accesses) * 100 : 0;
        },

        flush(asid = null) {
            if (asid === null) {
                // Flush all
                this.sets.forEach(set => {
                    set.ways.forEach(way => way.valid = false);
                });
            } else {
                // Flush specific ASID
                this.sets.forEach(set => {
                    set.ways.forEach(way => {
                        if (way.valid && way.asid === asid) {
                            way.valid = false;
                        }
                    });
                });
            }
        }
    };

    return tlb;
}

export { createTLB };
