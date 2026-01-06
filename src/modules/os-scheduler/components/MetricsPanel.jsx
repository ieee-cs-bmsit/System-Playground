import React from 'react';
import useSimulationStore from '../store/simulationStore';
import { BarChart3 } from 'lucide-react';

export default function MetricsPanel() {
    const metrics = useSimulationStore(state => state.metrics);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="absolute top-32 right-6 z-40">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-comic-blue text-white px-4 py-3 border-4 border-black shadow-comic font-comic hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-2"
                >
                    <BarChart3 size={20} />
                    METRICS
                </button>
            )}

            {/* Panel */}
            {isOpen && (
                <div className="bg-white border-4 border-black shadow-comic p-3 w-56">
                    <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-1">
                        <h3 className="font-comic text-lg bg-comic-blue text-white px-2">Metrics</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-6 h-6 bg-black text-white font-bold hover:bg-gray-800"
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between border-b border-gray-200 pb-1">
                            <span className="font-bold">Completed:</span>
                            <span className="font-mono">{metrics.completedProcesses}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-1">
                            <span className="font-bold">CPU Util:</span>
                            <span className="font-mono">{metrics.cpuUtilization}%</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-1">
                            <span className="font-bold">Avg Wait:</span>
                            <span className="font-mono">{metrics.avgWaitTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Avg Turn:</span>
                            <span className="font-mono">{metrics.avgTurnaroundTime}ms</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
