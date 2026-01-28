"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { EndpointList } from '@/components/features/endpoints/endpoint-list';

export default function EndpointsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Endpoint Management</h1>
          <p className="text-slate-400">Register and monitor your infrastructure endpoints.</p>
        </div>
        <EndpointList />
      </div>
    </MainLayout>
  );
}
