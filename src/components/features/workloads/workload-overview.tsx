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
            <FiActivity /> Uptime & Restarts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{workload.age}</div>
          <div className="text-sm text-slate-500 mt-1">{workload.restarts} restarts</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <FiCpu /> CPU Usage (Est)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">128m</div>
          <div className="text-sm text-slate-500 mt-1">Limit: 500m</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
             Memory Usage (Est)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">256Mi</div>
          <div className="text-sm text-slate-500 mt-1">Limit: 1Gi</div>
        </CardContent>
      </Card>
    </div>
  );
}
