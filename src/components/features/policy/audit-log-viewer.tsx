"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MOCK_AUDIT_LOGS } from '@/lib/mock-audit';
import { cn } from '@/lib/utils';

export function AuditLogViewer() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Audit Logs</h3>
        <div className="w-64">
           <Input 
             placeholder="Filter user or resource..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <Card className="flex-1 min-h-0 bg-slate-950 border-slate-800">
        <CardContent className="p-0 h-full overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-900 text-slate-400 sticky top-0">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Resource</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">IP</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                  <td className="px-6 py-3 text-slate-500">{log.timestamp}</td>
                  <td className="px-6 py-3 text-emerald-400">{log.user}</td>
                  <td className="px-6 py-3 text-blue-400">{log.action}</td>
                  <td className="px-6 py-3 text-slate-300">{log.resource}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                      log.status === 'allowed' ? "bg-emerald-900 text-emerald-500" : "bg-red-900 text-red-500"
                    )}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
