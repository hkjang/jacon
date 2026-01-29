"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader, Button, StatusBadge, FormModal, DeleteConfirmModal, DataTable, Column, Tabs, TabsList, TabsTrigger, TabsContent, Select } from '@/components/ui';
import { useListController, useResourceActions } from '@/hooks';
import { PersistentVolume, PersistentVolumeClaim, StorageClass, PVPhase, PVCPhase } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiHardDrive, FiDatabase, FiServer } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock PV 데이터
const MOCK_PVS: PersistentVolume[] = [
  {
    id: 'pv-1',
    name: 'pv-data-001',
    capacity: '100Gi',
    accessModes: ['ReadWriteOnce'],
    reclaimPolicy: 'Retain',
    storageClassName: 'standard',
    status: 'Bound',
    claimRef: { name: 'postgres-data', namespace: 'production' },
    createdAt: '2024-03-01T00:00:00Z',
    source: { type: 'local', path: '/mnt/data' },
  },
  {
    id: 'pv-2',
    name: 'pv-data-002',
    capacity: '50Gi',
    accessModes: ['ReadWriteOnce'],
    reclaimPolicy: 'Delete',
    storageClassName: 'fast-ssd',
    status: 'Bound',
    claimRef: { name: 'redis-data', namespace: 'production' },
    createdAt: '2024-03-05T00:00:00Z',
    source: { type: 'csi', driver: 'disk.csi.azure.com' },
  },
  {
    id: 'pv-3',
    name: 'pv-data-003',
    capacity: '200Gi',
    accessModes: ['ReadWriteMany'],
    reclaimPolicy: 'Retain',
    storageClassName: 'nfs-storage',
    status: 'Available',
    createdAt: '2024-03-10T00:00:00Z',
    source: { type: 'nfs', server: 'nfs.example.com', path: '/exports/data' },
  },
  {
    id: 'pv-4',
    name: 'pv-logs-001',
    capacity: '500Gi',
    accessModes: ['ReadWriteMany'],
    reclaimPolicy: 'Delete',
    storageClassName: 'standard',
    status: 'Bound',
    claimRef: { name: 'app-logs', namespace: 'monitoring' },
    createdAt: '2024-03-15T00:00:00Z',
    source: { type: 'hostPath', path: '/var/log/apps' },
  },
];

// Mock PVC 데이터
const MOCK_PVCS: PersistentVolumeClaim[] = [
  {
    id: 'pvc-1',
    name: 'postgres-data',
    namespace: 'production',
    storageClassName: 'standard',
    accessModes: ['ReadWriteOnce'],
    requestedStorage: '100Gi',
    status: 'Bound',
    volumeName: 'pv-data-001',
    createdAt: '2024-03-01T00:00:00Z',
    usedBy: [{ type: 'StatefulSet', name: 'postgres' }],
  },
  {
    id: 'pvc-2',
    name: 'redis-data',
    namespace: 'production',
    storageClassName: 'fast-ssd',
    accessModes: ['ReadWriteOnce'],
    requestedStorage: '50Gi',
    status: 'Bound',
    volumeName: 'pv-data-002',
    createdAt: '2024-03-05T00:00:00Z',
    usedBy: [{ type: 'StatefulSet', name: 'redis' }],
  },
  {
    id: 'pvc-3',
    name: 'app-logs',
    namespace: 'monitoring',
    storageClassName: 'standard',
    accessModes: ['ReadWriteMany'],
    requestedStorage: '500Gi',
    status: 'Bound',
    volumeName: 'pv-logs-001',
    createdAt: '2024-03-15T00:00:00Z',
    usedBy: [
      { type: 'Deployment', name: 'log-collector' },
      { type: 'Deployment', name: 'log-viewer' },
    ],
  },
  {
    id: 'pvc-4',
    name: 'upload-data',
    namespace: 'production',
    storageClassName: 'fast-ssd',
    accessModes: ['ReadWriteOnce'],
    requestedStorage: '20Gi',
    status: 'Pending',
    createdAt: '2024-04-01T00:00:00Z',
  },
];

// Mock StorageClass 데이터
const MOCK_STORAGE_CLASSES: StorageClass[] = [
  {
    id: 'sc-1',
    name: 'standard',
    provisioner: 'kubernetes.io/azure-disk',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    isDefault: true,
    parameters: { storageaccounttype: 'Standard_LRS' },
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sc-2',
    name: 'fast-ssd',
    provisioner: 'kubernetes.io/azure-disk',
    reclaimPolicy: 'Delete',
    volumeBindingMode: 'WaitForFirstConsumer',
    allowVolumeExpansion: true,
    isDefault: false,
    parameters: { storageaccounttype: 'Premium_LRS' },
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sc-3',
    name: 'nfs-storage',
    provisioner: 'nfs.csi.k8s.io',
    reclaimPolicy: 'Retain',
    volumeBindingMode: 'Immediate',
    allowVolumeExpansion: false,
    isDefault: false,
    parameters: { server: 'nfs.example.com', share: '/exports' },
    createdAt: '2024-02-15T00:00:00Z',
  },
];

