"use client";

import React, { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiMail, FiLock, FiAlertCircle, FiGithub, FiGlobe } from 'react-icons/fi';
import { loginAction, verifyMfaAction } from '@/lib/auth-actions';

const initialState = {
  error: '',
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [mfaState, mfaAction, isMfaPending] = useActionState(verifyMfaAction, { error: '' });
  const [activeTab, setActiveTab] = useState<'local' | 'sso'>('local');

  // If Login returned MFA required, show MFA form
  if (state?.status === 'mfa_required') {
      return (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                      <FiLock size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-200">2단계 인증</h2>
                  <p className="text-sm text-slate-400 mt-2">인증 앱에 표시된 6자리 코드를 입력하세요.</p>
              </div>

              <form action={mfaAction} className="flex flex-col gap-4">
                  <input type="hidden" name="userId" value={state.userId} />
                  
                  {mfaState?.error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm flex items-center gap-2">
                        <FiAlertCircle />
                        {mfaState.error}
                    </div>
                  )}

                  <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-300">인증 코드</label>
                      <Input 
                        name="code" 
                        placeholder="000000" 
                        className="text-center text-lg tracking-widest font-mono" 
                        maxLength={6}
                        autoFocus
                        required 
                      />
                  </div>

                  <Button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2" 
                      disabled={isMfaPending}
                  >
                    {isMfaPending ? '확인 중...' : '인증하기'}
                  </Button>
                  
                  <button 
                    type="button"
                    onClick={() => window.location.reload()} 
                    className="text-white text-xs hover:underline text-center mt-2"
                  >
                    로그인 화면으로 돌아가기
                  </button>
              </form>
          </div>
      );
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
      {/* Tabs */}
      <div className="flex bg-slate-950 p-1 rounded-md mb-6 border border-slate-800">
         <button 
           className={`flex-1 py-2 text-sm font-medium rounded transition-all ${activeTab === 'local' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
           onClick={() => setActiveTab('local')}
           type="button"
         >
            로컬 로그인
         </button>
         <button 
           className={`flex-1 py-2 text-sm font-medium rounded transition-all ${activeTab === 'sso' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
           onClick={() => setActiveTab('sso')}
           type="button"
         >
            SSO (OIDC)
         </button>
      </div>

      {activeTab === 'local' ? (
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm flex items-center gap-2">
                <FiAlertCircle />
                {state.error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">이메일</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">비밀번호</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2" 
                disabled={isPending}
            >
              {isPending ? '로그인 중...' : '로그인'}
            </Button>
            
            <div className="text-center mt-2">
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">비밀번호를 잊으셨나요?</a>
            </div>
          </form>
      ) : (
          <div className="flex flex-col gap-4 py-4">
             <div className="text-center text-sm text-slate-400 mb-2">
                조직 계정으로 로그인하여 SSO를 시작합니다.
             </div>
             
             <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12 bg-white text-slate-900 hover:bg-slate-100 border-none">
                <FiGlobe className="text-xl" />
                <span>Google Workspace 로그인</span>
             </Button>
             
             <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12 bg-[#24292e] text-white hover:bg-[#2f363d] border-slate-700">
                <FiGithub className="text-xl" />
                <span>GitHub Enterprise 로그인</span>
             </Button>
             
             <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3 text-xs text-blue-400 mt-2">
                <span className="font-bold block mb-1">SSO 정책 안내</span>
                관리자가 설정한 보안 정책에 따라 MFA 인증이 추가로 요구될 수 있습니다.
             </div>
          </div>
      )}
      
      <div className="mt-6 pt-6 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center mb-2">⚡ 개발용 빠른 로그인 (Dev Only)</p>
        <div className="grid grid-cols-2 gap-2">
            <form action={formAction}>
                <input type="hidden" name="email" value="kim.cs@jacon.io" />
                <input type="hidden" name="password" value="password" />
                <Button 
                    type="submit" 
                    variant="outline" 
                    className="w-full text-xs h-auto py-2 flex flex-col items-start gap-1"
                >
                    <span className="font-bold">시스템 관리자</span>
                    <span className="text-[10px] text-slate-400">kim.cs@jacon.io</span>
                </Button>
            </form>
            <form action={formAction}>
                <input type="hidden" name="email" value="park.jm@jacon.io" />
                <input type="hidden" name="password" value="password" />
                <Button 
                    type="submit" 
                    variant="outline" 
                    className="w-full text-xs h-auto py-2 flex flex-col items-start gap-1"
                >
                    <span className="font-bold">백엔드 개발자</span>
                    <span className="text-[10px] text-slate-400">park.jm@jacon.io</span>
                </Button>
            </form>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2025 Jacon Operations. All rights reserved.
      </div>
    </div>
  );
}
