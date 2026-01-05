import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [];
const initialEdges = [];

export default function Canvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div className="w-full h-full bg-white border-4 border-black shadow-comic-lg relative" data-testid="flow-canvas">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background
                    color="#aaa"
                    gap={20}
                    size={2}
                    variant="dots"
                    className="bg-comic-cream"
                />
                <Controls className="border-2 border-black shadow-comic bg-white rounded-none p-1" />
                <MiniMap
                    className="border-2 border-black shadow-comic bg-white"
                    maskColor="rgba(240, 240, 240, 0.6)"
                />
            </ReactFlow>

            {/* Decorative Label */}
            <div className="absolute top-0 left-0 bg-comic-yellow border-b-4 border-r-4 border-black px-4 py-1 z-10">
                <span className="font-comic text-xl">System Blueprint</span>
            </div>
        </div>
    );
}
