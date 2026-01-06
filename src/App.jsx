import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import ModuleSelector from './pages/ModuleSelector';
import TutorialOverlay from './components/onboarding/TutorialOverlay';

// Import OS Scheduler Components
import OSCanvas from './modules/os-scheduler/components/Canvas';
import OSSidebar from './modules/os-scheduler/components/Sidebar';
import OSControlPanel from './modules/os-scheduler/components/ControlPanel';
import GanttChart from './modules/os-scheduler/components/GanttChart';
import OSMetricsPanel from './modules/os-scheduler/components/MetricsPanel';
import PropertiesPanel from './modules/os-scheduler/components/PropertiesPanel';
import DeadlockPanel from './modules/os-scheduler/components/DeadlockPanel';
import ResourceTutorial from './modules/os-scheduler/components/ResourceTutorial';

// Import PC Architecture Components
import PCCanvas from './modules/pc-architecture/components/Canvas';
import PCSidebar from './modules/pc-architecture/components/Sidebar';
import PCControlPanel from './modules/pc-architecture/components/ControlPanel';
import PCMetricsPanel from './modules/pc-architecture/components/MetricsPanel';
import PCTutorialOverlay from './modules/pc-architecture/components/PCTutorialOverlay';

// Import RAM Simulator Components
import RAMCanvas from './modules/ram-simulator/components/Canvas';
import RAMSidebar from './modules/ram-simulator/components/Sidebar';
import RAMControlPanel from './modules/ram-simulator/components/ControlPanel';
import RAMMetricsPanel from './modules/ram-simulator/components/MetricsPanel';
import RAMTutorialOverlay from './modules/ram-simulator/components/RAMTutorialOverlay';

function App() {
    const [view, setView] = useState('home');
    const [activeModule, setActiveModule] = useState(null);
    const [showTutorial, setShowTutorial] = useState(true);
    const [showPCTutorial, setShowPCTutorial] = useState(false);
    const [showRAMTutorial, setShowRAMTutorial] = useState(false);
    const [showResourceTutorial, setShowResourceTutorial] = useState(false);

    useEffect(() => {
        const handleShowResourceTutorial = () => setShowResourceTutorial(true);
        window.addEventListener('showResourceTutorial', handleShowResourceTutorial);
        return () => window.removeEventListener('showResourceTutorial', handleShowResourceTutorial);
    }, []);

    const startApp = () => setView('module-selection');

    const navigateToBuilder = (moduleId) => {
        setActiveModule(moduleId);
        setView('builder');

        if (moduleId === 'os-scheduler') {
            setShowTutorial(true);
        } else if (moduleId === 'pc-architecture') {
            setShowPCTutorial(true);
        } else if (moduleId === 'ram') {
            setShowRAMTutorial(true);
        }
    };

    const navigateModules = () => {
        setView('module-selection');
        setActiveModule(null);
    };

    if (view === 'home') return <Home onStart={startApp} />;
    if (view === 'module-selection') return <ModuleSelector onSelect={navigateToBuilder} />;

    return (
        <div className="h-screen w-screen bg-comic-cream flex flex-col overflow-hidden font-body relative">
            <div className="absolute inset-0 bg-halftone-dots opacity-5 pointer-events-none z-0"></div>

            <div className="bg-comic-yellow border-b-4 border-black px-6 py-2 flex justify-between items-center shadow-md z-30 relative">
                <div
                    className="text-xl font-comic transform -rotate-1 cursor-pointer hover:scale-105 transition-transform border-2 border-black bg-white px-2 shadow-sm"
                    onClick={navigateModules}
                >
                    ⬅ Labs
                </div>
                <div className="text-3xl font-comic text-comic-pink drop-shadow-[2px_2px_0_#000] uppercase tracking-widest text-stroke-sm-white">
                    {activeModule === 'os-scheduler' ? 'OS Scheduler Lab' : 'PC Architecture Lab'}
                </div>
                <div
                    className="cursor-pointer font-bold bg-comic-blue text-white px-3 py-1 border-2 border-black shadow-comic-hover transform rotate-1 hover:rotate-0 transition-transform"
                    onClick={() => activeModule === 'os-scheduler' ? setShowTutorial(true) : setShowPCTutorial(true)}
                >
                    Help?
                </div>
            </div>

            <div className="flex-1 flex min-h-0 relative z-10">
                {activeModule === 'os-scheduler' && (
                    <>
                        <div className="z-20 h-full relative">
                            <OSSidebar />
                        </div>
                        <div className="flex-1 relative z-10 overflow-hidden">
                            <OSCanvas />
                            <PropertiesPanel />
                            <OSMetricsPanel />
                            <DeadlockPanel />
                            <div className="absolute bottom-8 left-[40%] transform -translate-x-1/2 z-50">
                                <OSControlPanel />
                            </div>
                            <div className="absolute bottom-6 right-6 w-96 h-48 z-40 bg-white border-4 border-black shadow-comic">
                                <GanttChart />
                            </div>
                        </div>
                    </>
                )}

                {activeModule === 'pc-architecture' && (
                    <>
                        <div className="z-20 h-full relative">
                            <PCSidebar />
                        </div>
                        <div className="flex-1 relative z-10 overflow-hidden">
                            <PCCanvas />
                            <PCMetricsPanel />
                            <div className="absolute bottom-8 left-[40%] transform -translate-x-1/2 z-50">
                                <PCControlPanel />
                            </div>
                        </div>
                    </>
                )}

                {activeModule === 'ram' && (
                    <>
                        <div className="z-20 h-full relative">
                            <RAMSidebar />
                        </div>
                        <div className="flex-1 relative z-10 overflow-hidden">
                            <RAMCanvas />
                            <RAMMetricsPanel />
                            <div className="absolute bottom-8 left-[40%] transform -translate-x-1/2 z-50">
                                <RAMControlPanel />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {activeModule === 'os-scheduler' && showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
            {activeModule === 'os-scheduler' && showResourceTutorial && <ResourceTutorial onClose={() => setShowResourceTutorial(false)} />}
            {activeModule === 'pc-architecture' && showPCTutorial && <PCTutorialOverlay onClose={() => setShowPCTutorial(false)} />}
            {activeModule === 'ram' && showRAMTutorial && <RAMTutorialOverlay onClose={() => setShowRAMTutorial(false)} />}
        </div>
    );
}

export default App;