// PV 상태 색상
const PV_STATUS_MAP: Record<PVPhase, string> = {
  'Available': 'bg-emerald-500/10 text-emerald-400',
  'Bound': 'bg-blue-500/10 text-blue-400',
  'Released': 'bg-amber-500/10 text-amber-400',
  'Failed': 'bg-red-500/10 text-red-400',
  'Pending': 'bg-slate-500/10 text-slate-400',
};

// PVC 상태 색상
const PVC_STATUS_MAP: Record<PVCPhase, string> = {
  'Bound': 'bg-emerald-500/10 text-emerald-400',
  'Pending': 'bg-amber-500/10 text-amber-400',
  'Lost': 'bg-red-500/10 text-red-400',
};

export default function StoragePage() {
  const [activeTab, setActiveTab] = useState('pvcs');

  // PVC 리스트 컨트롤러
  const pvcList = useListController<PersistentVolumeClaim>({
    fetchData: async () => MOCK_PVCS,
    keyExtractor: (pvc) => pvc.id,
    searchFields: ['name', 'namespace'],
  });

  // PV 리스트 컨트롤러
  const pvList = useListController<PersistentVolume>({
    fetchData: async () => MOCK_PVS,
    keyExtractor: (pv) => pv.id,
    searchFields: ['name'],
  });

  // StorageClass 리스트 컨트롤러
  const scList = useListController<StorageClass>({
    fetchData: async () => MOCK_STORAGE_CLASSES,
    keyExtractor: (sc) => sc.id,
    searchFields: ['name', 'provisioner'],
  });

  // PVC 리소스 액션
  const pvcActions = useResourceActions<PersistentVolumeClaim>({
    createAction: async (data) => {
      console.log('Create PVC:', data);
      return { success: true };
    },
    deleteAction: async (id) => {
      console.log('Delete PVC:', id);
      return { success: true };
    },
    onRefresh: pvcList.refresh,
  });

  // PVC 테이블 컬럼
  const pvcColumns: Column<PersistentVolumeClaim>[] = [
    {
      key: 'name',
      header: '이름',
      sortable: true,
      accessor: (pvc) => (
        <div className="flex items-center gap-2">
          <FiHardDrive className="text-blue-400" />
          <div>
            <span className="font-medium text-slate-200">{pvc.name}</span>
            <span className="text-slate-500 text-xs block">{pvc.namespace}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      accessor: (pvc) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${PVC_STATUS_MAP[pvc.status]}`}>
          {pvc.status === 'Bound' ? '바운드' : pvc.status === 'Pending' ? '대기 중' : '손실'}
        </span>
      ),
    },
    {
      key: 'storage',
      header: '요청 용량',
      accessor: (pvc) => <span className="text-slate-400">{pvc.requestedStorage}</span>,
    },
    {
      key: 'storageClass',
      header: '스토리지 클래스',
      accessor: (pvc) => (
        <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
          {pvc.storageClassName || '-'}
        </code>
      ),
    },
    {
      key: 'volume',
      header: '볼륨',
      accessor: (pvc) => (
        pvc.volumeName ? (
          <span className="text-emerald-400 text-sm">{pvc.volumeName}</span>
        ) : (
          <span className="text-slate-500 text-sm">-</span>
        )
      ),
    },
    {
      key: 'usedBy',
      header: '사용처',
      accessor: (pvc) => (
        pvc.usedBy && pvc.usedBy.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {pvc.usedBy.map((ref, i) => (
              <span key={i} className="text-xs bg-slate-700 px-1.5 py-0.5 rounded">
                {ref.type}/{ref.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-500 text-xs">사용 안함</span>
        )
      ),
    },
    {
      key: 'actions',
      header: '작업',
      align: 'right',
      accessor: (pvc) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
            onClick={(e) => { e.stopPropagation(); pvcActions.openDeleteModal(pvc); }}
            title="삭제"
          >
            <FiTrash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // PV 테이블 컬럼
  const pvColumns: Column<PersistentVolume>[] = [
    {
      key: 'name',
      header: '이름',
      sortable: true,
      accessor: (pv) => (
        <div className="flex items-center gap-2">
          <FiDatabase className="text-purple-400" />
          <span className="font-medium text-slate-200">{pv.name}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      accessor: (pv) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${PV_STATUS_MAP[pv.status]}`}>
          {pv.status === 'Available' ? '사용 가능' :
           pv.status === 'Bound' ? '바운드' :
           pv.status === 'Released' ? '해제됨' :
           pv.status === 'Pending' ? '대기 중' : '실패'}
        </span>
      ),
    },
    {
      key: 'capacity',
      header: '용량',
      accessor: (pv) => <span className="text-slate-400">{pv.capacity}</span>,
    },
    {
      key: 'accessModes',
      header: '액세스 모드',
      accessor: (pv) => (
        <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
          {pv.accessModes.join(', ')}
        </code>
      ),
    },
    {
      key: 'reclaimPolicy',
      header: '회수 정책',
      accessor: (pv) => (
        <span className={pv.reclaimPolicy === 'Retain' ? 'text-amber-400' : 'text-slate-400'}>
          {pv.reclaimPolicy}
        </span>
      ),
    },
    {
      key: 'claim',
      header: 'Claim',
      accessor: (pv) => (
        pv.claimRef ? (
          <span className="text-blue-400 text-sm">
            {pv.claimRef.namespace}/{pv.claimRef.name}
          </span>
        ) : (
          <span className="text-slate-500 text-sm">-</span>
        )
      ),
    },
  ];

  // StorageClass 테이블 컬럼
  const scColumns: Column<StorageClass>[] = [
    {
      key: 'name',
      header: '이름',
      sortable: true,
      accessor: (sc) => (
        <div className="flex items-center gap-2">
          <FiServer className="text-cyan-400" />
          <span className="font-medium text-slate-200">
            {sc.name}
            {sc.isDefault && (
              <span className="ml-2 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                기본값
              </span>
            )}
          </span>
        </div>
      ),
    },
    {
      key: 'provisioner',
      header: 'Provisioner',
      accessor: (sc) => (
        <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
          {sc.provisioner}
        </code>
      ),
    },
    {
      key: 'reclaimPolicy',
      header: '회수 정책',
      accessor: (sc) => <span className="text-slate-400">{sc.reclaimPolicy || 'Delete'}</span>,
    },
    {
      key: 'volumeBindingMode',
      header: '바인딩 모드',
      accessor: (sc) => (
        <span className="text-slate-400 text-sm">
          {sc.volumeBindingMode === 'WaitForFirstConsumer' ? '지연 바인딩' : '즉시'}
        </span>
      ),
    },
    {
      key: 'expansion',
      header: '확장',
      accessor: (sc) => (
        sc.allowVolumeExpansion ? (
          <span className="text-emerald-400">허용</span>
        ) : (
          <span className="text-slate-500">불가</span>
        )
      ),
    },
  ];

  const tabs = [
    { value: 'pvcs', label: 'PersistentVolumeClaim', count: MOCK_PVCS.length },
    { value: 'pvs', label: 'PersistentVolume', count: MOCK_PVS.length },
    { value: 'classes', label: 'StorageClass', count: MOCK_STORAGE_CLASSES.length },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="스토리지"
        description="Kubernetes 영구 볼륨과 스토리지 클래스를 관리합니다."
        breadcrumbs={[{ label: '스토리지' }]}
        actions={
          <Button onClick={pvcActions.openCreateModal}>
            <FiPlus className="mr-2" />
            PVC 생성
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="ml-2 px-1.5 py-0.5 bg-slate-700 rounded text-xs">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="pvcs">
          <DataTable
            data={pvcList.paginatedData}
            columns={pvcColumns}
            keyExtractor={(pvc) => pvc.id}
            loading={pvcList.loading}
            error={pvcList.error}
            searchable
            searchPlaceholder="PVC 검색..."
            onRefresh={pvcList.refresh}
            refreshing={pvcList.refreshing}
            emptyMessage="PVC가 없습니다."
            pagination
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="pvs">
          <DataTable
            data={pvList.paginatedData}
            columns={pvColumns}
            keyExtractor={(pv) => pv.id}
            loading={pvList.loading}
            error={pvList.error}
            searchable
            searchPlaceholder="PV 검색..."
            onRefresh={pvList.refresh}
            refreshing={pvList.refreshing}
            emptyMessage="PV가 없습니다."
            pagination
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="classes">
          <DataTable
            data={scList.paginatedData}
            columns={scColumns}
            keyExtractor={(sc) => sc.id}
            loading={scList.loading}
            error={scList.error}
            searchable
            searchPlaceholder="StorageClass 검색..."
            onRefresh={scList.refresh}
            refreshing={scList.refreshing}
            emptyMessage="StorageClass가 없습니다."
          />
        </TabsContent>
      </Tabs>

      {/* PVC 삭제 모달 */}
      {pvcActions.selectedItem && (
        <DeleteConfirmModal
          isOpen={pvcActions.deleteModalOpen}
          onClose={pvcActions.closeDeleteModal}
          onConfirm={pvcActions.handleDelete}
          resourceType="PVC"
          resourceName={pvcActions.selectedItem.name}
          loading={pvcActions.deleting}
          additionalWarning="연결된 데이터가 삭제될 수 있습니다."
        />
      )}
    </MainLayout>
  );
}
