"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';

import { Button } from '@/components/ui/button';
import { LogViewer } from '@/components/features/workloads/log-viewer';
import { Terminal } from '@/components/features/workloads/terminal';
import { db } from '@/lib/db';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

import { DriftDetails } from '@/components/features/governance/drift-details';
import { MOCK_DRIFT_ITEMS } from '@/lib/mock-drift';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WorkloadOverview } from '@/components/features/workloads/workload-overview';

export default function WorkloadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  // Use db state instead of static mock
  const [workload, setWorkload] = React.useState(db.getWorkloads().find(w => w.id === id));
  
  React.useEffect(() => {
     // Periodically check for updates (e.g. status change)
     const interval = setInterval(() => {
         const current = db.getWorkloads().find(w => w.id === id);
         setWorkload(prev => JSON.stringify(prev) !== JSON.stringify(current) ? current : prev);
     }, 1000);
     return () => clearInterval(interval);
  }, [id]);

  const driftItem = MOCK_DRIFT_ITEMS.find(d => d.resourceName === workload?.name);


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
              네임스페이스: <span className="text-slate-200">{workload.namespace}</span> • 
              클러스터: <span className="text-slate-200">{workload.cluster}</span>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
             <Tabs defaultValue="overview" className="flex flex-col flex-1 h-full">
                <div className="border-b border-slate-700">
                    <TabsList className="bg-transparent p-0 h-auto gap-4">
                        <TabsTrigger value="overview" className="border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-500 rounded-none px-4 py-3 text-sm font-medium">개요</TabsTrigger>
                        <TabsTrigger value="logs" className="border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-500 rounded-none px-4 py-3 text-sm font-medium">로그</TabsTrigger>
                        <TabsTrigger value="terminal" className="border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-500 rounded-none px-4 py-3 text-sm font-medium">터미널</TabsTrigger>
                        {driftItem && (
                        <TabsTrigger value="drift" className="border-b-2 border-transparent data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-amber-500 text-amber-500/80 rounded-none px-4 py-3 text-sm font-medium">
                            <FiAlertTriangle className="mr-2" /> 드리프트 감지됨
                        </TabsTrigger>
                        )}
                    </TabsList>
                </div>

                <TabsContent value="overview" className="flex-1 overflow-y-auto mt-6">
                    <WorkloadOverview workload={workload} />
                </TabsContent>

                <TabsContent value="logs" className="flex-1 overflow-y-auto mt-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <LogViewer />
                </TabsContent>

                <TabsContent value="terminal" className="flex-1 overflow-y-auto mt-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <Terminal containerName={workload.name} />
                </TabsContent>

                {driftItem && (
                    <TabsContent value="drift" className="flex-1 overflow-y-auto mt-4">
                        <DriftDetails item={driftItem} onSync={() => alert('동기화 중... (시뮬레이션)')} />
                    </TabsContent>
                )}
             </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
