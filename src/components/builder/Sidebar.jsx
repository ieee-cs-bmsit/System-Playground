import React from 'react';

export default function Sidebar() {
    const onDragStart = (event, nodeType, label) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 bg-white border-4 border-black shadow-comic flex flex-col p-4 h-full">
            <h3 className="font-comic text-xl border-b-4 border-black pb-2 mb-4 uppercase text-center bg-comic-yellow transform -rotate-1">
                Components
            </h3>

            <div className="flex flex-col gap-4 overflow-y-auto">

                {/* OS Category */}
                <div className="flex flex-col gap-2">
                    <h4 className="font-comic text-lg text-comic-blue mb-1">OS Components</h4>

                    <div
                        className="bg-white border-2 border-black p-2 shadow-comic-hover cursor-grab hover:bg-comic-cream active:cursor-grabbing transform hover:-rotate-1 transition-transform"
                        onDragStart={(event) => onDragStart(event, 'cpu', 'CPU Core')}
                        draggable
                    >
                        <div className="font-bold font-comic">CPU Core</div>
                        <div className="text-xs">Processing Unit</div>
                    </div>

                    <div
                        className="bg-white border-2 border-black p-2 shadow-comic-hover cursor-grab hover:bg-comic-cream active:cursor-grabbing transform hover:rotate-1 transition-transform"
                        onDragStart={(event) => onDragStart(event, 'scheduler', 'Scheduler')}
                        draggable
                    >
                        <div className="font-bold font-comic">Scheduler</div>
                        <div className="text-xs">Process Manager</div>
                    </div>

                    <div
                        className="bg-white border-2 border-black p-2 shadow-comic-hover cursor-grab hover:bg-comic-cream active:cursor-grabbing transform hover:-rotate-1 transition-transform"
                        onDragStart={(event) => onDragStart(event, 'process', 'Process')}
                        draggable
                    >
                        <div className="font-bold font-comic">Process</div>
                        <div className="text-xs">Task/Job</div>
                    </div>
                </div>

                {/* Generator (Source) */}
                <div className="flex flex-col gap-2 mt-4">
                    <h4 className="font-comic text-lg text-comic-pink mb-1">Helpers</h4>
                    <div
                        className="bg-white border-2 border-black p-2 shadow-comic-hover cursor-grab hover:bg-comic-cream active:cursor-grabbing"
                        onDragStart={(event) => onDragStart(event, 'generator', 'Process Generator')}
                        draggable
                    >
                        <div className="font-bold font-comic">Generator</div>
                        <div className="text-xs">Spawns Processes</div>
                    </div>
                </div>

            </div>
        </aside>
    );
}
