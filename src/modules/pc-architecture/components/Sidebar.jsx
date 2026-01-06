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
                Components
            </h2>

            {/* PROCESSING */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-blue-500 text-white px-2 py-1 border-2 border-black">PROCESSING</h3>

                <div
                    className="bg-blue-500 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'cpu', 'CPU')}
                >
                    <div className="font-bold text-xs uppercase">CPU</div>
                    <div className="text-[10px]">Processor</div>
                </div>
            </div>

            {/* MEMORY */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-green-500 text-white px-2 py-1 border-2 border-black">MEMORY</h3>

                <div
                    className="bg-green-500 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'ram', 'RAM')}
                >
                    <div className="font-bold text-xs uppercase">RAM</div>
                    <div className="text-[10px]">Main Memory</div>
                </div>
            </div>

            {/* STORAGE */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-purple-500 text-white px-2 py-1 border-2 border-black">STORAGE</h3>

                <div
                    className="bg-purple-500 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'storage', 'Storage')}
                >
                    <div className="font-bold text-xs uppercase">SSD</div>
                    <div className="text-[10px]">Solid State</div>
                </div>
            </div>

            {/* BUS */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-yellow-400 text-black px-2 py-1 border-2 border-black">BUS</h3>

                <div
                    className="bg-yellow-400 text-black border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'systembus', 'System Bus')}
                >
                    <div className="font-bold text-xs uppercase">System Bus</div>
                    <div className="text-[10px]">Data/Address</div>
                </div>
            </div>

            {/* BASE */}
            <div className="border-t-4 border-black pt-2">
                <h3 className="font-comic text-sm mb-2 bg-gray-700 text-white px-2 py-1 border-2 border-black">BASE</h3>

                <div
                    className="bg-gray-700 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'motherboard', 'Motherboard')}
                >
                    <div className="font-bold text-xs uppercase">Motherboard</div>
                    <div className="text-[10px]">Main Board</div>
                </div>
            </div>
        </div>
    );
}
