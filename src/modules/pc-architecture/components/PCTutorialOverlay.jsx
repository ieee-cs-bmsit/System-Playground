import React, { useState } from 'react';
import { Monitor, X, ChevronRight, ChevronLeft } from 'lucide-react';

const TUTORIAL_STEPS = [
    {
        title: "Welcome to PC Architecture Lab!",
        content: (
            <>
                <p className="mb-4">This interactive playground lets you <strong>build and visualize</strong> complete computer systems from scratch.</p>
                <p className="mb-4">Learn how CPUs, memory, storage, and buses work together to create a functioning computer!</p>
                <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded">
                    <strong>Let's build your first computer in 3 simple steps!</strong>
                </div>
            </>
        )
    },
    {
        title: "Step 1: Add Components",
        content: (
            <>
                <p className="mb-4">Drag components from the <strong>left sidebar</strong> onto the canvas:</p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li><strong className="text-blue-600">CPU</strong> - The brain of your computer</li>
                    <li><strong className="text-green-600">RAM</strong> - Fast memory for running programs</li>
                    <li><strong className="text-purple-600">Storage</strong> - SSD to store data</li>
                    <li><strong className="text-yellow-600">System Bus</strong> - Connects everything together</li>
                </ul>
                <div className="bg-yellow-100 border-2 border-yellow-400 p-3 rounded text-sm">
                    💡 <strong>Tip:</strong> Click and drag any component from the sidebar!
                </div>
            </>
        )
    },
    {
        title: "Step 2: Connect Components",
        content: (
            <>
                <p className="mb-4">Connect components by dragging from the <strong>small circles (●)</strong> on each component:</p>
                <div className="bg-white border-2 border-gray-300 p-3 mb-4 rounded">
                    <div className="font-mono text-sm space-y-2">
                        <div>CPU ← → System Bus</div>
                        <div>RAM ← → System Bus</div>
                        <div>Storage ← → System Bus</div>
                    </div>
                </div>
                <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded text-sm">
                    💡 <strong>Tip:</strong> Curved animated lines show data flowing between components!
                </div>
            </>
        )
    },
    {
        title: "Step 3: Run & Monitor",
        content: (
            <>
                <p className="mb-4">Use the <strong>Control Panel</strong> at the bottom to:</p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li><strong className="text-green-600">▶️ Run</strong> - Start the simulation</li>
                    <li><strong className="text-blue-600">⏭️ Step</strong> - Advance one clock cycle</li>
                    <li><strong className="text-red-600">🔄 Reset</strong> - Start over</li>
                </ul>
                <p className="mb-4">Watch the <strong className="text-blue-600">Metrics Panel</strong> (top-right) to see:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>IPC (Instructions Per Cycle)</li>
                    <li>Memory bandwidth</li>
                    <li>Power consumption</li>
                    <li>System cost</li>
                </ul>
            </>
        )
    }
];

export default function PCTutorialOverlay({ onClose }) {
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
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 border-b-4 border-black p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-white">
                        <Monitor size={32} />
                        <h2 className="font-comic text-2xl">{step.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white text-black border-2 border-black hover:bg-gray-100 font-bold flex items-center justify-center"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="min-h-[200px] text-gray-800">
                        {step.content}
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex gap-2 mt-6 mb-4">
                        {TUTORIAL_STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 flex-1 border-2 border-black ${idx === currentStep
                                        ? 'bg-purple-500'
                                        : idx < currentStep
                                            ? 'bg-blue-400'
                                            : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation */}
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
                            className="px-6 py-2 border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold flex items-center gap-2"
                        >
                            {currentStep === TUTORIAL_STEPS.length - 1 ? "Let's Build!" : "Next"}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
