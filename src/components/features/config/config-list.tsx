"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_CONFIGS, ConfigItem } from '@/lib/mock-config';
import { FiFileText, FiLock, FiPlus, FiMoreVertical, FiEdit2, FiTrash2, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ConfigCreateModal } from './config-create-modal';
import { ConfigEditModal } from './config-edit-modal';
import { ProtectedActionModal } from '@/components/ui/protected-action-modal';
import { getConfigsAction, deleteConfigAction, exportConfigAction } from '@/lib/actions/config-actions';

export function ConfigList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [configs, setConfigs] = useState<ConfigItem[]>(MOCK_CONFIGS);
  const [refreshing, setRefreshing] = useState(false);

  // 모달 상태
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfigItem | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setRefreshing(true);
    try {
      const data = await getConfigsAction();
      setConfigs(data);
    } catch (err) {
      console.error('Failed to load configs:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredConfigs = configs.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.namespace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (e: React.MouseEvent, config: ConfigItem) => {
    e.stopPropagation();
    setSelectedConfig(config);
    setEditModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, config: ConfigItem) => {
    e.stopPropagation();
    setSelectedConfig(config);
    setDeleteModalOpen(true);
    setActionMenuOpen(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedConfig) {
      await deleteConfigAction(selectedConfig.id);
      loadConfigs();
      setDeleteModalOpen(false);
      setSelectedConfig(null);
    }
  };

  const handleExport = async (e: React.MouseEvent, config: ConfigItem) => {
    e.stopPropagation();
    const result = await exportConfigAction(config.id, 'yaml');
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.name}.yaml`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setActionMenuOpen(null);
  };

  const toggleActionMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActionMenuOpen(actionMenuOpen === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <div className="w-1/3">
           <Input
             placeholder="구성 요소 검색..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
         <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={loadConfigs} disabled={refreshing}>
             <FiRefreshCw className={cn("mr-2", refreshing && "animate-spin")} />
             새로고침
           </Button>
           <Button onClick={() => setCreateModalOpen(true)}>
             <FiPlus className="mr-2" /> 새 구성 생성
           </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConfigs.map((config) => (
          <Card
            key={config.id}
            className="cursor-pointer hover:border-blue-500 transition-colors bg-slate-900 border-slate-800 group"
            onClick={() => {
              setSelectedConfig(config);
              setEditModalOpen(true);
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {config.type === 'Secret' ?
                    <FiLock className="text-amber-500" /> :
                    <FiFileText className="text-blue-500" />
                  }
                  <h3 className="font-semibold text-lg">{config.name}</h3>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => toggleActionMenu(e, config.id)}
                  >
                    <FiMoreVertical />
                  </Button>

                  {/* 드롭다운 메뉴 */}
                  {actionMenuOpen === config.id && (
                    <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                      <button
                        className="w-full px-3 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"
                        onClick={(e) => handleEditClick(e, config)}
                      >
                        <FiEdit2 className="w-4 h-4" /> 수정
                      </button>
                      <button
                        className="w-full px-3 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"
                        onClick={(e) => handleExport(e, config)}
                      >
                        <FiDownload className="w-4 h-4" /> 내보내기
                      </button>
                      <hr className="border-slate-700 my-1" />
                      <button
                        className="w-full px-3 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2 text-red-400"
                        onClick={(e) => handleDeleteClick(e, config)}
                      >
                        <FiTrash2 className="w-4 h-4" /> 삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-slate-400 mb-4">
                <span className={cn(
                  "inline-block px-1.5 py-0.5 rounded text-xs mr-2",
                  config.type === 'Secret' ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                )}>
                  {config.type}
                </span>
                <span className="text-slate-500">{config.namespace}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {config.keys.slice(0, 5).map(key => (
                  <span key={key} className="px-2 py-1 bg-slate-950 rounded text-xs font-mono text-slate-500 border border-slate-800">
                    {key}
                  </span>
                ))}
                {config.keys.length > 5 && (
                  <span className="px-2 py-1 text-xs text-slate-500">
                    +{config.keys.length - 5}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredConfigs.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-lg">
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 구성 요소가 없습니다.'}
          </div>
        )}
      </div>

      {/* 생성 모달 */}
      <ConfigCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadConfigs}
      />

      {/* 수정 모달 */}
      <ConfigEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedConfig(null);
        }}
        config={selectedConfig}
        onSuccess={loadConfigs}
      />

      {/* 삭제 확인 모달 */}
      {selectedConfig && (
        <ProtectedActionModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedConfig(null);
          }}
          onConfirm={handleConfirmDelete}
          title={`${selectedConfig.type} 삭제`}
          description={`정말 '${selectedConfig.name}'을(를) 삭제하시겠습니까? 이 ${selectedConfig.type}을 참조하는 워크로드에 영향을 줄 수 있습니다.`}
          resourceName={selectedConfig.name}
          actionType="delete"
        />
      )}

      {/* 외부 클릭 시 메뉴 닫기 */}
      {actionMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActionMenuOpen(null)}
        />
      )}
    </div>
  );
}
