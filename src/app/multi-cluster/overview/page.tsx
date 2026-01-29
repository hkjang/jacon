"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader, Card, CardHeader, CardTitle, CardContent, StatusBadge } from '@/components/ui';
import { Cluster } from '@/types';
import {
  FiServer,
  FiCpu,
  FiHardDrive,
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiTrendingUp,
  FiLayers,
} from 'react-icons/fi';
import { SiKubernetes } from 'react-icons/si';

// Mock 클러스터 데이터
const MOCK_CLUSTERS: Cluster[] = [
  {
    id: 'cluster-1',
    name: 'production-kr',
    provider: 'eks',
    version: 'v1.28.3',
    status: 'Online',
    apiServer: 'https://k8s-prod-kr.example.com',
    nodes: { total: 12, ready: 12 },
    resources: {
      cpuCapacity: '48 cores',
      cpuUsed: '32 cores',
      cpuPercent: 67,
      memoryCapacity: '192Gi',
      memoryUsed: '145Gi',
      memoryPercent: 76,
      podsCapacity: 1100,
      podsUsed: 847,
    },
    workloads: {
      deployments: 45,
      statefulSets: 8,
      daemonSets: 12,
      jobs: 5,
      pods: 847,
    },
    lastSeen: 'Just now',
    createdAt: '2024-01-15T00:00:00Z',
    tags: ['production', 'korea'],
  },
  {
    id: 'cluster-2',
    name: 'production-us',
    provider: 'eks',
    version: 'v1.28.3',
    status: 'Online',
    apiServer: 'https://k8s-prod-us.example.com',
    nodes: { total: 8, ready: 8 },
    resources: {
      cpuCapacity: '32 cores',
      cpuUsed: '18 cores',
      cpuPercent: 56,
      memoryCapacity: '128Gi',
      memoryUsed: '89Gi',
      memoryPercent: 70,
      podsCapacity: 800,
      podsUsed: 523,
    },
    workloads: {
      deployments: 32,
      statefulSets: 5,
      daemonSets: 8,
      jobs: 3,
      pods: 523,
    },
    lastSeen: 'Just now',
    createdAt: '2024-01-20T00:00:00Z',
    tags: ['production', 'us-east'],
  },
  {
    id: 'cluster-3',
    name: 'staging',
    provider: 'aks',
    version: 'v1.27.8',
    status: 'Warning',
    apiServer: 'https://k8s-staging.example.com',
    nodes: { total: 4, ready: 3 },
    resources: {
      cpuCapacity: '16 cores',
      cpuUsed: '14 cores',
      cpuPercent: 88,
      memoryCapacity: '64Gi',
      memoryUsed: '58Gi',
      memoryPercent: 91,
      podsCapacity: 400,
      podsUsed: 156,
    },
    workloads: {
      deployments: 15,
      statefulSets: 3,
      daemonSets: 4,
      jobs: 2,
      pods: 156,
    },
    lastSeen: '2 minutes ago',
    createdAt: '2024-02-01T00:00:00Z',
    tags: ['staging'],
  },
  {
    id: 'cluster-4',
    name: 'development',
    provider: 'gke',
    version: 'v1.28.1',
    status: 'Online',
    apiServer: 'https://k8s-dev.example.com',
    nodes: { total: 3, ready: 3 },
    resources: {
      cpuCapacity: '12 cores',
      cpuUsed: '4 cores',
      cpuPercent: 33,
      memoryCapacity: '48Gi',
      memoryUsed: '18Gi',
      memoryPercent: 38,
      podsCapacity: 300,
      podsUsed: 78,
    },
    workloads: {
      deployments: 8,
      statefulSets: 2,
      daemonSets: 3,
      jobs: 1,
      pods: 78,
    },
    lastSeen: 'Just now',
    createdAt: '2024-03-01T00:00:00Z',
    tags: ['development'],
  },
];

