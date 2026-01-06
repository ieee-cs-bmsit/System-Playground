import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { clsx } from 'clsx';
import { Cpu, Activity, ListOrdered, PlayCircle } from 'lucide-react';
import useSimulationStore from '../../../store/simulationStore';

const NodeWrapper = ({ children, className, label, icon: Icon, selected }) => (
    <div className={clsx(
        "bg-white border-4 border-black shadow-comic p-2 min-w-[150px]",
        selected && "ring-4 ring-comic-pink",
        className
    )}>
        <div className="flex items-center gap-2 border-b-2 border-black pb-1 mb-2">
            {Icon && <Icon size={18} />}
            <span className="font-comic font-bold uppercase">{label}</span>
        </div>
        {children}
    </div>
);

// CPU NODE
export const CPUNode = memo(({ id, data, selected }) => {
    // Subscribe to specific CPU state
    const cpuState = useSimulationStore(state => state.cpus.find(c => c.id === id));
    // If cpuState is undefined (e.g. before store update), fallback

    const usage = cpuState && cpuState.currentProcess ? 100 : 0;
    const processName = cpuState && cpuState.currentProcess ? `PID: ${cpuState.currentProcess.id}` : "Idle";

    return (
        <NodeWrapper label="CPU Core" icon={Cpu} className="bg-comic-blue/20" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <div className="text-xs font-mono">
                <div>Usage: {usage}%</div>
                <div>Process: {processName}</div>
            </div>
        </NodeWrapper>
    );
});

// SCHEDULER NODE
export const SchedulerNode = memo(({ selected }) => {
    // Subscribe to Scheduler state
    const scheduler = useSimulationStore(state => state.scheduler);
    const queueLength = scheduler ? scheduler.readyQueue.length : 0;

    return (
        <NodeWrapper label="Scheduler" icon={ListOrdered} className="bg-comic-yellow/20" selected={selected}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs">
                <div>Algo: Round Robin</div>
                <div>Queue: {queueLength}</div>
            </div>
        </NodeWrapper>
    );
});

// PROCESS NODE
export const ProcessNode = memo(({ id, selected }) => {
    // Find self in process list (if checking dynamic processes)
    // For now, since processes move through queues, we might just look it up or display static info if it's draggable
    // For the V1 visual builder, maybe we just show static ID unless we track all processes
    return (
        <NodeWrapper label="Process" icon={Activity} className="bg-green-100" selected={selected}>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-black border-2 border-white" />
            <div className="text-xs">
                <div>PID: {id.split('_')[1] || "?"}</div>
                <div>Burst: 15</div>
            </div>
        </NodeWrapper>
    );
});

// GENERATOR NODE
export const GeneratorNode = memo(({ selected }) => {
    return (
        <NodeWrapper label="Generator" icon={PlayCircle} className="bg-comic-pink/20" selected={selected}>
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-black border-2 border-white" />
            <div className="text-xs text-center italic">
                Spawns Process
            </div>
        </NodeWrapper>
    );
});
