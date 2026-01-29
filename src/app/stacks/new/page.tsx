"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSave, FiArrowLeft, FiCode } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Note: In real app, we use a server action here. For speed, I'll allow client-side DB access just for this mock phase if possible, 
// or I'll quickly make a server action file for stack ops.
// Let's create `src/lib/stack-actions.ts` next to be clean.

import { createStackAction } from '@/lib/stack-actions';
import { useActionState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export default function NewStackPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createStackAction, null);
  const [formData, setFormData] = useState({
      name: '',
      type: 'compose' as 'compose' | 'kubernetes',
      endpointId: 'ep-1',
      content: '',
  });
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-4">
            <Link href="/stacks">
                <Button variant="ghost" size="sm"><FiArrowLeft className="mr-2" /> 목록으로</Button>
            </Link>
            <h1 className="text-2xl font-bold">새 스택 생성</h1>
        </div>

        <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm flex items-center gap-2">
                <FiAlertCircle />
                {state.error}
              </div>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                    <CardDescription>스택의 이름과 배포 대상 엔드포인트를 설정합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">스택 이름</label>
                            <Input 
                                name="name"
                                placeholder="my-awesome-stack" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">엔드포인트</label>
                            <select 
                                name="endpointId"
                                className="w-full h-10 px-3 rounded-md border border-slate-700 bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
                                value={formData.endpointId}
                                onChange={e => setFormData({...formData, endpointId: e.target.value})}
                            >
                                <option value="ep-1">Production Cluster (k8s)</option>
                                <option value="ep-2">Dev Server (docker)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">스택 유형</label>
                        <input type="hidden" name="type" value={formData.type} />
                        <div className="flex gap-4">
                            <label className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${formData.type === 'compose' ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                                <input 
                                    type="radio" 
                                    className="sr-only" 
                                    checked={formData.type === 'compose'} 
                                    onChange={() => setFormData({...formData, type: 'compose'})} 
                                />
                                <div className="font-bold text-slate-200">Docker Compose</div>
                                <div className="text-xs text-slate-400 mt-1">docker-compose.yml 형식을 사용합니다. 단일 Docker 호스트에 배포합니다.</div>
                            </label>
                            <label className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${formData.type === 'kubernetes' ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                                <input 
                                    type="radio" 
                                    className="sr-only" 
                                    checked={formData.type === 'kubernetes'} 
                                    onChange={() => setFormData({...formData, type: 'kubernetes'})} 
                                />
                                <div className="font-bold text-slate-200">Kubernetes Manifest</div>
                                <div className="text-xs text-slate-400 mt-1">Standard K8s YAML 또는 Helm Chart를 사용합니다. 클러스터에 배포합니다.</div>
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FiCode />
                        웹 에디터
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative rounded-md overflow-hidden border border-slate-700">
                        <div className="bg-slate-800 text-xs text-slate-400 px-3 py-1 border-b border-slate-700">
                            {formData.type === 'compose' ? 'docker-compose.yml' : 'manifest.yaml'}
                        </div>
                        <textarea 
                            name="content"
                            className="w-full h-96 bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 outline-none resize-y"
                            placeholder={formData.type === 'compose' ? "version: '3'\nservices:\n  web:..." : "apiVersion: apps/v1\nkind: Deployment..."}
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            spellCheck={false}
                            required
                        />
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        * YAML 문법 오류는 배포 시점에 검증됩니다.
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
                <Link href="/stacks">
                    <Button type="button" variant="ghost">취소</Button>
                </Link>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-32" disabled={isPending}>
                    {isPending ? '배포 중...' : <><FiSave className="mr-2" /> 배포하기</>}
                </Button>
            </div>
        </form>
      </div>
    </MainLayout>
  );
}
