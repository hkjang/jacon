"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX, FiCheck } from 'react-icons/fi';
import { createIamRoleAction, getAvailablePermissionsAction, IamRoleCreateInput } from '@/lib/actions/iam-actions';
import { cn } from '@/lib/utils';

interface IamRoleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function IamRoleCreateModal({ isOpen, onClose, onSuccess }: IamRoleCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IamRoleCreateInput>({
    name: '',
    description: '',
    permissions: [],
  });
  const [availablePermissions, setAvailablePermissions] = useState<Array<{ category: string; permissions: string[] }>>([]);

  useEffect(() => {
    if (isOpen) {
      loadPermissions();
    }
  }, [isOpen]);

  const loadPermissions = async () => {
    const perms = await getAvailablePermissionsAction();
    setAvailablePermissions(perms);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createIamRoleAction(formData);

      if (result.success) {
        onSuccess?.();
        onClose();
        setFormData({
          name: '',
          description: '',
          permissions: [],
        });
      } else {
        setError(result.error || '역할 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const toggleCategory = (category: string) => {
    const categoryPerms = availablePermissions.find(c => c.category === category)?.permissions || [];
    const allSelected = categoryPerms.every(p => formData.permissions.includes(p));

    if (allSelected) {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => !categoryPerms.includes(p)),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPerms])],
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">새 역할 생성</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <FiX />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">역할 이름 *</Label>
                <Input
                  id="name"
                  placeholder="developer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  placeholder="개발자 권한"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>권한 ({formData.permissions.length}개 선택됨)</Label>
              <div className="space-y-3 max-h-[300px] overflow-y-auto border border-slate-700 rounded-lg p-3">
                {availablePermissions.map((category) => {
                  const selectedCount = category.permissions.filter(p => formData.permissions.includes(p)).length;
                  const allSelected = selectedCount === category.permissions.length;

                  return (
                    <div key={category.category} className="space-y-2">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleCategory(category.category)}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          allSelected
                            ? "bg-blue-500 border-blue-500"
                            : selectedCount > 0
                            ? "bg-blue-500/50 border-blue-500"
                            : "border-slate-600"
                        )}>
                          {(allSelected || selectedCount > 0) && <FiCheck className="w-3 h-3" />}
                        </div>
                        <span className="font-medium text-sm">{category.category}</span>
                        <span className="text-xs text-slate-500">({selectedCount}/{category.permissions.length})</span>
                      </div>
                      <div className="ml-6 flex flex-wrap gap-2">
                        {category.permissions.map((permission) => {
                          const isSelected = formData.permissions.includes(permission);
                          const permName = permission.split(':')[1];

                          return (
                            <button
                              key={permission}
                              type="button"
                              className={cn(
                                "px-2 py-1 rounded text-xs transition-colors",
                                isSelected
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
                              )}
                              onClick={() => togglePermission(permission)}
                            >
                              {permName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading || formData.permissions.length === 0}>
              {loading ? '생성 중...' : '역할 생성'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
