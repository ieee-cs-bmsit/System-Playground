import React from 'react';
import useIoTStore from '../store/iotStore';
import { Activity } from 'lucide-react';

export default function MetricsPanel() {
    const metrics = useIoTStore(state => state.metrics);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="absolute top-6 right-6 z-40">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-500 text-white px-4 py-3 border-4 border-black shadow-comic font-comic hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-2"
                >
                    <Activity size={20} />
                    METRICS
                </button>
            )}

            {isOpen && (
                <div className="bg-white border-4 border-black shadow-comic p-3 w-64">
                    <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-1">
                        <h3 className="font-comic text-lg bg-green-500 text-white px-2">Metrics</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-6 h-6 bg-black text-white font-bold hover:bg-gray-800"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Network Status */}
                        <div className="border-2 border-green-200 p-2 bg-green-50">
                            <div className="font-bold text-xs uppercase text-green-700 mb-1">Network</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Active:</span>
                                    <span className="font-mono font-bold">{metrics.activeDevices}/{metrics.totalDevices}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Dead:</span>
                                    <span className="font-mono font-bold text-red-600">{metrics.deadDevices}</span>
                                </div>
                            </div>
                        </div>

                        {/* Data Flow */}
                        <div className="border-2 border-blue-200 p-2 bg-blue-50">
                            <div className="font-bold text-xs uppercase text-blue-700 mb-1">Data Flow</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Generated:</span>
                                    <span className="font-mono font-bold">{metrics.messagesGenerated}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivered:</span>
                                    <span className="font-mono font-bold">{metrics.messagesDelivered}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Rate:</span>
                                    <span className="font-mono font-bold">{metrics.deliveryRate.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Power */}
                        <div className="border-2 border-yellow-200 p-2 bg-yellow-50">
                            <div className="font-bold text-xs uppercase text-yellow-700 mb-1">Power</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Avg Battery:</span>
                                    <span className="font-mono font-bold">{metrics.avgBatteryLevel.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Performance */}
                        <div className="border-2 border-purple-200 p-2 bg-purple-50">
                            <div className="font-bold text-xs uppercase text-purple-700 mb-1">Performance</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span>Throughput:</span>
                                    <span className="font-mono font-bold">{metrics.throughput.toFixed(2)} msg/s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Packet Loss:</span>
                                    <span className="font-mono font-bold">{metrics.packetLoss.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
