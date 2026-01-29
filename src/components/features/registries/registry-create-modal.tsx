"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX } from 'react-icons/fi';
import { SiDocker } from 'react-icons/si';
import { createRegistryAction, RegistryCreateInput } from '@/lib/actions/registry-actions';
import { cn } from '@/lib/utils';

interface RegistryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const REGISTRY_TYPES = [
  { value: 'dockerhub', label: 'Docker Hub', icon: '🐳' },
  { value: 'acr', label: 'Azure Container Registry', icon: '☁️' },
  { value: 'ecr', label: 'Amazon ECR', icon: '📦' },
  { value: 'gcr', label: 'Google Container Registry', icon: '🌐' },
  { value: 'harbor', label: 'Harbor', icon: '⚓' },
  { value: 'other', label: '기타', icon: '📁' },
] as const;

export function RegistryCreateModal({ isOpen, onClose, onSuccess }: RegistryCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistryCreateInput>({
    name: '',
    type: 'dockerhub',
    url: '',
    username: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createRegistryAction(formData);

      if (result.success) {
        onSuccess?.();
        onClose();
        setFormData({
          name: '',
          type: 'dockerhub',
          url: '',
          username: '',
          password: '',
        });
      } else {
        setError(result.error || '레지스트리 등록에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultUrl = (type: string) => {
    switch (type) {
      case 'dockerhub': return 'https://index.docker.io/v1/';
      case 'acr': return 'https://<name>.azurecr.io';
      case 'ecr': return 'https://<account>.dkr.ecr.<region>.amazonaws.com';
      case 'gcr': return 'https://gcr.io';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">컨테이너 레지스트리 등록</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <FiX />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>레지스트리 유형</Label>
            <div className="grid grid-cols-3 gap-2">
              {REGISTRY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={cn(
                    "p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors text-xs",
                    formData.type === type.value
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-slate-700 bg-slate-800 hover:border-slate-600"
                  )}
                  onClick={() => setFormData({
                    ...formData,
                    type: type.value as any,
                    url: getDefaultUrl(type.value),
                  })}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              placeholder="my-registry"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              placeholder={getDefaultUrl(formData.type)}
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">사용자명</Label>
              <Input
                id="username"
                placeholder="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 / 토큰</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '등록 중...' : '레지스트리 등록'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
