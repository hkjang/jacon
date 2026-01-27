"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricSeries } from '@/lib/mock-observability';

interface SimpleChartProps {
  title: string;
  data: MetricSeries[];
  unit: string;
}

export function SimpleChart({ title, data, unit }: SimpleChartProps) {
  // Find max value to normalize scaling
  const allValues = data.flatMap(d => d.data.map(p => p.value));
  const maxValue = Math.max(...allValues, 100); // Default to 100 if lower

  return (
    <Card className="h-[300px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400 flex justify-between">
          <span>{title}</span>
          <span>{unit}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-end gap-2 p-4 relative pt-10">
        {/* Simple Y-Axis Grid Lines */}
        <div className="absolute inset-0 px-4 py-4 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-t border-slate-500 w-full" />
            <div className="border-t border-slate-500 w-full" />
            <div className="border-t border-slate-500 w-full" />
            <div className="border-t border-slate-500 w-full" />
        </div>

        {/* Render data points as bars for simplicity in CSS implementation */}
        {data[0].data.map((point, index) => (
          <div key={index} className="flex-1 flex gap-1 h-full items-end group relative">
             {data.map((series) => {
                const p = series.data[index];
                const height = (p.value / maxValue) * 100;
                return (
                  <div 
                    key={series.id}
                    className="flex-1 rounded-t-sm hover:opacity-80 transition-all"
                    style={{ 
                        height: `${height}%`, 
                        backgroundColor: series.color 
                    }}
                  >
                     {/* Tooltip */}
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-xs p-2 rounded border border-slate-700 whitespace-nowrap z-10">
                        <div className="font-bold mb-1">{point.time}</div>
                        {data.map(s => (
                           <div key={s.id} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                              <span>{s.label}: {s.data[index].value}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                );
             })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
