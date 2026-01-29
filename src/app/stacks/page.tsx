import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiPlus, FiBox, FiActivity, FiServer } from 'react-icons/fi';
import Link from 'next/link';

export default function StacksPage() {
  const stacks = db.getStacks();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">스택 관리 (Stacks)</h1>
                <p className="text-slate-400">Docker Compose 및 Kubernetes Manifest 기반의 애플리케이션 스택을 관리합니다.</p>
            </div>
            <Link href="/stacks/new">
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <FiPlus /> 스택 생성
                </Button>
            </Link>
        </div>

        {stacks.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-700 bg-slate-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <FiBox className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200">배포된 스택이 없습니다</h3>
                    <p className="text-slate-400 mt-2 mb-6 max-w-md">
                        Docker Compose v3 또는 Kubernetes Manifest를 사용하여 첫 번째 스택을 배포해보세요.
                    </p>
                    <Link href="/stacks/new">
                        <Button variant="outline">새 스택 배포하기</Button>
                    </Link>
                </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stacks.map(stack => (
                    <Card key={stack.id} className="hover:border-indigo-500/50 transition-colors cursor-pointer group">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded text-indigo-400">
                                        <FiBox size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg group-hover:text-indigo-400 transition-colors">
                                            {stack.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-400 uppercase">
                                                {stack.type}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                Updated {new Date(stack.updatedAt).toLocaleDateString()}
                                            </span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${
                                    stack.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 
                                    stack.status === 'deploying' ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 
                                    'bg-red-500/10 text-red-500'
                                }`}>
                                    {stack.status.toUpperCase()}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm p-2 bg-slate-900 rounded">
                                    <span className="text-slate-500 flex items-center gap-2"><FiServer /> Endpoint</span>
                                    <span className="text-slate-300 font-medium">{stack.endpointId}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-2 bg-slate-900 rounded">
                                    <span className="text-slate-500 flex items-center gap-2"><FiActivity /> Resources</span>
                                    <span className="text-slate-300 font-medium">Coming soon</span>
                                </div>
                            </div>
                            <Link href={`/stacks/${stack.id}`} className="block mt-4">
                                <Button variant="outline" className="w-full group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                                    Manage Stack
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </MainLayout>
  );
}
