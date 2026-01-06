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
import { CPUNode, RAMNode, StorageNode, SystemBusNode, MotherboardNode } from '../nodes/ArchitectureNodes';
import useArchitectureStore from '../store/architectureStore';

const initialNodes = [];
const initialEdges = [];

function CanvasInner() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const nodeTypes = useMemo(() => ({
        cpu: CPUNode,
        ram: RAMNode,
        storage: StorageNode,
        systembus: SystemBusNode,
        motherboard: MotherboardNode
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
            data: { label, clockSpeed: 3.0, size: 8192, cores: 1 }
        };


        // BUG FIX: Use spread operator instead of concat
        setNodes((nds) => [...nds, newNode]);

        // Update store
        useArchitectureStore.getState().updateFromNode(newNode.id, type, newNode.data);
    }, [setNodes]);

    return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50">
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
                            case 'cpu': return '#3b82f6';
                            case 'ram': return '#22c55e';
                            case 'storage': return '#a855f7';
                            case 'systembus': return '#eab308';
                            case 'motherboard': return '#1f2937';
                            case 'l1cache': return '#22d3ee';
                            case 'l2cache': return '#3b82f6';
                            case 'l3cache': return '#4f46e5';
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
