"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_ADMIN_USERS, AdminUser } from '@/lib/mock-admin';
import { FiSearch, FiMoreVertical, FiLock, FiUnlock, FiShield } from 'react-icons/fi';

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);

  const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
      setUsers(users.map(u => {
          if (u.id === id) {
              return { ...u, status: u.status === 'Active' ? 'Locked' : 'Active' };
          }
          return u;
      }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-white">사용자 관리</h1>
         <Button>새 사용자 초대</Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
         <CardHeader className="border-b border-slate-800 py-4">
             <div className="relative max-w-sm">
                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                 <Input 
                   placeholder="사용자 검색..." 
                   className="pl-9 bg-slate-950 border-slate-800"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
             </div>
         </CardHeader>
         <CardContent className="p-0">
             <table className="w-full text-left text-sm">
                 <thead className="bg-slate-950/50 text-slate-400 font-medium">
                     <tr>
                         <th className="p-4">사용자</th>
                         <th className="p-4">역할</th>
                         <th className="p-4">상태</th>
                         <th className="p-4">마지막 로그인</th>
                         <th className="p-4 text-right">작업</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                     {filteredUsers.map(user => (
                         <tr key={user.id} className="hover:bg-slate-800/10 transition-colors">
                             <td className="p-4">
                                 <div className="font-bold text-slate-200">{user.name}</div>
                                 <div className="text-xs text-slate-500">{user.email}</div>
                             </td>
                             <td className="p-4">
                                 <div className="flex items-center gap-2">
                                     <FiShield className="text-indigo-500" />
                                     <span className="text-slate-300">{user.role}</span>
                                 </div>
                             </td>
                             <td className="p-4">
                                 <span className={`px-2 py-1 rounded text-xs font-bold ${
                                     user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                                     user.status === 'Locked' ? 'bg-red-500/10 text-red-500' : 'bg-slate-700 text-slate-400'
                                 }`}>
                                     {user.status === 'Active' ? '활성' : user.status === 'Locked' ? '잠김' : '대기중'}
                                 </span>
                             </td>
                             <td className="p-4 text-slate-400 font-mono text-xs">
                                 {user.lastLogin}
                             </td>
                             <td className="p-4 text-right">
                                 <div className="flex justify-end gap-2">
                                     <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => toggleStatus(user.id)}
                                        title={user.status === 'Active' ? '계정 잠금' : '잠금 해제'}
                                     >
                                         {user.status === 'Active' ? <FiLock /> : <FiUnlock />}
                                     </Button>
                                     <Button variant="ghost" size="sm"><FiMoreVertical /></Button>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </CardContent>
      </Card>
    </div>
  );
}
