import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiPlus, FiGitBranch, FiRefreshCw, FiTrash2, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { deleteGitRepoAction, syncGitRepoAction } from '@/lib/gitops-actions';

export default function GitOpsPage() {
  const repos = db.getGitRepos();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">GitOps 연동</h1>
                <p className="text-slate-400">Git 리포지토리를 연결하여 애플리케이션 상태를 자동으로 동기화합니다.</p>
            </div>
            <Link href="/gitops/new">
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <FiPlus /> 리포지토리 연결
                </Button>
            </Link>
        </div>

        {repos.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-700 bg-slate-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <FiGitBranch className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200">연결된 리포지토리가 없습니다</h3>
                    <p className="text-slate-400 mt-2 mb-6 max-w-md">
                        Git 리포지토리를 연결하여 GitOps 워크플로우를 시작하세요.
                    </p>
                    <Link href="/gitops/new">
                        <Button variant="outline">첫 번째 리포지토리 연결</Button>
                    </Link>
                </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {repos.map(repo => (
                    <Card key={repo.id} className="hover:border-indigo-500/30 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${
                                    repo.status === 'synced' ? 'bg-emerald-500/10 text-emerald-500' :
                                    repo.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                    'bg-blue-500/10 text-blue-500 animate-pulse'
                                }`}>
                                    <FiGitBranch size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                                        {repo.name}
                                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal border border-slate-700">
                                            {repo.branch}
                                        </span>
                                    </h3>
                                    <div className="text-sm text-slate-500 flex items-center gap-4 mt-1">
                                        <span className="truncate max-w-xs">{repo.url}</span>
                                        <span className="flex items-center gap-1">
                                            <FiClock size={14} /> 
                                            마지막 동기화: {repo.lastSync ? new Date(repo.lastSync).toLocaleString() : '없음'}
                                        </span>
                                        {repo.autoSync && <span className="text-emerald-500 text-xs border border-emerald-500/30 px-1 rounded">자동 동기화</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <form action={syncGitRepoAction}>
                                    <input type="hidden" name="id" value={repo.id} />
                                    <Button variant="outline" size="sm" type="submit" disabled={repo.status === 'syncing'}>
                                        <FiRefreshCw className={`mr-2 ${repo.status === 'syncing' ? 'animate-spin' : ''}`} /> 
                                        {repo.status === 'syncing' ? '동기화 중...' : '지금 동기화'}
                                    </Button>
                                </form>
                                <form action={deleteGitRepoAction}>
                                    <input type="hidden" name="id" value={repo.id} />
                                    <Button variant="ghost" size="sm" type="submit" className="text-slate-500 hover:text-red-400">
                                        <FiTrash2 />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </MainLayout>
  );
}
