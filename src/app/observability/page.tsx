"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { MetricChart } from '@/components/features/observability/metric-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiActivity, FiCpu, FiHardDrive, FiServer } from 'react-icons/fi';
import { db } from '@/lib/db';

export default function ObservabilityPage() {
  // Simulate data fetching
  const [cpuData, setCpuData] = useState<{timestamp: string, value: number}[]>([]);
  const [memData, setMemData] = useState<{timestamp: string, value: number}[]>([]);

  useEffect(() => {
    // Generate mock history
    const history = Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(Date.now() - (20 - i) * 60000).toISOString(),
      value: 20 + Math.random() * 30
    }));
    setCpuData(history);
    setMemData(history.map(d => ({ ...d, value: 40 + Math.random() * 20 })));
  }, []);

  return (
    <MainLayout>
       <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">System Observability</h1>
                <p className="text-slate-400">전체 클러스터 및 워크로드의 상태를 모니터링합니다.</p>
            </div>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded text-sm border border-emerald-500/20 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    System Healthy
                </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                         <FiCpu /> Cluster CPU Usage
                     </CardTitle>
                 </CardHeader>
                 <CardContent>
                     <MetricChart data={cpuData} color="#f43f5e" label="Total Cores Utilized" unit="%" />
                 </CardContent>
             </Card>
             <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                         <FiHardDrive /> Memory Usage
                     </CardTitle>
                 </CardHeader>
                 <CardContent>
                     <MetricChart data={memData} color="#3b82f6" label="Total RAM Utilized" unit="%" />
                 </CardContent>
             </Card>
          </div>

          <h2 className="text-lg font-semibold mt-4">Node Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['jacon-worker-1', 'jacon-worker-2', 'jacon-worker-3'].map(node => (
                  <Card key={node} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-4 flex items-center gap-4">
                          <div className="p-3 bg-slate-800 rounded">
                              <FiServer className="text-slate-400" />
                          </div>
                          <div>
                              <div className="font-bold text-slate-200">{node}</div>
                              <div className="text-xs text-slate-500">Ready • v1.28.2</div>
                          </div>
                          <div className="ml-auto text-emerald-500 text-sm font-bold">
                              OK
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
       </div>
    </MainLayout>
  );
}
