import React, { useState, useEffect } from 'react';
import { RustCPUEmulator, Instructions } from '../../../simulation/RustCPUEmulator';
import { Play, RotateCcw } from 'lucide-react';
import ALU from './ALU';
import RegisterBank from './RegisterBank';

/**
 * Simple PC Architecture Demo using Rust CPU
 * This is a simplified simulation for Level 1
 */
export default function SimpleCPUDemo() {
    const [cpu, setCpu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registers, setRegisters] = useState([]);
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        initializeCPU();
    }, []);

    const initializeCPU = async () => {
        try {
            const emulator = new RustCPUEmulator();
            await emulator.initialize();
            setCpu(emulator);
            updateDisplay(emulator);
            setLoading(false);
            addOutput('✅ CPU Ready');
        } catch (error) {
            setLoading(false);
            addOutput(`❌ ${error.message}`);
        }
    };

    const updateDisplay = (cpuInstance) => {
        const regs = Array.from(cpuInstance.getAllRegisters());
        setRegisters(regs);
    };

    const addOutput = (message) => {
        setOutput(prev => [...prev.slice(-3), message]);
    };

    const runDemo = () => {
        if (!cpu || isRunning) return;

        setIsRunning(true);
        cpu.reset();
        addOutput('🚀 Running...');

        // Simple demo: x3 = x1 + x2
        const program = [
            { inst: Instructions.ADDI(1, 0, 10), desc: 'x1 = 10' },
            { inst: Instructions.ADDI(2, 0, 20), desc: 'x2 = 20' },
            { inst: Instructions.ADD(3, 1, 2), desc: 'x3 = x1 + x2' },
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index >= program.length) {
                clearInterval(interval);
                setIsRunning(false);
                addOutput('✅ Done! x3 = 30');
                return;
            }

            const { inst, desc } = program[index];
            addOutput(desc);
            cpu.execute(inst);
            updateDisplay(cpu);
            index++;
        }, 800);
    };

    const handleReset = () => {
        if (!cpu) return;
        cpu.reset();
        updateDisplay(cpu);
        setOutput(['🔄 Reset']);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="font-comic text-xl">Loading CPU...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={runDemo}
                    disabled={isRunning}
                    className={`px-4 py-2 border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all font-comic font-bold flex items-center gap-2 ${isRunning ? 'bg-gray-300' : 'bg-green-400'
                        }`}
                >
                    <Play size={16} />
                    Run
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-comic-yellow border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all font-comic font-bold flex items-center gap-2"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>

            {/* Components */}
            <div className="grid grid-cols-2 gap-4">
                <RegisterBank registers={registers} specialRegisters={[1, 2, 3]} />
                <ALU operation="ADD" inputA={10} inputB={20} result={30} />
            </div>

            {/* Output */}
            <div className="bg-black text-green-400 border-4 border-black p-3 font-mono text-sm h-24">
                {output.map((line, idx) => (
                    <div key={idx}>{line}</div>
                ))}
            </div>
        </div>
    );
}
