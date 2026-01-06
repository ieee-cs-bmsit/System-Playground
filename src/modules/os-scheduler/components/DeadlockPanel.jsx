import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import useSimulationStore from '../store/simulationStore';

export default function DeadlockPanel() {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const processes = useSimulationStore(state => state.processes);

    // Mock deadlock detection - in real implementation, would use ResourceManager
    const deadlockedProcesses = []; // Will be populated by actual detection
    const hasDeadlock = deadlockedProcesses.length > 0;

    return (
        <div className="fixed bottom-64 right-6 w-72 bg-white border-4 border-black shadow-comic-lg z-40">
            {/* Header */}
            <div
                className={`border-b-4 border-black p-2 flex items-center justify-between cursor-pointer ${hasDeadlock ? 'bg-red-500 text-white animate-pulse' : 'bg-green-400'
                    }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    {hasDeadlock ? <AlertTriangle size={18} /> : <Shield size={18} />}
                    <span className="font-comic text-sm font-bold">
                        {hasDeadlock ? '⚠️ DEADLOCK!' : '✓ No Deadlock'}
                    </span>
                </div>
                <span className="text-xs">{isExpanded ? '▼' : '▲'}</span>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="p-3 text-sm">
                    {hasDeadlock ? (
                        <>
                            <div className="mb-2 font-bold text-red-600">
                                Deadlocked Processes: {deadlockedProcesses.length}
                            </div>
                            <div className="space-y-1 mb-3">
                                {deadlockedProcesses.map(pid => (
                                    <div key={pid} className="bg-red-50 border-l-4 border-red-500 p-1 text-xs">
                                        Process P{pid}
                                    </div>
                                ))}
                            </div>
                            <button className="w-full bg-red-500 text-white font-bold py-2 border-2 border-black hover:bg-red-600">
                                Recover (Kill P{deadlockedProcesses[0]})
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-600 text-xs">
                            System is running smoothly. No circular wait detected.
                        </div>
                    )}

                    {/* Info */}
                    <div className="mt-3 pt-2 border-t-2 border-gray-200 text-[10px] text-gray-500">
                        <div className="font-bold mb-1">Deadlock Conditions:</div>
                        <ul className="list-disc ml-4 space-y-0.5">
                            <li>Mutual Exclusion</li>
                            <li>Hold and Wait</li>
                            <li>No Preemption</li>
                            <li>Circular Wait</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