// 총계 계산
const getTotals = () => {
  return MOCK_CLUSTERS.reduce(
    (acc, cluster) => ({
      clusters: acc.clusters + 1,
      nodes: acc.nodes + cluster.nodes.total,
      readyNodes: acc.readyNodes + cluster.nodes.ready,
      pods: acc.pods + cluster.resources.podsUsed,
      deployments: acc.deployments + cluster.workloads.deployments,
    }),
    { clusters: 0, nodes: 0, readyNodes: 0, pods: 0, deployments: 0 }
  );
};

// 리소스 사용량 바 컴포넌트
const ResourceBar = ({
  label,
  used,
  capacity,
  percent,
}: {
  label: string;
  used: string;
  capacity: string;
  percent: number;
}) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-300">
        {used} / {capacity}
      </span>
    </div>
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${
          percent > 85 ? 'bg-red-500' : percent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

// 클러스터 카드 컴포넌트
const ClusterCard = ({ cluster }: { cluster: Cluster }) => (
  <Card className="hover:border-slate-600 transition-colors cursor-pointer">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <SiKubernetes className="text-blue-400 text-xl" />
          </div>
          <div>
            <CardTitle className="text-base">{cluster.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500">{cluster.provider.toUpperCase()}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">{cluster.version}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={cluster.status} showDot pulseDot={cluster.status === 'Warning'} />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* 노드 상태 */}
      <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <FiServer className="text-slate-400" />
          <span className="text-sm text-slate-300">노드</span>
        </div>
        <span className={`text-sm font-medium ${
          cluster.nodes.ready === cluster.nodes.total ? 'text-emerald-400' : 'text-amber-400'
        }`}>
          {cluster.nodes.ready}/{cluster.nodes.total} Ready
        </span>
      </div>

      {/* 리소스 사용량 */}
      <div className="space-y-3">
        <ResourceBar
          label="CPU"
          used={cluster.resources.cpuUsed}
          capacity={cluster.resources.cpuCapacity}
          percent={cluster.resources.cpuPercent}
        />
        <ResourceBar
          label="메모리"
          used={cluster.resources.memoryUsed}
          capacity={cluster.resources.memoryCapacity}
          percent={cluster.resources.memoryPercent}
        />
      </div>

      {/* 워크로드 요약 */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700">
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-200">{cluster.workloads.deployments}</div>
          <div className="text-xs text-slate-500">Deployments</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-200">{cluster.workloads.pods}</div>
          <div className="text-xs text-slate-500">Pods</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-200">{cluster.workloads.statefulSets}</div>
          <div className="text-xs text-slate-500">StatefulSets</div>
        </div>
      </div>

      {/* 태그 */}
      {cluster.tags && cluster.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {cluster.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default function MultiClusterOverviewPage() {
  const totals = getTotals();
  const onlineClusters = MOCK_CLUSTERS.filter((c) => c.status === 'Online').length;
  const warningClusters = MOCK_CLUSTERS.filter((c) => c.status === 'Warning').length;

  return (
    <MainLayout>
      <PageHeader
        title="멀티 클러스터 개요"
        description="전체 클러스터의 상태와 리소스 사용량을 모니터링합니다."
        breadcrumbs={[
          { label: '멀티 클러스터', href: '/multi-cluster/overview' },
          { label: '개요' },
        ]}
      />

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <SiKubernetes className="text-blue-400 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">{totals.clusters}</div>
                <div className="text-sm text-slate-400">총 클러스터</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FiCheckCircle className="text-emerald-400 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">{onlineClusters}</div>
                <div className="text-sm text-slate-400">온라인</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {warningClusters > 0 && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <FiAlertTriangle className="text-amber-400 text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">{warningClusters}</div>
                  <div className="text-sm text-slate-400">경고</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FiServer className="text-cyan-400 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">
                  {totals.readyNodes}/{totals.nodes}
                </div>
                <div className="text-sm text-slate-400">노드 Ready</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FiLayers className="text-purple-400 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">{totals.pods}</div>
                <div className="text-sm text-slate-400">총 Pods</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 클러스터 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_CLUSTERS.map((cluster) => (
          <ClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </MainLayout>
  );
}
