"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db, Endpoint } from '@/lib/db';
import { FiPlus, FiServer, FiActivity, FiTag, FiMoreVertical, FiWifi, FiEdit2, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { SiKubernetes, SiDocker } from 'react-icons/si';
import { cn } from '@/lib/utils';
import { useProject } from '@/hooks/use-project-context';
import { useRouter } from 'next/navigation';
import { ProtectedActionModal } from '@/components/ui/protected-action-modal';
import { EndpointCreateModal } from './endpoint-create-modal';
import { EndpointEditModal } from './endpoint-edit-modal';
import { deleteEndpointAction, testEndpointConnectionAction } from '@/lib/actions/endpoint-actions';

export function EndpointList() {
  const router = useRouter();
  const { currentProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = () => {
    setRefreshing(true);
    setTimeout(() => {
      setEndpoints([...db.getEndpoints()]);
      setRefreshing(false);
    }, 300);
  };

  const filteredEndpoints = endpoints.filter(ep =>
    ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ep.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClick = (ep: Endpoint) => {
      setSelectedEndpoint(ep);
      setDeleteModalOpen(true);
  };

  const handleEditClick = (ep: Endpoint) => {
      setSelectedEndpoint(ep);
      setEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
      if (selectedEndpoint) {
        await deleteEndpointAction(selectedEndpoint.id);
        loadEndpoints();
      }
      setDeleteModalOpen(false);
      setSelectedEndpoint(null);
  };

  const handleTestConnection = async (ep: Endpoint) => {
      setTestingId(ep.id);
      try {
        await testEndpointConnectionAction(ep.id);
        loadEndpoints();
      } finally {
        setTestingId(null);
      }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <div className="w-1/3">
           <Input
             placeholder="엔드포인트 검색 (이름, 태그)..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
         <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={loadEndpoints} disabled={refreshing}>
             <FiRefreshCw className={cn("mr-2", refreshing && "animate-spin")} />
             새로고침
           </Button>
           <Button onClick={() => setCreateModalOpen(true)}>
             <FiPlus className="mr-2" /> 엔드포인트 등록
           </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEndpoints.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                <FiServer className="mx-auto h-10 w-10 mb-3 opacity-50" />
                <p>프로젝트 <strong>{currentProject.name}</strong>에 엔드포인트가 없습니다.</p>
                <Button variant="ghost" className="text-blue-500 hover:text-blue-400 p-0 h-auto" onClick={() => router.push('/endpoints/new')}>첫 번째 엔드포인트 등록</Button>
            </div>
        ) : (
            filteredEndpoints.map((ep) => (
              <Card key={ep.id} className="hover:bg-slate-900 transition-colors bg-slate-950 border-slate-800 group">
                <CardContent className="p-4 flex items-center gap-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-2xl">
                     {ep.type === 'Kubernetes' ? <SiKubernetes className="text-blue-500" /> : <SiDocker className="text-blue-400" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
                            {ep.name}
                            {ep.isEdge && <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] border border-indigo-500/30">EDGE</span>}
                        </h3>
                        <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                            ep.status === 'Online' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                            ep.status === 'Warning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            "bg-slate-800 text-slate-500 border-slate-700"
                        )}>
                            {(() => {
                                const map: Record<string, string> = {
                                    'Online': '온라인',
                                    'Offline': '오프라인',
                                    'Warning': '경고'
                                };
                                return map[ep.status] || ep.status;
                            })()}
                        </span>
                     </div>
                     <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><FiActivity className="w-3 h-3" /> {ep.version}</span>
                        {/* <span className="flex items-center gap-1"><FiServer className="w-3 h-3" /> {ep.url}</span> removed unused icon usage if needed, keeping for now */}
                        <span className="flex items-center gap-1">URL: {ep.url}</span>
                     </div>
                  </div>

                  {/* Tags */}
                  <div className="hidden md:flex gap-2">
                     {ep.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-slate-900 rounded text-xs text-slate-400 border border-slate-800">
                           <FiTag className="w-3 h-3" /> {tag}
                        </span>
                     ))}
                  </div>

                  {/* Actions - Visible on hover or focused */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(ep)}
                        disabled={testingId === ep.id}
                        title="연결 테스트"
                      >
                        {testingId === ep.id ? (
                          <FiRefreshCw className="animate-spin" />
                        ) : (
                          <FiCheckCircle />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(ep)}
                        title="수정"
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20"
                        onClick={() => handleDeleteClick(ep)}
                        title="삭제"
                      >
                         삭제
                      </Button>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>

      {/* 생성 모달 */}
      <EndpointCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadEndpoints}
      />

      {/* 수정 모달 */}
      <EndpointEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedEndpoint(null);
        }}
        endpoint={selectedEndpoint}
        onSuccess={loadEndpoints}
      />

      {/* 삭제 확인 모달 */}
      {selectedEndpoint && (
          <ProtectedActionModal
             isOpen={deleteModalOpen}
             onClose={() => {
               setDeleteModalOpen(false);
               setSelectedEndpoint(null);
             }}
             onConfirm={handleConfirmDelete}
             title="엔드포인트 삭제"
             description={`정말 '${selectedEndpoint.name}'을(를) 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
             resourceName={selectedEndpoint.name}
             actionType="delete"
          />
      )}
    </div>
  );
}
