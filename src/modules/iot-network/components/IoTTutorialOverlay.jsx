import React, { useState } from 'react';
import { Wifi, X, ChevronRight, ChevronLeft } from 'lucide-react';

const TUTORIAL_STEPS = [
    {
        title: "Welcome to IoT Network Simulator!",
        content: (
            <>
                <p className="mb-4">This interactive playground lets you <strong>design and visualize</strong> complete IoT sensor networks!</p>
                <p className="mb-4">Learn about sensors, gateways, protocols, and power management.</p>
                <div className="bg-green-100 border-2 border-green-400 p-3 rounded">
                    <strong>Let's build your first IoT network in 3 steps!</strong>
                </div>
            </>
        )
    },
    {
        title: "Step 1: Add Sensors",
        content: (
            <>
                <p className="mb-4">Drag sensors from the <strong>left sidebar</strong> onto the canvas:</p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li><strong className="text-red-600">🌡️ Temperature</strong> - Monitors temperature (°C)</li>
                    <li><strong className="text-blue-600">💧 Humidity</strong> - Measures humidity (%)</li>
                    <li><strong className="text-purple-600">👁️ Motion</strong> - Detects movement</li>
                    <li><strong className="text-yellow-600">💡 Light</strong> - Measures brightness (lux)</li>
                </ul>
                <div className="bg-yellow-100 border-2 border-yellow-400 p-3 rounded text-sm">
                    💡 <strong>Tip:</strong> Each sensor has a battery that drains over time!
                </div>
            </>
        )
    },
    {
        title: "Step 2: Add Infrastructure",
        content: (
            <>
                <p className="mb-4">Build your network infrastructure:</p>
                <div className="bg-white border-2 border-gray-300 p-3 mb-4 rounded space-y-2 text-sm">
                    <div>1️⃣ Add a <strong className="text-green-600">Gateway</strong> (MQTT broker)</div>
                    <div className="ml-4 text-xs">→ Collects data from sensors</div>
                    <div>2️⃣ Add a <strong className="text-indigo-600">Cloud Server</strong></div>
                    <div className="ml-4 text-xs">→ Stores and processes data</div>
                    <div>3️⃣ Connect them: Sensors → Gateway → Cloud</div>
                </div>
                <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded text-sm">
                    💡 <strong>MQTT Protocol:</strong> Lightweight pub/sub messaging (20B overhead)
                </div>
            </>
        )
    },
    {
        title: "Step 3: Run & Monitor",
        content: (
            <>
                <p className="mb-4">Use the <strong>Control Panel</strong> to run your network:</p>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li><strong className="text-green-600">▶️ Run</strong> - Start data collection</li>
                    <li><strong className="text-blue-600">⏭️ Step</strong> - Advance one timestep</li>
                    <li><strong className="text-red-600">🔄 Reset</strong> - Clear everything</li>
                </ul>
                <p className="mb-4">Watch the <strong className="text-green-600">Metrics Panel</strong>:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Active vs dead devices</li>
                    <li>Message delivery rate</li>
                    <li>Average battery level 🔋</li>
                    <li>Network throughput</li>
                </ul>
            </>
        )
    }
];

export default function IoTTutorialOverlay({ onClose }) {
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
                <div className="bg-gradient-to-r from-green-500 to-blue-500 border-b-4 border-black p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-white">
                        <Wifi size={32} />
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
                            className="px-6 py-2 border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold flex items-center gap-2"
                        >
                            {currentStep === TUTORIAL_STEPS.length - 1 ? "Start Building!" : "Next"}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
