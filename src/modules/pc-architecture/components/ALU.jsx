import React from 'react';
import { Cpu, Activity } from 'lucide-react';

/**
 * ALU Component - Arithmetic Logic Unit
 * Displays current operation and results
 */
export default function ALU({ operation, inputA, inputB, result, flags, active }) {
    const operationSymbols = {
        'ADD': '+',
        'SUB': '-',
        'AND': '&',
        'OR': '|',
        'XOR': '^',
        'SLL': '<<',
        'SRL': '>>',
        'SLT': '<'
    };

    return (
        <div className={`
            bg-white border-4 border-black shadow-comic
            p-4 min-w-[280px]
            ${active ? 'animate-pulse bg-comic-yellow' : ''}
        `}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black">
                <div className="flex items-center gap-2">
                    <Cpu size={24} className="text-comic-pink" />
                    <h3 className="font-comic font-bold text-lg uppercase">ALU</h3>
                </div>
                {active && (
                    <Activity size={20} className="text-comic-pink animate-pulse" />
                )}
            </div>

            {/* Operation Display */}
            <div className="bg-gray-100 border-2 border-black p-3 mb-3">
                <div className="text-center font-mono">
                    <div className="text-sm text-gray-600 mb-1">Operation</div>
                    <div className="text-2xl font-bold text-comic-pink">
                        {operation || 'IDLE'}
                    </div>
                </div>
            </div>

            {/* Inputs and Output */}
            <div className="space-y-2 font-mono text-sm">
                {/* Input A */}
                <div className="flex items-center justify-between bg-comic-blue bg-opacity-10 border-2 border-black p-2">
                    <span className="font-bold">Input A:</span>
                    <span className="font-mono bg-white px-2 py-1 border border-black">
                        {inputA !== undefined ? inputA.toString() : '--'}
                    </span>
                </div>

                {/* Operation Symbol */}
                <div className="text-center text-2xl text-comic-pink">
                    {operationSymbols[operation] || '?'}
                </div>

                {/* Input B */}
                <div className="flex items-center justify-between bg-comic-blue bg-opacity-10 border-2 border-black p-2">
                    <span className="font-bold">Input B:</span>
                    <span className="font-mono bg-white px-2 py-1 border border-black">
                        {inputB !== undefined ? inputB.toString() : '--'}
                    </span>
                </div>

                {/* Equals */}
                <div className="text-center text-2xl font-bold">=</div>

                {/* Result */}
                <div className="flex items-center justify-between bg-green-100 border-3 border-black p-2">
                    <span className="font-bold">Result:</span>
                    <span className="font-mono font-bold bg-white px-2 py-1 border-2 border-black text-lg">
                        {result !== undefined ? result.toString() : '--'}
                    </span>
                </div>
            </div>

            {/* Status Flags */}
            {flags && (
                <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-400">
                    <div className="text-xs font-bold mb-2">FLAGS:</div>
                    <div className="grid grid-cols-4 gap-1">
                        <div className={`text-center p-1 border-2 border-black text-xs font-bold ${flags.zero ? 'bg-comic-yellow' : 'bg-gray-200'
                            }`}>
                            Z
                        </div>
                        <div className={`text-center p-1 border-2 border-black text-xs font-bold ${flags.carry ? 'bg-comic-yellow' : 'bg-gray-200'
                            }`}>
                            C
                        </div>
                        <div className={`text-center p-1 border-2 border-black text-xs font-bold ${flags.overflow ? 'bg-comic-yellow' : 'bg-gray-200'
                            }`}>
                            V
                        </div>
                        <div className={`text-center p-1 border-2 border-black text-xs font-bold ${flags.negative ? 'bg-comic-yellow' : 'bg-gray-200'
                            }`}>
                            N
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
