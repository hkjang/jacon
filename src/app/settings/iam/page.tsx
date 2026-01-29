import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiUsers, FiLock, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function IamPage() {
  const roles = db.getIamRoles();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Identity & Access Management (IAM)</h1>
                <p className="text-slate-400">역할 기반 접근 제어(RBAC)를 관리합니다.</p>
            </div>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <FiPlus /> Create Role
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map(role => (
                <Card key={role.id} className="hover:border-slate-600 transition-colors">
                     <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="flex items-center gap-2">
                                <FiLock className={role.name === 'Administrator' ? 'text-amber-500' : 'text-slate-500'} />
                                {role.name}
                            </CardTitle>
                            {role.type === 'system' && (
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">System</span>
                            )}
                        </div>
                        <CardDescription>{role.description}</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Permissions</div>
                            <div className="flex flex-wrap gap-1">
                                {role.permissions.map(perm => (
                                    <span key={perm} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-300 font-mono border border-slate-800">
                                        {perm}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outline" size="sm" className="w-full" disabled={role.type === 'system'}>
                                <FiEdit className="mr-2" /> Edit
                             </Button>
                             {role.type !== 'system' && (
                                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
                                    <FiTrash2 />
                                </Button>
                             )}
                        </div>
                     </CardContent>
                </Card>
            ))}
        </div>
        
        <Card className="mt-4 border-dashed border-2 bg-slate-900/30">
            <CardContent className="py-8 text-center text-slate-500">
                <FiUsers size={32} className="mx-auto mb-2 opacity-50" />
                <p>User assignment to roles is managed in the <span className="text-blue-400 underline cursor-pointer">Users & Teams</span> section.</p>
            </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
