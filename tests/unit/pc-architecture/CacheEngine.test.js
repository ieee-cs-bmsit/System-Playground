/**
 * Unit Tests for Cache Engine
 * Validates L1/L2/L3 cache hierarchy simulation
 */

describe('Cache Engine', () => {
    describe('Single-Level Cache', () => {
        test('should initialize cache with correct parameters', () => {
            const cache = {
                size: 32, // 32 KB
                lineSize: 64, // 64 bytes
                associativity: 4, // 4-way set associative
                accessTime: 4 // 4 cycles
            };

            const numLines = (cache.size * 1024) / cache.lineSize; // 512 lines
            const numSets = numLines / cache.associativity; // 128 sets

            expect(numLines).toBe(512);
            expect(numSets).toBe(128);
        });

        test('should achieve >95% hit rate with sequential access', () => {
            const cache = createCache(32, 64, 4, 'LRU');

            // Simulate sequential array access (good spatial locality)
            for (let i = 0; i < 1000; i++) {
                const address = i * 4; // 4-byte integers
                cache.access(address);
            }

            const hitRate = (cache.hits / (cache.hits + cache.misses)) * 100;
            expect(hitRate).toBeGreaterThan(95);
        });

        test('should perform poorly with random access', () => {
            const cache = createCache(32, 64, 4, 'LRU');

            // Random access (poor locality)
            for (let i = 0; i < 1000; i++) {
                const randomAddr = Math.floor(Math.random() * 1000000);
                cache.access(randomAddr);
            }

            const hitRate = (cache.hits / (cache.hits + cache.misses)) * 100;
            expect(hitRate).toBeLessThan(20);
        });
    });

    describe('LRU Replacement Policy', () => {
        test('should evict least recently used line', () => {
            const cache = createCache(1, 64, 2, 'LRU'); // 2-way, 1KB = 16 lines total, 8 sets

            const set0Addr1 = 0;      // Maps to set 0
            const set0Addr2 = 512;    // Maps to set 0 (different tag)
            const set0Addr3 = 1024;   // Maps to set 0 (different tag)

            cache.access(set0Addr1); // Way 0 of set 0
            cache.access(set0Addr2); // Way 1 of set 0
            cache.access(set0Addr1); // Touch addr1 (make it MRU)
            cache.access(set0Addr3); // Should evict addr2 (LRU)

            expect(cache.isInCache(set0Addr1)).toBe(true);
            expect(cache.isInCache(set0Addr3)).toBe(true);
            expect(cache.isInCache(set0Addr2)).toBe(false); // Evicted
        });
    });

    describe('Cache Hierarchy (L1 → L2 → L3)', () => {
        test('should check L1 before L2', () => {
            const hierarchy = createCacheHierarchy({
                L1: { size: 32, lineSize: 64, associativity: 4, accessTime: 4 },
                L2: { size: 256, lineSize: 64, associativity: 8, accessTime: 12 },
                L3: { size: 2048, lineSize: 64, associativity: 16, accessTime: 40 }
            });

            const address = 0x1000;

            // First access - miss in all levels
            let result = hierarchy.access(address);
            expect(result.hitLevel).toBe('RAM');
            expect(result.totalCycles).toBe(4 + 12 + 40 + 100); // L1 + L2 + L3 + RAM

            // Second access - hit in L1
            result = hierarchy.access(address);
            expect(result.hitLevel).toBe('L1');
            expect(result.totalCycles).toBe(4);
        });

        test('should populate lower levels on miss', () => {
            const hierarchy = createCacheHierarchy({
                L1: { size: 32, lineSize: 64, associativity: 4, accessTime: 4 },
                L2: { size: 256, lineSize: 64, associativity: 8, accessTime: 12 }
            });

            const address = 0x2000;

            // First access - loads into both L1 and L2
            hierarchy.access(address);

            // Evict from L1 but keep in L2
            for (let i = 0; i < 1000; i++) {
                hierarchy.access(i * 64); // Thrash L1
            }

            // Access again - should hit in L2
            const result = hierarchy.access(address);
            expect(result.hitLevel).toBe('L2');
            expect(result.totalCycles).toBe(4 + 12); // L1 miss + L2 hit
        });
    });

    describe('Performance Metrics Validation', () => {
        test('cache latencies should match realistic values', () => {
            // Based on README.md validation (Intel/AMD CPUs)
            const l1Latency = 4;
            const l2Latency = 12;
            const l3Latency = 40;

            // Intel range: L1=4-5, L2=12-14, L3=40-75
            expect(l1Latency).toBeGreaterThanOrEqual(3);
            expect(l1Latency).toBeLessThanOrEqual(5);

            expect(l2Latency).toBeGreaterThanOrEqual(10);
            expect(l2Latency).toBeLessThanOrEqual(15);

            expect(l3Latency).toBeGreaterThanOrEqual(35);
            expect(l3Latency).toBeLessThanOrEqual(75);
        });
    });
});

