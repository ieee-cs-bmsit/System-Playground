import React from 'react';
import useSimulationStore from '../../store/simulationStore';
import { Settings, Sliders } from 'lucide-react';

export default function PropertiesPanel() {
    const scheduler = useSimulationStore(state => state.scheduler);
    const updateQuantum = useSimulationStore(state => state.updateQuantum);

    // In a real app, we would listen to ReactFlow selection. 
    // For this V1, we'll expose Global Scheduler Settings since there is only one Scheduler.

    return (
        <div className="bg-white border-4 border-black shadow-comic p-4 w-64 absolute top-20 left-4 z-40 transform -rotate-1">
            <h3 className="font-comic text-xl border-b-4 border-black pb-2 mb-4 bg-comic-pink text-white inline-block px-2 transform rotate-1">
                Config
            </h3>

            <div className="flex flex-col gap-4">
                {/* Algorithm Selection (Static for now, but visual) */}
                <div>
                    <label className="font-bold text-xs uppercase text-gray-500 mb-1 block">Algorithm</label>
                    <select className="w-full border-2 border-black p-2 font-comic bg-comic-cream">
                        <option>Round Robin</option>
                        <option disabled>FCFS (Coming Soon)</option>
                    </select>
                </div>

                {/* Quantum Slider */}
                <div>
                    <label className="font-bold text-xs uppercase text-gray-500 mb-1 block flex justify-between">
                        <span>Time Quantum</span>
                        <span className="bg-black text-white px-1 text-xs">{scheduler.quantum} ticks</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={scheduler.quantum}
                        onChange={(e) => updateQuantum(parseInt(e.target.value))}
                        className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black accent-comic-blue"
                    />
                </div>
            </div>
        </div>
    );
}
