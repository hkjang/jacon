"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { createWorkloadAction, WorkloadCreateInput } from '@/lib/actions/workload-actions';

interface WorkloadCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WorkloadCreateModal({ isOpen, onClose, onSuccess }: WorkloadCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkloadCreateInput>({
    name: '',
    namespace: 'default',
    type: 'Deployment',
    image: '',
    replicas: 1,
    cpu: '100m',
    memory: '128Mi',
    cluster: 'default-cluster',
  });
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>([]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const envVarsObj = envVars.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const result = await createWorkloadAction({
        ...formData,
        envVars: envVarsObj,
      });

      if (result.success) {
        onSuccess?.();
        onClose();
        // 폼 초기화
        setFormData({
          name: '',
          namespace: 'default',
          type: 'Deployment',
          image: '',
          replicas: 1,
          cpu: '100m',
          memory: '128Mi',
          cluster: 'default-cluster',
        });
        setEnvVars([]);
      } else {
        setError(result.error || '워크로드 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">새 워크로드 생성</h2>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                placeholder="my-app"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="namespace">네임스페이스</Label>
              <Input
                id="namespace"
                placeholder="default"
                value={formData.namespace}
                onChange={(e) => setFormData({ ...formData, namespace: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">유형</Label>
              <select
                id="type"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="Deployment">Deployment</option>
                <option value="StatefulSet">StatefulSet</option>
                <option value="DaemonSet">DaemonSet</option>
                <option value="Job">Job</option>
                <option value="CronJob">CronJob</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cluster">클러스터</Label>
              <Input
                id="cluster"
                placeholder="default-cluster"
                value={formData.cluster}
                onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">컨테이너 이미지 *</Label>
            <Input
              id="image"
              placeholder="nginx:latest"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="replicas">레플리카</Label>
              <Input
                id="replicas"
                type="number"
                min="0"
                max="100"
                value={formData.replicas}
                onChange={(e) => setFormData({ ...formData, replicas: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpu">CPU</Label>
              <Input
                id="cpu"
                placeholder="100m"
                value={formData.cpu}
                onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory">메모리</Label>
              <Input
                id="memory"
                placeholder="128Mi"
                value={formData.memory}
                onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
              />
            </div>
          </div>

          {/* 환경변수 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>환경변수</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addEnvVar}>
                <FiPlus className="mr-1" /> 추가
              </Button>
            </div>
            {envVars.length > 0 && (
              <div className="space-y-2">
                {envVars.map((env, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="KEY"
                      value={env.key}
                      onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="VALUE"
                      value={env.value}
                      onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEnvVar(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '생성 중...' : '워크로드 생성'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
