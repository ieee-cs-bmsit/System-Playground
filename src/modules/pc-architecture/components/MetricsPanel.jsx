import React from 'react';
import useArchitectureStore from '../store/architectureStore';
import { BarChart3 } from 'lucide-react';

export default function MetricsPanel() {
    const metrics = useArchitectureStore(state => state.metrics);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="absolute top-6 right-6 z-40">
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
                <div className="bg-white border-4 border-black shadow-comic p-3 w-64">
                    <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-1">
                        <h3 className="font-comic text-lg bg-comic-blue text-white px-2">Metrics</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-6 h-6 bg-black text-white font-bold hover:bg-gray-800"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Performance */}
                        <div className="border-2 border-blue-200 p-2 bg-blue-50">
                            <div className="font-bold text-xs uppercase text-blue-700 mb-1">Performance</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>IPC:</span>
                                    <span className="font-mono font-bold">{metrics.ipc.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Instructions:</span>
                                    <span className="font-mono font-bold">{metrics.completedInstructions}</span>
                                </div>
                            </div>
                        </div>

                        {/* Memory */}
                        <div className="border-2 border-green-200 p-2 bg-green-50">
                            <div className="font-bold text-xs uppercase text-green-700 mb-1">Memory</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Bandwidth:</span>
                                    <span className="font-mono font-bold">{metrics.memoryBandwidth.toFixed(1)} GB/s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cache Hit:</span>
                                    <span className="font-mono font-bold">{metrics.cacheHitRate.toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Power */}
                        <div className="border-2 border-yellow-200 p-2 bg-yellow-50">
                            <div className="font-bold text-xs uppercase text-yellow-700 mb-1">Power</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Consumption:</span>
                                    <span className="font-mono font-bold">{metrics.powerConsumption}W</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Temperature:</span>
                                    <span className="font-mono font-bold">{metrics.temperature}°C</span>
                                </div>
                            </div>
                        </div>

                        {/* Cost */}
                        <div className="border-2 border-purple-200 p-2 bg-purple-50">
                            <div className="font-bold text-xs uppercase text-purple-700 mb-1">Cost</div>
                            <div className="flex justify-between text-xs">
                                <span>Total:</span>
                                <span className="font-mono font-bold">${metrics.totalCost}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
