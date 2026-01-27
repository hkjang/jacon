"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RoleList } from '@/components/features/policy/role-list';
import { AuditLogViewer } from '@/components/features/policy/audit-log-viewer';
import { cn } from '@/lib/utils';

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'audit'>('roles');

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Policy & IAM</h1>
            <p className="text-slate-400">Manage Roles, Bindings and Security Policies.</p>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
             <button
               onClick={() => setActiveTab('roles')}
               className={cn(
                 "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                 activeTab === 'roles' ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
               )}
             >
               Roles & Permissions
             </button>
             <button
               onClick={() => setActiveTab('audit')}
               className={cn(
                 "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                 activeTab === 'audit' ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
               )}
             >
               Audit Logs
             </button>
          </div>
        </div>

        {activeTab === 'roles' ? <RoleList /> : <AuditLogViewer />}
      </div>
    </MainLayout>
  );
}
