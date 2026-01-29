"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiPlay, FiPause, FiDownload, FiSearch, FiTrash2 } from 'react-icons/fi';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

export function LogViewer({ initialLogs = [], stream = true }: { initialLogs?: LogEntry[], stream?: boolean }) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isPlaying, setIsPlaying] = useState(stream);
  const [filter, setFilter] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const levels: ('INFO' | 'WARN' | 'ERROR' | 'DEBUG')[] = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG'];
      const messages = [
          'Processing incoming request GET /api/v1/health',
          'Database connection pool acquired',
          'Cache miss for key: user_profile_123',
          'Background job started: daily_cleanup',
          'Request completed in 45ms',
          'Reconciling state for deployment/web-app'
      ];
      
      const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => [...prev.slice(-1000), newLog]); // Keep last 1000
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const filteredLogs = logs.filter(log => 
      log.message.toLowerCase().includes(filter.toLowerCase()) || 
      log.level.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[500px] bg-[#1e1e1e] border border-slate-700 rounded-lg overflow-hidden font-mono text-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-slate-900 border-b border-slate-700">
         <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                className={isPlaying ? "text-amber-400 hover:text-amber-300" : "text-emerald-400 hover:text-emerald-300"}
                onClick={() => setIsPlaying(!isPlaying)}
            >
                {isPlaying ? <><FiPause className="mr-1" /> Pause</> : <><FiPlay className="mr-1" /> Live</>}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLogs([])}>
                <FiTrash2 /> Clear
            </Button>
         </div>
         <div className="flex items-center gap-2">
            <div className="relative">
                <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input 
                    className="h-7 pl-8 bg-slate-800 border-slate-700 w-48 text-xs" 
                    placeholder="Filter logs..." 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <Button variant="ghost" size="sm"><FiDownload /></Button>
         </div>
      </div>

      {/* Log Body */}
      <div className="flex-1 overflow-auto p-4 space-y-1">
          {filteredLogs.map(log => (
              <div key={log.id} className="flex gap-3 hover:bg-white/5 px-1 rounded text-slate-300">
                  <span className="text-slate-500 shrink-0 select-none w-36">{log.timestamp.split('T')[1].replace('Z','')}</span>
                  <span className={`w-12 shrink-0 font-bold ${
                      log.level === 'INFO' ? 'text-blue-400' :
                      log.level === 'WARN' ? 'text-amber-400' :
                      log.level === 'ERROR' ? 'text-red-400' :
                      'text-slate-400'
                  }`}>{log.level}</span>
                  <span className="break-all">{log.message}</span>
              </div>
          ))}
          {filteredLogs.length === 0 && <div className="text-slate-500 italic text-center mt-10">No logs found.</div>}
          <div ref={logsEndRef} />
      </div>
    </div>
  );
}
