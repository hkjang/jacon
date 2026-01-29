"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader, Button, StatusBadge, FormModal, DeleteConfirmModal, DataTable, Column, Select } from '@/components/ui';
import { useListController, useResourceActions } from '@/hooks';
import { Cluster } from '@/types';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiExternalLink,
  FiActivity,
  FiServer,
} from 'react-icons/fi';
import { SiKubernetes, SiDocker } from 'react-icons/si';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    authType: 'kubeconfig',
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
    authType: 'token',
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
    authType: 'kubeconfig',
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
    authType: 'certificate',
  },
  {
    id: 'cluster-5',
    name: 'docker-local',
    provider: 'docker',
    version: '24.0.7',
    status: 'Online',
    apiServer: 'tcp://localhost:2375',
    nodes: { total: 1, ready: 1 },
    resources: {
      cpuCapacity: '8 cores',
      cpuUsed: '2 cores',
      cpuPercent: 25,
      memoryCapacity: '16Gi',
      memoryUsed: '4Gi',
      memoryPercent: 25,
      podsCapacity: 100,
      podsUsed: 12,
    },
    workloads: {
      deployments: 0,
      statefulSets: 0,
      daemonSets: 0,
      jobs: 0,
      pods: 12,
    },
    lastSeen: 'Just now',
    createdAt: '2024-04-01T00:00:00Z',
    tags: ['local', 'docker'],
  },
];

const PROVIDER_OPTIONS = [
  { value: '', label: '모든 프로바이더' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'eks', label: 'Amazon EKS' },
  { value: 'aks', label: 'Azure AKS' },
  { value: 'gke', label: 'Google GKE' },
  { value: 'docker', label: 'Docker' },
];

const STATUS_OPTIONS = [
  { value: '', label: '모든 상태' },
  { value: 'Online', label: '온라인' },
  { value: 'Warning', label: '경고' },
  { value: 'Offline', label: '오프라인' },
];

