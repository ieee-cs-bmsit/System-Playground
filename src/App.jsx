import React, { useState } from 'react';
import Home from './pages/Home';
import ModuleSelector from './pages/ModuleSelector';

// Import level-based module wrappers
import OSSchedulerWithLevels from './modules/os-scheduler/OSSchedulerWithLevels';
import PCArchitectureWithLevels from './modules/pc-architecture/PCArchitectureWithLevels';
import RAMSimulatorWithLevels from './modules/ram-simulator/RAMSimulatorWithLevels';
import IoTNetworkWithLevels from './modules/iot-network/IoTNetworkWithLevels';

function App() {
    const [view, setView] = useState('home');
    const [activeModule, setActiveModule] = useState(null);

    const startApp = () => setView('module-selection');

    const navigateToBuilder = (moduleId) => {
        setActiveModule(moduleId);
        setView('builder');
    };

    const navigateModules = () => {
        setView('module-selection');
        setActiveModule(null);
    };

    const navigateHome = () => {
        setView('home');
        setActiveModule(null);
    };

    if (view === 'home') return <Home onStart={startApp} />;
    if (view === 'module-selection') return <ModuleSelector onSelect={navigateToBuilder} onBack={navigateHome} />;

    return (
        <div className="h-screen w-screen bg-comic-cream flex flex-col overflow-hidden font-body relative">
            <div className="absolute inset-0 bg-halftone-dots opacity-5 pointer-events-none z-0"></div>

            {/* All modules now use level-based wrappers with their own headers */}
            <div className="flex-1 flex min-h-0 relative z-10">
                {activeModule === 'os-scheduler' && <OSSchedulerWithLevels />}
                {activeModule === 'pc-architecture' && <PCArchitectureWithLevels />}
                {activeModule === 'ram' && <RAMSimulatorWithLevels />}
                {activeModule === 'iot' && <IoTNetworkWithLevels />}
            </div>
        </div>
    );
}

export default App;
