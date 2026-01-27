"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_WORKLOADS } from '@/lib/mock-workloads';
import { FiRefreshCw, FiMoreVertical } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export function WorkloadList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkloads = MOCK_WORKLOADS.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.namespace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 w-full max-w-md">
          <Input 
            placeholder="Filter workloads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
          <Button>
            Create Workload
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-800 text-slate-400">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Namespace</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Restarts</th>
                <th className="px-6 py-3">Age</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkloads.map((workload) => (
                <tr 
                  key={workload.id} 
                  className="border-b border-slate-700 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/workloads/${workload.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-slate-200">{workload.name}</td>
                  <td className="px-6 py-4 text-slate-400">{workload.namespace}</td>
                  <td className="px-6 py-4 text-slate-400">{workload.type}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      workload.status === 'Running' && "bg-emerald-500/10 text-emerald-500",
                      workload.status === 'CrashLoopBackOff' && "bg-red-500/10 text-red-500",
                      workload.status === 'Pending' && "bg-amber-500/10 text-amber-500",
                    )}>
                      {workload.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{workload.restarts}</td>
                  <td className="px-6 py-4 text-slate-400">{workload.age}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                      <FiMoreVertical />
                    </Button>
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
