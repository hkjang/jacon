"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader, Button, StatusBadge, FormModal, DeleteConfirmModal, DataTable, Column, Select } from '@/components/ui';
import { useListController, useResourceActions } from '@/hooks';
import { Service, ServiceType } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiCloud, FiExternalLink, FiCopy } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock 데이터
const MOCK_SERVICES: Service[] = [
  {
    id: 'svc-1',
    name: 'frontend',
    namespace: 'production',
    type: 'LoadBalancer',
    clusterIP: '10.0.0.15',
    externalIP: '52.187.123.45',
    ports: [{ port: 80, targetPort: 8080, protocol: 'TCP' }],
    selector: { app: 'frontend' },
    createdAt: '2024-03-15T10:30:00Z',
    status: 'Active',
    loadBalancerIngress: [{ ip: '52.187.123.45' }],
  },
  {
    id: 'svc-2',
    name: 'api-gateway',
    namespace: 'production',
    type: 'LoadBalancer',
    clusterIP: '10.0.0.20',
    externalIP: '52.187.123.50',
    ports: [
      { port: 443, targetPort: 8443, protocol: 'TCP', name: 'https' },
      { port: 80, targetPort: 8080, protocol: 'TCP', name: 'http' },
    ],
    selector: { app: 'api-gateway' },
    createdAt: '2024-03-15T10:30:00Z',
    status: 'Active',
  },
  {
    id: 'svc-3',
    name: 'user-service',
    namespace: 'production',
    type: 'ClusterIP',
    clusterIP: '10.0.0.25',
    ports: [{ port: 8080, targetPort: 8080, protocol: 'TCP' }],
    selector: { app: 'user-service' },
    createdAt: '2024-03-16T14:20:00Z',
    status: 'Active',
  },
  {
    id: 'svc-4',
    name: 'redis',
    namespace: 'production',
    type: 'ClusterIP',
    clusterIP: '10.0.0.30',
    ports: [{ port: 6379, targetPort: 6379, protocol: 'TCP' }],
    selector: { app: 'redis' },
    createdAt: '2024-03-10T08:00:00Z',
    status: 'Active',
  },
  {
    id: 'svc-5',
    name: 'postgres',
    namespace: 'production',
    type: 'ClusterIP',
    clusterIP: '10.0.0.35',
    ports: [{ port: 5432, targetPort: 5432, protocol: 'TCP' }],
    selector: { app: 'postgres' },
    createdAt: '2024-03-10T08:00:00Z',
    status: 'Active',
  },
  {
    id: 'svc-6',
    name: 'node-exporter',
    namespace: 'monitoring',
    type: 'NodePort',
    clusterIP: '10.0.0.40',
    ports: [{ port: 9100, targetPort: 9100, nodePort: 30100, protocol: 'TCP' }],
    selector: { app: 'node-exporter' },
    createdAt: '2024-03-20T11:00:00Z',
    status: 'Active',
  },
];

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: 'ClusterIP', label: 'ClusterIP' },
  { value: 'NodePort', label: 'NodePort' },
  { value: 'LoadBalancer', label: 'LoadBalancer' },
  { value: 'ExternalName', label: 'ExternalName' },
];

