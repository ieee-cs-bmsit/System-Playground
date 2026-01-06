/**
 * Connection Validator
 * Ensures proper wiring between system components
 */

export class ConnectionValidator {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Main validation method
     */
    validate() {
        this.errors = [];
        this.warnings = [];

        this.validateGeneratorConnections();
        this.validateSchedulerConnections();
        this.validateCPUConnections();
        this.checkOrphanedNodes();
        this.checkDataFlowCompleteness();

        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings
        };
    }

    /**
     * Generators should connect to Scheduler
     */
    validateGeneratorConnections() {
        const generators = this.nodes.filter(n => n.type === 'generator');

        generators.forEach(gen => {
            const outgoingEdges = this.edges.filter(e => e.source === gen.id);

            if (outgoingEdges.length === 0) {
                this.warnings.push({
                    type: 'NO_CONNECTION',
                    node: gen.id,
                    message: `Generator ${gen.id} is not connected to any component`
                });
            } else {
                // Check if connected to scheduler
                const connectedToScheduler = outgoingEdges.some(e => {
                    const target = this.nodes.find(n => n.id === e.target);
                    return target && target.type === 'scheduler';
                });

                if (!connectedToScheduler) {
                    this.errors.push({
                        type: 'INVALID_CONNECTION',
                        node: gen.id,
                        message: `Generator ${gen.id} should connect to a Scheduler`
                    });
                }
            }
        });
    }

    /**
     * Scheduler should have incoming (from generators/processes) and outgoing (to CPUs)
     */
    validateSchedulerConnections() {
        const schedulers = this.nodes.filter(n => n.type === 'scheduler');

        if (schedulers.length === 0) {
            this.errors.push({
                type: 'MISSING_COMPONENT',
                message: 'No Scheduler found in the system'
            });
            return;
        }

        if (schedulers.length > 1) {
            this.warnings.push({
                type: 'MULTIPLE_SCHEDULERS',
                message: 'Multiple Schedulers detected. Only one is currently supported.'
            });
        }

        schedulers.forEach(scheduler => {
            const outgoingEdges = this.edges.filter(e => e.source === scheduler.id);

            if (outgoingEdges.length === 0) {
                this.errors.push({
                    type: 'NO_CPU_CONNECTION',
                    node: scheduler.id,
                    message: 'Scheduler must connect to at least one CPU'
                });
            }

            // Check if connected to CPUs
            const connectedToCPUs = outgoingEdges.filter(e => {
                const target = this.nodes.find(n => n.id === e.target);
                return target && target.type === 'cpu';
            });

            if (connectedToCPUs.length === 0) {
                this.errors.push({
                    type: 'INVALID_CPU_CONNECTION',
                    node: scheduler.id,
                    message: 'Scheduler connections must target CPU nodes'
                });
            }
        });
    }

    /**
     * CPUs should receive input from Scheduler
     */
    validateCPUConnections() {
        const cpus = this.nodes.filter(n => n.type === 'cpu');

        if (cpus.length === 0) {
            this.errors.push({
                type: 'MISSING_COMPONENT',
                message: 'No CPUs found in the system'
            });
            return;
        }

        cpus.forEach(cpu => {
            const incomingEdges = this.edges.filter(e => e.target === cpu.id);

            if (incomingEdges.length === 0) {
                this.warnings.push({
                    type: 'UNCONNECTED_CPU',
                    node: cpu.id,
                    message: `CPU ${cpu.id} has no incoming connections from Scheduler`
                });
            }
        });
    }

    /**
     * Check for nodes that aren't part of any connection
     */
    checkOrphanedNodes() {
        this.nodes.forEach(node => {
            const hasIncoming = this.edges.some(e => e.target === node.id);
            const hasOutgoing = this.edges.some(e => e.source === node.id);

            if (!hasIncoming && !hasOutgoing && node.type !== 'scheduler') {
                this.warnings.push({
                    type: 'ORPHANED_NODE',
                    node: node.id,
                    message: `${node.type} ${node.id} is not connected to the system`
                });
            }
        });
    }

    /**
     * Verify complete data flow path exists
     */
    checkDataFlowCompleteness() {
        const hasGenerator = this.nodes.some(n => n.type === 'generator');
        const hasScheduler = this.nodes.some(n => n.type === 'scheduler');
        const hasCPU = this.nodes.some(n => n.type === 'cpu');

        if (!hasGenerator) {
            this.warnings.push({
                type: 'NO_GENERATOR',
                message: 'No process generator. Add a Generator to spawn processes automatically.'
            });
        }

        if (!hasScheduler) {
            this.errors.push({
                type: 'NO_SCHEDULER',
                message: 'Critical: No Scheduler found. System cannot function.'
            });
        }

        if (!hasCPU) {
            this.errors.push({
                type: 'NO_CPU',
                message: 'Critical: No CPU found. Add at least one CPU to execute processes.'
            });
        }

        // Check complete path
        if (hasGenerator && hasScheduler && hasCPU) {
            const genToScheduler = this.edges.some(e => {
                const source = this.nodes.find(n => n.id === e.source);
                const target = this.nodes.find(n => n.id === e.target);
                return source?.type === 'generator' && target?.type === 'scheduler';
            });

            const schedulerToCPU = this.edges.some(e => {
                const source = this.nodes.find(n => n.id === e.source);
                const target = this.nodes.find(n => n.id === e.target);
                return source?.type === 'scheduler' && target?.type === 'cpu';
            });

            if (!genToScheduler || !schedulerToCPU) {
                this.errors.push({
                    type: 'INCOMPLETE_FLOW',
                    message: 'Data flow incomplete. Connect: Generator → Scheduler → CPU'
                });
            }
        }
    }

    /**
     * Get validation summary for UI display
     */
    getSummary() {
        return {
            totalNodes: this.nodes.length,
            totalEdges: this.edges.length,
            errorCount: this.errors.length,
            warningCount: this.warnings.length,
            status: this.errors.length === 0 ? 'VALID' : 'INVALID'
        };
    }
}

/**
 * Helper function for quick validation
 */
export function validateSystem(nodes, edges) {
    const validator = new ConnectionValidator(nodes, edges);
    return validator.validate();
}
