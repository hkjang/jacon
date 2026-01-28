"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiArrowLeft, FiUploadCloud, FiTerminal } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewEndpointPage() {
  const router = useRouter();
  const [type, setType] = useState<'k8s' | 'docker'>('k8s');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate validation and creation
    setTimeout(() => {
        router.push('/endpoints');
    }, 500);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-4">
           <Link href="/endpoints">
              <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                  <FiArrowLeft />
              </Button>
           </Link>
           <div>
              <h1 className="text-2xl font-bold">엔드포인트 등록</h1>
              <p className="text-slate-400">이 프로젝트에 새 클러스터 또는 호스트를 추가합니다.</p>
           </div>
        </div>

        <div className="flex gap-4 mb-4">
           <Card 
             className={`flex-1 cursor-pointer transition-all ${type === 'k8s' ? 'border-blue-500 bg-slate-900 ring-1 ring-blue-500' : 'hover:bg-slate-900'}`}
             onClick={() => setType('k8s')}
           >
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
                    <FiUploadCloud />
                 </div>
                 <div className="font-bold">Kubernetes 클러스터</div>
                 <p className="text-xs text-slate-400">Kubeconfig 파일 또는 URL을 통해 가져오기</p>
              </CardContent>
           </Card>
           
           <Card 
             className={`flex-1 cursor-pointer transition-all ${type === 'docker' ? 'border-blue-500 bg-slate-900 ring-1 ring-blue-500' : 'hover:bg-slate-900'}`}
             onClick={() => setType('docker')}
           >
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-blue-400/10 text-blue-400 flex items-center justify-center text-2xl">
                    <FiTerminal />
                 </div>
                 <div className="font-bold">Docker 엔진</div>
                 <p className="text-xs text-slate-400">TCP 또는 SSH를 통해 연결</p>
              </CardContent>
           </Card>
        </div>

        <Card>
           <CardHeader>
              <CardTitle>연결 세부 정보</CardTitle>
           </CardHeader>
           <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">표시 이름</label>
                    <Input placeholder="예: Production Cluster US-East" required />
                 </div>
                 
                 {type === 'k8s' ? (
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Kubeconfig (YAML)</label>
                        <textarea 
                           className="w-full h-40 bg-slate-950 border border-slate-800 rounded-md p-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                           placeholder="Kubeconfig 내용을 여기에 붙여넣으세요..."
                        />
                     </div>
                 ) : (
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">호스트 URL</label>
                        <Input placeholder="tcp://docker.host:2376" required />
                        <p className="text-xs text-slate-500">Docker 데몬 API가 노출되어 있고 접근 가능한지 확인하세요.</p>
                     </div>
                 )}

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">태그 (쉼표로 구분)</label>
                    <Input placeholder="production, aws, west" />
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>취소</Button>
                    <Button type="submit">검증 및 등록</Button>
                 </div>
              </form>
           </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
