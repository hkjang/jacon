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
               Enterprise Grade<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Kubernetes Operations</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
               Securely manage multi-cluster workloads, enforce policies, and audit every action with a platform built for scale.
            </p>
         </div>

         <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
               <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                  <FiShield size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-200">Zero Trust Security</h3>
                  <p className="text-sm text-slate-400 mt-1">Strict RBAC, audit logging, and policy enforcement at every layer.</p>
               </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
               <div className="mt-1 bg-blue-500/10 p-2 rounded-lg text-blue-400">
                  <FiGlobe size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-200">Multi-Cluster Scale</h3>
                  <p className="text-sm text-slate-400 mt-1">Unified inventory and operations across hybrid cloud environments.</p>
               </div>
            </div>
         </div>
         
         <div className="text-xs text-slate-500 flex gap-6">
            <span>© 2025 Jacon Inc.</span>
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
         </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[url('/grid.svg')] bg-center relative">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:hidden mb-8">
               <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500 mb-2">Jacon</h1>
               <p className="text-slate-400">Operations Platform</p>
            </div>

            <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
               <p className="text-slate-400 text-sm mt-2">Sign in to your account to continue</p>
            </div>

            <LoginForm />

            <div className="text-center text-xs text-slate-500 mt-8">
               <p>Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
