/**
 * RAM Simulator - Memory Management Engine
 * Simulates paging, page tables, and TLB
 */

export class PhysicalMemory {
    constructor(size, pageSize = 4096) {
        this.size = size; // Total bytes
        this.pageSize = pageSize; // Bytes per page
        this.frames = Math.floor(size / pageSize);
        this.frameTable = new Array(this.frames).fill(null);
        this.freeFrames = this.frames;
    }

    allocateFrame() {
        for (let i = 0; i < this.frames; i++) {
            if (this.frameTable[i] === null) {
                this.frameTable[i] = { allocated: true, pid: null };
                this.freeFrames--;
                return i;
            }
        }
        return -1; // No free frames available
    }

    freeFrame(frameNumber) {
        if (frameNumber >= 0 && frameNumber < this.frames) {
            this.frameTable[frameNumber] = null;
            this.freeFrames++;
        }
    }

    getUtilization() {
        return ((this.frames - this.freeFrames) / this.frames) * 100;
    }
}

export class PageTableEntry {
    constructor() {
        this.frameNumber = -1;
        this.valid = false;
        this.dirty = false;
        this.referenced = false;
        this.timestamp = 0;
    }
}

export class PageTable {
    constructor(pages) {
        this.pages = pages;
        this.entries = new Array(pages).fill(null).map(() => new PageTableEntry());
        this.accessCounter = 0;
    }

    translate(virtualPage) {
        if (virtualPage < 0 || virtualPage >= this.pages) {
            return {
                pageFault: true,
                reason: 'INVALID_ADDRESS'
            };
        }

        const entry = this.entries[virtualPage];

        if (!entry.valid) {
            return {
                pageFault: true,
                reason: 'PAGE_NOT_IN_MEMORY'
            };
        }

        // Update reference info
        entry.referenced = true;
        entry.timestamp = this.accessCounter++;

        return {
            pageFault: false,
            frameNumber: entry.frameNumber,
            physicalAddress: entry.frameNumber
        };
    }

    map(virtualPage, frameNumber) {
        if (virtualPage >= 0 && virtualPage < this.pages) {
            const entry = this.entries[virtualPage];
            entry.frameNumber = frameNumber;
            entry.valid = true;
            entry.dirty = false;
            entry.referenced = true;
            entry.timestamp = this.accessCounter++;
        }
    }

    unmap(virtualPage) {
        if (virtualPage >= 0 && virtualPage < this.pages) {
            const entry = this.entries[virtualPage];
            entry.frameNumber = -1;
            entry.valid = false;
        }
    }

    setDirty(virtualPage) {
        if (virtualPage >= 0 && virtualPage < this.pages) {
            this.entries[virtualPage].dirty = true;
        }
    }
}

export class TLB {
    constructor(entries = 64, associativity = 4) {
        this.maxEntries = entries;
        this.associativity = associativity;
        this.cache = new Map(); // virtualPage -> frameNumber
        this.accessOrder = []; // For LRU

        this.hits = 0;
        this.misses = 0;
    }

    lookup(virtualPage) {
        if (this.cache.has(virtualPage)) {
            this.hits++;

            // Update LRU - move to end
            const index = this.accessOrder.indexOf(virtualPage);
            if (index > -1) {
                this.accessOrder.splice(index, 1);
            }
            this.accessOrder.push(virtualPage);

            return {
                hit: true,
                frameNumber: this.cache.get(virtualPage)
            };
        }

        this.misses++;
        return { hit: false };
    }

    insert(virtualPage, frameNumber) {
        // If cache is full, evict LRU entry
        if (this.cache.size >= this.maxEntries) {
            const lruPage = this.accessOrder.shift();
            this.cache.delete(lruPage);
        }

        this.cache.set(virtualPage, frameNumber);
        this.accessOrder.push(virtualPage);
    }

    flush() {
        this.cache.clear();
        this.accessOrder = [];
    }

    getHitRate() {
        const total = this.hits + this.misses;
        return total > 0 ? (this.hits / total) * 100 : 0;
    }
}

export class PageReplacement {
    constructor(algorithm = 'LRU') {
        this.algorithm = algorithm; // LRU, FIFO, CLOCK, OPTIMAL
        this.fifoQueue = [];
        this.clockHand = 0;
    }

    selectVictim(pageTable, futureAccesses = []) {
        switch (this.algorithm) {
            case 'FIFO':
                return this.fifo();
            case 'LRU':
                return this.lru(pageTable);
            case 'CLOCK':
                return this.clock(pageTable);
            case 'OPTIMAL':
                return this.optimal(pageTable, futureAccesses);
            default:
                return this.lru(pageTable);
        }
    }

    fifo() {
        if (this.fifoQueue.length > 0) {
            return this.fifoQueue.shift();
        }
        return -1;
    }

    lru(pageTable) {
        let lruPage = -1;
        let oldestTime = Infinity;

        for (let i = 0; i < pageTable.entries.length; i++) {
            const entry = pageTable.entries[i];
            if (entry.valid && entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                lruPage = i;
            }
        }

        return lruPage;
    }

    clock(pageTable) {
        let steps = 0;
        const maxSteps = pageTable.entries.length * 2;

        while (steps < maxSteps) {
            const entry = pageTable.entries[this.clockHand];

            if (entry.valid) {
                if (!entry.referenced) {
                    const victim = this.clockHand;
                    this.clockHand = (this.clockHand + 1) % pageTable.entries.length;
                    return victim;
                }
                entry.referenced = false;
            }

            this.clockHand = (this.clockHand + 1) % pageTable.entries.length;
            steps++;
        }

        return this.clockHand;
    }

    optimal(pageTable, futureAccesses) {
        let victimPage = -1;
        let farthestUse = -1;

        for (let i = 0; i < pageTable.entries.length; i++) {
            if (!pageTable.entries[i].valid) continue;

            const nextUse = futureAccesses.indexOf(i);

            if (nextUse === -1) {
                return i; // Never used again
            }

            if (nextUse > farthestUse) {
                farthestUse = nextUse;
                victimPage = i;
            }
        }

        return victimPage >= 0 ? victimPage : 0;
    }

    addToFIFO(page) {
        this.fifoQueue.push(page);
    }
}
