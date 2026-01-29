"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db, Registry } from '@/lib/db';
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiBox, FiMoreVertical } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { RegistryCreateModal } from './registry-create-modal';
import { ProtectedActionModal } from '@/components/ui/protected-action-modal';
import { getRegistriesAction, deleteRegistryAction, testRegistryConnectionAction } from '@/lib/actions/registry-actions';

const REGISTRY_ICONS: Record<string, string> = {
  dockerhub: '🐳',
  acr: '☁️',
  ecr: '📦',
  gcr: '🌐',
  harbor: '⚓',
  other: '📁',
};

export function RegistryList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRegistry, setSelectedRegistry] = useState<Registry | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadRegistries();
  }, []);

  const loadRegistries = async () => {
    setRefreshing(true);
    try {
      const data = await getRegistriesAction();
      setRegistries(data);
    } catch (err) {
      console.error('Failed to load registries:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredRegistries = registries.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (registry: Registry) => {
    setSelectedRegistry(registry);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRegistry) {
      await deleteRegistryAction(selectedRegistry.id);
      loadRegistries();
      setDeleteModalOpen(false);
      setSelectedRegistry(null);
    }
  };

  const handleTestConnection = async (registry: Registry) => {
    setTestingId(registry.id);
    try {
      const result = await testRegistryConnectionAction(registry.id);
      setTestResults(prev => ({ ...prev, [registry.id]: result.connected || false }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <Input
            placeholder="레지스트리 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadRegistries} disabled={refreshing}>
            <FiRefreshCw className={cn("mr-2", refreshing && "animate-spin")} />
            새로고침
          </Button>
          <Button onClick={() => setCreateModalOpen(true)}>
            <FiPlus className="mr-2" /> 레지스트리 추가
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRegistries.map((registry) => (
          <Card key={registry.id} className="bg-slate-900 border-slate-800 group hover:border-slate-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{REGISTRY_ICONS[registry.type] || '📁'}</span>
                  <div>
                    <h3 className="font-semibold">{registry.name}</h3>
                    <p className="text-xs text-slate-500">{registry.type.toUpperCase()}</p>
                  </div>
                </div>
                {testResults[registry.id] !== undefined && (
                  <span className={cn(
                    "flex items-center gap-1 text-xs px-2 py-1 rounded",
                    testResults[registry.id]
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  )}>
                    {testResults[registry.id] ? <FiCheckCircle /> : <FiXCircle />}
                    {testResults[registry.id] ? '연결됨' : '실패'}
                  </span>
                )}
              </div>

              <div className="text-sm text-slate-400 mb-3 truncate font-mono">
                {registry.url}
              </div>

              {registry.username && (
                <div className="text-xs text-slate-500 mb-3">
                  사용자: {registry.username}
                </div>
              )}

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection(registry)}
                  disabled={testingId === registry.id}
                  className="flex-1"
                >
                  {testingId === registry.id ? (
                    <FiRefreshCw className="animate-spin mr-1" />
                  ) : (
                    <FiCheckCircle className="mr-1" />
                  )}
                  테스트
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDeleteClick(registry)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRegistries.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-lg">
            <FiBox className="w-10 h-10 mx-auto mb-3 opacity-50" />
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 레지스트리가 없습니다.'}
          </div>
        )}
      </div>

      {/* 생성 모달 */}
      <RegistryCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadRegistries}
      />

      {/* 삭제 확인 모달 */}
      {selectedRegistry && (
        <ProtectedActionModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedRegistry(null);
          }}
          onConfirm={handleConfirmDelete}
          title="레지스트리 삭제"
          description={`정말 '${selectedRegistry.name}'을(를) 삭제하시겠습니까? 이 레지스트리를 사용하는 엔드포인트에서 이미지를 가져올 수 없게 됩니다.`}
          resourceName={selectedRegistry.name}
          actionType="delete"
        />
      )}
    </div>
  );
}
