"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db, IamRole } from '@/lib/db';
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiShield, FiCopy, FiLock } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { IamRoleCreateModal } from './iam-role-create-modal';
import { ProtectedActionModal } from '@/components/ui/protected-action-modal';
import { getIamRolesAction, deleteIamRoleAction, cloneIamRoleAction } from '@/lib/actions/iam-actions';

export function IamRoleList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roles, setRoles] = useState<IamRole[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IamRole | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setRefreshing(true);
    try {
      const data = await getIamRolesAction();
      setRoles(data);
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (role: IamRole) => {
    if (role.type === 'system') {
      alert('시스템 역할은 삭제할 수 없습니다.');
      return;
    }
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedRole) {
      await deleteIamRoleAction(selectedRole.id);
      loadRoles();
      setDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const handleClone = async (role: IamRole) => {
    const newName = prompt('새 역할 이름을 입력하세요:', `${role.name}-copy`);
    if (newName) {
      const result = await cloneIamRoleAction(role.id, newName);
      if (result.success) {
        loadRoles();
      } else {
        alert(result.error || '역할 복제에 실패했습니다.');
      }
    }
  };

  const getPermissionCount = (permissions: string[]) => {
    const categories = new Set(permissions.map(p => p.split(':')[0]));
    return { total: permissions.length, categories: categories.size };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-1/3">
          <Input
            placeholder="역할 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadRoles} disabled={refreshing}>
            <FiRefreshCw className={cn("mr-2", refreshing && "animate-spin")} />
            새로고침
          </Button>
          <Button onClick={() => setCreateModalOpen(true)}>
            <FiPlus className="mr-2" /> 역할 생성
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => {
          const permCount = getPermissionCount(role.permissions);

          return (
            <Card key={role.id} className="bg-slate-900 border-slate-800 group hover:border-slate-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      role.type === 'system' ? "bg-amber-500/10" : "bg-blue-500/10"
                    )}>
                      {role.type === 'system' ? (
                        <FiLock className="text-amber-500" />
                      ) : (
                        <FiShield className="text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{role.name}</h3>
                        {role.type === 'system' && (
                          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] rounded border border-amber-500/20">
                            시스템
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{role.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span>{permCount.total}개 권한</span>
                  <span>{permCount.categories}개 카테고리</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {role.permissions.slice(0, 6).map((perm) => (
                    <span
                      key={perm}
                      className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded"
                    >
                      {perm.split(':')[1]}
                    </span>
                  ))}
                  {role.permissions.length > 6 && (
                    <span className="px-1.5 py-0.5 text-slate-500 text-[10px]">
                      +{role.permissions.length - 6}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClone(role)}
                    className="flex-1"
                    title="역할 복제"
                  >
                    <FiCopy className="mr-1" /> 복제
                  </Button>
                  {role.type !== 'system' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteClick(role)}
                      title="역할 삭제"
                    >
                      <FiTrash2 />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredRoles.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-lg">
            <FiShield className="w-10 h-10 mx-auto mb-3 opacity-50" />
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 역할이 없습니다.'}
          </div>
        )}
      </div>

      {/* 생성 모달 */}
      <IamRoleCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadRoles}
      />

      {/* 삭제 확인 모달 */}
      {selectedRole && (
        <ProtectedActionModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedRole(null);
          }}
          onConfirm={handleConfirmDelete}
          title="역할 삭제"
          description={`정말 '${selectedRole.name}'을(를) 삭제하시겠습니까? 이 역할이 할당된 사용자는 권한을 잃게 됩니다.`}
          resourceName={selectedRole.name}
          actionType="delete"
        />
      )}
    </div>
  );
}
