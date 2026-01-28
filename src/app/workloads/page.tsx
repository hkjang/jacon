"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { WorkloadList } from '@/components/features/workloads/workload-list';

export default function WorkloadsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">워크로드</h1>
          <p className="text-slate-400">클러스터 전반의 파드, 배포 및 기타 리소스를 관리합니다.</p>
        </div>
        <WorkloadList />
      </div>
    </MainLayout>
  );
}
