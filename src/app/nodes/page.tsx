"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader, Button, Card, CardContent, StatusBadge, DataTable, Column, Select } from '@/components/ui';
import { useListController } from '@/hooks';
import { Node } from '@/types';
import { FiCpu, FiHardDrive, FiServer, FiRefreshCw, FiActivity } from 'react-icons/fi';

// Mock 노드 데이터
const MOCK_NODES: Node[] = [
  {
    id: 'node-1',
    name: 'node-prod-kr-1',
    status: 'Ready',
    roles: ['control-plane', 'master'],
    version: 'v1.28.3',
    internalIP: '10.0.1.10',
    externalIP: '52.187.100.10',
    os: 'Ubuntu 22.04 LTS',
    architecture: 'amd64',
    containerRuntime: 'containerd://1.6.24',
    createdAt: '2024-01-15T00:00:00Z',
    capacity: { cpu: '8', memory: '32Gi', pods: '110' },
    allocatable: { cpu: '7800m', memory: '30Gi', pods: '110' },
    usage: { cpu: '3.2 cores', cpuPercent: 41, memory: '18Gi', memoryPercent: 60, pods: 45 },
    conditions: [
      { type: 'Ready', status: 'True' as const, reason: 'KubeletReady', message: 'kubelet is posting ready status' },
      { type: 'MemoryPressure', status: 'False' as const },
      { type: 'DiskPressure', status: 'False' as const },
    ],
    labels: { 'node-role.kubernetes.io/control-plane': '', 'topology.kubernetes.io/zone': 'kr-1' },
  },
  {
    id: 'node-2',
    name: 'node-prod-kr-2',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    internalIP: '10.0.1.11',
    os: 'Ubuntu 22.04 LTS',
    architecture: 'amd64',
    containerRuntime: 'containerd://1.6.24',
    createdAt: '2024-01-15T00:00:00Z',
    capacity: { cpu: '16', memory: '64Gi', pods: '110' },
    allocatable: { cpu: '15800m', memory: '62Gi', pods: '110' },
    usage: { cpu: '12.5 cores', cpuPercent: 79, memory: '52Gi', memoryPercent: 84, pods: 89 },
    conditions: [
      { type: 'Ready', status: 'True' as const },
      { type: 'MemoryPressure', status: 'False' as const },
      { type: 'DiskPressure', status: 'False' as const },
    ],
    labels: { 'topology.kubernetes.io/zone': 'kr-1', 'node.kubernetes.io/instance-type': 'Standard_D16s_v3' },
  },
  {
    id: 'node-3',
    name: 'node-prod-kr-3',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.3',
    internalIP: '10.0.1.12',
    os: 'Ubuntu 22.04 LTS',
    architecture: 'amd64',
    containerRuntime: 'containerd://1.6.24',
    createdAt: '2024-01-20T00:00:00Z',
    capacity: { cpu: '16', memory: '64Gi', pods: '110' },
    allocatable: { cpu: '15800m', memory: '62Gi', pods: '110' },
    usage: { cpu: '8.2 cores', cpuPercent: 52, memory: '38Gi', memoryPercent: 61, pods: 72 },
    conditions: [
      { type: 'Ready', status: 'True' as const },
      { type: 'MemoryPressure', status: 'False' as const },
      { type: 'DiskPressure', status: 'False' as const },
    ],
    labels: { 'topology.kubernetes.io/zone': 'kr-2', 'node.kubernetes.io/instance-type': 'Standard_D16s_v3' },
  },
  {
    id: 'node-4',
    name: 'node-staging-1',
    status: 'NotReady',
    roles: ['worker'],
    version: 'v1.27.8',
    internalIP: '10.0.2.10',
    os: 'Ubuntu 22.04 LTS',
    architecture: 'amd64',
    containerRuntime: 'containerd://1.6.20',
    createdAt: '2024-02-01T00:00:00Z',
    capacity: { cpu: '4', memory: '16Gi', pods: '110' },
    allocatable: { cpu: '3800m', memory: '14Gi', pods: '110' },
    usage: { cpu: '3.5 cores', cpuPercent: 92, memory: '13Gi', memoryPercent: 93, pods: 38 },
    conditions: [
      { type: 'Ready', status: 'False' as const, reason: 'KubeletNotReady', message: 'PLEG is not healthy' },
      { type: 'MemoryPressure', status: 'True' as const },
      { type: 'DiskPressure', status: 'False' as const },
    ],
    taints: [{ key: 'node.kubernetes.io/not-ready', effect: 'NoSchedule' }],
    labels: { 'env': 'staging' },
  },
  {
    id: 'node-5',
    name: 'node-dev-1',
    status: 'Ready',
    roles: ['worker'],
    version: 'v1.28.1',
    internalIP: '10.0.3.10',
    os: 'Ubuntu 22.04 LTS',
    architecture: 'amd64',
    containerRuntime: 'containerd://1.6.24',
    createdAt: '2024-03-01T00:00:00Z',
    capacity: { cpu: '4', memory: '16Gi', pods: '110' },
    allocatable: { cpu: '3800m', memory: '14Gi', pods: '110' },
    usage: { cpu: '1.2 cores', cpuPercent: 32, memory: '6Gi', memoryPercent: 43, pods: 25 },
    conditions: [
      { type: 'Ready', status: 'True' as const },
      { type: 'MemoryPressure', status: 'False' as const },
      { type: 'DiskPressure', status: 'False' as const },
    ],
    labels: { 'env': 'development' },
  },
];

