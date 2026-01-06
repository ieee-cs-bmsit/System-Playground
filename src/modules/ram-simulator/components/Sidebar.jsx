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

            {/* MEMORY */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-blue-500 text-white px-2 py-1 border-2 border-black">MEMORY</h3>

                <div
                    className="bg-blue-500 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'physicalram', 'Physical RAM')}
                >
                    <div className="font-bold text-xs uppercase">Physical RAM</div>
                    <div className="text-[10px]">Main Memory</div>
                </div>

                <div
                    className="bg-purple-500 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'virtualmemory', 'Virtual Memory')}
                >
                    <div className="font-bold text-xs uppercase">Virtual Memory</div>
                    <div className="text-[10px]">Address Space</div>
                </div>
            </div>

            {/* TABLES */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-green-500 text-white px-2 py-1 border-2 border-black">TRANSLATION</h3>

                <div
                    className="bg-green-500 text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'pagetable', 'Page Table')}
                >
                    <div className="font-bold text-xs uppercase">Page Table</div>
                    <div className="text-[10px]">Virtual → Physical</div>
                </div>

                <div
                    className="bg-yellow-400 text-black border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'tlb', 'TLB')}
                >
                    <div className="font-bold text-xs uppercase">TLB</div>
                    <div className="text-[10px]">Fast Lookup</div>
                </div>
            </div>
        </div>
    );
}
