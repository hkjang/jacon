"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSave, FiArrowLeft, FiGitBranch, FiLock, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { addGitRepoAction } from '@/lib/gitops-actions';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewGitRepoPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addGitRepoAction, null);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-4">
            <Link href="/gitops">
                <Button variant="ghost" size="sm"><FiArrowLeft className="mr-2" /> 목록으로</Button>
            </Link>
            <h1 className="text-2xl font-bold">리포지토리 연결</h1>
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
                    <CardTitle>리포지토리 정보</CardTitle>
                    <CardDescription>연결할 Git 리포지토리의 정보를 입력하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">이름 (Alias)</label>
                        <Input 
                            name="name" 
                            placeholder="my-production-config" 
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Repository URL</label>
                        <Input 
                            name="url" 
                            placeholder="https://github.com/org/repo.git" 
                            required
                        />
                        <p className="text-xs text-slate-500">HTTPS 또는 SSH URL을 지원합니다.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Branch</label>
                        <div className="relative">
                            <FiGitBranch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <Input 
                                name="branch" 
                                placeholder="main" 
                                defaultValue="main"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FiLock /> 인증 설정 (Optional)
                    </CardTitle>
                    <CardDescription>Private 리포지토리의 경우 인증 정보를 입력하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">사용자명</label>
                            <Input name="username" placeholder="git-user" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">개인 액세스 토큰</label>
                            <Input type="password" name="token" placeholder="ghp_xxxxxxxxxxxx" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-slate-200">자동 동기화 (Auto-Sync)</div>
                            <div className="text-sm text-slate-500">리포지토리 변경사항을 감지하여 자동으로 클러스터에 배포합니다.</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="autoSync" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                 </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
                <Link href="/gitops">
                    <Button type="button" variant="ghost">취소</Button>
                </Link>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-32" disabled={isPending}>
                    {isPending ? '연결 중...' : <><FiSave className="mr-2" /> 연결하기</>}
                </Button>
            </div>
        </form>
      </div>
    </MainLayout>
  );
}
