import React, { useState } from 'react';
import { Target, Star, CheckCircle, XCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react';

/**
 * Level Objective Panel - POP ART COMIC THEME!
 */
export default function LevelObjective({ level, validationResult }) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!level) return null;

    const { objective, constraints, starRating } = level;
    const hasValidation = validationResult !== null && validationResult !== undefined;

    return (
        <div className="absolute top-4 left-4 bg-white border-4 border-black shadow-comic max-w-sm z-40 font-comic">
            {/* Comic Header - Collapsible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between bg-comic-yellow border-b-4 border-black hover:bg-yellow-300 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Zap size={20} className="stroke-[3]" />
                    <div className="text-left">
                        <h3 className="font-bold text-base uppercase tracking-wide">{level.title}</h3>
                        <p className="text-xs uppercase">{level.difficulty}</p>
                    </div>
                </div>
                {isExpanded ? <ChevronUp size={24} className="stroke-[3]" /> : <ChevronDown size={24} className="stroke-[3]" />}
            </button>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="p-4 max-h-96 overflow-y-auto">
                    {/* Objective */}
                    <div className="mb-4 pb-3 border-b-2 border-dashed border-gray-400">
                        <h4 className="font-bold text-sm uppercase mb-2 bg-black text-white px-2 py-1 inline-block">
                            🎯 Your Mission
                        </h4>
                        <p className="text-sm font-bold leading-snug">{objective.description}</p>
                    </div>

                    {/* Requirements */}
                    {objective.requirements && objective.requirements.length > 0 && (
                        <div className="mb-4 pb-3 border-b-2 border-dashed border-gray-400">
                            <h4 className="font-bold text-sm uppercase mb-2">✓ Must Do:</h4>
                            <ul className="space-y-1">
                                {objective.requirements.map((req, idx) => (
                                    <li key={idx} className="text-xs flex items-start gap-2 leading-tight">
                                        <span className="text-comic-pink text-lg">➤</span>
                                        <span className="font-semibold">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* How to Submit - BIG AND CLEAR */}
                    <div className="mb-4 pb-3 bg-comic-blue border-3 border-black p-3 -mx-1 shadow-sm">
                        <h4 className="font-bold text-sm uppercase mb-2 text-white flex items-center gap-2">
                            <span className="text-xl">⚡</span> HOW TO SUBMIT
                        </h4>
                        <ol className="space-y-1.5 text-white text-xs font-bold">
                            <li className="flex gap-2">
                                <span className="bg-white text-black px-1.5">1</span>
                                <span>Drag components from sidebar</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-white text-black px-1.5">2</span>
                                <span>Click PLAY ▶ button</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-white text-black px-1.5">3</span>
                                <span>Click "Check Solution" (top right)</span>
                            </li>
                        </ol>
                    </div>

                    {/* Star Goals */}
                    {starRating && typeof starRating === 'object' && (
                        <div className="mb-4">
                            <h4 className="font-bold text-sm uppercase mb-2">★ Star Goals</h4>
                            <div className="space-y-1">
                                {[3, 2, 1].map(stars => {
                                    const criteria = starRating[stars];
                                    if (!criteria) return null;

                                    const text = typeof criteria === 'object' && criteria.hint
                                        ? criteria.hint.replace(/⭐+/g, '').trim()
                                        : typeof criteria === 'string'
                                            ? criteria
                                            : `${stars} stars`;

                                    return (
                                        <div key={stars} className="flex items-center gap-2 text-xs bg-gray-100 border-2 border-black px-2 py-1">
                                            <div className="flex">
                                                {Array.from({ length: stars }).map((_, i) => (
                                                    <Star key={i} size={12} className="fill-yellow-300 text-black stroke-black stroke-2" />
                                                ))}
                                            </div>
                                            <span className="font-semibold">{text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Validation Result - BOLD */}
                    {hasValidation && (
                        <div className={`p-3 border-4 border-black shadow-comic ${validationResult.passed
                            ? 'bg-green-300'
                            : 'bg-red-300'
                            }`}>
                            <div className="flex items-start gap-2">
                                {validationResult.passed ? (
                                    <CheckCircle className="stroke-black stroke-[3] flex-shrink-0" size={24} />
                                ) : (
                                    <XCircle className="stroke-black stroke-[3] flex-shrink-0" size={24} />
                                )}
                                <div className="flex-1">
                                    <p className="font-bold text-sm uppercase">
                                        {validationResult.feedback?.title || (validationResult.passed ? '✓ Success!' : '✗ Not Yet!')}
                                    </p>
                                    <p className="text-sm font-semibold mt-1">
                                        {validationResult.feedback?.message}
                                    </p>
                                </div>

                                {/* Stars */}
                                {validationResult.passed && validationResult.stars > 0 && (
                                    <div className="flex">
                                        {Array.from({ length: validationResult.stars }).map((_, i) => (
                                            <Star key={i} size={20} className="fill-yellow-300 text-black stroke-black stroke-2" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Issues  */}
                            {!validationResult.passed && validationResult.violations && validationResult.violations.length > 0 && (
                                <div className="mt-2 pt-2 border-t-2 border-black">
                                    <p className="text-xs font-bold uppercase">⚠ Issues:</p>
                                    <ul className="space-y-0.5 mt-1">
                                        {validationResult.violations.slice(0, 2).map((violation, idx) => (
                                            <li key={idx} className="text-xs font-semibold flex gap-1">
                                                <span>•</span>
                                                <span>{violation}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Suggestions */}
                            {validationResult.feedback?.suggestions && validationResult.feedback.suggestions.length > 0 && (
                                <div className="mt-2 pt-2 border-t-2 border-black">
                                    <p className="text-xs font-bold uppercase">💡 Try This:</p>
                                    <ul className="space-y-0.5 mt-1">
                                        {validationResult.feedback.suggestions.slice(0, 2).map((suggestion, idx) => (
                                            <li key={idx} className="text-xs font-semibold">
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Collapsed Indicator */}
            {!isExpanded && (
                <div className="px-4 py-2 bg-gray-100 border-t-2 border-black">
                    <p className="text-xs uppercase font-bold text-center">▼ Click to expand</p>
                </div>
            )}
        </div>
    );
}
