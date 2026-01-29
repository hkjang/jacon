"use client";

import React, { useMemo } from 'react';

interface MetricPoint {
  timestamp: string;
  value: number;
}

interface MetricChartProps {
  data: MetricPoint[];
  color?: string;
  height?: number;
  label?: string;
  unit?: string;
}

export function MetricChart({ data, color = "#6366f1", height = 200, label, unit }: MetricChartProps) {
  const points = useMemo(() => {
    if (data.length === 0) return "";
    
    const maxVal = Math.max(...data.map(d => d.value)) * 1.2; // 20% padding
    const minVal = 0;
    
    const width = 100; // viewbox units
    const chartHeight = 100; // viewbox units
    
    const xStep = width / (data.length - 1);
    
    return data.map((d, i) => {
      const x = i * xStep;
      const y = chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
      return `${x},${y}`;
    }).join(" ");
  }, [data]);

  return (
    <div className="w-full bg-slate-900/50 rounded-lg p-4 border border-slate-800">
       <div className="flex justify-between mb-4">
           {label && <h4 className="text-sm font-semibold text-slate-400">{label}</h4>}
           {data.length > 0 && <span className="text-xl font-bold text-slate-200">{data[data.length-1].value}{unit}</span>}
       </div>
       <div className="relative w-full overflow-hidden" style={{ height }}>
         <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="2" />

            {/* Line */}
            <polyline 
                fill="none" 
                stroke={color} 
                strokeWidth="2" 
                points={points} 
                className="transition-all duration-300 ease-in-out"
            />
            
            {/* Area (Optional, tricky with just polyline, skipping for now) */}
         </svg>
       </div>
    </div>
  );
}
