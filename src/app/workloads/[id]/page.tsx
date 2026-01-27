"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogViewer } from '@/components/features/workloads/log-viewer';
import { Terminal } from '@/components/features/workloads/terminal';
import { MOCK_WORKLOADS } from '@/lib/mock-workloads';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FiArrowLeft, FiCpu, FiActivity } from 'react-icons/fi';
import Link from 'next/link';

export default function WorkloadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const workload = MOCK_WORKLOADS.find(w => w.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'terminal'>('overview');

  if (!workload) {
    // In a real app we would use notFound(), but for static build/mock we return UI
    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold">Workload Not Found</h1>
                <Link href="/workloads" className="text-blue-500 hover:underline mt-4">Back to Workloads</Link>
            </div>
        </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/workloads">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <FiArrowLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {workload.name}
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-semibold border",
                workload.status === 'Running' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-800 text-slate-400 border-slate-700"
              )}>
                {workload.status}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Namespace: <span className="text-slate-200">{workload.namespace}</span> • 
              Cluster: <span className="text-slate-200">{workload.cluster}</span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'overview' ? "border-blue-500 text-blue-500" : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'logs' ? "border-blue-500 text-blue-500" : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            Logs
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'terminal' ? "border-blue-500 text-blue-500" : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            Terminal
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <FiActivity /> Uptime & Restarts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workload.age}</div>
                  <div className="text-sm text-slate-500 mt-1">{workload.restarts} restarts</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <FiCpu /> CPU Usage (Est)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">128m</div>
                  <div className="text-sm text-slate-500 mt-1">Limit: 500m</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                     Memory Usage (Est)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">256Mi</div>
                  <div className="text-sm text-slate-500 mt-1">Limit: 1Gi</div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                 <CardHeader><CardTitle>Labels</CardTitle></CardHeader>
                 <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs">app={workload.name.split('-')[0]}</span>
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs">env=production</span>
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs">managed-by=helm</span>
                    </div>
                 </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'logs' && <LogViewer />}
          {activeTab === 'terminal' && <Terminal containerName={workload.name} />}
        </div>
      </div>
    </MainLayout>
  );
}
