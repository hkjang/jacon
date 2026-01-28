"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ActivityFeed } from '@/components/features/dashboard/activity-feed';
import { FiServer, FiCheckCircle, FiLayers } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';


export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
      totalClusters: 0,
      activeWorkloads: 0,
      healthScore: 100,
      workloadChange: '+2'
  });

  useEffect(() => {
      calculateStats();
  }, []);

  const calculateStats = () => {
      const workloads = db.getWorkloads();
      
      // Clusters
      const clusters = new Set(workloads.map(w => w.cluster)).size;
      
      // Active Workloads
      const active = workloads.filter(w => w.status === 'Running').length;
      
      // Health Score (mock calculation: 100 - (failed/total * 100))
      const failed = workloads.filter(w => w.status === 'Failed' || w.status === 'CrashLoopBackOff').length;
      const total = workloads.length || 1;
      const health = Math.round(100 - ((failed / total) * 50)); // Penalty for failures

      setStats({
          totalClusters: clusters + 1, // +1 for Docker
          activeWorkloads: active,
          healthScore: health,
          workloadChange: '0' // Static for now as we don't track history deeply
      });
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold mb-2">My Dashboard</h1>
        <p className="text-slate-400">Docker 및 Kubernetes 리소스 현황 개요</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card onClick={() => router.push('/inventory')} className="cursor-pointer hover:bg-slate-900/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <FiServer /> 전체 클러스터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalClusters}</p>
            <p className="text-xs text-slate-500 mt-1">{stats.totalClusters - 1} Kubernetes, 1 Docker</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <FiCheckCircle /> 시스템 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-3xl font-bold", 
                stats.healthScore > 90 ? "text-emerald-500" : 
                stats.healthScore > 70 ? "text-amber-500" : "text-red-500"
            )}>{stats.healthScore}%</p>
            <p className="text-xs text-slate-500 mt-1">
                {stats.healthScore > 90 ? "모든 주요 시스템 정상" : "일부 시스템 확인 필요"}
            </p>
          </CardContent>
        </Card>
        
        <Card onClick={() => router.push('/workloads')} className="cursor-pointer hover:bg-slate-900/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <FiLayers /> 활성 워크로드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{stats.activeWorkloads}</p>
            <p className="text-xs text-slate-500 mt-1">총 {db.getWorkloads().length}개 워크로드 정의됨</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed Section */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="flex-1">
             <CardHeader>
                <CardTitle>리소스 사용량 트렌드</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="flex items-center justify-center h-48 border border-dashed border-slate-700 rounded-lg bg-slate-900/50 cursor-pointer hover:bg-slate-900 transition-colors" onClick={() => router.push('/observability')}>
                   <div className="text-center">
                      <p className="text-slate-500 text-sm mb-2">실시간 메트릭 보기</p>
                      <p className="text-blue-500 text-xs font-semibold">클릭하여 관제 대시보드 열기</p>
                   </div>
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

