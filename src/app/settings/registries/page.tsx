"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RegistryList } from '@/components/features/registries/registry-list';

export default function RegistriesPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">컨테이너 레지스트리</h1>
          <p className="text-slate-400">Private 이미지를 가져오기 위한 레지스트리 자격 증명을 관리합니다.</p>
        </div>

        <RegistryList />
      </div>
    </MainLayout>
  );
}
