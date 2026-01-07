import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Target } from 'lucide-react';
import useSimulationStore from './store/simulationStore';
import useProgressStore from '../../store/progressStore';
import LevelValidator from '../../levels/LevelValidator';
import LevelSelect from '../../components/LevelSelect';
import LevelObjective from '../../components/LevelObjective';
import OS_SCHEDULER_LEVELS from '../../levels/definitions/os-scheduler-levels';

// Import original components
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import ControlPanel from './components/ControlPanel';
import MetricsPanel from './components/MetricsPanel';
import GanttChart from './components/GanttChart';

/**
 * OS Scheduler with Level Mode
 * Wraps the original OS Scheduler with level-based challenges
 */
export default function OSSchedulerWithLevels() {
    const [mode, setMode] = useState('level-select'); // 'level-select', 'playing-level', 'sandbox'
    const [currentLevel, setCurrentLevel] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    const [startTime, setStartTime] = useState(null);

    const isPlaying = useSimulationStore(state => state.isPlaying);
    const currentTime = useSimulationStore(state => state.currentTime);
    const metrics = useSimulationStore(state => state.metrics);
    const reset = useSimulationStore(state => state.reset);
    const completeLevel = useProgressStore(state => state.completeLevel);
    const setCurrentLevelInStore = useProgressStore(state => state.setCurrentLevel);

    const validator = new LevelValidator();

    // Auto-validate when simulation is paused and metrics change
    useEffect(() => {
        if (!isPlaying && currentLevel && currentTime > 0) {
            // Give it a small delay to let final metrics settle
            const timer = setTimeout(() => {
                validateCurrentLevel();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, metrics, currentTime]);

    const handleSelectLevel = (level) => {
        setCurrentLevel(level);
        setMode('playing-level');
        setValidationResult(null);
        setStartTime(Date.now());
        setCurrentLevelInStore(level.id);

        // Reset simulation
        reset();

        // Apply initial setup if level has one
        if (level.initialSetup) {
            // TODO: Apply initial nodes and edges to canvas
            // This would require exposing setNodes and setEdges from Canvas
            console.log('Initial setup:', level.initialSetup);
        }
    };

    const handleBackToSelect = () => {
        setMode('level-select');
        setCurrentLevel(null);
        setValidationResult(null);
        reset();
    };

    const handleSandboxMode = () => {
        setMode('sandbox');
        setCurrentLevel(null);
        setValidationResult(null);
        reset();
    };

    const validateCurrentLevel = () => {
        if (!currentLevel) return;

        // Get actual simulation state
        const simState = useSimulationStore.getState();

        // Gather simulation state with REAL data
        const simulationState = {
            // FIX: Use completed processes count, not current active processes
            processCount: metrics.completedProcesses || 0,
            processes: simState.processes || [],
            scheduler: simState.scheduler?.algorithm || 'RR',
            metrics: {
                avgWaitTime: metrics.avgWaitTime || 0,
                avgTurnaroundTime: metrics.avgTurnaroundTime || 0,
                cpuUtilization: metrics.cpuUtilization || 0,
                throughput: parseFloat(metrics.throughput) || 0,
                contextSwitches: metrics.contextSwitches || 0,
                completedProcesses: metrics.completedProcesses || 0,
                deadlockCount: metrics.deadlockCount || 0
            },
            // FIX: Gather components from store
            components: [
                ...(simState.cpus?.length > 0 ? [{ type: 'cpu' }] : []),
                { type: 'scheduler' },
                ...(simState.resourceManager?.resources?.size > 0
                    ? Array.from(simState.resourceManager.resources.keys()).map(id => ({ type: 'mutex', id }))
                    : [])
            ],
            deadlockDetected: metrics.deadlockDetected || false,
            deadlockCount: metrics.deadlockCount || 0
        };

        console.log('🔍 Validation State:', simulationState);

        const result = validator.validate(currentLevel, simulationState);
        setValidationResult(result);

        // If passed, record progress
        if (result.passed) {
            const timeElapsed = (Date.now() - startTime) / 1000; // seconds
            completeLevel(currentLevel.id, {
                stars: result.stars,
                time: timeElapsed,
                metrics: simulationState.metrics,
                unlocks: currentLevel.unlocks
            });
        }

        return result;
    };

    const handleValidateNow = () => {
        const result = validateCurrentLevel();

        // Auto-scroll to show validation result
        if (result) {
            console.log('🎯 Validation Result:', result);
            // Validation result panel will show automatically via validationResult state
        }
    };

    if (mode === 'level-select') {
        return (
            <LevelSelect
                levels={OS_SCHEDULER_LEVELS}
                moduleTitle="OS CHALLENGES"
                moduleSubtitle="Master The Scheduler!"
                onSelectLevel={handleSelectLevel}
                onSandboxMode={handleSandboxMode}
                onBack={() => window.location.reload()} // Reload to go back to module selection
            />
        );
    }

    // Playing Level or Sandbox Mode
    return (
        <div className="w-full h-screen flex flex-col bg-comic-cream relative">
            {/* Halftone Background */}
            <div className="absolute inset-0 bg-halftone-dots opacity-5 pointer-events-none z-0"></div>

            {/* Comic Top Bar */}
            <div className="bg-comic-yellow border-b-4 border-black px-6 py-2 flex items-center justify-between shadow-md z-30 relative">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackToSelect}
                        className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all font-comic font-bold"
                    >
                        <ArrowLeft size={20} className="stroke-[3]" />
                        {mode === 'sandbox' ? 'BACK' : 'EXIT LEVEL'}
                    </button>

                    {currentLevel && (
                        <div className="flex items-center gap-3">
                            <Target className="stroke-[3]" size={28} />
                            <div>
                                <h2 className="font-comic text-xl font-bold uppercase tracking-wide">{currentLevel.title}</h2>
                                <p className="text-sm font-comic uppercase tracking-wide">
                                    {currentLevel.difficulty} · {currentLevel.estimatedTime}
                                </p>
                            </div>
                        </div>
                    )}

                    {mode === 'sandbox' && (
                        <h2 className="font-comic text-2xl font-bold uppercase tracking-wider">🎨 SANDBOX MODE</h2>
                    )}
                </div>

                {currentLevel && (
                    <button
                        onClick={handleValidateNow}
                        className="px-6 py-3 bg-comic-blue text-white border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all font-comic font-bold text-lg uppercase"
                    >
                        ⚡ Check Solution
                    </button>
                )}
            </div>

            {/* Main Content - Original OS Scheduler Layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Area */}
                <div className="flex-1 flex flex-col relative">
                    {/* Canvas */}
                    <div className="flex-1 relative">
                        <Canvas />

                        {/* Level Objective Overlay */}
                        {currentLevel && (
                            <LevelObjective
                                level={currentLevel}
                                validationResult={validationResult}
                            />
                        )}

                        {/* Metrics Panel Overlay */}
                        <MetricsPanel />

                        {/* Gantt Chart - Bottom Right */}
                        <div className="absolute bottom-4 right-4 w-80 h-40 bg-white border-2 border-gray-300 rounded shadow-lg">
                            <GanttChart />
                        </div>
                    </div>

                    {/* Bottom Controls - Just ControlPanel */}
                    <div className="border-t-2 border-gray-200 bg-white">
                        <ControlPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}
