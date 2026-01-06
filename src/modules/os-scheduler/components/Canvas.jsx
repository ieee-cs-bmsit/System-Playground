import React, { useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CPUNode, SchedulerNode, ProcessNode, GeneratorNode } from '../nodes/OSNodes';
import { MemoryResourceNode, MutexResourceNode, IODeviceNode } from '../nodes/ResourceNodes';
import useSimulationStore from '../store/simulationStore';
import ValidationPanel from './ValidationPanel';

const initialNodes = [];
const initialEdges = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

function CanvasContent() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const registerNode = useSimulationStore(state => state.registerNode);

    // REGISTER CUSTOM NODE TYPES
    const nodeTypes = useMemo(() => ({
        cpu: CPUNode,
        scheduler: SchedulerNode,
        process: ProcessNode,
        generator: GeneratorNode,
        memory: MemoryResourceNode,
        mutex: MutexResourceNode,
        iodevice: IODeviceNode
    }), []);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: '#000', strokeWidth: 3 },
        type: 'default' // Using default bezier curves for thread-like appearance
    }, eds)), [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNodeId = getId();

            // Logically register in the simulation engine
            registerNode(type, newNodeId);

            const newNode = {
                id: newNodeId,
                type: type,
                position,
                data: { label: `${type}`, id: newNodeId },
            };

            // BUG FIX: Use spread operator instead of concat to ensure nodes persist
            // concat was causing existing nodes to disappear
            setNodes((nds) => [...nds, newNode]);
        },
        [screenToFlowPosition, setNodes, registerNode],
    );

    return (
        <div className="w-full h-full bg-white border-4 border-black shadow-comic-lg relative" ref={reactFlowWrapper} data-testid="flow-canvas">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={console.log}
                onDrop={onDrop}
                onDragOver={onDragOver}
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

            {/* Validation Panel - Inside ReactFlow context */}
            <ValidationPanel />

            {/* Decorative Label */}
            <div className="absolute top-0 left-0 bg-comic-yellow border-b-4 border-r-4 border-black px-4 py-1 z-10">
                <span className="font-comic text-xl">System Blueprint</span>
            </div>
        </div>
    );
}

export default function Canvas() {
    return (
        <ReactFlowProvider>
            <CanvasContent />
        </ReactFlowProvider>
    );
}