export default function ClustersPage() {
  const [filterProvider, setFilterProvider] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 리스트 컨트롤러
  const {
    paginatedData,
    loading,
    error,
    refresh,
    refreshing,
  } = useListController<Cluster>({
    fetchData: async () => {
      let filtered = MOCK_CLUSTERS;
      if (filterProvider) {
        filtered = filtered.filter((c) => c.provider === filterProvider);
      }
      if (filterStatus) {
        filtered = filtered.filter((c) => c.status === filterStatus);
      }
      return filtered;
    },
    keyExtractor: (c) => c.id,
    searchFields: ['name'],
  });

  // 리소스 액션
  const {
    createModalOpen,
    deleteModalOpen,
    selectedItem,
    openCreateModal,
    openDeleteModal,
    closeCreateModal,
    closeDeleteModal,
    handleCreate,
    handleDelete,
    creating,
    deleting,
    actionError,
  } = useResourceActions<Cluster>({
    createAction: async (data) => {
      console.log('Create cluster:', data);
      return { success: true };
    },
    deleteAction: async (id) => {
      console.log('Delete cluster:', id);
      return { success: true };
    },
    onRefresh: refresh,
  });

  // 폼 상태
  const [formData, setFormData] = useState<{
    name: string;
    provider: Cluster['provider'];
    apiServer: string;
  }>({
    name: '',
    provider: 'kubernetes',
    apiServer: '',
  });

  // 프로바이더 아이콘
  const getProviderIcon = (provider: string) => {
    if (provider === 'docker') {
      return <SiDocker className="text-blue-400" />;
    }
    return <SiKubernetes className="text-blue-400" />;
  };

  // 테이블 컬럼 정의
  const columns: Column<Cluster>[] = [
    {
      key: 'name',
      header: '클러스터',
      sortable: true,
      accessor: (cluster) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            {getProviderIcon(cluster.provider)}
          </div>
          <div>
            <span className="font-medium text-slate-200">{cluster.name}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500 uppercase">{cluster.provider}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-500">{cluster.version}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      accessor: (cluster) => (
        <StatusBadge
          status={cluster.status}
          showDot
          pulseDot={cluster.status !== 'Online'}
        />
      ),
    },
    {
      key: 'nodes',
      header: '노드',
      accessor: (cluster) => (
        <div className="flex items-center gap-2">
          <FiServer className="text-slate-500" />
          <span className={
            cluster.nodes.ready === cluster.nodes.total
              ? 'text-emerald-400'
              : 'text-amber-400'
          }>
            {cluster.nodes.ready}/{cluster.nodes.total}
          </span>
        </div>
      ),
    },
    {
      key: 'resources',
      header: '리소스 사용률',
      accessor: (cluster) => (
        <div className="space-y-1 min-w-[120px]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-10">CPU</span>
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  cluster.resources.cpuPercent > 85 ? 'bg-red-500' :
                  cluster.resources.cpuPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${cluster.resources.cpuPercent}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 w-10 text-right">
              {cluster.resources.cpuPercent}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-10">MEM</span>
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  cluster.resources.memoryPercent > 85 ? 'bg-red-500' :
                  cluster.resources.memoryPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${cluster.resources.memoryPercent}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 w-10 text-right">
              {cluster.resources.memoryPercent}%
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'workloads',
      header: '워크로드',
      accessor: (cluster) => (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-300">
            <span className="text-slate-500">D:</span> {cluster.workloads.deployments}
          </span>
          <span className="text-slate-300">
            <span className="text-slate-500">P:</span> {cluster.workloads.pods}
          </span>
        </div>
      ),
    },
    {
      key: 'lastSeen',
      header: '마지막 확인',
      accessor: (cluster) => (
        <span className="text-slate-400 text-sm">{cluster.lastSeen}</span>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      align: 'right',
      accessor: (cluster) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => { e.stopPropagation(); }}
            title="모니터링"
          >
            <FiActivity className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => { e.stopPropagation(); }}
            title="수정"
          >
            <FiEdit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
            onClick={(e) => { e.stopPropagation(); openDeleteModal(cluster); }}
            title="연결 해제"
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="클러스터 관리"
        description="Kubernetes 및 Docker 클러스터를 연결하고 관리합니다."
        breadcrumbs={[
          { label: '멀티 클러스터', href: '/multi-cluster/overview' },
          { label: '클러스터 목록' },
        ]}
        actions={
          <Button onClick={openCreateModal}>
            <FiPlus className="mr-2" />
            클러스터 연결
          </Button>
        }
      />

      {/* 필터 */}
      <div className="flex gap-4 mb-4">
        <Select
          options={PROVIDER_OPTIONS}
          value={filterProvider}
          onChange={setFilterProvider}
          label="프로바이더"
        />
        <Select
          options={STATUS_OPTIONS}
          value={filterStatus}
          onChange={setFilterStatus}
          label="상태"
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(c) => c.id}
        loading={loading}
        error={error}
        searchable
        searchPlaceholder="클러스터 검색..."
        onRefresh={refresh}
        refreshing={refreshing}
        emptyMessage="연결된 클러스터가 없습니다."
        pagination
        pageSize={10}
      />

      {/* 클러스터 연결 모달 */}
      <FormModal
        isOpen={createModalOpen}
        onClose={closeCreateModal}
        title="새 클러스터 연결"
        description="Kubernetes 또는 Docker 클러스터를 연결합니다."
        onSubmit={async () => {
          await handleCreate(formData);
          setFormData({ name: '', provider: 'kubernetes', apiServer: '' });
        }}
        submitLabel="연결"
        loading={creating}
        error={actionError}
        size="lg"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">클러스터 이름 *</Label>
            <Input
              id="name"
              placeholder="my-cluster"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>클러스터 유형</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, provider: 'kubernetes' })}
                className={`p-4 rounded-lg border flex items-center gap-3 transition-colors ${
                  formData.provider !== 'docker'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <SiKubernetes className="text-2xl text-blue-400" />
                <div className="text-left">
                  <div className="font-medium text-slate-200">Kubernetes</div>
                  <div className="text-xs text-slate-400">K8s, EKS, AKS, GKE</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, provider: 'docker' })}
                className={`p-4 rounded-lg border flex items-center gap-3 transition-colors ${
                  formData.provider === 'docker'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <SiDocker className="text-2xl text-blue-400" />
                <div className="text-left">
                  <div className="font-medium text-slate-200">Docker</div>
                  <div className="text-xs text-slate-400">Standalone, Swarm</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiServer">
              API 서버 URL *
              <span className="text-slate-500 ml-2 font-normal">
                {formData.provider === 'docker'
                  ? '(예: tcp://docker.example.com:2375)'
                  : '(예: https://api.k8s.example.com:6443)'}
              </span>
            </Label>
            <Input
              id="apiServer"
              placeholder={formData.provider === 'docker' ? 'tcp://docker.example.com:2375' : 'https://api.k8s.example.com:6443'}
              value={formData.apiServer}
              onChange={(e) => setFormData({ ...formData, apiServer: e.target.value })}
              required
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-400">
              클러스터 연결을 위해 적절한 인증 정보(kubeconfig, 토큰 등)가 필요합니다.
              연결 후 추가 인증 설정이 필요할 수 있습니다.
            </p>
          </div>
        </div>
      </FormModal>

      {/* 삭제 모달 */}
      {selectedItem && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          resourceType="클러스터"
          resourceName={selectedItem.name}
          loading={deleting}
          additionalWarning="클러스터 연결만 해제되며, 실제 클러스터나 리소스는 삭제되지 않습니다."
        />
      )}
    </MainLayout>
  );
}
