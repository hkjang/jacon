"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface DiffViewerProps {
  oldValue: string;
  newValue: string;
  splitView?: boolean;
}

// Simple mock diff logic for visualization purposes
// In production, use a library like 'diff' package
export function DiffViewer({ oldValue, newValue }: DiffViewerProps) {
  const oldLines = oldValue.split('\n');
  const newLines = newValue.split('\n');
  
  // Naive diff: if line at index doesn't match, mark it.

  return (
    <div className="font-mono text-xs border border-slate-800 rounded-md overflow-hidden bg-slate-950">
       <div className="flex bg-slate-900 border-b border-slate-800 p-2 justify-between items-center text-slate-400">
          <span>변경사항 미리보기</span>
          <div className="flex gap-2 text-[10px] uppercase font-bold">
             <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400/20 block ring-1 ring-red-500/50" /> 삭제됨</span>
             <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400/20 block ring-1 ring-emerald-500/50" /> 추가됨</span>
          </div>
       </div>
       
       <div className="flex divide-x divide-slate-800">
          {/* Left Side (Old) */}
          <div className="flex-1 min-w-0">
             {oldLines.map((line, i) => {
                 const isDiff = newLines[i] !== line;
                 return (
                    <div key={i} className={cn("flex", isDiff ? "bg-red-500/5" : "")}>
                       <div className="w-8 text-slate-700 text-right pr-2 select-none border-r border-slate-800/50 bg-slate-900/30">{i + 1}</div>
                       <div className={cn("pl-2 whitespace-pre text-slate-400", isDiff && "text-red-300")}>
                          {isDiff && <span className="select-none text-red-500/50 mr-1">-</span>}
                          {line || ' '}
                       </div>
                    </div>
                 );
             })}
          </div>

          {/* Right Side (New) */}
          <div className="flex-1 min-w-0">
             {newLines.map((line, i) => {
                 const isDiff = oldLines[i] !== line;
                 return (
                    <div key={i} className={cn("flex", isDiff ? "bg-emerald-500/5" : "")}>
                       <div className="w-8 text-slate-700 text-right pr-2 select-none border-r border-slate-800/50 bg-slate-900/30">{i + 1}</div>
                       <div className={cn("pl-2 whitespace-pre text-slate-400", isDiff && "text-emerald-300")}>
                          {isDiff && <span className="select-none text-emerald-500/50 mr-1">+</span>}
                          {line || ' '}
                       </div>
                    </div>
                 );
             })}
          </div>
       </div>
    </div>
  );
}
