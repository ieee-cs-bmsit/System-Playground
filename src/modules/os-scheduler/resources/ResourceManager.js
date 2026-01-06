/**
 * Resource Management System
 * Handles shared resources (Memory, I/O Devices, Mutexes)
 */

export class Resource {
    constructor(id, type, capacity = 1) {
        this.id = id;
        this.type = type; // 'memory', 'io', 'mutex', 'semaphore'
        this.capacity = capacity;
        this.allocated = 0;
        this.holders = []; // Processes currently holding this resource
        this.waitQueue = []; // Processes waiting for this resource
    }

    /**
     * Request resource allocation
     */
    request(process, amount = 1) {
        if (this.allocated + amount <= this.capacity) {
            // Resource available
            this.allocated += amount;
            this.holders.push({ process, amount });
            return { success: true, granted: amount };
        } else {
            // Resource unavailable - add to wait queue
            this.waitQueue.push({ process, amount });
            return { success: false, queued: true };
        }
    }

    /**
     * Release resource
     */
    release(process, amount = 1) {
        const holderIndex = this.holders.findIndex(h => h.process.id === process.id);

        if (holderIndex !== -1) {
            this.holders.splice(holderIndex, 1);
            this.allocated -= amount;

            // Try to satisfy waiting processes
            this.satisfyWaitQueue();
            return true;
        }

        return false;
    }

    /**
     * Try to allocate to waiting processes
     */
    satisfyWaitQueue() {
        let i = 0;
        while (i < this.waitQueue.length) {
            const { process, amount } = this.waitQueue[i];

            if (this.allocated + amount <= this.capacity) {
                this.allocated += amount;
                this.holders.push({ process, amount });
                this.waitQueue.splice(i, 1);

                // Notify process that resource is available
                process.state = 'READY';
            } else {
                i++;
            }
        }
    }

    /**
     * Check if process holds this resource
     */
    isHeldBy(process) {
        return this.holders.some(h => h.process.id === process.id);
    }

    /**
     * Get allocation info
     */
    getInfo() {
        return {
            id: this.id,
            type: this.type,
            capacity: this.capacity,
            allocated: this.allocated,
            available: this.capacity - this.allocated,
            holderCount: this.holders.length,
            waitQueueLength: this.waitQueue.length
        };
    }
}

export class ResourceManager {
    constructor() {
        this.resources = new Map();
    }

    /**
     * Register a new resource
     */
    registerResource(id, type, capacity = 1) {
        const resource = new Resource(id, type, capacity);
        this.resources.set(id, resource);
        return resource;
    }

    /**
     * Get resource by ID
     */
    getResource(id) {
        return this.resources.get(id);
    }

    /**
     * Detect deadlock using cycle detection in Resource Allocation Graph
     */
    detectDeadlock(processes) {
        const graph = this.buildRAG(processes);
        return this.hasCycle(graph);
    }

    /**
     * Build Resource Allocation Graph (RAG)
     */
    buildRAG(processes) {
        const graph = new Map();

        // Initialize graph nodes
        processes.forEach(p => graph.set(`P${p.id}`, []));
        this.resources.forEach((res, id) => graph.set(`R${id}`, []));

        // Add edges: Process -> Resource (request) and Resource -> Process (allocation)
        this.resources.forEach((resource, resId) => {
            // Allocation edges: Resource -> Process
            resource.holders.forEach(({ process }) => {
                const resNode = `R${resId}`;
                const procNode = `P${process.id}`;
                if (!graph.get(resNode)) graph.set(resNode, []);
                graph.get(resNode).push(procNode);
            });

            // Request edges: Process -> Resource
            resource.waitQueue.forEach(({ process }) => {
                const procNode = `P${process.id}`;
                const resNode = `R${resId}`;
                if (!graph.get(procNode)) graph.set(procNode, []);
                graph.get(procNode).push(resNode);
            });
        });

        return graph;
    }

    /**
     * Detect cycle in directed graph (DFS-based)
     */
    hasCycle(graph) {
        const visited = new Set();
        const recStack = new Set();

        const dfs = (node) => {
            visited.add(node);
            recStack.add(node);

            const neighbors = graph.get(node) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (recStack.has(neighbor)) {
                    // Cycle detected!
                    return true;
                }
            }

            recStack.delete(node);
            return false;
        };

        for (const node of graph.keys()) {
            if (!visited.has(node)) {
                if (dfs(node)) return true;
            }
        }

        return false;
    }

    /**
     * Get deadlocked processes
     */
    getDeadlockedProcesses(processes) {
        if (!this.detectDeadlock(processes)) return [];

        const graph = this.buildRAG(processes);
        const deadlockedNodes = new Set();
        const visited = new Set();
        const recStack = new Set();

        const dfs = (node, path = []) => {
            visited.add(node);
            recStack.add(node);
            path.push(node);

            const neighbors = graph.get(node) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    dfs(neighbor, path);
                } else if (recStack.has(neighbor)) {
                    // Found cycle - mark all nodes in cycle
                    const cycleStart = path.indexOf(neighbor);
                    path.slice(cycleStart).forEach(n => deadlockedNodes.add(n));
                }
            }

            recStack.delete(node);
        };

        for (const node of graph.keys()) {
            if (!visited.has(node)) {
                dfs(node);
            }
        }

        // Extract process IDs from deadlocked nodes
        return Array.from(deadlockedNodes)
            .filter(node => node.startsWith('P'))
            .map(node => node.substring(1));
    }

    /**
     * Recover from deadlock by terminating a process
     */
    recoverFromDeadlock(processes) {
        const deadlockedPids = this.getDeadlockedProcesses(processes);

        if (deadlockedPids.length === 0) return null;

        // Simple recovery: terminate process with lowest priority
        const deadlockedProcesses = processes.filter(p =>
            deadlockedPids.includes(p.id)
        );

        const victim = deadlockedProcesses.reduce((min, p) =>
            p.priority < min.priority ? p : min
        );

        // Release all resources held by victim
        this.resources.forEach(resource => {
            resource.release(victim);
        });

        victim.state = 'TERMINATED';
        return victim;
    }

    /**
     * Get all resource info
     */
    getAllResourceInfo() {
        const info = [];
        this.resources.forEach(res => {
            info.push(res.getInfo());
        });
        return info;
    }
}
