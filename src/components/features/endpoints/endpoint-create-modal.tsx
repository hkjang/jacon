"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { SiKubernetes, SiDocker } from 'react-icons/si';
import { createEndpointAction, EndpointCreateInput } from '@/lib/actions/endpoint-actions';
import { cn } from '@/lib/utils';

interface EndpointCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EndpointCreateModal({ isOpen, onClose, onSuccess }: EndpointCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EndpointCreateInput>({
    name: '',
    type: 'Kubernetes',
    url: '',
    tags: [],
    isEdge: false,
    connectionMode: 'direct',
  });
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createEndpointAction(formData);

      if (result.success) {
        onSuccess?.();
        onClose();
        setFormData({
          name: '',
          type: 'Kubernetes',
          url: '',
          tags: [],
          isEdge: false,
          connectionMode: 'direct',
        });
        setTagInput('');
      } else {
        setError(result.error || '엔드포인트 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tag] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">새 엔드포인트 등록</h2>
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

          {/* 타입 선택 */}
          <div className="space-y-2">
            <Label>엔드포인트 유형</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['Kubernetes', 'Docker', 'Swarm'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={cn(
                    "p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors",
                    formData.type === type
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-slate-700 bg-slate-800 hover:border-slate-600"
                  )}
                  onClick={() => setFormData({ ...formData, type })}
                >
                  {type === 'Kubernetes' ? (
                    <SiKubernetes className="text-2xl" />
                  ) : (
                    <SiDocker className="text-2xl" />
                  )}
                  <span className="text-sm">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              placeholder="production-cluster"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">
              URL *
              {formData.type === 'Kubernetes' && <span className="text-slate-500 ml-2">(예: https://api.k8s.example.com:6443)</span>}
              {formData.type === 'Docker' && <span className="text-slate-500 ml-2">(예: tcp://docker.example.com:2375)</span>}
            </Label>
            <Input
              id="url"
              placeholder={formData.type === 'Kubernetes' ? 'https://api.k8s.example.com:6443' : 'tcp://docker.example.com:2375'}
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="connectionMode">연결 모드</Label>
              <select
                id="connectionMode"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.connectionMode}
                onChange={(e) => setFormData({ ...formData, connectionMode: e.target.value as 'direct' | 'agent' })}
              >
                <option value="direct">직접 연결</option>
                <option value="agent">에이전트</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>옵션</Label>
              <div className="flex items-center gap-2 h-10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEdge}
                    onChange={(e) => setFormData({ ...formData, isEdge: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800"
                  />
                  <span className="text-sm">Edge 노드</span>
                </label>
              </div>
            </div>
          </div>

          {/* 태그 입력 */}
          <div className="space-y-2">
            <Label>태그</Label>
            <div className="flex gap-2">
              <Input
                placeholder="태그 입력 후 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <FiPlus />
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-slate-800 rounded text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '등록 중...' : '엔드포인트 등록'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
