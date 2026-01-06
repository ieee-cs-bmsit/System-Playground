import React from 'react';
import useSimulationStore from '../../store/simulationStore';
import { Clock, Timer, CheckCircle } from 'lucide-react';

export default function MetricsPanel() {
    const metrics = useSimulationStore(state => state.metrics);

    return (
        <div className="bg-white border-4 border-black shadow-comic p-4 w-64 absolute top-20 right-4 z-40 transform rotate-1">
            <h3 className="font-comic text-xl border-b-4 border-black pb-2 mb-4 bg-comic-blue text-white inline-block px-2 transform -rotate-1">
                Performance
            </h3>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-comic-yellow p-2 border-2 border-black rounded-full">
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase text-gray-500">Completed</div>
                        <div className="font-comic text-2xl">{metrics.completedProcesses}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-comic-pink p-2 border-2 border-black rounded-full text-white">
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase text-gray-500">Avg Wait Time</div>
                        <div className="font-comic text-2xl">{metrics.avgWaitTime}ms</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-green-400 p-2 border-2 border-black rounded-full text-black">
                        <Timer size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase text-gray-500">Avg Turnaround</div>
                        <div className="font-comic text-2xl">{metrics.avgTurnaroundTime}ms</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