export default function ServicesPage() {
  const [filterType, setFilterType] = useState<string>('');
  const [filterNamespace, setFilterNamespace] = useState<string>('');

  // 리스트 컨트롤러
  const {
    paginatedData,
    loading,
    error,
    refresh,
    refreshing,
  } = useListController<Service>({
    fetchData: async () => {
      let filtered = MOCK_SERVICES;
      if (filterType) {
        filtered = filtered.filter((svc) => svc.type === filterType);
      }
      if (filterNamespace) {
        filtered = filtered.filter((svc) => svc.namespace === filterNamespace);
      }
      return filtered;
    },
    keyExtractor: (svc) => svc.id,
    searchFields: ['name', 'namespace'],
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
  } = useResourceActions<Service>({
    createAction: async (data) => {
      console.log('Create service:', data);
      return { success: true };
    },
    deleteAction: async (id) => {
      console.log('Delete service:', id);
      return { success: true };
    },
    onRefresh: refresh,
  });

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    namespace: 'default',
    type: 'ClusterIP' as ServiceType,
    port: 80,
    targetPort: 8080,
  });

  // 포트 포맷
  const formatPorts = (ports: Service['ports']) => {
    return ports.map((p) => {
      let portStr = `${p.port}:${p.targetPort}`;
      if (p.nodePort) {
        portStr += `:${p.nodePort}`;
      }
      return portStr;
    }).join(', ');
  };

  // 클립보드 복사
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 테이블 컬럼 정의
  const columns: Column<Service>[] = [
    {
      key: 'name',
      header: '이름',
      sortable: true,
      accessor: (svc) => (
        <div className="flex items-center gap-2">
          <FiCloud className="text-cyan-400" />
          <div>
            <span className="font-medium text-slate-200">{svc.name}</span>
            <span className="text-slate-500 text-xs block">{svc.namespace}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: '유형',
      accessor: (svc) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          svc.type === 'LoadBalancer' ? 'bg-purple-500/10 text-purple-400' :
          svc.type === 'NodePort' ? 'bg-amber-500/10 text-amber-400' :
          svc.type === 'ExternalName' ? 'bg-green-500/10 text-green-400' :
          'bg-blue-500/10 text-blue-400'
        }`}>
          {svc.type}
        </span>
      ),
    },
    {
      key: 'clusterIP',
      header: 'Cluster IP',
      accessor: (svc) => (
        <div className="flex items-center gap-1">
          <code className="text-slate-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">
            {svc.clusterIP}
          </code>
          <button
            onClick={(e) => { e.stopPropagation(); copyToClipboard(svc.clusterIP || ''); }}
            className="text-slate-500 hover:text-slate-300"
          >
            <FiCopy className="w-3 h-3" />
          </button>
        </div>
      ),
    },
    {
      key: 'externalIP',
      header: 'External IP',
      accessor: (svc) => (
        svc.externalIP ? (
          <div className="flex items-center gap-1">
            <code className="text-emerald-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">
              {svc.externalIP}
            </code>
            <a
              href={`http://${svc.externalIP}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-400 hover:text-blue-300"
            >
              <FiExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <span className="text-slate-500 text-xs">-</span>
        )
      ),
    },
    {
      key: 'ports',
      header: '포트',
      accessor: (svc) => (
        <code className="text-slate-400 text-xs">
          {formatPorts(svc.ports)}
        </code>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      align: 'right',
      accessor: (svc) => (
        <div className="flex items-center justify-end gap-1">
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
            onClick={(e) => { e.stopPropagation(); openDeleteModal(svc); }}
            title="삭제"
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // 네임스페이스 목록 추출
  const namespaces = [...new Set(MOCK_SERVICES.map((svc) => svc.namespace))];

  return (
    <MainLayout>
      <PageHeader
        title="서비스"
        description="Kubernetes 서비스를 관리하고 네트워크 노출을 설정합니다."
        breadcrumbs={[{ label: '서비스' }]}
        actions={
          <Button onClick={openCreateModal}>
            <FiPlus className="mr-2" />
            서비스 생성
          </Button>
        }
      />

      {/* 필터 */}
      <div className="flex gap-4 mb-4">
        <Select
          options={[{ value: '', label: '모든 유형' }, ...SERVICE_TYPES]}
          value={filterType}
          onChange={setFilterType}
          label="서비스 유형"
        />
        <Select
          options={[{ value: '', label: '모든 네임스페이스' }, ...namespaces.map((ns) => ({ value: ns, label: ns }))]}
          value={filterNamespace}
          onChange={setFilterNamespace}
          label="네임스페이스"
        />
      </div>

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(svc) => svc.id}
        loading={loading}
        error={error}
        searchable
        searchPlaceholder="서비스 검색..."
        onRefresh={refresh}
        refreshing={refreshing}
        emptyMessage="서비스가 없습니다."
        pagination
        pageSize={10}
      />

      {/* 생성 모달 */}
      <FormModal
        isOpen={createModalOpen}
        onClose={closeCreateModal}
        title="새 서비스 생성"
        onSubmit={async () => {
          await handleCreate(formData);
          setFormData({ name: '', namespace: 'default', type: 'ClusterIP', port: 80, targetPort: 8080 });
        }}
        submitLabel="생성"
        loading={creating}
        error={actionError}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                placeholder="my-service"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="namespace">네임스페이스</Label>
              <Select
                options={namespaces.map((ns) => ({ value: ns, label: ns }))}
                value={formData.namespace}
                onChange={(value) => setFormData({ ...formData, namespace: value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>서비스 유형</Label>
            <div className="grid grid-cols-4 gap-2">
              {SERVICE_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="port">포트</Label>
              <Input
                id="port"
                type="number"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 80 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetPort">타겟 포트</Label>
              <Input
                id="targetPort"
                type="number"
                value={formData.targetPort}
                onChange={(e) => setFormData({ ...formData, targetPort: parseInt(e.target.value) || 8080 })}
              />
            </div>
          </div>
        </div>
      </FormModal>

      {/* 삭제 모달 */}
      {selectedItem && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          resourceType="서비스"
          resourceName={selectedItem.name}
          loading={deleting}
        />
      )}
    </MainLayout>
  );
}
