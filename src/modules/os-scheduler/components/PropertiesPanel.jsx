import React from 'react';
import useSimulationStore from '../store/simulationStore';
import { Settings } from 'lucide-react';

export default function PropertiesPanel() {
    const scheduler = useSimulationStore(state => state.scheduler);
    const updateQuantum = useSimulationStore(state => state.updateQuantum);
    const updateAlgorithm = useSimulationStore(state => state.updateAlgorithm);
    const [isOpen, setIsOpen] = React.useState(true); // Start open

    return (
        <div className="absolute bottom-6 left-6 z-40">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-comic-pink text-white px-4 py-3 border-4 border-black shadow-comic font-comic hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-2"
                >
                    <Settings size={20} />
                    CONFIG
                </button>
            )}

            {/* Panel */}
            {isOpen && (
                <div className="bg-white border-4 border-black shadow-comic p-3 w-64">
                    <div className="flex justify-between items-center mb-3 border-b-2 border-black pb-2">
                        <h3 className="font-comic text-lg bg-comic-pink text-white px-2">Config</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-6 h-6 bg-black text-white font-bold hover:bg-gray-800"
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Algorithm Selector */}
                        <div>
                            <label className="font-bold text-xs uppercase text-gray-600 mb-1 block">
                                Scheduling Algorithm
                            </label>
                            <select
                                value={scheduler.algorithm}
                                onChange={(e) => updateAlgorithm(e.target.value)}
                                className="w-full p-2 border-2 border-black bg-white font-mono text-sm hover:bg-gray-50 cursor-pointer"
                            >
                                <option value="RR">Round Robin (RR)</option>
                                <option value="FCFS">First Come First Serve (FCFS)</option>
                                <option value="Priority">Priority Scheduling</option>
                                <option value="SJF">Shortest Job First (SJF)</option>
                            </select>
                        </div>

                        {/* Quantum Slider - Only show for RR */}
                        {scheduler.algorithm === 'RR' && (
                            <div>
                                <label className="font-bold text-xs uppercase text-gray-600 mb-1 block flex justify-between">
                                    <span>Time Quantum</span>
                                    <span className="bg-black text-white px-2 text-xs">{scheduler.quantum}</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={scheduler.quantum}
                                    onChange={(e) => updateQuantum(parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-200 rounded appearance-none cursor-pointer border-2 border-black accent-comic-blue"
                                />
                            </div>
                        )}

                        {/* Algorithm Info */}
                        <div className="text-xs bg-blue-50 border-l-4 border-blue-500 p-2">
                            {scheduler.algorithm === 'RR' && 'Each process gets equal CPU time slice'}
                            {scheduler.algorithm === 'FCFS' && 'Processes run in arrival order until completion'}
                            {scheduler.algorithm === 'Priority' && 'Higher priority processes run first'}
                            {scheduler.algorithm === 'SJF' && 'Shortest burst time processes run first'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
