import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import ModuleSelector from './pages/ModuleSelector';
import TutorialOverlay from './components/onboarding/TutorialOverlay';

// Import OS Scheduler Components (Now in Modules)
import Canvas from './modules/os-scheduler/components/Canvas';
import Sidebar from './modules/os-scheduler/components/Sidebar';
import ControlPanel from './modules/os-scheduler/components/ControlPanel';
import GanttChart from './modules/os-scheduler/components/GanttChart';
import MetricsPanel from './modules/os-scheduler/components/MetricsPanel';
import PropertiesPanel from './modules/os-scheduler/components/PropertiesPanel';
import DeadlockPanel from './modules/os-scheduler/components/DeadlockPanel';
import ResourceTutorial from './modules/os-scheduler/components/ResourceTutorial';

function App() {
    // VIEW STATE: 'home' -> 'module-selection' -> 'builder'
    const [view, setView] = useState('home');
    const [activeModule, setActiveModule] = useState(null);
    const [showTutorial, setShowTutorial] = useState(true); // Show tutorial by default
    const [showResourceTutorial, setShowResourceTutorial] = useState(false);

    // Listen for resource tutorial trigger
    useEffect(() => {
        const handleShowResourceTutorial = () => setShowResourceTutorial(true);
        window.addEventListener('showResourceTutorial', handleShowResourceTutorial);
        return () => window.removeEventListener('showResourceTutorial', handleShowResourceTutorial);
    }, []);

    // NAVIGATION HANDLERS
    const startApp = () => {
        setView('module-selection');
    };

    const navigateToBuilder = (moduleId) => {
        setActiveModule(moduleId);
        setView('builder');
        setShowTutorial(true); // Show tutorial when entering builder
    };

    const navigateModules = () => {
        setView('module-selection');
        setActiveModule(null);
    };

    // 1. LANDING PAGE
    if (view === 'home') {
        return <Home onStart={startApp} />;
    }

    // 2. MODULE SELECTION LAB
    if (view === 'module-selection') {
        return <ModuleSelector onSelect={navigateToBuilder} />;
    }

    // 3. BUILDER VIEW (Modular)
    return (
        <div className="h-screen w-screen bg-comic-cream flex flex-col overflow-hidden font-body relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-halftone-dots opacity-5 pointer-events-none z-0"></div>

            {/* Header */}
            <div className="bg-comic-yellow border-b-4 border-black px-6 py-2 flex justify-between items-center shadow-md z-30 relative">
                <div
                    className="text-xl font-comic transform -rotate-1 cursor-pointer hover:scale-105 transition-transform border-2 border-black bg-white px-2 shadow-sm"
                    onClick={navigateModules}
                >
                    ⬅ Labs
                </div>
                <div className="text-3xl font-comic text-comic-pink drop-shadow-[2px_2px_0_#000] uppercase tracking-widest text-stroke-sm-white">
                    {activeModule === 'os-scheduler' ? 'OS Scheduler Lab' : 'System Lab'}
                </div>
                <div
                    className="cursor-pointer font-bold bg-comic-blue text-white px-3 py-1 border-2 border-black shadow-comic-hover transform rotate-1 hover:rotate-0 transition-transform"
                    onClick={() => setShowTutorial(true)}
                >
                    Help?
                </div>
            </div>

            <div className="flex-1 flex min-h-0 relative z-10">
                {/* RENDER ACTIVE MODULE COMPONENTS */}
                {activeModule === 'os-scheduler' && (
                    <>
                        <div className="z-20 h-full relative">
                            <Sidebar />
                        </div>

                        <div className="flex-1 relative z-10 overflow-hidden">
                            <Canvas />
                            <PropertiesPanel />
                            <MetricsPanel />
                            <DeadlockPanel />

                            {/* Controls - Shifted Left (approx 35%) to avoid Gantt Overlap */}
                            <div className="absolute bottom-8 left-[40%] transform -translate-x-1/2 z-50">
                                <ControlPanel />
                            </div>

                            {/* Gantt Chart - Bottom Right */}
                            <div className="absolute bottom-6 right-6 w-96 h-48 z-40 bg-white border-4 border-black shadow-comic">
                                <GanttChart />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Tutorial Modal */}
            {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

            {/* Resource Tutorial Modal */}
            {showResourceTutorial && <ResourceTutorial onClose={() => setShowResourceTutorial(false)} />}
        </div>
    );
}

export default App;
