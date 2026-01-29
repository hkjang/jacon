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
  const id = params?.id as string;

  // Validate ID parameter
  if (!id || typeof id !== 'string') {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-red-400">잘못된 요청</h1>
          <p className="text-slate-400 mt-2">유효하지 않은 Config ID입니다.</p>
          <Link href="/config" className="text-blue-500 hover:underline mt-4">Config 목록으로 돌아가기</Link>
        </div>
      </MainLayout>
    );
  }

  const config = MOCK_CONFIGS?.find(c => c.id === id);

  if (!config) {
     return (
        <MainLayout>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Config를 찾을 수 없습니다</h1>
            <p className="text-slate-400 mt-2">요청한 Config가 존재하지 않거나 삭제되었습니다.</p>
            <Link href="/config" className="text-blue-500 hover:underline mt-4">Config 목록으로 돌아가기</Link>
          </div>
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
