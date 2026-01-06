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
import {
    TemperatureSensorNode,
    HumiditySensorNode,
    MotionSensorNode,
    LightSensorNode,
    GatewayNode,
    CloudServerNode
} from '../nodes/IoTNodes';
import useIoTStore from '../store/iotStore';

const initialNodes = [];
const initialEdges = [];

function CanvasInner() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const addSensor = useIoTStore(state => state.addSensor);
    const addGateway = useIoTStore(state => state.addGateway);
    const initializeCloud = useIoTStore(state => state.initializeCloud);

    const nodeTypes = useMemo(() => ({
        temperature: TemperatureSensorNode,
        humidity: HumiditySensorNode,
        motion: MotionSensorNode,
        light: LightSensorNode,
        gateway: GatewayNode,
        cloud: CloudServerNode
    }), []);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: '#22c55e', strokeWidth: 3 },
        type: 'smoothstep'
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
            x: event.clientX - reactFlowBounds.left - 65,
            y: event.clientY - reactFlowBounds.top - 40,
        };

        const newNode = {
            id: `${type}_${Date.now()}`,
            type,
            position,
            data: { label, battery: 100, state: 'ACTIVE' }
        };


        // BUG FIX: Use spread operator instead of concat
        setNodes((nds) => [...nds, newNode]);

        // Add to simulation
        if (type === 'temperature' || type === 'humidity' || type === 'motion' || type === 'light') {
            addSensor(type, position);
        } else if (type === 'gateway') {
            addGateway('MQTT', position);
        } else if (type === 'cloud') {
            initializeCloud();
        }
    }, [setNodes, addSensor, addGateway, initializeCloud]);

    return (
        <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50">
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
                        const colors = {
                            temperature: '#f87171',
                            humidity: '#60a5fa',
                            motion: '#a78bfa',
                            light: '#fbbf24',
                            gateway: '#22c55e',
                            cloud: '#4f46e5'
                        };
                        return colors[node.type] || '#999';
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
