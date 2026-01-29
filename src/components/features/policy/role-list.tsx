"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_ROLES, Role } from '@/lib/mock-policy';
import { FiPlus, FiShield, FiMoreHorizontal } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export function RoleList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const filteredRoles = MOCK_ROLES.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Role List */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Input 
            placeholder="역할 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button size="sm">
            <FiPlus />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredRoles.map((role) => (
            <div 
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-colors",
                selectedRole?.id === role.id 
                  ? "bg-slate-800 border-blue-500" 
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800/50"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <FiShield className={role.type === 'ClusterRole' ? "text-amber-500" : "text-blue-500"} />
                <span className="font-semibold">{role.name}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                    {role.type}
                 </span>
                 <span className="text-xs text-slate-500">{role.permissions.length} 규칙</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Details */}
      <Card className="flex-1">
        {selectedRole ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-700 flex justify-between items-start">
               <div>
                 <h2 className="text-xl font-bold flex items-center gap-2">
                   <FiShield className={selectedRole.type === 'ClusterRole' ? "text-amber-500" : "text-blue-500"} />
                   {selectedRole.name}
                 </h2>
                 <p className="text-slate-400 mt-2">{selectedRole.description}</p>
               </div>
               <Button variant="outline" size="sm">
                 <FiMoreHorizontal />
               </Button>
            </div>
            
            <CardContent className="flex-1 overflow-y-auto p-0">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-slate-800 text-slate-400">
                     <tr>
                        <th className="px-6 py-3">리소스</th>
                        <th className="px-6 py-3">작업</th>
                     </tr>
                  </thead>
                  <tbody>
                     {selectedRole.permissions.map((perm, i) => (
                        <tr key={i} className="border-b border-slate-700">
                           <td className="px-6 py-4 font-mono text-slate-300">{perm.resource}</td>
                           <td className="px-6 py-4">
                              <div className="flex gap-2">
                                 {perm.actions.map(action => (
                                    <span key={action} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                                       {action}
                                    </span>
                                 ))}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </CardContent>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            권한을 볼 역할을 선택하세요
          </div>
        )}
      </Card>
    </div>
  );
}
