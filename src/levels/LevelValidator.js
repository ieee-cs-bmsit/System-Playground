/**
 * Level Validator - Core validation engine for challenge levels
 * Validates simulation results against level requirements
 */

export class LevelValidator {
    /**
     * Validate simulation results against level constraints
     * @param {Object} levelDef - Level definition with constraints
     * @param {Object} simulationState - Current simulation state
     * @returns {Object} Validation result with pass/fail, violations, stars, feedback
     */
    validate(levelDef, simulationState) {
        const constraints = levelDef.constraints || {};
        const metrics = simulationState.metrics || {};
        const violations = [];
        const warnings = [];

        // 1. Check component constraints
        if (constraints.maxProcesses !== undefined) {
            const processCount = simulationState.processCount || simulationState.processes?.length || 0;
            if (processCount > constraints.maxProcesses) {
                violations.push(`Too many processes: ${processCount}/${constraints.maxProcesses}`);
            }
        }

        if (constraints.minProcesses !== undefined) {
            const processCount = simulationState.processCount || simulationState.processes?.length || 0;
            if (processCount < constraints.minProcesses) {
                violations.push(`Not enough processes: ${processCount}/${constraints.minProcesses}`);
            }
        }

        // 2. Check allowed schedulers (OS Scheduler specific)
        if (constraints.allowedSchedulers && simulationState.scheduler) {
            const usedScheduler = simulationState.scheduler.algorithm || simulationState.scheduler;
            if (!constraints.allowedSchedulers.includes(usedScheduler)) {
                violations.push(`Wrong scheduler: ${usedScheduler} not allowed. Use: ${constraints.allowedSchedulers.join(', ')}`);
            }
        }

        // 3. Check allowed components
        if (constraints.allowedComponents && simulationState.components) {
            const usedComponents = simulationState.components.map(c => c.type);
            const disallowedComponents = usedComponents.filter(c => !constraints.allowedComponents.includes(c));
            if (disallowedComponents.length > 0) {
                violations.push(`Disallowed components used: ${disallowedComponents.join(', ')}`);
            }
        }

        // 4. Check required components
        if (constraints.requiredComponents) {
            const usedComponents = (simulationState.components || []).map(c => c.type);
            const missingComponents = constraints.requiredComponents.filter(c => !usedComponents.includes(c));
            if (missingComponents.length > 0) {
                violations.push(`Missing required components: ${missingComponents.join(', ')}`);
            }
        }

        // 5. Check metric constraints
        if (constraints.requiredMetrics) {
            for (const [metric, target] of Object.entries(constraints.requiredMetrics)) {
                const actualValue = metrics[metric];

                if (actualValue === undefined) {
                    warnings.push(`Metric ${metric} not available`);
                    continue;
                }

                if (target.max !== undefined && actualValue > target.max) {
                    violations.push(`${metric} too high: ${actualValue.toFixed(2)} > ${target.max}`);
                }

                if (target.min !== undefined && actualValue < target.min) {
                    violations.push(`${metric} too low: ${actualValue.toFixed(2)} < ${target.min}`);
                }

                if (target.exact !== undefined && Math.abs(actualValue - target.exact) > 0.01) {
                    violations.push(`${metric} must be exactly ${target.exact}, got ${actualValue.toFixed(2)}`);
                }
            }
        }

        // 6. Check custom validation function
        if (levelDef.customValidation && typeof levelDef.customValidation === 'function') {
            try {
                const customResult = levelDef.customValidation(simulationState);
                if (!customResult.passed) {
                    violations.push(...(customResult.violations || []));
                }
                if (customResult.warnings) {
                    warnings.push(...customResult.warnings);
                }
            } catch (error) {
                violations.push(`Custom validation error: ${error.message}`);
            }
        }

        // Calculate star rating
        const stars = violations.length === 0
            ? this.calculateStars(levelDef.starRating, metrics, simulationState)
            : 0;

        // Generate feedback
        const feedback = this.generateFeedback(violations, warnings, metrics, levelDef, stars);

        return {
            passed: violations.length === 0,
            violations,
            warnings,
            stars,
            metrics,
            feedback,
            timestamp: Date.now()
        };
    }

    /**
     * Calculate star rating based on performance
     */
    calculateStars(starConfig, metrics, state) {
        if (!starConfig) return 1; // Default to 1 star if no config

        // Custom star calculation
        if (typeof starConfig === 'string' || typeof starConfig === 'function') {
            return this.customStarLogic(starConfig, metrics, state);
        }

        // Check 3-star requirements first (most strict)
        if (starConfig[3] && this.meetsRequirements(starConfig[3], metrics, state)) {
            return 3;
        }

        // Check 2-star requirements
        if (starConfig[2] && this.meetsRequirements(starConfig[2], metrics, state)) {
            return 2;
        }

        // Check 1-star requirements
        if (starConfig[1] && this.meetsRequirements(starConfig[1], metrics, state)) {
            return 1;
        }

        return 1; // Passed but no stars earned
    }