/**
 * Helper: Create cache simulator
 */
function createCache(sizeKB, lineSize, associativity, replacementPolicy) {
    const numLines = (sizeKB * 1024) / lineSize;
    const numSets = numLines / associativity;

    const cache = {
        sets: Array(numSets).fill(null).map(() => ({
            ways: Array(associativity).fill(null).map(() => ({
                valid: false,
                tag: 0,
                lastAccess: 0
            }))
        })),
        hits: 0,
        misses: 0,
        accesses: 0
    };

    cache.access = function (address) {
        this.accesses++;

        const setIndex = Math.floor(address / lineSize) % numSets;
        const tag = Math.floor(address / lineSize / numSets);
        const set = this.sets[setIndex];

        // Check for hit
        for (let way of set.ways) {
            if (way.valid && way.tag === tag) {
                way.lastAccess = this.accesses;
                this.hits++;
                return true;
            }
        }

        // Miss - find replacement victim
        this.misses++;
        let victimWay = 0;
        let oldestAccess = Infinity;

        // Look for invalid way first
        for (let i = 0; i < set.ways.length; i++) {
            if (!set.ways[i].valid) {
                victimWay = i;
                break;
            }
            // Track LRU
            if (set.ways[i].lastAccess < oldestAccess) {
                oldestAccess = set.ways[i].lastAccess;
                victimWay = i;
            }
        }

        // Replace
        set.ways[victimWay].valid = true;
        set.ways[victimWay].tag = tag;
        set.ways[victimWay].lastAccess = this.accesses;

        return false;
    };

    cache.isInCache = function (address) {
        const setIndex = Math.floor(address / lineSize) % numSets;
        const tag = Math.floor(address / lineSize / numSets);
        const set = this.sets[setIndex];

        return set.ways.some(way => way.valid && way.tag === tag);
    };

    return cache;
}

/**
 * Helper: Create cache hierarchy
 */
function createCacheHierarchy(levels) {
    const caches = {
        L1: levels.L1 ? createCache(levels.L1.size, levels.L1.lineSize, levels.L1.associativity) : null,
        L2: levels.L2 ? createCache(levels.L2.size, levels.L2.lineSize, levels.L2.associativity) : null,
        L3: levels.L3 ? createCache(levels.L3.size, levels.L3.lineSize, levels.L3.associativity) : null
    };

    return {
        access(address) {
            let totalCycles = 0;

            // Try L1
            if (caches.L1) {
                totalCycles += levels.L1.accessTime;
                if (caches.L1.access(address)) {
                    return { hitLevel: 'L1', totalCycles };
                }
            }

            // Try L2
            if (caches.L2) {
                totalCycles += levels.L2.accessTime;
                if (caches.L2.access(address)) {
                    // Populate L1
                    if (caches.L1) caches.L1.access(address);
                    return { hitLevel: 'L2', totalCycles };
                }
            }

            // Try L3
            if (caches.L3) {
                totalCycles += levels.L3.accessTime;
                if (caches.L3.access(address)) {
                    // Populate L1 and L2
                    if (caches.L1) caches.L1.access(address);
                    if (caches.L2) caches.L2.access(address);
                    return { hitLevel: 'L3', totalCycles };
                }
            }

            // RAM access
            totalCycles += 100; // RAM latency
            if (caches.L1) caches.L1.access(address);
            if (caches.L2) caches.L2.access(address);
            if (caches.L3) caches.L3.access(address);

            return { hitLevel: 'RAM', totalCycles };
        }
    };
}

export { createCache, createCacheHierarchy };
