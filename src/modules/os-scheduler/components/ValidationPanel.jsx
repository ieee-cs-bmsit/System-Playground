import React from 'react';
import { AlertCircle, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { ConnectionValidator } from '../validation/ConnectionValidator';

export default function ValidationPanel() {
    const reactFlow = useReactFlow();
    const [validation, setValidation] = React.useState(null);
    const [isExpanded, setIsExpanded] = React.useState(true);

    const runValidation = React.useCallback(() => {
        try {
            const nodes = reactFlow.getNodes();
            const edges = reactFlow.getEdges();
            const validator = new ConnectionValidator(nodes, edges);
            const result = validator.validate();
            setValidation(result);
        } catch (error) {
            console.error('Validation error:', error);
        }
    }, [reactFlow]);

    // Re-validate when nodes or edges change
    React.useEffect(() => {
        const nodes = reactFlow.getNodes();
        const edges = reactFlow.getEdges();

        const timer = setTimeout(runValidation, 300);
        return () => clearTimeout(timer);
    }, [reactFlow.getNodes().length, reactFlow.getEdges().length, runValidation]);

    if (!validation) return null;

    const { isValid, errors, warnings } = validation;
    const nodes = reactFlow.getNodes();
    const edges = reactFlow.getEdges();

    return (
        <div className="fixed top-24 right-4 w-80 bg-white border-4 border-black shadow-comic-lg z-50">
            {/* Collapsible Header */}
            <div
                className={`border-b-4 border-black p-3 flex items-center justify-between cursor-pointer ${isValid ? 'bg-green-400' : 'bg-red-400'
                    }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    {isValid ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-comic text-lg">
                        {isValid ? 'Valid ✓' : 'Setup Required'}
                    </span>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="p-4 max-h-96 overflow-y-auto">
                    {/* Getting Started Guide */}
                    {nodes.length === 0 && (
                        <div className="bg-blue-50 border-2 border-blue-400 p-3 mb-3">
                            <div className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                                <Info size={18} />
                                Quick Start
                            </div>
                            <ol className="text-sm space-y-1 text-gray-700">
                                <li>1. Drag components from sidebar</li>
                                <li>2. Connect: Generator → Scheduler → CPU</li>
                                <li>3. Press Play</li>
                            </ol>
                        </div>
                    )}

                    {/* Current Status */}
                    <div className="mb-3 text-sm bg-gray-50 p-2 border-l-4 border-gray-400">
                        <div className="flex justify-between mb-1">
                            <span>Components:</span>
                            <span className="font-mono font-bold">{nodes.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Connections:</span>
                            <span className="font-mono font-bold">{edges.length}</span>
                        </div>
                    </div>

                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="mb-3">
                            <div className="font-bold text-red-600 mb-2 text-sm">
                                ❌ Errors ({errors.length})
                            </div>
                            <div className="space-y-2">
                                {errors.slice(0, 3).map((error, idx) => (
                                    <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-2 text-xs">
                                        <div className="text-gray-700">{error.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Warnings */}
                    {warnings.length > 0 && (
                        <div className="mb-3">
                            <div className="font-bold text-yellow-600 mb-2 text-sm">
                                ⚠️ Warnings ({warnings.length})
                            </div>
                            <div className="space-y-2">
                                {warnings.slice(0, 2).map((warning, idx) => (
                                    <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-500 p-2 text-xs">
                                        <div className="text-gray-700">{warning.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Fix */}
                    {!isValid && nodes.length > 0 && (
                        <div className="bg-blue-50 border-2 border-blue-400 p-2 text-xs">
                            <div className="font-bold text-blue-700 mb-1">💡 Fix:</div>
                            <div className="text-gray-700">
                                Drag from node handle (●) to another node's handle
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
