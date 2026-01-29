import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { getSessionUser, logoutAction } from '@/lib/auth-actions';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { ProfileTabs } from '@/components/features/profile/profile-tabs';

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch active sessions for this user
  const sessions = db.getUserSessions(user.id);
  
  // Fetch API tokens
  const apiTokens = db.getApiTokens(user.id);

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/50 pb-6">
            <div>
                <h1 className="text-2xl font-bold">내 프로필</h1>
                <p className="text-slate-400">계정 정보 및 보안 설정을 관리합니다.</p>
            </div>
            <form action={logoutAction}>
                <Button variant="danger" className="gap-2">
                    <FiLogOut /> 로그아웃
                </Button>
            </form>
        </div>

        <ProfileTabs user={user} sessions={sessions} apiTokens={apiTokens} />
        
      </div>
    </MainLayout>
  );
}
