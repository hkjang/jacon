import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ActivityFeed } from '@/components/features/dashboard/activity-feed';
import { FiServer, FiCheckCircle, FiLayers } from 'react-icons/fi';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold mb-2">My Dashboard</h1>
        <p className="text-slate-400">Overview of your Docker and Kubernetes resources.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <FiServer /> Total Clusters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-slate-500 mt-1">2 Kubernetes, 1 Docker</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <FiCheckCircle /> System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-500">98%</p>
            <p className="text-xs text-slate-500 mt-1">All critical systems operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <FiLayers /> Active Workloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">45</p>
            <p className="text-xs text-slate-500 mt-1">+3 since yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed Section */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="flex-1">
             <CardHeader>
                <CardTitle>Resource Usage Trends</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="flex items-center justify-center h-48 border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
                   <p className="text-slate-500 text-sm">Chart Placeholder (Observability Module)</p>
                </div>
             </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 min-h-0 overflow-y-auto">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
