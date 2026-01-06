import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PipelinePanel({ pipeline }) {
    if (!pipeline) return null;

    const snapshot = pipeline.getSnapshot();
    const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
    const stageNames = {
        IF: 'Fetch',
        ID: 'Decode',
        EX: 'Execute',
        MEM: 'Memory',
        WB: 'Write Back'
    };

    return (
        <div className="absolute bottom-6 left-6 z-40 bg-white border-4 border-black shadow-comic p-3 w-[600px]">
            <div className="border-b-2 border-black pb-2 mb-2">
                <h3 className="font-comic text-lg">CPU Pipeline</h3>
            </div>

            {/* Pipeline Stages */}
            <div className="flex items-center gap-2 mb-3">
                {stages.map((stage, idx) => (
                    <React.Fragment key={stage}>
                        <div className={`flex-1 border-2 border-black p-2 text-center ${snapshot[stage]?.bubble ? 'bg-gray-200' :
                                snapshot[stage]?.stalled ? 'bg-red-200' :
                                    snapshot[stage] ? 'bg-green-200' : 'bg-white'
                            }`}>
                            <div className="font-bold text-xs">{stageNames[stage]}</div>
                            <div className="text-[10px] font-mono mt-1">
                                {snapshot[stage]?.bubble ? '(bubble)' :
                                    snapshot[stage]?.stalled ? '(stalled)' :
                                        snapshot[stage] ? snapshot[stage].id : '---'}
                            </div>
                        </div>
                        {idx < stages.length - 1 && (
                            <ArrowRight size={16} className="flex-shrink-0" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="border border-black p-1">
                    <div className="font-bold">CPI</div>
                    <div className="font-mono">{pipeline.getCPI().toFixed(2)}</div>
                </div>
                <div className="border border-black p-1">
                    <div className="font-bold">IPC</div>
                    <div className="font-mono">{pipeline.getIPC().toFixed(2)}</div>
                </div>
                <div className="border border-black p-1">
                    <div className="font-bold">Efficiency</div>
                    <div className="font-mono">{pipeline.getPipelineEfficiency().toFixed(1)}%</div>
                </div>
                <div className="border border-black p-1">
                    <div className="font-bold">Stalls</div>
                    <div className="font-mono">{pipeline.getStallRate().toFixed(1)}%</div>
                </div>
            </div>

            {/* Hazard Indicators */}
            {pipeline.dataHazards.length > 0 && (
                <div className="mt-2 bg-yellow-100 border-2 border-yellow-400 p-2 text-xs">
                    <div className="font-bold">⚠️ Data Hazard Detected</div>
                    <div className="text-[10px]">
                        {pipeline.dataHazards[pipeline.dataHazards.length - 1].instruction} conflicts with {pipeline.dataHazards[pipeline.dataHazards.length - 1].conflictsWith}
                    </div>
                </div>
            )}
        </div>
    );
}
