import React from 'react';
import useSimulationStore from '../../store/simulationStore';

export default function GanttChart() {
    const history = useSimulationStore(state => state.history);
    const currentTime = useSimulationStore(state => state.currentTime);

    // If no history, show placeholder
    if (history.length === 0) {
        return (
            <div className="bg-white border-4 border-black shadow-comic p-4 h-full flex flex-col justify-center items-center">
                <h3 className="font-comic text-xl text-gray-400 transform -rotate-2">Gantt Chart (Waiting for Data...)</h3>
            </div>
        );
    }

    // Group by CPU
    // We want to render rows for each CPU
    const cpus = [...new Set(history.map(h => h.cpuId))];
    const windowStart = Math.max(0, currentTime - 50); // Show last 50 ticks
    const windowEnd = currentTime;

    return (
        <div className="bg-white border-4 border-black shadow-comic p-4 h-full flex flex-col overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-comic-pink text-white px-2 py-1 font-bold font-mono border-b-2 border-l-2 border-black">
                LIVE
            </div>
            <h3 className="font-comic text-xl border-b-4 border-black pb-2 mb-4 bg-comic-yellow inline-block px-2 transform -rotate-1 self-start">
                Execution History
            </h3>

            <div className="flex-1 overflow-x-auto overflow-y-auto">
                <div className="flex flex-col gap-4 min-w-[300px]">
                    {cpus.map(cpuId => (
                        <div key={cpuId} className="flex flex-col">
                            <div className="font-mono font-bold text-sm mb-1">{cpuId}</div>
                            <div className="relative h-8 bg-gray-100 border-2 border-black w-full overflow-hidden">
                                {history
                                    .filter(h => h.cpuId === cpuId && h.time >= windowStart)
                                    .map((h, i) => (
                                        <div
                                            key={i}
                                            className="absolute h-full border-r border-black/20"
                                            style={{
                                                left: `${((h.time - windowStart) / 50) * 100}%`,
                                                width: `${(1 / 50) * 100}%`,
                                                backgroundColor: h.color || '#ccc'
                                            }}
                                            title={`PID: ${h.processId} @ T=${h.time}`}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
