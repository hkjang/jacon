"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { SimpleChart } from '@/components/features/observability/simple-chart';
import { MOCK_CPU_METRICS, MOCK_MEMORY_METRICS } from '@/lib/mock-observability';

export default function ObservabilityPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Observability</h1>
          <p className="text-slate-400">Monitor cluster performance and resource usage metrics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleChart 
            title="CPU Usage (Average)" 
            data={MOCK_CPU_METRICS} 
            unit="%" 
          />
           <SimpleChart 
            title="Memory Usage (Average)" 
            data={MOCK_MEMORY_METRICS} 
            unit="%" 
          />
        </div>

        {/* Placeholder for Alerts */}
        <div className="border border-dashed border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50">
           <h3 className="text-lg font-semibold mb-2">Alert Manager</h3>
           <p>No active alerts detected in the last 24 hours.</p>
        </div>
      </div>
    </MainLayout>
  );
}
