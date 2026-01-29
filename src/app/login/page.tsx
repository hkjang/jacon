import React from 'react';
import { LoginForm } from '@/components/features/auth/login-form';
import { FiCheckCircle, FiShield, FiGlobe, FiCpu } from 'react-icons/fi';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Left Panel: Product Info */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 border-r border-slate-800 p-12 flex-col justify-between relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

         <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FiCpu className="text-white text-xl" />
               </div>
               <span className="text-2xl font-bold tracking-tight">Jacon Operations</span>
            </div>
            
            <h1 className="text-4xl font-extrabold leading-tight mb-6">
               엔터프라이즈급<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Kubernetes 운영 플랫폼</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
               멀티 클러스터 워크로드를 안전하게 관리하고, 정책을 적용하며, 확장 가능한 플랫폼으로 모든 작업을 감사합니다.
            </p>
         </div>

         <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
               <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                  <FiShield size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-200">제로 트러스트 보안</h3>
                  <p className="text-sm text-slate-400 mt-1">엄격한 RBAC, 감사 로깅, 모든 계층에서의 정책 적용.</p>
               </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
               <div className="mt-1 bg-blue-500/10 p-2 rounded-lg text-blue-400">
                  <FiGlobe size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-200">멀티 클러스터 확장</h3>
                  <p className="text-sm text-slate-400 mt-1">하이브리드 클라우드 환경 전반에 걸친 통합 인벤토리 및 운영.</p>
               </div>
            </div>
         </div>
         
         <div className="text-xs text-slate-500 flex gap-6">
            <span>© 2025 Jacon Inc.</span>
            <a href="#" className="hover:text-slate-300">개인정보처리방침</a>
            <a href="#" className="hover:text-slate-300">서비스 이용약관</a>
         </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[url('/grid.svg')] bg-center relative">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:hidden mb-8">
               <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500 mb-2">Jacon</h1>
               <p className="text-slate-400">운영 플랫폼</p>
            </div>

            <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-slate-100">다시 오신 것을 환영합니다</h2>
               <p className="text-slate-400 text-sm mt-2">계속하려면 계정에 로그인하세요</p>
            </div>

            <LoginForm />

            <div className="text-center text-xs text-slate-500 mt-8">
               <p>reCAPTCHA로 보호되며 개인정보처리방침 및 서비스 이용약관이 적용됩니다.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
