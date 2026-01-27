"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ConfigList } from '@/components/features/config/config-list';

export default function ConfigPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Configuration</h1>
          <p className="text-slate-400">Manage ConfigMaps and Secrets securely.</p>
        </div>
        <ConfigList />
      </div>
    </MainLayout>
  );
}
