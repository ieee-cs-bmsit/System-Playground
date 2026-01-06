import React from 'react';
import { Cpu, HardDrive, Wifi, CircuitBoard, Battery, Monitor } from 'lucide-react';

const modules = [
    { id: 'os-scheduler', name: 'OS Scheduler', icon: Cpu, desc: 'Visualize CPU Scheduling Algorithms (RR, FCFS)', active: true, color: 'bg-comic-blue' },
    { id: 'pc-architecture', name: 'PC Architecture', icon: Monitor, desc: 'Build Computer Systems from Scratch', active: true, color: 'bg-purple-500' },
    { id: 'ram', name: 'RAM Simulator', icon: CircuitBoard, desc: 'Paging, Virtual Memory & TLB', active: true, color: 'bg-green-500' },
    { id: 'iot', name: 'IoT Network', icon: Wifi, desc: 'Sensor Networks & MQTT Protocol', active: true, color: 'bg-pink-500' },
    { id: 'caching', name: 'Caching System', icon: HardDrive, desc: 'L1/L2 Cache Hits & Misses', active: false, color: 'bg-comic-yellow' },
];

export default function ModuleSelector({ onSelect, onBack }) {
    return (
        <div className="min-h-screen bg-comic-cream font-comic p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-comic-stripes opacity-5 pointer-events-none"></div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="mb-6 bg-white px-6 py-3 border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all font-comic font-bold text-xl transform -rotate-1"
                    >
                        ← BACK TO HOME
                    </button>
                )}

                <h1 className="text-6xl text-center mb-16 text-black drop-shadow-[4px_4px_0_#fff] text-stroke-white">
                    Select Your Lab
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((mod) => (
                        <div
                            key={mod.id}
                            onClick={() => mod.active && onSelect(mod.id)}
                            className={`
                                relative border-4 border-black p-6 shadow-comic-lg transition-all
                                ${mod.active ? 'hover:-translate-y-2 hover:shadow-comic cursor-pointer bg-white' : 'opacity-70 grayscale cursor-not-allowed bg-gray-100'}
                            `}
                        >
                            <div className={`absolute -top-6 -right-6 w-16 h-16 ${mod.color} border-4 border-black rounded-full flex items-center justify-center transform rotate-12`}>
                                <mod.icon size={32} color="black" />
                            </div>

                            <h2 className="text-3xl mb-2">{mod.name}</h2>
                            <p className="font-body font-bold text-gray-600 mb-4">{mod.desc}</p>

                            {!mod.active && (
                                <div className="bg-black text-white px-2 py-1 text-sm inline-block transform -rotate-2">
                                    COMING SOON
                                </div>
                            )}

                            {mod.active && (
                                <button className="w-full bg-comic-yellow border-2 border-black font-bold py-2 hover:bg-yellow-300 transition-colors">
                                    ENTER LAB
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
