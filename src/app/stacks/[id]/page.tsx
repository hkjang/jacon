import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiArrowLeft, FiBox, FiTrash2, FiPlay, FiStopCircle, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { deleteStackAction } from '@/lib/stack-actions';

import { notFound } from 'next/navigation';

export default async function StackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let id: string;

  try {
    const resolvedParams = await params;
    id = resolvedParams?.id;
  } catch {
    redirect('/stacks');
    return null;
  }

  // Validate ID parameter
  if (!id || typeof id !== 'string') {
    notFound();
  }

  const stack = db.getStack(id);

  if (!stack) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/stacks">
                    <Button variant="ghost" size="sm"><FiArrowLeft className="mr-2" /> 목록으로</Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        {stack.name}
                        <span className={`text-xs px-2 py-0.5 rounded border ${
                            stack.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                            {stack.status.toUpperCase()}
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm">
                        ID: {stack.id} • Type: {stack.type} • Endpoint: {stack.endpointId}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                    <FiRefreshCw /> Redeploy
                </Button>
                <Button variant="outline" className="gap-2 text-red-400 hover:text-red-300 hover:border-red-500/50">
                    <FiStopCircle /> Stop
                </Button>
                
                <form action={deleteStackAction}>
                    <input type="hidden" name="id" value={stack.id} />
                    <Button variant="danger" type="submit" className="gap-2">
                        <FiTrash2 /> Delete
                    </Button>
                </form>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Info */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Stack Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span className="text-slate-500">Created At</span>
                            <span className="text-slate-300">{new Date(stack.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-2">
                            <span className="text-slate-500">Last Updated</span>
                            <span className="text-slate-300">{new Date(stack.updatedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-slate-500">Env Vars</span>
                            <span className="text-slate-300">{Object.keys(stack.envVars).length} defined</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resources</CardTitle>
                        <CardDescription>Managed containers/resources</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-slate-900 rounded text-center text-slate-500 text-sm">
                            <FiBox className="mx-auto mb-2 opacity-50" />
                            Live resource tracking coming in Phase 12.
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Configuration
                            <span className="text-xs font-normal text-slate-500 ml-auto">Read-only</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-[#1e1e1e] rounded-md border border-slate-700 p-4 overflow-auto max-h-[600px]">
                            <pre className="text-sm font-mono text-blue-300">
                                {stack.content}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
