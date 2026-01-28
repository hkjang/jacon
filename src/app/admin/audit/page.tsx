"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiSearch, FiDownload, FiFilter } from 'react-icons/fi';

import { MOCK_AUDIT_LOGS } from '@/lib/mock-audit';

export default function GlobalAuditPage() {
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredLogs = MOCK_AUDIT_LOGS.filter(log => 
          log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
           <h1 className="text-2xl font-bold text-white">글로벌 감사 로그</h1>
           <div className="flex gap-2">
               <Button variant="outline" className="text-slate-400 border-slate-700 hover:bg-slate-800">
                   <FiFilter className="mr-2" /> 필터
               </Button>
               <Button variant="outline" className="text-slate-400 border-slate-700 hover:bg-slate-800">
                   <FiDownload className="mr-2" /> CSV 내보내기
               </Button>
           </div>
       </div>

       <Card className="bg-slate-900 border-slate-800">
           <CardHeader className="py-4 border-b border-slate-800">
                <div className="relative max-w-sm">
                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                 <Input 
                   placeholder="로그 검색 (사용자, 작업, 리소스)..." 
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
                           <th className="p-4">타임스탬프</th>
                           <th className="p-4">심각도</th>
                           <th className="p-4">사용자</th>
                           <th className="p-4">작업</th>
                           <th className="p-4">리소스</th>
                           <th className="p-4">세부정보</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                       {filteredLogs.map(log => (
                           <tr key={log.id} className="hover:bg-slate-800/10 transition-colors font-mono text-xs">
                               <td className="p-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                               <td className="p-4">
                                   <span className={`px-2 py-0.5 rounded ${
                                       log.severity === 'Critical' ? 'bg-red-500/20 text-red-500 font-bold' :
                                       log.severity === 'High' ? 'bg-orange-500/20 text-orange-500' :
                                       log.severity === 'Info' ? 'bg-blue-500/10 text-blue-500' : 'text-slate-400'
                                   }`}>
                                       {log.severity}
                                   </span>
                               </td>
                               <td className="p-4 text-slate-300">{log.user}</td>
                               <td className="p-4 text-slate-300 font-bold">{log.action}</td>
                               <td className="p-4 text-indigo-400">{log.resource}</td>
                               <td className="p-4 text-slate-400 max-w-xs truncate" title={log.details}>{log.details}</td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </CardContent>
       </Card>
    </div>
  );
}
