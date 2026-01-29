"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX, FiPlus, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { SiKubernetes, SiDocker } from 'react-icons/si';
import { updateEndpointAction, testEndpointConnectionAction, EndpointUpdateInput } from '@/lib/actions/endpoint-actions';
import { Endpoint } from '@/lib/db';
import { cn } from '@/lib/utils';

interface EndpointEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: Endpoint | null;
  onSuccess?: () => void;
}

export function EndpointEditModal({ isOpen, onClose, endpoint, onSuccess }: EndpointEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; version?: string; message?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EndpointUpdateInput>({
    id: '',
    name: '',
    url: '',
    tags: [],
    isEdge: false,
    connectionMode: 'direct',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (endpoint) {
      setFormData({
        id: endpoint.id,
        name: endpoint.name,
        url: endpoint.url,
        tags: endpoint.tags,
        isEdge: endpoint.isEdge,
        connectionMode: endpoint.connectionMode,
      });
      setTestResult(null);
    }
  }, [endpoint]);

  if (!isOpen || !endpoint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await updateEndpointAction(formData);

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || '엔드포인트 수정에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const result = await testEndpointConnectionAction(endpoint.id);
      if (result.success) {
        setTestResult({
          connected: result.connected || false,
          version: result.version,
          message: result.connected ? '연결 성공' : '연결 실패',
        });
      } else {
        setTestResult({
          connected: false,
          message: result.error || '연결 테스트 실패',
        });
      }
    } catch (err: any) {
      setTestResult({
        connected: false,
        message: err.message || '연결 테스트 중 오류 발생',
      });
    } finally {
      setTesting(false);
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
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {endpoint.type === 'Kubernetes' ? (
              <SiKubernetes className="text-2xl text-blue-500" />
            ) : (
              <SiDocker className="text-2xl text-blue-400" />
            )}
            <h2 className="text-lg font-semibold">엔드포인트 수정</h2>
          </div>
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

          {/* 상태 정보 */}
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  endpoint.status === 'Online' ? "bg-emerald-500" :
                  endpoint.status === 'Warning' ? "bg-amber-500" : "bg-slate-500"
                )} />
                <span className="text-sm text-slate-400">
                  {endpoint.status === 'Online' ? '온라인' :
                   endpoint.status === 'Warning' ? '경고' : '오프라인'}
                </span>
              </div>
              <div className="text-sm text-slate-500">
                {endpoint.type} · v{endpoint.version}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
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

          {/* 태그 */}
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

          {/* 연결 테스트 */}
          <div className="space-y-2">
            <Label>연결 테스트</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex-1"
              >
                {testing ? (
                  <>
                    <FiLoader className="mr-2 animate-spin" />
                    테스트 중...
                  </>
                ) : (
                  '연결 테스트'
                )}
              </Button>
              {testResult && (
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  testResult.connected
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                )}>
                  {testResult.connected ? <FiCheckCircle /> : <FiXCircle />}
                  <span>{testResult.message}</span>
                  {testResult.version && <span className="text-slate-400">v{testResult.version}</span>}
                </div>
              )}
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
