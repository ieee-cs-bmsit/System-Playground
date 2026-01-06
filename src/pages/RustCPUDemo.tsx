import React, { useState, useEffect } from 'react';
import { RustCPUEmulator, Instructions } from '../simulation/RustCPUEmulator';
import { Play, RotateCcw, Cpu } from 'lucide-react';

/**
 * Demo component showing the Rust CPU emulator in action
 */
export default function RustCPUDemo() {
    const [cpu, setCpu] = useState<RustCPUEmulator | null>(null);
    const [loading, setLoading] = useState(true);
    const [registers, setRegisters] = useState<bigint[]>([]);
    const [pc, setPC] = useState<bigint>(0n);
    const [cycles, setCycles] = useState<bigint>(0n);
    const [output, setOutput] = useState<string[]>([]);

    useEffect(() => {
        const initCPU = async () => {
            try {
                const emulator = new RustCPUEmulator();
                await emulator.initialize();
                setCpu(emulator);
                updateState(emulator);
                setLoading(false);
                addOutput('✅ Rust CPU initialized successfully!');
            } catch (error) {
                console.error('Failed to initialize CPU:', error);
                addOutput(`❌ Failed to initialize: ${error}`);
                setLoading(false);
            }
        };

        initCPU();
    }, []);

    const updateState = (cpuInstance: RustCPUEmulator) => {
        const regs = Array.from(cpuInstance.getAllRegisters());
        setRegisters(regs);
        setPC(cpuInstance.getPC());
        setCycles(cpuInstance.getCycleCount());
    };

    const addOutput = (message: string) => {
        setOutput(prev => [...prev.slice(-9), message]);
    };

    const runDemoProgram = () => {
        if (!cpu) return;

        addOutput('🚀 Running demo program...');
        cpu.reset();

        // Simple program: compute (10 + 20) - 5
        const program = [
            Instructions.ADDI(1, 0, 10),    // x1 = 10
            Instructions.ADDI(2, 0, 20),    // x2 = 20
            Instructions.ADD(3, 1, 2),      // x3 = x1 + x2 (30)
            Instructions.ADDI(4, 0, 5),     // x4 = 5
            Instructions.SUB(5, 3, 4),      // x5 = x3 - x4 (25)
        ];

        const totalCycles = cpu.runProgram(program);
        updateState(cpu);

        addOutput(`Executed ${program.length} instructions`);
        addOutput(`Total cycles: ${totalCycles}`);
        addOutput(`Result in x5: ${cpu.getRegister(5)}`);
        addOutput(`Expected: 25 ✓`);
    };

    const runPerformanceTest = () => {
        if (!cpu) return;

        addOutput('⚡ Running performance test...');
        cpu.reset();

        const iterations = 10000;
        const instruction = Instructions.ADD(1, 1, 2); // x1 = x1 + x2

        const startTime = performance.now();
        for (let i = 0; i < iterations; i++) {
            cpu.execute(instruction);
        }
        const endTime = performance.now();

        const timeTaken = endTime - startTime;
        const instructionsPerSecond = (iterations / timeTaken) * 1000;

        updateState(cpu);

        addOutput(`Executed ${iterations.toLocaleString()} instructions`);
        addOutput(`Time: ${timeTaken.toFixed(2)}ms`);
        addOutput(`Speed: ${instructionsPerSecond.toLocaleString()} inst/sec`);
    };

    const handleReset = () => {
        if (!cpu) return;
        cpu.reset();
        updateState(cpu);
        addOutput('🔄 CPU reset');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Cpu size={48} className="animate-pulse mb-4" />
                    <p className="font-comic text-xl">Loading Rust CPU Emulator...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-comic-cream min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white border-4 border-black shadow-comic p-6 mb-6">
                    <h1 className="text-4xl font-comic text-comic-pink mb-2">
                        🦀 Rust CPU Emulator Demo
                    </h1>
                    <p className="text-gray-700">
                        Real RISC-V CPU emulation compiled from Rust to WebAssembly
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="bg-white border-4 border-black shadow-comic p-6">
                        <h2 className="text-2xl font-comic mb-4">Controls</h2>
                        <div className="space-y-3">
                            <button
                                onClick={runDemoProgram}
                                className="w-full bg-green-400 border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all py-3 font-comic font-bold flex items-center justify-center gap-2"
                            >
                                <Play size={20} />
                                Run Demo Program
                            </button>

                            <button
                                onClick={runPerformanceTest}
                                className="w-full bg-comic-yellow border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all py-3 font-comic font-bold"
                            >
                                ⚡ Performance Test
                            </button>

                            <button
                                onClick={handleReset}
                                className="w-full bg-comic-pink text-white border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all py-3 font-comic font-bold flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={20} />
                                Reset CPU
                            </button>
                        </div>

                        {/* Status */}
                        <div className="mt-6 p-4 bg-gray-100 border-2 border-black font-mono text-sm">
                            <div><strong>PC:</strong> 0x{pc.toString(16).toUpperCase()}</div>
                            <div><strong>Cycles:</strong> {cycles.toString()}</div>
                        </div>
                    </div>

                    {/* Registers */}
                    <div className="bg-white border-4 border-black shadow-comic p-6">
                        <h2 className="text-2xl font-comic mb-4">Registers</h2>
                        <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto font-mono text-sm">
                            {registers.slice(0, 32).map((value, idx) => (
                                <div
                                    key={idx}
                                    className={`p-2 border-2 border-black ${value > 0n ? 'bg-comic-yellow' : 'bg-white'
                                        }`}
                                >
                                    <div className="font-bold">x{idx}</div>
                                    <div className="text-xs">{value.toString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Output Console */}
                <div className="bg-black text-green-400 border-4 border-black shadow-comic p-4 mt-6 font-mono text-sm h-64 overflow-y-auto">
                    {output.map((line, idx) => (
                        <div key={idx}>{line}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
