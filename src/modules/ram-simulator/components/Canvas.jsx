import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PhysicalRAMNode, VirtualMemoryNode, PageTableNode, TLBNode } from '../nodes/MemoryNodes';
import useRAMStore from '../store/ramStore';

const initialNodes = [];
const initialEdges = [];

function CanvasInner() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const initializeMemory = useRAMStore(state => state.initializeMemory);

    const nodeTypes = useMemo(() => ({
        physicalram: PhysicalRAMNode,
        virtualmemory: VirtualMemoryNode,
        pagetable: PageTableNode,
        tlb: TLBNode
    }), []);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: '#000', strokeWidth: 3 },
        type: 'default'
    }, eds)), [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow');
        const label = event.dataTransfer.getData('application/label');

        if (!type) return;

        const reactFlowBounds = event.target.getBoundingClientRect();
        const position = {
            x: event.clientX - reactFlowBounds.left - 75,
            y: event.clientY - reactFlowBounds.top - 40,
        };

        const newNode = {
            id: `${type}_${Date.now()}`,
            type,
            position,
            data: { label, size: 16, pageSize: 4, entries: 64, assoc: 4 }
        };

        setNodes((nds) => nds.concat(newNode));

        // Initialize memory on first PhysicalRAM drop
        if (type === 'physicalram' && !useRAMStore.getState().physicalRAM) {
            initializeMemory();
        }
    }, [setNodes, initializeMemory]);

    return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#aaa" gap={16} />
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case 'physicalram': return '#3b82f6';
                            case 'virtualmemory': return '#a855f7';
                            case 'pagetable': return '#22c55e';
                            case 'tlb': return '#eab308';
                            default: return '#999';
                        }
                    }}
                    style={{ background: '#f3f4f6', border: '2px solid black' }}
                />
            </ReactFlow>
        </div>
    );
}

export default function Canvas() {
    return (
        <ReactFlowProvider>
            <CanvasInner />
        </ReactFlowProvider>
    );
}
