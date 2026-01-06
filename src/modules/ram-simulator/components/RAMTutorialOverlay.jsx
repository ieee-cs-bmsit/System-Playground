import React, { useState } from 'react';
import { MemoryStick, X, ChevronRight, ChevronLeft } from 'lucide-react';

const TUTORIAL_STEPS = [
    {
        title: "Welcome to RAM Simulator Lab!",
        content: (
            <>
                <p className="mb-4">This interactive playground lets you <strong>visualize and understand</strong> how operating systems manage memory using virtual memory and paging.</p>
                <p className="mb-4">Learn about page tables, TLB, page faults, and address translation!</p>
                <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded">
                    <strong>Let's build your first virtual memory system in 3 steps!</strong>
                </div>
            </>
        )
    },
    {
        title: "Step 1: Add Memory Components",
        content: (
            <>
                <p className="mb-4">Drag components from the <strong>left sidebar</strong> onto the canvas:</p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li><strong className="text-blue-600">Physical RAM</strong> - The actual hardware memory</li>
                    <li><strong className="text-purple-600">Virtual Memory</strong> - Expanded address space</li>
                    <li><strong className="text-green-600">Page Table</strong> - Maps virtual → physical addresses</li>
                    <li><strong className="text-yellow-600">TLB</strong> - Fast lookup cache</li>
                </ul>
                <div className="bg-yellow-100 border-2 border-yellow-400 p-3 rounded text-sm">
                    💡 <strong>Tip:</strong> Start with Physical RAM and Page Table!
                </div>
            </>
        )
    },
    {
        title: "Step 2: Understanding Paging",
        content: (
            <>
                <p className="mb-4">When a program accesses memory:</p>
                <div className="bg-white border-2 border-gray-300 p-3 mb-4 rounded space-y-2 text-sm">
                    <div>1️⃣ CPU generates <strong>virtual address</strong></div>
                    <div>2️⃣ Check <strong className="text-yellow-600">TLB</strong> for fast translation</div>
                    <div>3️⃣ If TLB miss, check <strong className="text-green-600">Page Table</strong></div>
                    <div>4️⃣ If page not in RAM → <strong className="text-red-600">Page Fault!</strong></div>
                    <div>5️⃣ Load page from disk into <strong className="text-blue-600">Physical RAM</strong></div>
                </div>
                <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded text-sm">
                    💡 <strong>Key Insight:</strong> TLB dramatically speeds up address translation!
                </div>
            </>
        )
    },
    {
        title: "Step 3: Run & Observe",
        content: (
            <>
                <p className="mb-4">Use the <strong>Control Panel</strong> to simulate memory accesses:</p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li><strong className="text-green-600">▶️ Run</strong> - Auto-generate memory accesses</li>
                    <li><strong className="text-blue-600">⏭️ Step</strong> - Single memory access</li>
                    <li><strong className="text-red-600">🔄 Reset</strong> - Clear all stats</li>
                </ul>
                <p className="mb-4">Watch the <strong className="text-blue-600">Metrics Panel</strong> to see:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Page fault rate</li>
                    <li>TLB hit rate (aim for 99%+!)</li>
                    <li>Average access time</li>
                    <li>Memory utilization</li>
                </ul>
            </>
        )
    }
];

export default function RAMTutorialOverlay({ onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const step = TUTORIAL_STEPS[currentStep];

    const goNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const goPrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black shadow-comic-lg max-w-2xl w-full">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 border-b-4 border-black p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-white">
                        <MemoryStick size={32} />
                        <h2 className="font-comic text-2xl">{step.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white text-black border-2 border-black hover:bg-gray-100 font-bold flex items-center justify-center"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="min-h-[200px] text-gray-800">
                        {step.content}
                    </div>

                    <div className="flex gap-2 mt-6 mb-4">
                        {TUTORIAL_STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 flex-1 border-2 border-black ${idx === currentStep
                                        ? 'bg-green-500'
                                        : idx < currentStep
                                            ? 'bg-blue-400'
                                            : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={goPrev}
                            disabled={currentStep === 0}
                            className="px-6 py-2 border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white font-bold flex items-center gap-2"
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>

                        <span className="text-sm text-gray-600 font-mono">
                            {currentStep + 1} / {TUTORIAL_STEPS.length}
                        </span>

                        <button
                            onClick={goNext}
                            className="px-6 py-2 border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold flex items-center gap-2"
                        >
                            {currentStep === TUTORIAL_STEPS.length - 1 ? "Let's Go!" : "Next"}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
