import React from 'react';

export default function Sidebar() {
    const onDragStart = (event, nodeType, label) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-48 bg-comic-cream border-r-4 border-black p-4 overflow-y-auto h-full">
            <h2 className="font-comic text-2xl mb-4 bg-comic-yellow border-4 border-black p-2 text-center transform -rotate-1">
                Devices
            </h2>

            {/* SENSORS */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-red-400 text-white px-2 py-1 border-2 border-black">SENSORS</h3>

                <div
                    className="bg-red-400 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'temperature', 'Temperature')}
                >
                    <div className="font-bold text-xs uppercase">🌡️ Temperature</div>
                    <div className="text-[10px]">Temp Sensor</div>
                </div>

                <div
                    className="bg-blue-400 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'humidity', 'Humidity')}
                >
                    <div className="font-bold text-xs uppercase">💧 Humidity</div>
                    <div className="text-[10px]">Humidity Sensor</div>
                </div>

                <div
                    className="bg-purple-500 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'motion', 'Motion')}
                >
                    <div className="font-bold text-xs uppercase">👁️ Motion</div>
                    <div className="text-[10px]">Motion Sensor</div>
                </div>

                <div
                    className="bg-yellow-300 text-black border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'light', 'Light')}
                >
                    <div className="font-bold text-xs uppercase">💡 Light</div>
                    <div className="text-[10px]">Light Sensor</div>
                </div>
            </div>

            {/* INFRASTRUCTURE */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-green-500 text-white px-2 py-1 border-2 border-black">INFRASTRUCTURE</h3>

                <div
                    className="bg-green-500 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'gateway', 'Gateway')}
                >
                    <div className="font-bold text-xs uppercase">📡 Gateway</div>
                    <div className="text-[10px]">MQTT Broker</div>
                </div>

                <div
                    className="bg-indigo-600 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'cloud', 'Cloud')}
                >
                    <div className="font-bold text-xs uppercase">☁️ Cloud</div>
                    <div className="text-[10px]">Server</div>
                </div>
            </div>
        </div>
    );
}
