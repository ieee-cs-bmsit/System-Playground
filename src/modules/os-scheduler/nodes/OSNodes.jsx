import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Cpu, Calendar, Activity, Sparkles } from 'lucide-react';
import useSimulationStore from '../store/simulationStore';

// SHARED WRAPPER
const NodeWrapper = ({ children, className, label, icon: Icon, selected }) => (
    <div className={`w-32 border-4 border-black shadow-comic transform transition-all ${selected ? 'scale-110 shadow-comic-lg' : ''} ${className}`}>
        <div className="flex items-center gap-2 p-1 border-b-4 border-black">
            <Icon size={16} />
            <div className="font-comic text-xs uppercase tracking-wide">{label}</div>
        </div>
        {children}
    </div>
);

// CPU NODE (Blue)
export const CPUNode = memo(({ id, data, selected }) => {
    const cpuState = useSimulationStore(state => state.cpus.find(c => c.id === id));

    return (
        <NodeWrapper label="CPU Core" icon={Cpu} className="bg-comic-blue text-black" selected={selected}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-black border-2 border-white" />
            <div className="text-xs bg-white p-2 border-2 border-black shadow-sm">
                <div className="font-bold">Usage: {cpuState?.isIdle() ? '0' : '100'}%</div>
                <div className="text-[10px]">Process: {cpuState?.currentProcess?.id.split('_')[1] || 'Idle'}</div>
            </div>
        </NodeWrapper>
    );
});

// SCHEDULER NODE (Yellow)
export const SchedulerNode = memo(({ id, data, selected }) => {
    const scheduler = useSimulationStore(state => state.scheduler);

    return (
        <NodeWrapper label="Scheduler" icon={Calendar} className="bg-comic-yellow text-black" selected={selected}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-black border-2 border-white" />
            <div className="text-xs bg-white p-2 border-2 border-black shadow-sm">
                <div className="font-bold">{scheduler.algorithm}</div>
                <div className="text-[10px]">Queue: {scheduler.readyQueue.length}</div>
            </div>
        </NodeWrapper>
    );
});

// PROCESS NODE (Green)
export const ProcessNode = memo(({ id, selected }) => {
    const process = useSimulationStore(state =>
        state.processes.find(p => p.id === id) ||
        state.scheduler?.readyQueue.find(p => p.id === id)
    );

    const getStateColor = (state) => {
        switch (state) {
            case 'RUNNING': return 'bg-green-500 animate-pulse';
            case 'READY': return 'bg-yellow-400';
            case 'TERMINATED': return 'bg-gray-400';
            default: return 'bg-blue-400';
        }
    };

    // Extract PID from id (format: "process_X")
    const pid = id.includes('_') ? id.split('_')[1] : id;

    return (
        <NodeWrapper label="Process" icon={Activity} className="bg-green-400 text-black" selected={selected}>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-black border-2 border-white" />
            <div className="text-xs bg-white p-2 border-2 border-black shadow-sm">
                <div className="font-bold text-base">P{pid}</div>
                <div className="text-[10px]">Burst: {process?.totalBurstTime || 15}</div>
                {process && (
                    <div className={`mt-1 px-1 text-[10px] font-bold text-center ${getStateColor(process.state)}`}>
                        {process.state}
                    </div>
                )}
            </div>
        </NodeWrapper>
    );
});

// GENERATOR NODE (Pink)
export const GeneratorNode = memo(({ id, data, selected }) => {
    return (
        <NodeWrapper label="Generator" icon={Sparkles} className="bg-comic-pink text-white" selected={selected}>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-black border-2 border-white" />
            <div className="text-xs bg-white text-black p-2 border-2 border-black shadow-sm">
                <div className="font-bold">Spawns Process</div>
            </div>
        </NodeWrapper>
    );
});
