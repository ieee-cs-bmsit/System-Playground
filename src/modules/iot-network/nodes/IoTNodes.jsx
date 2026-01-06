import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Thermometer, Droplets, Eye, Lightbulb, Wifi, Cloud } from 'lucide-react';

// Shared wrapper
const NodeWrapper = ({ children, className, label, icon: Icon, selected }) => (
    <div className={`w-32 border-4 border-black shadow-comic transform transition-all ${selected ? 'scale-110' : ''} ${className}`}>
        <div className="flex items-center gap-2 p-1 border-b-4 border-black bg-white/90">
            <Icon size={12} />
            <div className="font-comic text-[10px] uppercase">{label}</div>
        </div>
        {children}
    </div>
);

// Battery indicator component
const BatteryIndicator = ({ percentage }) => {
    const color = percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-400' : 'bg-red-500';
    return (
        <div className="w-full h-2 bg-gray-200 border border-black mt-1">
            <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
        </div>
    );
};

// TEMPERATURE SENSOR
export const TemperatureSensorNode = memo(({ id, data, selected }) => {
    const battery = data?.battery || 100;
    const state = data?.state || 'ACTIVE';

    return (
        <NodeWrapper label="Temp Sensor" icon={Thermometer} className="bg-red-400 text-white" selected={selected}>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2">
                <div className="font-bold">{data?.lastReading?.value?.toFixed(1) || '--'}°C</div>
                <div className="text-[9px]">State: {state}</div>
                <div className="text-[9px]">Batt: {battery.toFixed(0)}%</div>
                <BatteryIndicator percentage={battery} />
            </div>
        </NodeWrapper>
    );
});

// HUMIDITY SENSOR
export const HumiditySensorNode = memo(({ id, data, selected }) => {
    const battery = data?.battery || 100;
    const state = data?.state || 'ACTIVE';

    return (
        <NodeWrapper label="Humidity" icon={Droplets} className="bg-blue-400 text-white" selected={selected}>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2">
                <div className="font-bold">{data?.lastReading?.value?.toFixed(0) || '--'}%</div>
                <div className="text-[9px]">State: {state}</div>
                <div className="text-[9px]">Batt: {battery.toFixed(0)}%</div>
                <BatteryIndicator percentage={battery} />
            </div>
        </NodeWrapper>
    );
});

// MOTION SENSOR
export const MotionSensorNode = memo(({ id, data, selected }) => {
    const battery = data?.battery || 100;
    const state = data?.state || 'ACTIVE';
    const motion = data?.lastReading?.value || 0;

    return (
        <NodeWrapper label="Motion" icon={Eye} className="bg-purple-500 text-white" selected={selected}>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2">
                <div className="font-bold">{motion ? '🚶 Detected' : '⭕ None'}</div>
                <div className="text-[9px]">State: {state}</div>
                <div className="text-[9px]">Batt: {battery.toFixed(0)}%</div>
                <BatteryIndicator percentage={battery} />
            </div>
        </NodeWrapper>
    );
});

// LIGHT SENSOR
export const LightSensorNode = memo(({ id, data, selected }) => {
    const battery = data?.battery || 100;
    const state = data?.state || 'ACTIVE';

    return (
        <NodeWrapper label="Light" icon={Lightbulb} className="bg-yellow-300 text-black" selected={selected}>
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2">
                <div className="font-bold">{data?.lastReading?.value?.toFixed(0) || '--'} lux</div>
                <div className="text-[9px]">State: {state}</div>
                <div className="text-[9px]">Batt: {battery.toFixed(0)}%</div>
                <BatteryIndicator percentage={battery} />
            </div>
        </NodeWrapper>
    );
});

// GATEWAY NODE
export const GatewayNode = memo(({ id, data, selected }) => {
    const connected = data?.connected || 0;
    const protocol = data?.protocol || 'MQTT';

    return (
        <NodeWrapper label="Gateway" icon={Wifi} className="bg-green-500 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2">
                <div className="font-bold">{protocol}</div>
                <div className="text-[9px]">Devices: {connected}</div>
                <div className="text-[9px]">Msgs: {data?.messages || 0}</div>
                <div className="text-[9px]">Util: {data?.utilization?.toFixed(1) || 0}%</div>
            </div>
        </NodeWrapper>
    );
});

// CLOUD SERVER NODE
export const CloudServerNode = memo(({ id, data, selected }) => {
    return (
        <NodeWrapper label="Cloud" icon={Cloud} className="bg-indigo-600 text-white" selected={selected}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />

            <div className="text-xs bg-white text-black p-2">
                <div className="font-bold">☁️ Server</div>
                <div className="text-[9px]">Messages: {data?.messages || 0}</div>
                <div className="text-[9px]">Storage: {data?.storage?.toFixed(2) || 0} GB</div>
            </div>
        </NodeWrapper>
    );
});
