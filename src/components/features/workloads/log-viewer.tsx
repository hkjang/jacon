"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiDownload, FiPause, FiPlay } from 'react-icons/fi';

const MOCK_LOGS = [
  "[2023-10-27 10:00:01] [INFO] Starting application...",
  "[2023-10-27 10:00:02] [INFO] Connected to database at postgres:5432",
  "[2023-10-27 10:00:02] [INFO] HTTP Server listening on port 8080",
];

export function LogViewer() {
  const [logs, setLogs] = useState<string[]>(MOCK_LOGS);
  const [isPlaying, setIsPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newLog = `[${new Date().toISOString()}] [INFO] Received request GET /api/v1/health`;
      setLogs(prev => [...prev, newLog]);
      
      // Auto-scroll
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <Card className="h-[500px] flex flex-col bg-slate-950 border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900 rounded-t-lg">
        <span className="text-xs font-mono text-slate-400">logs/stdout</span>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-slate-400 hover:text-white"
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <FiDownload />
          </Button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
      >
        {logs.map((log, i) => (
          <div key={i} className="text-slate-300 whitespace-pre-wrap hover:bg-slate-900/50 px-1">
            {log}
          </div>
        ))}
      </div>
    </Card>
  );
}
