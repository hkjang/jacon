"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ConfigEditor } from '@/components/features/config/config-editor';
import { useParams } from 'next/navigation';
import { MOCK_CONFIGS } from '@/lib/mock-config';
import { FiArrowLeft, FiLock, FiFileText } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ConfigDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const config = MOCK_CONFIGS.find(c => c.id === id);

  if (!config) {
     return (
        <MainLayout>
           <div className="text-center mt-10">Config not found</div>
        </MainLayout>
     )
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex items-center gap-4">
          <Link href="/config">
            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
               <FiArrowLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
               {config.type === 'Secret' ? <FiLock className="text-amber-500" /> : <FiFileText className="text-blue-500" />}
               {config.name}
            </h1>
            <p className="text-slate-400 text-sm">
               Namespace: <span className="text-slate-200">{config.namespace}</span>
            </p>
          </div>
        </div>
        <ConfigEditor configId={id} />
      </div>
    </MainLayout>
  );
}
