"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_WORKLOADS } from '@/lib/mock-workloads';
import { db } from '@/lib/db';
import { FiRefreshCw, FiMoreVertical } from 'react-icons/fi';
import { cn } from '@/lib/utils';


export function WorkloadList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [workloads, setWorkloads] = useState(MOCK_WORKLOADS); // Init with default
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  React.useEffect(() => {
      loadWorkloads();
  }, []);

  const loadWorkloads = () => {
      setRefreshing(true);
      setError(null);
      // Simulate network delay
      setTimeout(() => {
          try {
              const data = db.getWorkloads();
              if (!data || !Array.isArray(data)) {
                  setError('워크로드 데이터를 불러올 수 없습니다.');
                  setWorkloads([]);
              } else {
                  setWorkloads([...data]);
              }
          } catch (err) {
              console.error('Failed to load workloads:', err);
              setError('워크로드를 불러오는 중 오류가 발생했습니다.');
              setWorkloads([]);
          } finally {
              setRefreshing(false);
          }
      }, 500);
  };

  const handleRestart = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(confirm('재시작 하시겠습니까? (상태가 Pending으로 변경됩니다)')) {
          db.updateWorkloadStatus(id, 'Pending');
          loadWorkloads();
          
          // Auto recover to Running after 3s
          setTimeout(() => {
             db.updateWorkloadStatus(id, 'Running');
             loadWorkloads(); // This might not update if component unmounted, but okay for mock
          }, 3000);
      }
  };

  const filteredWorkloads = (workloads ?? []).filter(w =>
    w?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w?.namespace?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
          <button
            onClick={loadWorkloads}
            className="ml-2 underline hover:no-underline"
          >
            다시 시도
          </button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 w-full max-w-md">
          <Input 
            placeholder="워크로드 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadWorkloads} disabled={refreshing}>
            <FiRefreshCw className={cn("mr-2", refreshing && "animate-spin")} />
            새로고침
          </Button>
          <Button>
            워크로드 생성
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-800 text-slate-400">
              <tr>
                <th className="px-6 py-3">이름</th>
                <th className="px-6 py-3">네임스페이스</th>
                <th className="px-6 py-3">유형</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3">재시작</th>
                <th className="px-6 py-3">생성 경과</th>
                <th className="px-6 py-3 text-right">작업</th>
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
                      workload.status === 'Failed' && "bg-red-500/10 text-red-500",
                      workload.status === 'Pending' && "bg-amber-500/10 text-amber-500",
                      workload.status === 'Unknown' && "bg-slate-500/10 text-slate-500",
                    )}>
                      {(() => {
                        const map: Record<string, string> = {
                          'Running': '실행 중',
                          'Pending': '대기 중',
                          'Failed': '실패',
                          'CrashLoopBackOff': '오류 반복',
                          'Unknown': '알 수 없음'
                        };
                        return map[workload.status] || workload.status;
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{workload.restarts}</td>
                  <td className="px-6 py-4 text-slate-400">{workload.age}</td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={(e) => handleRestart(e, workload.id)}
                        title="워크로드 재시작"
                    >
                      <FiRefreshCw />
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

