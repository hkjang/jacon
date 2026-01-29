import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiActivity, FiCpu } from 'react-icons/fi';

interface Workload {
    id: string;
    name: string;
    age: string;
    restarts: number;
    // add other fields as needed
}

export function WorkloadOverview({ workload }: { workload: Workload }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <FiActivity /> 가동 시간 및 재시작
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{workload.age}</div>
          <div className="text-sm text-slate-500 mt-1">{workload.restarts}회 재시작</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <FiCpu /> CPU 사용량 (추정)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">128m</div>
          <div className="text-sm text-slate-500 mt-1">제한: 500m</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
             메모리 사용량 (추정)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">256Mi</div>
          <div className="text-sm text-slate-500 mt-1">제한: 1Gi</div>
        </CardContent>
      </Card>
    </div>
  );
}
