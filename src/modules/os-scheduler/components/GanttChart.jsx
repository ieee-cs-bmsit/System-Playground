import React from 'react';
import useSimulationStore from '../store/simulationStore';

export default function GanttChart() {
    const history = useSimulationStore(state => state.history);

    // Group history by CPU
    const groupedByCpu = React.useMemo(() => {
        const cpuMap = {};
        history.forEach(log => {
            if (!cpuMap[log.cpuId]) cpuMap[log.cpuId] = [];
            cpuMap[log.cpuId].push(log);
        });
        return Object.entries(cpuMap).map(([cpuId, logs]) => ({ cpuId, logs }));
    }, [history]);

    return (
        <div className="h-full flex flex-col">
            <div className="bg-comic-yellow border-b-4 border-black p-2">
                <h3 className="font-comic text-sm uppercase">Execution History</h3>
                {history.length > 0 && (
                    <div className="text-[10px] text-gray-700">Last {Math.min(history.length, 100)} ticks</div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                {history.length === 0 ? (
                    <div className="text-center text-gray-400 italic text-sm mt-4">
                        (Waiting for data...)
                    </div>
                ) : (
                    groupedByCpu.map(({ cpuId, logs }) => (
                        <div key={cpuId} className="flex items-center gap-2 mb-2">
                            <div className="w-16 text-xs font-bold font-mono">{cpuId}</div>
                            <div className="flex-1 flex gap-1">
                                {logs.map((log, idx) => {
                                    // Extract PID from processId (format: "process_X" or just "PX")
                                    const pid = log.processId.includes('_')
                                        ? log.processId.split('_')[1]
                                        : log.processId.replace('P', '');

                                    return (
                                        <div
                                            key={idx}
                                            className="h-6 border border-black text-[10px] flex items-center justify-center font-bold text-white"
                                            style={{
                                                backgroundColor: log.color,
                                                width: `${100 / logs.length}%`
                                            }}
                                            title={`P${pid} at T:${log.time}`}
                                        >
                                            P{pid}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
