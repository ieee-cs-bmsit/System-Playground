import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import useSimulationStore from '../../store/simulationStore';

export default function ControlPanel() {
    const { isPlaying, togglePlay, reset, currentTime, tick, speed, setSpeed } = useSimulationStore();

    // Game Loop
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                tick();
            }, speed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, speed, tick]);

    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white border-4 border-black shadow-comic flex items-center gap-4 p-4 z-50">
            {/* Time Display */}
            <div className="bg-comic-dark text-white px-4 py-2 font-mono font-bold border-2 border-black min-w-[100px] text-center">
                T: {currentTime}
            </div>

            {/* Controls */}
            <button
                onClick={togglePlay}
                className={`p-3 border-2 border-black shadow-comic-hover transition-transform active:translate-y-1 active:shadow-none ${isPlaying ? 'bg-comic-pink text-white' : 'bg-green-400 hover:bg-green-300'}`}
                title={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>

            <button
                onClick={reset}
                className="p-3 bg-comic-yellow border-2 border-black shadow-comic-hover hover:bg-yellow-300 transition-transform active:translate-y-1 active:shadow-none"
                title="Reset"
            >
                <RotateCcw />
            </button>

            {/* Speed Control */}
            <div className="flex items-center gap-2 border-l-2 border-black pl-4">
                <FastForward size={20} />
                <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={2100 - speed} // Invert so right is faster
                    onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
                    className="w-24 accent-comic-blue h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
                />
            </div>
        </div>
    );
}
