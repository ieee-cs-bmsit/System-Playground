import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { HardDrive, Lock, Wifi } from 'lucide-react';

// Resource Node Wrapper
const ResourceNodeWrapper = ({ children, className, label, icon: Icon, selected }) => (
    <div className={`w-28 border-4 border-black shadow-comic transform transition-all ${selected ? 'scale-110' : ''} ${className}`}>
        <div className="flex items-center gap-1 p-1 border-b-2 border-black bg-white/90">
            <Icon size={14} />
            <div className="font-comic text-[10px] uppercase">{label}</div>
        </div>
        {children}
    </div>
);

// Memory Resource Node
export const MemoryResourceNode = memo(({ id, selected }) => {
    return (
        <ResourceNodeWrapper label="Memory" icon={HardDrive} className="bg-purple-400 text-black" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-2 h-2 bg-black border-2 border-white" />
            <div className="text-[10px] bg-white p-1 border border-black text-center">
                <div className="font-bold">4GB RAM</div>
                <div className="text-[8px]">Capacity: 4</div>
            </div>
        </ResourceNodeWrapper>
    );
});

// Mutex Resource Node
export const MutexResourceNode = memo(({ id, selected }) => {
    return (
        <ResourceNodeWrapper label="Mutex" icon={Lock} className="bg-orange-400 text-black" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-2 h-2 bg-black border-2 border-white" />
            <div className="text-[10px] bg-white p-1 border border-black text-center">
                <div className="font-bold">Lock</div>
                <div className="text-[8px]">Binary</div>
            </div>
        </ResourceNodeWrapper>
    );
});

// I/O Device Resource Node
export const IODeviceNode = memo(({ id, selected }) => {
    return (
        <ResourceNodeWrapper label="I/O Device" icon={Wifi} className="bg-teal-400 text-black" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-2 h-2 bg-black border-2 border-white" />
            <div className="text-[10px] bg-white p-1 border border-black text-center">
                <div className="font-bold">Disk</div>
                <div className="text-[8px]">Shared</div>
            </div>
        </ResourceNodeWrapper>
    );
});
