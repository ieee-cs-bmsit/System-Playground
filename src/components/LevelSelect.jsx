import React, { useState } from 'react';
import { Lock, Clock, Star, ChevronRight, Trophy, Target } from 'lucide-react';
import useProgressStore from '../store/progressStore';

/**
 * Level Select Component - POP ART THEME!
 */
export default function LevelSelect({ levels, moduleTitle, moduleSubtitle, onSelectLevel, onSandboxMode, onBack }) {
    const isUnlocked = useProgressStore(state => state.isLevelUnlocked);
    const getStars = useProgressStore(state => state.getLevelStars);
    const getLevelProgress = useProgressStore(state => state.getLevelProgress);

    const [selectedDifficulty, setSelectedDifficulty] = useState('all');

    const difficulties = ['all', 'beginner', 'intermediate', 'advanced', 'expert'];

    const filteredLevels = selectedDifficulty === 'all'
        ? levels
        : levels.filter(l => l.difficulty === selectedDifficulty);

    const getDifficultyColor = (difficulty) => {
        const colors = {
            beginner: 'bg-green-400 border-green-600',
            intermediate: 'bg-blue-400 border-blue-600',
            advanced: 'bg-orange-400 border-orange-600',
            expert: 'bg-red-400 border-red-600'
        };
        return colors[difficulty] || 'bg-gray-300 border-gray-500';
    };

    const StarRating = ({ stars }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                    <Star
                        key={i}
                        size={18}
                        className={i <= stars ? 'fill-yellow-300 text-black stroke-black stroke-2' : 'text-gray-400 stroke-black stroke-2'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-comic-cream overflow-y-auto relative">
            {/* Halftone Background */}
            <div className="absolute inset-0 bg-halftone-dots opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto p-8 relative z-10">
                {/* Comic Header with Back Button */}
                <div className="mb-8 flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        {/* Back Button */}
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="bg-white px-4 py-3 border-4 border-black shadow-comic hover:shadow-none hover:translate-y-1 transition-all font-comic font-bold text-xl transform -rotate-2"
                            >
                                ← BACK
                            </button>
                        )}

                        <div className="transform -rotate-1">
                            <h1 className="text-5xl font-comic text-comic-pink drop-shadow-[4px_4px_0_#000] uppercase tracking-wider border-4 border-black bg-white px-6 py-3 inline-block shadow-comic mb-3">
                                ⚡ {moduleTitle} ⚡
                            </h1>
                            <p className="font-comic text-xl ml-2 bg-comic-yellow px-3 py-1 border-2 border-black inline-block transform rotate-1">
                                {moduleSubtitle}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onSandboxMode}
                        className="bg-comic-yellow text-black px-6 py-3 border-4 border-black shadow-comic font-comic text-xl hover:shadow-none hover:translate-y-1 transition-all transform rotate-1 font-bold"
                    >
                        🎨 SANDBOX MODE
                    </button>
                </div>

                {/* Difficulty Filter Buttons */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    {difficulties.map(diff => (
                        <button
                            key={diff}
                            onClick={() => setSelectedDifficulty(diff)}
                            className={`px-5 py-2 border-3 border-black font-comic text-lg uppercase tracking-wide transition-all ${selectedDifficulty === diff
                                ? 'bg-black text-comic-yellow shadow-comic scale-105'
                                : 'bg-white hover:bg-comic-yellow shadow-comic-sm hover:shadow-comic hover:scale-105'
                                }`}
                        >
                            {diff}
                        </button>
                    ))}
                </div>

                {/* Progress Stats - Module Specific */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-comic-yellow border-4 border-black shadow-comic p-4 transform -rotate-1 hover:rotate-0 transition-transform">
                        <div className="flex items-center justify-between">
                            <Trophy size={32} className="text-black stroke-[3]" />
                            <div className="text-right">
                                <div className="text-3xl font-bold">
                                    {levels.reduce((sum, level) => sum + (getStars(level.id) || 0), 0)}
                                </div>
                                <div className="text-sm uppercase tracking-wide font-comic">Total Stars</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-comic-blue border-4 border-black shadow-comic p-4 transform rotate-1 hover:rotate-0 transition-transform">
                        <div className="flex items-center justify-between text-white">
                            <Target size={32} className="stroke-[3]" />
                            <div className="text-right">
                                <div className="text-3xl font-bold">
                                    {levels.filter(level => getLevelProgress(level.id)?.completed).length}/{levels.length}
                                </div>
                                <div className="text-sm uppercase tracking-wide font-comic">Completed</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-comic-pink border-4 border-black shadow-comic p-4 transform -rotate-1 hover:rotate-0 transition-transform">
                        <div className="flex items-center justify-between text-white">
                            <Star size={32} className="stroke-[3] fill-white" />
                            <div className="text-right">
                                <div className="text-3xl font-bold">
                                    {Math.round((levels.filter(level => getLevelProgress(level.id)?.completed).length / levels.length) * 100) || 0}%
                                </div>
                                <div className="text-sm uppercase tracking-wide font-comic">Progress</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level Cards - Pop Art Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLevels.map((level, idx) => {
                        const unlocked = isUnlocked(level.id);
                        const stars = getStars(level.id);
                        const progress = getLevelProgress(level.id);

                        return (
                            <button
                                key={level.id}
                                onClick={() => unlocked && onSelectLevel(level)}
                                disabled={!unlocked}
                                className={`
                                    p-5 border-4 border-black text-left transition-all font-comic
                                    ${unlocked
                                        ? 'bg-white shadow-comic hover:shadow-comic-hover hover:-translate-y-1 cursor-pointer'
                                        : 'bg-gray-200 opacity-60 cursor-not-allowed'
                                    }
                                `}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3 border-b-2 border-black pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold bg-black text-white px-2 py-1">
                                            #{idx + 1}
                                        </span>
                                        {!unlocked && <Lock size={18} className="stroke-[3]" />}
                                    </div>

                                    {unlocked && progress?.completed ? (
                                        <StarRating stars={stars} />
                                    ) : unlocked ? (
                                        <span className="bg-comic-yellow px-3 py-1 border-2 border-black text-xs font-bold uppercase transform -rotate-3">NEW!</span>
                                    ) : null}
                                </div>

                                {/* Title */}
                                <h3 className="font-comic text-xl mb-2 text-black uppercase tracking-wide leading-tight">
                                    {level.title}
                                </h3>

                                {/* Objective */}
                                <p className="text-sm mb-4 line-clamp-2 leading-snug">
                                    {level.objective.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`text-xs px-3 py-1 border-2 border-black font-bold uppercase ${getDifficultyColor(level.difficulty)}`}>
                                        {level.difficulty}
                                    </span>

                                    {level.estimatedTime && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 border-2 border-black flex items-center gap-1">
                                            <Clock size={12} className="stroke-[2.5]" />
                                            {level.estimatedTime}
                                        </span>
                                    )}
                                </div>

                                {/* Attempts */}
                                {progress?.attempts > 0 && (
                                    <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-400">
                                        <p className="text-xs font-bold uppercase">
                                            Attempts: {progress.attempts} | Best: {stars}★
                                        </p>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredLevels.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white border-4 border-black shadow-comic p-8 inline-block transform rotate-2">
                            <p className="text-2xl font-comic uppercase">No Levels Found! 🤔</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
