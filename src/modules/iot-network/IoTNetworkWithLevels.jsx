import React, { useState } from 'react';
import { ArrowLeft, Target } from 'lucide-react';

// Import IoT Network components
import IoTSidebar from './components/Sidebar';
import IoTCanvas from './components/Canvas';
import IoTMetricsPanel from './components/MetricsPanel';
import IoTControlPanel from './components/ControlPanel';

// Import level system components
import LevelSelect from '../../components/LevelSelect';
import LevelObjective from '../../components/LevelObjective';
import LevelValidator from '../../levels/LevelValidator';
import IOT_NETWORK_LEVELS from '../../levels/definitions/iot-network-levels';
import useProgressStore from '../../store/progressStore';

/**
 * IoT Network Module with Level-Based Learning
 */
export default function IoTNetworkWithLevels() {
    const [mode, setMode] = useState('level-select'); // 'level-select', 'playing', 'sandbox'
    const [currentLevel, setCurrentLevel] = useState(null);
    const [validationResult, setValidationResult] = useState(null);

    const { updateLevelProgress, unlockLevel } = useProgressStore();

    // Handle level selection
    const handleSelectLevel = (level) => {
        setCurrentLevel(level);
        setMode('playing');
        setValidationResult(null);
    };

    // Handle sandbox mode
    const handleSandboxMode = () => {
        setCurrentLevel(null);
        setMode('sandbox');
        setValidationResult(null);
    };

    // Back to level select
    const handleBackToSelect = () => {
        setMode('level-select');
        setCurrentLevel(null);
        setValidationResult(null);
    };

    // Validate solution
    const handleValidateNow = () => {
        if (!currentLevel) return;

        const validator = new LevelValidator(currentLevel);

        // TODO: Get actual simulation state from store
        const simulationState = {
            // This will be populated from the actual simulation store
            metrics: {},
            components: [],
            running: false
        };

        const result = validator.validate(simulationState);
        setValidationResult(result);

        // Update progress if passed
        if (result.passed) {
            updateLevelProgress('iot-network', currentLevel.id, {
                completed: true,
                stars: result.stars,
                attempts: 1,
                bestTime: result.completionTime || 0
            });

            // Unlock next level
            if (currentLevel.unlocks) {
                unlockLevel(currentLevel.unlocks);
            }
        }
    };

    if (mode === 'level-select') {
        return (
            <LevelSelect
                levels={IOT_NETWORK_LEVELS}
                moduleTitle="IoT NETWORK"
                moduleSubtitle="Connect The World!"
                onSelectLevel={handleSelectLevel}
                onSandboxMode={handleSandboxMode}
                onBack={() => window.location.reload()} // Reload to go back
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

            {/* Main Content - Original IoT Network Layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <div className="z-20 h-full relative">
                    <IoTSidebar />
                </div>

                {/* Main Area */}
                <div className="flex-1 flex flex-col relative">
                    {/* Canvas */}
                    <div className="flex-1 relative">
                        <IoTCanvas />

                        {/* Level Objective Overlay */}
                        {currentLevel && (
                            <LevelObjective
                                level={currentLevel}
                                validationResult={validationResult}
                            />
                        )}

                        {/* Metrics Panel Overlay */}
                        <div className="absolute top-32 right-4 z-40">
                            <IoTMetricsPanel />
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-8 left-[40%] transform -translate-x-1/2 z-50">
                        <IoTControlPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}
