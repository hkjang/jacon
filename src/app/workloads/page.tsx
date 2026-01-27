"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { WorkloadList } from '@/components/features/workloads/workload-list';

export default function WorkloadsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Workloads</h1>
          <p className="text-slate-400">Manage Pods, Deployments and other resources across clusters.</p>
        </div>
        <WorkloadList />
      </div>
    </MainLayout>
  );
}
