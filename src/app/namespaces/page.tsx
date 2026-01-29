"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader, Button, StatusBadge, FormModal, DeleteConfirmModal, DataTable, Column, EmptyState } from '@/components/ui';
import { useListController, useResourceActions } from '@/hooks';
import { Namespace } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiRefreshCw } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock 데이터
const MOCK_NAMESPACES: Namespace[] = [
  {
    id: 'ns-1',
    name: 'default',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
    labels: { 'kubernetes.io/metadata.name': 'default' },
    resourceUsage: { pods: 12, deployments: 5, services: 8, configMaps: 15, secrets: 10 },
  },
  {
    id: 'ns-2',
    name: 'kube-system',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
    labels: { 'kubernetes.io/metadata.name': 'kube-system' },
    resourceUsage: { pods: 25, deployments: 12, services: 15, configMaps: 30, secrets: 20 },
  },
  {
    id: 'ns-3',
    name: 'production',
    status: 'Active',
    createdAt: '2024-03-15T10:30:00Z',
    labels: { 'env': 'production', 'team': 'backend' },
    resourceUsage: { pods: 45, deployments: 15, services: 20, configMaps: 25, secrets: 18 },
    resourceQuota: { hard: { 'pods': '100', 'cpu': '10', 'memory': '20Gi' }, used: { 'pods': '45', 'cpu': '4.5', 'memory': '12Gi' } },
  },
  {
    id: 'ns-4',
    name: 'staging',
    status: 'Active',
    createdAt: '2024-03-15T10:30:00Z',
    labels: { 'env': 'staging', 'team': 'backend' },
    resourceUsage: { pods: 20, deployments: 8, services: 10, configMaps: 12, secrets: 8 },
  },
  {
    id: 'ns-5',
    name: 'development',
    status: 'Active',
    createdAt: '2024-04-01T09:00:00Z',
    labels: { 'env': 'development', 'team': 'frontend' },
    resourceUsage: { pods: 8, deployments: 3, services: 5, configMaps: 8, secrets: 5 },
  },
];

export default function NamespacesPage() {
  // 리스트 컨트롤러
  const {
    paginatedData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refresh,
    refreshing,
  } = useListController<Namespace>({
    fetchData: async () => MOCK_NAMESPACES,
    keyExtractor: (ns) => ns.id,
    searchFields: ['name'],
  });

  // 리소스 액션
  const {
    createModalOpen,
    editModalOpen,
    deleteModalOpen,
    selectedItem,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
    handleCreate,
    handleDelete,
    creating,
    deleting,
    actionError,
  } = useResourceActions<Namespace>({
    createAction: async (data) => {
      console.log('Create namespace:', data);
      return { success: true };
    },
    deleteAction: async (id) => {
      console.log('Delete namespace:', id);
      return { success: true };
    },
    onRefresh: refresh,
  });

  // 폼 상태
  const [formData, setFormData] = useState({ name: '', labels: '' });

  // 테이블 컬럼 정의
  const columns: Column<Namespace>[] = [
    {
      key: 'name',
      header: '이름',
      sortable: true,
      accessor: (ns) => (
        <div className="flex items-center gap-2">
          <FiPackage className="text-blue-400" />
          <span className="font-medium text-slate-200">{ns.name}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      accessor: (ns) => <StatusBadge status={ns.status} showDot />,
    },
    {
      key: 'pods',
      header: 'Pods',
      accessor: (ns) => (
        <span className="text-slate-400">{ns.resourceUsage?.pods || 0}</span>
      ),
    },
    {
      key: 'deployments',
      header: 'Deployments',
      accessor: (ns) => (
        <span className="text-slate-400">{ns.resourceUsage?.deployments || 0}</span>
      ),
    },
    {
      key: 'services',
      header: 'Services',
      accessor: (ns) => (
        <span className="text-slate-400">{ns.resourceUsage?.services || 0}</span>
      ),
    },
    {
      key: 'quota',
      header: '리소스 쿼터',
      accessor: (ns) => (
        ns.resourceQuota ? (
          <span className="text-emerald-400 text-xs">설정됨</span>
        ) : (
          <span className="text-slate-500 text-xs">없음</span>
        )
      ),
    },
    {
      key: 'actions',
      header: '작업',
      align: 'right',
      accessor: (ns) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => { e.stopPropagation(); openEditModal(ns); }}
            title="수정"
          >
            <FiEdit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
            onClick={(e) => { e.stopPropagation(); openDeleteModal(ns); }}
            title="삭제"
            disabled={['default', 'kube-system', 'kube-public'].includes(ns.name)}
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
        title="네임스페이스"
        description="Kubernetes 네임스페이스를 관리합니다."
        breadcrumbs={[{ label: '네임스페이스' }]}
        actions={
          <Button onClick={openCreateModal}>
            <FiPlus className="mr-2" />
            네임스페이스 생성
          </Button>
        }
      />

      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(ns) => ns.id}
        loading={loading}
        error={error}
        searchable
        searchPlaceholder="네임스페이스 검색..."
        onRefresh={refresh}
        refreshing={refreshing}
        emptyMessage="네임스페이스가 없습니다."
        pagination
        pageSize={10}
      />

      {/* 생성 모달 */}
      <FormModal
        isOpen={createModalOpen}
        onClose={closeCreateModal}
        title="새 네임스페이스 생성"
        onSubmit={async () => {
          await handleCreate(formData);
          setFormData({ name: '', labels: '' });
        }}
        submitLabel="생성"
        loading={creating}
        error={actionError}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              placeholder="my-namespace"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <p className="text-xs text-slate-500">
              소문자, 숫자, 하이픈만 사용할 수 있습니다.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="labels">레이블 (선택)</Label>
            <Input
              id="labels"
              placeholder="env=production, team=backend"
              value={formData.labels}
              onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
            />
            <p className="text-xs text-slate-500">
              쉼표로 구분된 key=value 형식으로 입력하세요.
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
          resourceType="네임스페이스"
          resourceName={selectedItem.name}
          loading={deleting}
          additionalWarning="네임스페이스 내의 모든 리소스가 함께 삭제됩니다."
        />
      )}
    </MainLayout>
  );
}
