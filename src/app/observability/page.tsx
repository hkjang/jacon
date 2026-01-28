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
          <h1 className="text-2xl font-bold mb-2">관측성 (Observability)</h1>
          <p className="text-slate-400">클러스터 성능 및 리소스 사용량 메트릭을 모니터링합니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleChart 
            title="CPU 사용률 (평균)" 
            data={MOCK_CPU_METRICS} 
            unit="%" 
          />
           <SimpleChart 
            title="메모리 사용률 (평균)" 
            data={MOCK_MEMORY_METRICS} 
            unit="%" 
          />
        </div>

        {/* Placeholder for Alerts */}
        <div className="border border-dashed border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50">
           <h3 className="text-lg font-semibold mb-2">알림 매니저</h3>
           <p>지난 24시간 동안 감지된 활성 알림이 없습니다.</p>
        </div>
      </div>
    </MainLayout>
  );
}
