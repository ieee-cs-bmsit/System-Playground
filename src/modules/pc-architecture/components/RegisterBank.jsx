import React from 'react';
import { Database } from 'lucide-react';

/**
 * Register Bank Component
 * Displays all CPU registers with current values
 */
export default function RegisterBank({ registers, highlightedRegister, specialRegisters }) {
    // Register names (RISC-V style)
    const registerNames = {
        0: 'zero', 1: 'ra', 2: 'sp', 3: 'gp', 4: 'tp',
        5: 't0', 6: 't1', 7: 't2', 8: 's0/fp', 9: 's1',
        10: 'a0', 11: 'a1', 12: 'a2', 13: 'a3', 14: 'a4', 15: 'a5',
        16: 'a6', 17: 'a7', 18: 's2', 19: 's3', 20: 's4', 21: 's5',
        22: 's6', 23: 's7', 24: 's8', 25: 's9', 26: 's10', 27: 's11',
        28: 't3', 29: 't4', 30: 't5', 31: 't6'
    };

    const getRegisterValue = (index) => {
        if (!registers) return 0;
        if (Array.isArray(registers)) return Number(registers[index] || 0n);
        return Number(registers[index] || 0);
    };

    return (
        <div className="bg-white border-4 border-black shadow-comic p-4 min-w-[320px] max-h-[600px] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black sticky top-0 bg-white">
                <Database size={24} className="text-comic-blue" />
                <h3 className="font-comic font-bold text-lg uppercase">Register Bank</h3>
            </div>

            {/* Register Grid */}
            <div className="space-y-1">
                {Array.from({ length: 32 }, (_, i) => i).map(index => {
                    const value = getRegisterValue(index);
                    const isHighlighted = highlightedRegister === index;
                    const isSpecial = specialRegisters?.includes(index);
                    const isNonZero = value !== 0;

                    return (
                        <div
                            key={index}
                            className={`
                                flex items-center justify-between p-2 border-2 border-black
                                transition-all duration-200
                                ${isHighlighted ? 'bg-comic-yellow scale-105 shadow-comic' : ''}
                                ${!isHighlighted && isNonZero ? 'bg-green-50' : ''}
                                ${!isHighlighted && !isNonZero ? 'bg-gray-50' : ''}
                                ${isSpecial ? 'border-comic-pink border-3' : ''}
                            `}
                        >
                            {/* Register Name */}
                            <div className="flex items-center gap-2 min-w-[80px]">
                                <span className="font-mono font-bold text-xs text-gray-600">
                                    x{index}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {registerNames[index]}
                                </span>
                            </div>

                            {/* Register Value */}
                            <div className="flex items-center gap-2">
                                <div className="font-mono text-sm bg-white px-2 py-1 border border-black min-w-[80px] text-right">
                                    {value.toString().padStart(8, '0')}
                                </div>
                                <div className="text-xs text-gray-500 font-mono w-16 text-right">
                                    0x{value.toString(16).toUpperCase().padStart(8, '0')}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Special Registers Section */}
            {specialRegisters && specialRegisters.length > 0 && (
                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-400">
                    <div className="text-xs font-bold mb-2 text-comic-pink">SPECIAL REGISTERS:</div>
                    <div className="text-xs text-gray-600 space-y-1">
                        {specialRegisters.map(idx => (
                            <div key={idx} className="flex items-center gap-1">
                                <span className="w-4 h-4 bg-comic-pink border border-black inline-block"></span>
                                <span className="font-mono">x{idx} ({registerNames[idx]})</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
