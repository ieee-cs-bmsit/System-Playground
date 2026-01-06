import React from 'react';
import { Info, X, ArrowRight } from 'lucide-react';

export default function ResourceTutorial({ onClose }) {
    const [step, setStep] = React.useState(0);

    const steps = [
        {
            title: "What are Resources?",
            content: (
                <>
                    <p className="mb-3">Resources are <strong>shared system components</strong> that processes need to run.</p>
                    <div className="bg-blue-50 border-2 border-blue-400 p-3 rounded">
                        <div className="font-bold mb-2">3 Types:</div>
                        <ul className="space-y-1 text-sm">
                            <li>🟣 <strong>Memory</strong> - RAM allocation</li>
                            <li>🟠 <strong>Mutex</strong> - Lock (only 1 process at a time)</li>
                            <li>🟢 <strong>I/O Device</strong> - Disk, printer, network</li>
                        </ul>
                    </div>
                </>
            )
        },
        {
            title: "How to Use Resources",
            content: (
                <>
                    <p className="mb-3">Follow these steps to simulate resource allocation:</p>
                    <ol className="list-decimal ml-5 space-y-2">
                        <li>
                            <strong>Drag Resources</strong> onto the canvas
                            <div className="text-xs text-gray-600 mt-1">From the "Resources" section in the sidebar</div>
                        </li>
                        <li>
                            <strong>Connect Process → Resource</strong>
                            <div className="text-xs text-gray-600 mt-1">Shows the process needs this resource</div>
                        </li>
                        <li>
                            <strong>Connect Resource → Scheduler</strong>
                            <div className="text-xs text-gray-600 mt-1">Allows scheduler to manage allocation</div>
                        </li>
                    </ol>
                </>
            )
        },
        {
            title: "Deadlock Detection",
            content: (
                <>
                    <p className="mb-3">A <strong>deadlock</strong> occurs when processes wait for each other's resources forever.</p>

                    <div className="bg-red-50 border-2 border-red-400 p-3 mb-3">
                        <div className="font-bold text-red-700 mb-2">Example: Circular Wait</div>
                        <div className="font-mono text-xs space-y-1">
                            <div>Process A holds Mutex1, wants Mutex2</div>
                            <div>Process B holds Mutex2, wants Mutex1</div>
                            <div className="text-red-600 font-bold mt-2">➔ DEADLOCK!</div>
                        </div>
                    </div>

                    <div className="text-sm">
                        <strong>The DeadlockPanel</strong> (bottom-right) will:
                        <ul className="list-disc ml-5 mt-1">
                            <li>Turn RED when deadlock detected</li>
                            <li>Show which processes are stuck</li>
                            <li>Offer recovery (kill a process)</li>
                        </ul>
                    </div>
                </>
            )
        },
        {
            title: "Try It Yourself!",
            content: (
                <>
                    <p className="mb-3">Create a simple deadlock scenario:</p>
                    <div className="bg-yellow-50 border-2 border-yellow-400 p-3 space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="font-bold">1.</span>
                            <span>Add 2 Processes, 2 Mutexes</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold">2.</span>
                            <span>Connect: P1 → M1 → P2 → M2 → P1 (circular)</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold">3.</span>
                            <span>Run simulation and watch DeadlockPanel!</span>
                        </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-600 italic">
                        Tip: Resources help you understand synchronization problems in operating systems!
                    </div>
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
                <div className="bg-purple-400 border-b-4 border-black p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Info size={28} />
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
                    <div className="text-base mb-6">
                        {currentStep.content}
                    </div>

                    {/* Progress */}
                    <div className="flex gap-2 mb-4">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 flex-1 border-2 border-black ${idx <= step ? 'bg-purple-400' : 'bg-gray-200'
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
                                className="px-8 py-2 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all bg-purple-400 font-bold"
                            >
                                Got It!
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-6 py-2 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all bg-purple-400"
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
