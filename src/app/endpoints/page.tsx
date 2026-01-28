"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { EndpointList } from '@/components/features/endpoints/endpoint-list';

export default function EndpointsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">엔드포인트 관리</h1>
          <p className="text-slate-400">인프라 엔드포인트를 등록하고 모니터링합니다.</p>
        </div>
        <EndpointList />
      </div>
    </MainLayout>
  );
}
