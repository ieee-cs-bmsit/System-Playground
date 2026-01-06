import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Layers, Database, Zap } from 'lucide-react';

// Shared wrapper
const NodeWrapper = ({ children, className, label, icon: Icon, selected }) => (
    <div className={`w-36 border-4 border-black shadow-comic transform transition-all ${selected ? 'scale-110' : ''} ${className}`}>
        <div className="flex items-center gap-2 p-1 border-b-4 border-black bg-white/90">
            <Icon size={14} />
            <div className="font-comic text-xs uppercase">{label}</div>
        </div>
        {children}
    </div>
);

// L1 CACHE NODE
export const L1CacheNode = memo(({ id, data, selected }) => {
    return (
        <NodeWrapper label="L1 Cache" icon={Zap} className="bg-cyan-400 text-black" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.size || '32'} KB</div>
                <div className="text-[10px]">8-way, 64B line</div>
                <div className="text-[10px] mt-1">
                    <div>Latency: 4 cycles</div>
                    <div>Hit Rate: {data?.hitRate || 0}%</div>
                </div>
            </div>
        </NodeWrapper>
    );
});

// L2 CACHE NODE
export const L2CacheNode = memo(({ id, data, selected }) => {
    return (
        <NodeWrapper label="L2 Cache" icon={Layers} className="bg-blue-500 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.size || '256'} KB</div>
                <div className="text-[10px]">8-way, 64B line</div>
                <div className="text-[10px] mt-1">
                    <div>Latency: 12 cycles</div>
                    <div>Hit Rate: {data?.hitRate || 0}%</div>
                </div>
            </div>
        </NodeWrapper>
    );
});

// L3 CACHE NODE
export const L3CacheNode = memo(({ id, data, selected }) => {
    return (
        <NodeWrapper label="L3 Cache" icon={Database} className="bg-indigo-600 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2 border-2 border-black">
                <div className="font-bold">{data?.size || '8'} MB</div>
                <div className="text-[10px]">16-way, 64B line</div>
                <div className="text-[10px] mt-1">
                    <div>Latency: 40 cycles</div>
                    <div>Hit Rate: {data?.hitRate || 0}%</div>
                </div>
            </div>
        </NodeWrapper>
    );
});
