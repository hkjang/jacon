"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX } from 'react-icons/fi';
import { updateWorkloadAction, scaleWorkloadAction, WorkloadUpdateInput } from '@/lib/actions/workload-actions';
import { Workload } from '@/lib/mock-workloads';

interface WorkloadEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  workload: Workload | null;
  onSuccess?: () => void;
}

export function WorkloadEditModal({ isOpen, onClose, workload, onSuccess }: WorkloadEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkloadUpdateInput>({
    id: '',
    replicas: 1,
    image: '',
    cpu: '',
    memory: '',
  });

  useEffect(() => {
    if (workload) {
      const currentReplicas = parseInt(workload.replicas.split('/')[1]) || 1;
      setFormData({
        id: workload.id,
        replicas: currentReplicas,
        image: workload.image,
        cpu: workload.cpu,
        memory: workload.memory,
      });
    }
  }, [workload]);

  if (!isOpen || !workload) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await updateWorkloadAction(formData);

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || '워크로드 수정에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleScale = async (newReplicas: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await scaleWorkloadAction(workload.id, newReplicas);

      if (result.success) {
        setFormData({ ...formData, replicas: newReplicas });
        onSuccess?.();
      } else {
        setError(result.error || '스케일링에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">워크로드 수정: {workload.name}</h2>
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

          <div className="bg-slate-800/50 rounded-lg p-3 text-sm">
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <span>네임스페이스:</span>
              <span className="text-slate-200">{workload.namespace}</span>
              <span>유형:</span>
              <span className="text-slate-200">{workload.type}</span>
              <span>클러스터:</span>
              <span className="text-slate-200">{workload.cluster}</span>
              <span>상태:</span>
              <span className={workload.status === 'Running' ? 'text-emerald-400' : 'text-amber-400'}>
                {workload.status}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">컨테이너 이미지</Label>
            <Input
              id="image"
              placeholder="nginx:latest"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>레플리카 (현재: {workload.replicas})</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleScale(Math.max(0, (formData.replicas || 1) - 1))}
                disabled={loading}
              >
                -
              </Button>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.replicas}
                onChange={(e) => setFormData({ ...formData, replicas: parseInt(e.target.value) || 0 })}
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleScale((formData.replicas || 1) + 1)}
                disabled={loading}
              >
                +
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleScale(formData.replicas || 1)}
                disabled={loading}
              >
                스케일
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpu">CPU 요청량</Label>
              <Input
                id="cpu"
                placeholder="100m"
                value={formData.cpu}
                onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memory">메모리 요청량</Label>
              <Input
                id="memory"
                placeholder="128Mi"
                value={formData.memory}
                onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : '변경사항 저장'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
