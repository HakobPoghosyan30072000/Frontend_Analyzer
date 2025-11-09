'use client';

import { Profiler, useRef, useState } from 'react';

interface RenderLog {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
}

export default function ProfilerPanel({ children }: { children: React.ReactNode }) {
  const logsRef = useRef<RenderLog[]>([]);
  const [viewLogs, setViewLogs] = useState<RenderLog[]>([]);
console.log(viewLogs, 'logsRef');

  const onRenderCallback = (
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    // Store logs without triggering re-renders
    logsRef.current.push({ id, phase, actualDuration, baseDuration, startTime, commitTime });
  };

  return (
    <div className="border rounded-lg p-3 bg-gray-50 mt-4">
      <h3 className="text-lg font-semibold mb-2">🧠 Render Profiler</h3>

      <Profiler id="AnalyzerProfiler" onRender={onRenderCallback}>
        {children}
      </Profiler>

      <button
        className="mt-3 bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
        onClick={() => setViewLogs([...logsRef.current])}
      >
        Refresh Logs
      </button>

      <div className="mt-3 max-h-48 overflow-y-auto text-sm">
        {viewLogs.length === 0 ? (
          <p className="text-gray-500 italic">No renders recorded yet.</p>
        ) : (
          viewLogs.map((log, i) => (
            <div key={i} className="border-b border-gray-200 py-1">
              <span className="font-semibold text-blue-600">{log.id}</span> →{' '}
              <span className="text-gray-700">
                {log.phase} ({log.actualDuration.toFixed(2)}ms)
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
