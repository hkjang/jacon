"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/auth';
import { Session, ApiToken } from '@/lib/db';
import { FiUser, FiShield, FiMonitor, FiKey, FiSettings, FiLogOut, FiTrash2, FiPlus, FiCopy, FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { ProtectedActionModal } from '@/components/ui/protected-action-modal';

interface ProfileTabsProps {
  user: User;
  sessions: Session[];
  apiTokens: ApiToken[];
}

export function ProfileTabs({ user, sessions: initialSessions, apiTokens: initialTokens }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'sessions' | 'tokens' | 'settings'>('general');
  const isSso = user.isSso ?? false;

  const tabs = [
    { id: 'general', label: '기본 정보', icon: FiUser },
    { id: 'security', label: '보안', icon: FiShield },
    { id: 'sessions', label: '활성 세션', icon: FiMonitor },
    { id: 'tokens', label: 'API 토큰', icon: FiKey },
    { id: 'settings', label: '환경설정', icon: FiSettings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Sidebar for Tabs */}
      <div className="w-full md:w-64 space-y-2">
         {tabs.map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                   "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                   activeTab === tab.id 
                     ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                     : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
               )}
            >
               <tab.icon className="w-4 h-4" />
               {tab.label}
            </button>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
          {activeTab === 'general' && <GeneralTab user={user} isSso={isSso} />}
          {activeTab === 'security' && <SecurityTab user={user} />}
          {activeTab === 'sessions' && <SessionsTab sessions={initialSessions} />}
          {activeTab === 'tokens' && <TokensTab tokens={initialTokens} />}
          {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

// --- Sub Components ---

function GeneralTab({ user, isSso }: { user: User; isSso: boolean }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <Card>
        <CardHeader>
           <CardTitle>기본 정보</CardTitle>
           <CardDescription>계정의 기본 정보를 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                 {user.name.charAt(0)}
              </div>
              <div>
                 <h3 className="text-xl font-bold text-slate-100">{user.name}</h3>
                 <p className="text-slate-400">{user.email}</p>
                 <span className="inline-block mt-2 px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20 uppercase font-bold">
                    {user.role}
                 </span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase">이름</label>
                 <div className="p-3 bg-slate-900 border border-slate-800 rounded text-slate-300">
                    {user.name}
                 </div>
                 {isSso && <p className="text-xs text-slate-500">SSO 계정은 이름을 변경할 수 없습니다.</p>}
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase">이메일</label>
                 <div className="p-3 bg-slate-900 border border-slate-800 rounded text-slate-300">
                    {user.email}
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase">직책</label>
                 <div className="p-3 bg-slate-900 border border-slate-800 rounded text-slate-300">
                    {user.title || 'N/A'}
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityTab({ user }: { user: User }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card>
                <CardHeader>
                    <CardTitle>보안 설정</CardTitle>
                    <CardDescription>계정 보안 및 인증 방법을 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg">
                        <div className="space-y-1">
                            <div className="font-medium text-slate-200">다중 인증 (MFA)</div>
                            <div className="text-sm text-slate-500">로그인 시 추가 인증을 요구하여 보안을 강화합니다.</div>
                        </div>
                        <Button variant={user.mfaEnabled ? 'outline' : 'primary'} className={user.mfaEnabled ? 'text-emerald-500 border-emerald-500/50' : ''}>
                            {user.mfaEnabled ? '설정 변경' : 'MFA 설정'}
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg">
                        <div className="space-y-1">
                            <div className="font-medium text-slate-200">비밀번호 변경</div>
                            <div className="text-sm text-slate-500">주기적인 비밀번호 변경을 권장합니다.</div>
                        </div>
                        <Button variant="outline">변경하기</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SessionsTab({ sessions }: { sessions: Session[] }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card>
                <CardHeader>
                    <CardTitle>활성 세션</CardTitle>
                    <CardDescription>현재 계정에 로그인된 기기 및 브라우저 목록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {sessions.map(session => (
                            <div key={session.sessionId} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:bg-slate-900 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                        <FiMonitor size={20} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-200">
                                            {session.userAgent.includes('Windows') ? 'Windows PC' : 
                                             session.userAgent.includes('Mac') ? 'Mac' : 'Browser Session'}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span>IP: {session.ip}</span>
                                            <span>•</span>
                                            <span>접속: {new Date(session.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {session.expiresAt && (
                                        <span className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                            Current
                                        </span>
                                    )}
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
                                        종료
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {sessions.length > 1 && (
                         <div className="mt-4 flex justify-end">
                            <Button variant="danger" size="sm">다른 모든 세션 종료</Button>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function TokensTab({ tokens }: { tokens: ApiToken[] }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>API 토큰</CardTitle>
                        <CardDescription>외부 시스템 연동을 위한 액세스 토큰을 관리합니다.</CardDescription>
                    </div>
                    <Button size="sm"><FiPlus className="mr-2" /> 토큰 생성</Button>
                </CardHeader>
                <CardContent>
                    {tokens.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg text-slate-500">
                            <FiKey className="mx-auto h-8 w-8 mb-2 opacity-50" />
                            <p>발급된 API 토큰이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tokens.map(token => (
                                <div key={token.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-200">{token.name}</span>
                                            <div className="flex gap-1">
                                                {token.scopes.map(scope => (
                                                    <span key={scope} className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                                                        {scope}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 font-mono">
                                            생성: {token.createdAt.split('T')[0]} • 만료: 90일 후
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
                                        <FiTrash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function SettingsTab() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card>
                <CardHeader>
                    <CardTitle>환경설정</CardTitle>
                    <CardDescription>개인화된 작업 환경을 설정합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                         <div className="flex items-center justify-between p-2">
                             <span className="text-sm text-slate-300">언어 (Language)</span>
                             <select className="bg-slate-900 border border-slate-700 rounded p-1 text-sm text-slate-300">
                                 <option>한국어</option>
                                 <option>English</option>
                             </select>
                         </div>
                         <div className="flex items-center justify-between p-2">
                             <span className="text-sm text-slate-300">테마 (Theme)</span>
                             <select className="bg-slate-900 border border-slate-700 rounded p-1 text-sm text-slate-300">
                                 <option>Dark (Default)</option>
                                 <option>Light</option>
                             </select>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
