import React from 'react';
import useRAMStore from '../store/ramStore';
import { Activity } from 'lucide-react';

export default function MetricsPanel() {
    const metrics = useRAMStore(state => state.metrics);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="absolute top-6 right-6 z-40">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 text-white px-4 py-3 border-4 border-black shadow-comic font-comic hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-2"
                >
                    <Activity size={20} />
                    METRICS
                </button>
            )}

            {isOpen && (
                <div className="bg-white border-4 border-black shadow-comic p-3 w-64">
                    <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-1">
                        <h3 className="font-comic text-lg bg-blue-500 text-white px-2">Metrics</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-6 h-6 bg-black text-white font-bold hover:bg-gray-800"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Memory Usage */}
                        <div className="border-2 border-blue-200 p-2 bg-blue-50">
                            <div className="font-bold text-xs uppercase text-blue-700 mb-1">Memory</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-mono font-bold">{(metrics.totalRAM / 1024 / 1024).toFixed(0)} MB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Free:</span>
                                    <span className="font-mono font-bold">{(metrics.freeRAM / 1024 / 1024).toFixed(0)} MB</span>
                                </div>
                            </div>
                        </div>

                        {/* Paging Stats */}
                        <div className="border-2 border-green-200 p-2 bg-green-50">
                            <div className="font-bold text-xs uppercase text-green-700 mb-1">Paging</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Page Faults:</span>
                                    <span className="font-mono font-bold">{metrics.pageFaults}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Page Hits:</span>
                                    <span className="font-mono font-bold">{metrics.pageHits}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Fault Rate:</span>
                                    <span className="font-mono font-bold">{metrics.pageFaultRate.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* TLB Stats */}
                        <div className="border-2 border-yellow-200 p-2 bg-yellow-50">
                            <div className="font-bold text-xs uppercase text-yellow-700 mb-1">TLB</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Hits:</span>
                                    <span className="font-mono font-bold">{metrics.tlbHits}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Misses:</span>
                                    <span className="font-mono font-bold">{metrics.tlbMisses}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Hit Rate:</span>
                                    <span className="font-mono font-bold">{metrics.tlbHitRate.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Performance */}
                        <div className="border-2 border-purple-200 p-2 bg-purple-50">
                            <div className="font-bold text-xs uppercase text-purple-700 mb-1">Performance</div>
                            <div className="flex justify-between text-xs">
                                <span>Avg Access:</span>
                                <span className="font-mono font-bold">{metrics.avgAccessTime.toFixed(0)}ns</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
