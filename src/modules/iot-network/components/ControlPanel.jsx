import React from 'react';
import useIoTStore from '../store/iotStore';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export default function ControlPanel() {
    const isRunning = useIoTStore(state => state.isRunning);
    const currentTime = useIoTStore(state => state.currentTime);
    const play = useIoTStore(state => state.play);
    const pause = useIoTStore(state => state.pause);
    const reset = useIoTStore(state => state.reset);
    const tick = useIoTStore(state => state.tick);

    const [speed, setSpeed] = React.useState(1000);

    React.useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                tick();
            }, speed);
            return () => clearInterval(interval);
        }
    }, [isRunning, speed, tick]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white border-4 border-black shadow-comic p-4 flex flex-col gap-3 min-w-[300px]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="font-comic text-lg">Controls</span>
                <span className="font-mono bg-black text-white px-2 py-1 text-sm">
                    Time: {formatTime(currentTime)}
                </span>
            </div>

            <div className="flex gap-2">
                {!isRunning ? (
                    <button
                        onClick={play}
                        className="flex-1 bg-green-500 text-white font-bold py-2 px-4 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        <Play size={20} fill="white" />
                        Run
                    </button>
                ) : (
                    <button
                        onClick={pause}
                        className="flex-1 bg-yellow-400 text-black font-bold py-2 px-4 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        <Pause size={20} />
                        Pause
                    </button>
                )}

                <button
                    onClick={() => { pause(); tick(); }}
                    className="bg-blue-500 text-white font-bold py-2 px-4 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all"
                    title="Step"
                >
                    <SkipForward size={20} />
                </button>

                <button
                    onClick={reset}
                    className="bg-red-500 text-white font-bold py-2 px-4 border-4 border-black shadow-comic hover:translate-y-1 hover:shadow-none transition-all"
                    title="Reset"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            <div>
                <label className="font-bold text-xs uppercase text-gray-600 mb-1 block flex justify-between">
                    <span>Speed</span>
                    <span className="bg-black text-white px-2">{speed}ms</span>
                </label>
                <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded appearance-none cursor-pointer border-2 border-black"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                    <span>Fast</span>
                    <span>Slow</span>
                </div>
            </div>
        </div>
    );
}