    /**
     * Check if all requirements are met
     */
    meetsRequirements(requirements, metrics, state) {
        if (!requirements) return false;

        for (const [key, value] of Object.entries(requirements)) {
            // Check scheduler match
            if (key === 'scheduler') {
                const actualScheduler = state.scheduler?.algorithm || state.scheduler;
                if (actualScheduler !== value) return false;
            }

            // Check metric thresholds
            if (metrics[key] !== undefined) {
                if (typeof value === 'number' && metrics[key] > value) {
                    return false;
                }
                if (value.max && metrics[key] > value.max) {
                    return false;
                }
                if (value.min && metrics[key] < value.min) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Custom star calculation logic
     */
    customStarLogic(config, metrics, state) {
        if (typeof config === 'function') {
            return config(metrics, state);
        }

        // Default: based on combined score
        let score = 0;
        const weights = {
            avgWaitTime: -1,        // Lower is better
            avgTurnaroundTime: -1,
            cpuUtilization: 1,      // Higher is better
            throughput: 1,
            deliveryRate: 1,
            hitRate: 1
        };

        for (const [metric, weight] of Object.entries(weights)) {
            if (metrics[metric] !== undefined) {
                score += metrics[metric] * weight;
            }
        }

        // Convert score to stars
        if (score > 100) return 3;
        if (score > 50) return 2;
        return 1;
    }

    /**
     * Generate helpful feedback
     */
    generateFeedback(violations, warnings, metrics, levelDef, stars) {
        if (violations.length > 0) {
            return {
                type: 'error',
                title: '❌ Objective Not Met',
                message: violations[0], // Show first violation
                allViolations: violations,
                suggestions: this.getSuggestions(violations, levelDef)
            };
        }

        // Success feedback based on stars
        const titles = {
            3: '⭐⭐⭐ Perfect!',
            2: '⭐⭐ Good Job!',
            1: '⭐ Complete!'
        };

        const starFeedback = levelDef.starRating?.[stars];
        const message = typeof starFeedback === 'object'
            ? starFeedback.hint
            : typeof starFeedback === 'string'
                ? starFeedback
                : 'Level complete!';

        // Dynamic hints based on metrics
        const hints = this.getDynamicHints(metrics, levelDef);

        return {
            type: 'success',
            title: titles[stars] || 'Complete!',
            message,
            hints,
            nextLevel: levelDef.unlocks,
            warnings
        };
    }

    /**
     * Get suggestions for fixing violations
     */
    getSuggestions(violations, levelDef) {
        const suggestions = [];

        violations.forEach(violation => {
            if (violation.includes('Too many processes')) {
                suggestions.push('Remove some process generators to reduce process count');
            }
            if (violation.includes('Wrong scheduler')) {
                suggestions.push(`Change to an allowed scheduler: ${levelDef.constraints.allowedSchedulers?.join(', ')}`);
            }
            if (violation.includes('avgWaitTime')) {
                suggestions.push('Try using SJF (Shortest Job First) to minimize wait time');
                suggestions.push('Reduce time quantum to improve responsiveness');
            }
            if (violation.includes('Missing required')) {
                suggestions.push('Add all required components from the sidebar');
            }
        });

        return suggestions;
    }

    /**
     * Get dynamic hints based on performance
     */
    getDynamicHints(metrics, levelDef) {
        const hints = [];

        // Check if user-provided hints match current state
        if (levelDef.hints) {
            for (const hint of levelDef.hints) {
                if (this.evaluateTrigger(hint.trigger, metrics)) {
                    hints.push(hint.message);
                }
            }
        }

        // Generic hints based on metrics
        if (metrics.avgWaitTime > 20) {
            hints.push('💡 Try using SJF scheduler for shorter wait times');
        }
        if (metrics.cpuUtilization < 50) {
            hints.push('💡 Add more processes to improve CPU utilization');
        }
        if (metrics.contextSwitches > 50) {
            hints.push('💡 Increase time quantum to reduce context switches');
        }

        return hints;
    }

    /**
     * Evaluate trigger conditions (e.g., "avgWaitTime > 25")
     */
    evaluateTrigger(trigger, metrics) {
        if (!trigger || typeof trigger !== 'string') return false;

        // Parse simple conditions like "avgWaitTime > 25"
        const match = trigger.match(/(\w+)\s*([><=!]+)\s*(\d+)/);
        if (!match) return false;

        const [, metric, operator, value] = match;
        const actualValue = metrics[metric];
        const threshold = parseFloat(value);

        if (actualValue === undefined) return false;

        switch (operator) {
            case '>': return actualValue > threshold;
            case '<': return actualValue < threshold;
            case '>=': return actualValue >= threshold;
            case '<=': return actualValue <= threshold;
            case '==': return actualValue === threshold;
            case '!=': return actualValue !== threshold;
            default: return false;
        }
    }
}

export default LevelValidator;
