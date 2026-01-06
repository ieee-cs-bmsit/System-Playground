import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function TutorialOverlay({ onClose }) {
    const [step, setStep] = React.useState(0);

    const steps = [
        {
            title: "Welcome to OS Scheduler Lab!",
            content: (
                <>
                    <p className="mb-3">This interactive playground lets you <strong>build and visualize</strong> how operating systems schedule processes.</p>
                    <p>Let's learn the basics in 3 simple steps!</p>
                </>
            )
        },
        {
            title: "Step 1: Add Components",
            content: (
                <>
                    <p className="mb-3">From the <strong>left sidebar</strong>, drag these components onto the canvas:</p>
                    <ul className="list-disc ml-5 space-y-1">
                        <li><span className="font-bold text-comic-pink">Generator</span> - Spawns processes automatically</li>
                        <li><span className="font-bold text-comic-yellow">Scheduler</span> - Manages the ready queue</li>
                        <li><span className="font-bold text-comic-blue">CPU</span> - Executes processes</li>
                    </ul>
                </>
            )
        },
        {
            title: "Step 2: Connect Them",
            content: (
                <>
                    <p className="mb-3">Click and drag from a component's <strong>handle</strong> (small circle) to another component's handle to create connections.</p>
                    <div className="bg-blue-50 border-2 border-blue-400 p-3 rounded">
                        <div className="font-bold mb-1">Proper Flow:</div>
                        <div className="font-mono text-sm">Generator → Scheduler → CPU</div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">The validation panel on the right will guide you!</p>
                </>
            )
        },
        {
            title: "Step 3: Run & Observe",
            content: (
                <>
                    <p className="mb-3">Once your system is valid:</p>
                    <ol className="list-decimal ml-5 space-y-2">
                        <li>Click the <strong className="text-green-600">Play</strong> button at the bottom</li>
                        <li>Watch the <strong>Gantt Chart</strong> (bottom-right) to see process execution</li>
                        <li>Monitor <strong>Metrics</strong> (top-right) to see performance</li>
                        <li>Adjust <strong>Time Quantum</strong> (bottom-left) to change scheduling behavior</li>
                    </ol>
                </>
            )
        }
    ];

    const currentStep = steps[step];
    const isLastStep = step === steps.length - 1;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black shadow-comic-lg max-w-2xl w-full">
                {/* Header */}
                <div className="bg-comic-yellow border-b-4 border-black p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <HelpCircle size={32} />
                        <h2 className="font-comic text-2xl">{currentStep.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-black text-white hover:bg-gray-800 font-bold flex items-center justify-center"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-lg mb-6">
                        {currentStep.content}
                    </div>

                    {/* Progress */}
                    <div className="flex gap-2 mb-4">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 flex-1 border-2 border-black ${idx <= step ? 'bg-comic-blue' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                            className="px-6 py-2 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            Previous
                        </button>

                        {isLastStep ? (
                            <button
                                onClick={onClose}
                                className="px-8 py-2 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all bg-green-400 font-bold"
                            >
                                Start Building!
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-6 py-2 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all bg-comic-yellow"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
