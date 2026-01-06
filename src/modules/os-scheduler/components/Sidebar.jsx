import React from 'react';

export default function Sidebar() {
    const onDragStart = (event, nodeType, label) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    const showResourceTutorial = () => {
        window.dispatchEvent(new CustomEvent('showResourceTutorial'));
    };

    return (
        <div className="w-48 bg-comic-cream border-r-4 border-black p-4 overflow-y-auto h-full">
            <h2 className="font-comic text-2xl mb-4 bg-comic-yellow border-4 border-black p-2 text-center transform -rotate-1">
                Components
            </h2>

            {/* OS COMPONENTS */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-comic-blue text-white px-2 py-1 border-2 border-black">OS COMPONENTS</h3>

                <div
                    className="bg-comic-blue text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'cpu', 'CPU Core')}
                >
                    <div className="font-bold text-xs uppercase">CPU Core</div>
                    <div className="text-[10px]">Processing Unit</div>
                </div>

                <div
                    className="bg-comic-yellow text-black border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'scheduler', 'Scheduler')}
                >
                    <div className="font-bold text-xs uppercase">Scheduler</div>
                    <div className="text-[10px]">Process Manager</div>
                </div>

                <div
                    className="bg-green-400 text-black border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'process', 'Process')}
                >
                    <div className="font-bold text-xs uppercase">Process</div>
                    <div className="text-[10px]">Task/Job</div>
                </div>
            </div>

            {/* HELPERS */}
            <div className="mb-4">
                <h3 className="font-comic text-sm mb-2 bg-comic-pink text-white px-2 py-1 border-2 border-black">HELPERS</h3>

                <div
                    className="bg-comic-pink text-white border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'generator', 'Process Generator')}
                >
                    <div className="font-bold text-xs uppercase">Generator</div>
                    <div className="text-[10px]">Spawns Processes</div>
                </div>
            </div>

            {/* RESOURCES */}
            <div className="border-t-4 border-black pt-2">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-comic text-sm bg-purple-400 text-black px-2 py-1 border-2 border-black">RESOURCES</h3>
                    <button
                        onClick={showResourceTutorial}
                        className="bg-purple-400 border-2 border-black px-2 py-1 text-xs font-bold hover:bg-purple-500"
                        title="How to use resources"
                    >
                        ?
                    </button>
                </div>

                <div
                    className="bg-purple-400 text-black border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'memory', 'Memory Resource')}
                >
                    <div className="font-bold text-xs uppercase">Memory</div>
                    <div className="text-[10px]">Shared RAM</div>
                </div>

                <div
                    className="bg-orange-400 text-black border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'mutex', 'Mutex Lock')}
                >
                    <div className="font-bold text-xs uppercase">Mutex</div>
                    <div className="text-[10px]">Lock/Unlock</div>
                </div>

                <div
                    className="bg-teal-400 text-black border-4 border-black mb-2 p-3 cursor-grab hover:shadow-comic-lg transition-all active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => onDragStart(e, 'iodevice', 'I/O Device')}
                >
                    <div className="font-bold text-xs uppercase">I/O Device</div>
                    <div className="text-[10px]">Disk/Network</div>
                </div>
            </div>
        </div>
    );
}
