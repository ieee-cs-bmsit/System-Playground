import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Cpu, HardDrive, Database, Cable } from 'lucide-react';
import useArchitectureStore from '../store/architectureStore';

// Shared wrapper
const NodeWrapper = ({ children, className, label, icon: Icon, selected }) => (
    <div className={`w-36 border-4 border-black shadow-comic transform transition-all ${selected ? 'scale-110' : ''} ${className}`}>
        <div className="flex items-center gap-2 p-1 border-b-4 border-black bg-white/90">
            <Icon size={16} />
            <div className="font-comic text-xs uppercase">{label}</div>
        </div>
        {children}
    </div>
);

// CPU NODE
export const CPUNode = memo(({ id, data, selected }) => {
    const cpus = useArchitectureStore(state => state.cpus);
    const cpu = cpus.find(c => c.id === id);

    return (
        <NodeWrapper label="CPU" icon={Cpu} className="bg-blue-500 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.clockSpeed || 3.0} GHz</div>
                <div className="text-[10px]">Cores: {data?.cores || 1}</div>
                {cpu && (
                    <div className="text-[10px] mt-1">
                        <div>State: {cpu.state}</div>
                        <div>IPC: {cpu.getIPC().toFixed(2)}</div>
                    </div>
                )}
            </div>
        </NodeWrapper>
    );
});

// RAM NODE
export const RAMNode = memo(({ id, data, selected }) => {
    const memory = useArchitectureStore(state => state.memory);

    return (
        <NodeWrapper label="RAM" icon={Database} className="bg-green-500 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.size || 8192} MB</div>
                <div className="text-[10px]">{data?.type || 'DDR4'}</div>
                {memory && (
                    <div className="text-[10px] mt-1">
                        <div>Reads: {memory.reads}</div>
                        <div>Writes: {memory.writes}</div>
                    </div>
                )}
            </div>
        </NodeWrapper>
    );
});

// STORAGE NODE
export const StorageNode = memo(({ id, data, selected }) => {
    return (
        <NodeWrapper label="Storage" icon={HardDrive} className="bg-purple-500 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.size || 512} GB</div>
                <div className="text-[10px]">{data?.type || 'SSD'}</div>
                <div className="text-[10px]">Read: {data?.readSpeed || 500} MB/s</div>
            </div>
        </NodeWrapper>
    );
});

// SYSTEM BUS NODE
export const SystemBusNode = memo(({ id, data, selected }) => {
    return (
        <NodeWrapper label="System Bus" icon={Cable} className="bg-yellow-400 text-black" selected={selected}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.width || 64}-bit</div>
                <div className="text-[10px]">{data?.speed || 100} MHz</div>
            </div>
        </NodeWrapper>
    );
});

// MOTHERBOARD NODE (connects everything)
export const MotherboardNode = memo(({ id, data, selected }) => {
    return (
        <div className={`w-96 h-48 border-4 border-black shadow-comic bg-gradient-to-br from-gray-700 to-gray-900 ${selected ? 'scale-105' : ''}`}>
            <div className="flex items-center gap-2 p-2 border-b-4 border-black bg-gray-800 text-white">
                <div className="font-comic text-sm uppercase">Motherboard</div>
            </div>

            {/* Connection points */}
            <Handle type="source" position={Position.Top} style={{ left: '25%' }} className="w-3 h-3 bg-green-500 border-2 border-white" />
            <Handle type="source" position={Position.Top} style={{ left: '50%' }} className="w-3 h-3 bg-blue-500 border-2 border-white" />
            <Handle type="source" position={Position.Top} style={{ left: '75%' }} className="w-3 h-3 bg-purple-500 border-2 border-white" />

            <Handle type="source" position={Position.Bottom} style={{ left: '33%' }} className="w-3 h-3 bg-yellow-400 border-2 border-white" />
            <Handle type="source" position={Position.Bottom} style={{ left: '66%' }} className="w-3 h-3 bg-red-500 border-2 border-white" />

            <div className="p-4 text-white text-xs">
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 p-1 border border-white/30 rounded">CPU Socket</div>
                    <div className="bg-white/10 p-1 border border-white/30 rounded">RAM Slots</div>
                    <div className="bg-white/10 p-1 border border-white/30 rounded">PCIe</div>
                    <div className="bg-white/10 p-1 border border-white/30 rounded">SATA</div>
                    <div className="bg-white/10 p-1 border border-white/30 rounded">M.2</div>
                    <div className="bg-white/10 p-1 border border-white/30 rounded">USB</div>
                </div>
            </div>
        </div>
    );
});
