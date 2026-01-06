import React from 'react';
import { Zap, Star, MousePointer2, Sparkles } from 'lucide-react';

export default function Home({ onStart }) {
    return (
        <div className="min-h-screen bg-comic-cream relative overflow-hidden font-comic flex flex-col items-center justify-center p-4">

            {/* 1. Background Layer: Dynamic Patterns */}
            <div className="absolute inset-0 bg-halftone-dots opacity-10 pointer-events-none animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle,#ff44cc_2px,transparent_2px)] [background-size:32px_32px] opacity-20 pointer-events-none"></div>

            {/* Spinning Sunburst Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_20deg,#fff_20deg,#fff_40deg,transparent_40deg)] opacity-10 animate-spin-slow pointer-events-none z-0"></div>

            {/* 2. Content Layer */}
            <div className="relative z-10 text-center max-w-7xl w-full flex flex-col items-center">

                {/* Floating Decor Elements (Top) */}
                <div className="absolute -top-20 -left-10 text-comic-yellow animate-bounce delay-100 hidden md:block">
                    <Star size={80} fill="#FFE800" stroke="black" strokeWidth={3} />
                </div>
                <div className="absolute -top-10 right-0 text-comic-pink animate-pulse hidden md:block">
                    <Sparkles size={64} stroke="black" strokeWidth={3} />
                </div>

                {/* Hero Title Block */}
                <div className="relative inline-block mb-16 hover:scale-105 transition-transform duration-300 cursor-default group">
                    {/* Shadow Block */}
                    <div className="absolute -inset-4 bg-black skew-y-3 skew-x-3 rounded-sm z-0"></div>
                    {/* Color Block */}
                    <div className="absolute -inset-2 bg-comic-blue border-4 border-black z-10 skew-y-1 skew-x-1 group-hover:bg-comic-pink transition-colors"></div>

                    {/* Main Text - Single Line */}
                    <h1 className="relative z-20 text-5xl md:text-8xl text-white text-stroke-black drop-shadow-[8px_8px_0_#000] uppercase tracking-tighter leading-none p-6 whitespace-nowrap">
                        Visual <span className="text-comic-yellow text-stroke-black">System</span> Builder
                    </h1>

                    {/* Decor Lightning */}
                    <div className="absolute -right-12 -bottom-8 text-comic-yellow z-30 animate-wiggle">
                        <Zap size={96} fill="#FFE800" stroke="black" strokeWidth={4} />
                    </div>
                </div>

                {/* Subtitle Badge */}
                <div className="mb-20 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="inline-block bg-white border-4 border-black shadow-comic-lg px-8 py-4 relative">
                        {/* Pin Effect */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-black shadow-sm"></div>

                        <p className="text-2xl md:text-4xl font-body font-bold text-gray-800">
                            Visualize. Simulate. <span className="bg-comic-yellow px-2 inline-block transform -skew-x-12 border-2 border-black">Master It.</span>
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">

                    {/* Primary CTA */}
                    <button
                        onClick={onStart}
                        className="relative group bg-comic-pink text-white text-4xl px-16 py-6 font-comic border-4 border-black shadow-comic-lg hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all transform hover:-rotate-1"
                    >
                        <div className="flex items-center gap-4">
                            <span>START LAB</span>
                            <MousePointer2 size={32} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                        {/* "Free" Badge */}
                        <span className="absolute -top-4 -right-4 bg-comic-yellow text-black text-sm font-bold px-3 py-1 border-2 border-black transform rotate-12">
                            v1.0
                        </span>
                    </button>

                    {/* Secondary CTA */}
                    <button
                        onClick={() => alert("Docs coming soon!")}
                        className="bg-white text-4xl px-12 py-6 font-comic border-4 border-black shadow-comic-lg hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all text-black hover:bg-gray-100 transform rotate-2"
                    >
                        DOCS
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 text-center font-bold text-gray-500 font-mono text-sm">
                POWERED BY <span className="text-black bg-white px-1 border border-black">REACT FLOW</span> & <span className="text-black bg-white px-1 border border-black">ZUSTAND</span>
            </div>
        </div>
    );
}