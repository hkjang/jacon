import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSessionUser, logoutAction } from '@/lib/auth-actions';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { FiUser, FiShield, FiKey, FiSmartphone, FiLogOut, FiMonitor, FiTrash2 } from 'react-icons/fi';

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
      <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: User Info */}
            <div className="space-y-6">
                <Card>
                    <CardHeader className="text-center pb-2">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
                            {user.name.charAt(0)}
                        </div>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.title || user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-slate-900 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-slate-400">역할</span>
                            <span className="text-sm font-bold text-blue-400 uppercase">{user.role}</span>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-slate-400">상태</span>
                            <span className="text-sm font-bold text-emerald-400">Active</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FiShield className="text-emerald-500" /> 보안 상태
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">이메일 인증</span>
                            <span className="text-emerald-500">완료</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">MFA 설정</span>
                            <span className={user.mfaEnabled ? "text-emerald-500" : "text-slate-500"}>
                                {user.mfaEnabled ? '켜짐' : '꺼짐'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">비밀번호 변경</span>
                            <span className="text-slate-500">30일 전</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Settings & Lists */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Active Sessions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FiMonitor /> 활성 세션
                        </CardTitle>
                        <CardDescription>현재 계정에 로그인된 기기 목록입니다.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sessions.map(session => (
                                <div key={session.sessionId} className="flex items-start justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                                    <div className="flex gap-3">
                                        <div className="mt-1 text-slate-400"><FiMonitor size={20} /></div>
                                        <div>
                                            <div className="font-medium text-slate-200">
                                                {session.userAgent.includes('Windows') ? 'Windows PC' : 
                                                 session.userAgent.includes('Mac') ? 'Mac' : 'Browser Session'}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                IP: {session.ip} • 접속: {new Date(session.createdAt).toLocaleString()}
                                            </div>
                                            {session.expiresAt && (
                                                <div className="text-xs text-emerald-500 mt-1">
                                                    현재 활성 세션
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                        종료
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* API Tokens */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FiKey /> API 토큰
                            </CardTitle>
                            <CardDescription>외부 시스템 연동을 위한 액세스 토큰입니다.</CardDescription>
                        </div>
                        <Button size="sm" variant="outline">토큰 생성</Button>
                    </CardHeader>
                    <CardContent>
                        {apiTokens.length === 0 ? (
                            <div className="text-center py-6 text-slate-500 text-sm">
                                발급된 API 토큰이 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {apiTokens.map(token => (
                                    <div key={token.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-200">{token.name}</span>
                                            <span className="text-xs text-slate-500 text-mono">
                                                {token.createdAt.split('T')[0]} 생성 • {token.scopes.join(', ')}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm"><FiTrash2 className="text-slate-400" /></Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* MFA Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FiSmartphone /> 다중 인증 (MFA)
                        </CardTitle>
                        <CardDescription>계정 보안을 위해 2단계 인증을 설정하세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="text-sm text-slate-300">
                            {user.mfaEnabled ? 'MFA가 현재 활성화되어 있습니다.' : 'MFA가 설정되지 않았습니다.'}
                        </div>
                        <Button variant={user.mfaEnabled ? "outline" : "primary"}>
                            {user.mfaEnabled ? '설정 변경' : 'MFA 설정하기'}
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
      </div>
    </MainLayout>
  );
}