const STATUS_OPTIONS = [
  { value: '', label: '모든 상태' },
  { value: 'Ready', label: 'Ready' },
  { value: 'NotReady', label: 'NotReady' },
];

const ROLE_OPTIONS = [
  { value: '', label: '모든 역할' },
  { value: 'control-plane', label: 'Control Plane' },
  { value: 'worker', label: 'Worker' },
];

// 리소스 바 컴포넌트
const ResourceBar = ({ percent, size = 'sm' }: { percent: number; size?: 'sm' | 'md' }) => {
  const color = percent > 85 ? 'bg-red-500' : percent > 70 ? 'bg-amber-500' : 'bg-emerald-500';
  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={`${height} bg-slate-700 rounded-full overflow-hidden flex-1`}>
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default function NodesPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // 리스트 컨트롤러
  const {
    paginatedData,
    loading,
    error,
    refresh,
    refreshing,
  } = useListController<Node>({
    fetchData: async () => {
      let filtered = MOCK_NODES;
      if (filterStatus) {
        filtered = filtered.filter((n) => n.status === filterStatus);
      }
      if (filterRole) {
        filtered = filtered.filter((n) => n.roles.includes(filterRole));
      }
      return filtered;
    },
    keyExtractor: (n) => n.id,
    searchFields: ['name'],
  });

  // 총계 계산
  const totals = MOCK_NODES.reduce(
    (acc, node) => ({
      total: acc.total + 1,
      ready: acc.ready + (node.status === 'Ready' ? 1 : 0),
      pods: acc.pods + (node.usage?.pods || 0),
    }),
    { total: 0, ready: 0, pods: 0 }
  );

  // 테이블 컬럼 정의
  const columns: Column<Node>[] = [
    {
      key: 'name',
      header: '노드',
      sortable: true,
      accessor: (node) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            node.status === 'Ready' ? 'bg-emerald-500/10' : 'bg-red-500/10'
          }`}>
            <FiServer className={node.status === 'Ready' ? 'text-emerald-400' : 'text-red-400'} />
          </div>
          <div>
            <span className="font-medium text-slate-200">{node.name}</span>
            <div className="flex items-center gap-2 mt-0.5">
              {node.roles.map((role) => (
                <span
                  key={role}
                  className={`px-1.5 py-0.5 rounded text-xs ${
                    role === 'control-plane' || role === 'master'
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'bg-slate-500/10 text-slate-400'
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      accessor: (node) => (
        <StatusBadge
          status={node.status === 'Ready' ? 'Running' : 'Failed'}
          label={node.status}
          showDot
          pulseDot={node.status !== 'Ready'}
        />
      ),
    },
    {
      key: 'version',
      header: '버전',
      accessor: (node) => <span className="text-slate-400">{node.version}</span>,
    },
    {
      key: 'cpu',
      header: 'CPU',
      accessor: (node) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <ResourceBar percent={node.usage?.cpuPercent || 0} />
          <span className="text-xs text-slate-400 w-10 text-right">
            {node.usage?.cpuPercent || 0}%
          </span>
        </div>
      ),
    },
    {
      key: 'memory',
      header: '메모리',
      accessor: (node) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <ResourceBar percent={node.usage?.memoryPercent || 0} />
          <span className="text-xs text-slate-400 w-10 text-right">
            {node.usage?.memoryPercent || 0}%
          </span>
        </div>
      ),
    },
    {
      key: 'pods',
      header: 'Pods',
      accessor: (node) => (
        <span className="text-slate-400">
          {node.usage?.pods || 0}/{node.capacity.pods}
        </span>
      ),
    },
    {
      key: 'ip',
      header: 'IP',
      accessor: (node) => (
        <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
          {node.internalIP}
        </code>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="노드"
        description="클러스터 노드의 상태와 리소스 사용량을 모니터링합니다."
        breadcrumbs={[{ label: '노드' }]}
      />

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FiServer className="text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">{totals.total}</div>
                <div className="text-sm text-slate-400">총 노드</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FiActivity className="text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">
                  {totals.ready}/{totals.total}
                </div>
                <div className="text-sm text-slate-400">Ready</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FiCpu className="text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">
                  {Math.round(MOCK_NODES.reduce((sum, n) => sum + (n.usage?.cpuPercent || 0), 0) / MOCK_NODES.length)}%
                </div>
                <div className="text-sm text-slate-400">평균 CPU</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FiHardDrive className="text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-100">{totals.pods}</div>
                <div className="text-sm text-slate-400">실행 중인 Pods</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <div className="flex gap-4 mb-4">
        <Select
          options={STATUS_OPTIONS}
          value={filterStatus}
          onChange={setFilterStatus}
          label="상태"
        />
        <Select
          options={ROLE_OPTIONS}
          value={filterRole}
          onChange={setFilterRole}
          label="역할"
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(n) => n.id}
        loading={loading}
        error={error}
        searchable
        searchPlaceholder="노드 검색..."
        onRefresh={refresh}
        refreshing={refreshing}
        emptyMessage="노드가 없습니다."
        pagination
        pageSize={10}
      />
    </MainLayout>
  );
}
