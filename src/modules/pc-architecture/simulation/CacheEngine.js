/**
 * Cache Memory Hierarchy Simulation
 * L1, L2, L3 caches with hit/miss tracking
 */

export class CacheLine {
    constructor() {
        this.valid = false;
        this.tag = null;
        this.data = null;
        this.dirty = false;
        this.lruCounter = 0;
    }
}

export class Cache {
    constructor(level, size, lineSize, associativity, accessTime) {
        this.level = level; // L1, L2, L3
        this.size = size; // bytes
        this.lineSize = lineSize; // bytes per line
        this.associativity = associativity; // ways (1=direct, N=N-way set associative)
        this.accessTime = accessTime; // cycles

        // Calculate cache organization
        this.numLines = Math.floor(size / lineSize);
        this.numSets = Math.floor(this.numLines / associativity);

        // Initialize cache lines
        this.sets = [];
        for (let i = 0; i < this.numSets; i++) {
            this.sets[i] = [];
            for (let j = 0; j < associativity; j++) {
                this.sets[i][j] = new CacheLine();
            }
        }

        // Statistics
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
        this.writebacks = 0;
    }

    getSetIndex(address) {
        const blockNumber = Math.floor(address / this.lineSize);
        return blockNumber % this.numSets;
    }

    getTag(address) {
        const blockNumber = Math.floor(address / this.lineSize);
        return Math.floor(blockNumber / this.numSets);
    }

    read(address) {
        const setIndex = this.getSetIndex(address);
        const tag = this.getTag(address);
        const set = this.sets[setIndex];

        // Check for hit
        for (let i = 0; i < this.associativity; i++) {
            const line = set[i];
            if (line.valid && line.tag === tag) {
                // HIT!
                this.hits++;
                line.lruCounter = 0; // Mark as most recently used

                // Age other lines
                for (let j = 0; j < this.associativity; j++) {
                    if (i !== j && set[j].valid) {
                        set[j].lruCounter++;
                    }
                }

                return {
                    hit: true,
                    data: line.data,
                    latency: this.accessTime
                };
            }
        }

        // MISS!
        this.misses++;
        return {
            hit: false,
            latency: this.accessTime
        };
    }

    write(address, data) {
        const setIndex = this.getSetIndex(address);
        const tag = this.getTag(address);
        const set = this.sets[setIndex];

        // Check for hit
        for (let i = 0; i < this.associativity; i++) {
            const line = set[i];
            if (line.valid && line.tag === tag) {
                // Write hit
                this.hits++;
                line.data = data;
                line.dirty = true; // Mark for writeback
                line.lruCounter = 0;

                // Age other lines
                for (let j = 0; j < this.associativity; j++) {
                    if (i !== j && set[j].valid) {
                        set[j].lruCounter++;
                    }
                }

                return {
                    hit: true,
                    latency: this.accessTime
                };
            }
        }

        // Write miss
        this.misses++;
        return {
            hit: false,
            latency: this.accessTime
        };
    }

    install(address, data) {
        const setIndex = this.getSetIndex(address);
        const tag = this.getTag(address);
        const set = this.sets[setIndex];

        // Find invalid line or LRU line
        let victimIndex = -1;
        let maxLRU = -1;

        for (let i = 0; i < this.associativity; i++) {
            if (!set[i].valid) {
                victimIndex = i;
                break;
            }
            if (set[i].lruCounter > maxLRU) {
                maxLRU = set[i].lruCounter;
                victimIndex = i;
            }
        }

        const victim = set[victimIndex];

        // Evict if valid
        if (victim.valid) {
            this.evictions++;
            if (victim.dirty) {
                this.writebacks++;
            }
        }

        // Install new line
        victim.valid = true;
        victim.tag = tag;
        victim.data = data;
        victim.dirty = false;
        victim.lruCounter = 0;

        // Age other lines
        for (let i = 0; i < this.associativity; i++) {
            if (i !== victimIndex && set[i].valid) {
                set[i].lruCounter++;
            }
        }
    }

    getHitRate() {
        const total = this.hits + this.misses;
        return total > 0 ? (this.hits / total) * 100 : 0;
    }

    getMissRate() {
        const total = this.hits + this.misses;
        return total > 0 ? (this.misses / total) * 100 : 0;
    }
}

export class CacheHierarchy {
    constructor() {
        // L1: 32KB, 64B lines, 8-way, 4 cycles
        this.l1 = new Cache('L1', 32 * 1024, 64, 8, 4);

        // L2: 256KB, 64B lines, 8-way, 12 cycles
        this.l2 = new Cache('L2', 256 * 1024, 64, 8, 12);

        // L3: 8MB, 64B lines, 16-way, 40 cycles
        this.l3 = new Cache('L3', 8 * 1024 * 1024, 64, 16, 40);

        this.totalAccesses = 0;
        this.totalLatency = 0;
    }

    access(address, type = 'read', data = null) {
        this.totalAccesses++;
        let totalLatency = 0;

        // Try L1
        const l1Result = type === 'read' ? this.l1.read(address) : this.l1.write(address, data);
        totalLatency += l1Result.latency;

        if (l1Result.hit) {
            this.totalLatency += totalLatency;
            return {
                level: 'L1',
                latency: totalLatency,
                data: l1Result.data
            };
        }

        // L1 miss, try L2
        const l2Result = this.l2.read(address);
        totalLatency += l2Result.latency;

        if (l2Result.hit) {
            // Install in L1
            this.l1.install(address, l2Result.data);
            this.totalLatency += totalLatency;
            return {
                level: 'L2',
                latency: totalLatency,
                data: l2Result.data
            };
        }

        // L2 miss, try L3
        const l3Result = this.l3.read(address);
        totalLatency += l3Result.latency;

        if (l3Result.hit) {
            // Install in L2 and L1
            this.l2.install(address, l3Result.data);
            this.l1.install(address, l3Result.data);
            this.totalLatency += totalLatency;
            return {
                level: 'L3',
                latency: totalLatency,
                data: l3Result.data
            };
        }

        // L3 miss - fetch from memory (100 cycles)
        totalLatency += 100;
        const memData = data || `data_${address}`;

        // Install in all levels
        this.l3.install(address, memData);
        this.l2.install(address, memData);
        this.l1.install(address, memData);

        this.totalLatency += totalLatency;
        return {
            level: 'RAM',
            latency: totalLatency,
            data: memData
        };
    }

    getAverageLatency() {
        return this.totalAccesses > 0
            ? this.totalLatency / this.totalAccesses
            : 0;
    }
}
