import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { HardDrive, Table, Zap, MemoryStick } from 'lucide-react';
import useRAMStore from '../store/ramStore';

// Shared wrapper
const NodeWrapper = ({ children, className, label, icon: Icon, selected }) => (
    <div className={`w-40 border-4 border-black shadow-comic transform transition-all ${selected ? 'scale-110' : ''} ${className}`}>
        <div className="flex items-center gap-2 p-1 border-b-4 border-black bg-white/90">
            <Icon size={16} />
            <div className="font-comic text-xs uppercase">{label}</div>
        </div>
        {children}
    </div>
);

// PHYSICAL RAM NODE
export const PhysicalRAMNode = memo(({ id, data, selected }) => {
    const physicalRAM = useRAMStore(state => state.physicalRAM);
    const metrics = useRAMStore(state => state.metrics);

    return (
        <NodeWrapper label="Physical RAM" icon={MemoryStick} className="bg-blue-500 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.size || '16'} MB</div>
                <div className="text-[10px]">Page: {data?.pageSize || 4}KB</div>
                {physicalRAM && (
                    <div className="text-[10px] mt-1">
                        <div>Frames: {physicalRAM.frames}</div>
                        <div>Free: {physicalRAM.freeFrames}</div>
                        <div>Used: {((metrics.usedRAM / metrics.totalRAM) * 100).toFixed(1)}%</div>
                    </div>
                )}
            </div>
        </NodeWrapper>
    );
});

// VIRTUAL MEMORY NODE
export const VirtualMemoryNode = memo(({ id, data, selected }) => {
    const metrics = useRAMStore(state => state.metrics);

    return (
        <NodeWrapper label="Virtual Memory" icon={HardDrive} className="bg-purple-500 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.size || '64'} MB</div>
                <div className="text-[10px]">Address Space</div>
                <div className="text-[10px] mt-1">
                    <div>Faults: {metrics.pageFaults}</div>
                    <div>Rate: {metrics.pageFaultRate.toFixed(2)}%</div>
                </div>
            </div>
        </NodeWrapper>
    );
});

// PAGE TABLE NODE
export const PageTableNode = memo(({ id, data, selected }) => {
    const pageTable = useRAMStore(state => state.pageTable);

    const validEntries = pageTable?.entries.filter(e => e.valid).length || 0;
    const totalEntries = pageTable?.entries.length || 0;

    return (
        <NodeWrapper label="Page Table" icon={Table} className="bg-green-500 text-white" selected={selected}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">Entries: {totalEntries}</div>
                <div className="text-[10px]">Valid: {validEntries}</div>
                <div className="text-[10px] mt-1">
                    <div>Hit Rate: {((validEntries / totalEntries) * 100).toFixed(1)}%</div>
                </div>
            </div>
        </NodeWrapper>
    );
});

// TLB NODE
export const TLBNode = memo(({ id, data, selected }) => {
    const tlb = useRAMStore(state => state.tlb);
    const metrics = useRAMStore(state => state.metrics);

    return (
        <NodeWrapper label="TLB" icon={Zap} className="bg-yellow-400 text-black" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.entries || 64} Entries</div>
                <div className="text-[10px]">{data?.assoc || 4}-way</div>
                {tlb && (
                    <div className="text-[10px] mt-1">
                        <div>Hits: {tlb.hits}</div>
                        <div>Rate: {metrics.tlbHitRate.toFixed(1)}%</div>
                    </div>
                )}
            </div>
        </NodeWrapper>
    );
});
