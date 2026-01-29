"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX, FiPlus, FiTrash2, FiPlay, FiSquare, FiRefreshCw } from 'react-icons/fi';
import { SiDocker, SiKubernetes } from 'react-icons/si';
import { updateStackAction, deployStackAction, stopStackAction, restartStackAction, updateStackEnvVarsAction } from '@/lib/actions/stack-actions';
import { Stack } from '@/lib/db';
import { cn } from '@/lib/utils';

interface StackEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  stack: Stack | null;
  onSuccess?: () => void;
}

export function StackEditModal({ isOpen, onClose, stack, onSuccess }: StackEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'env' | 'yaml'>('config');
  const [content, setContent] = useState('');
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>([]);

  useEffect(() => {
    if (stack) {
      setContent(stack.content);
      setEnvVars(
        Object.entries(stack.envVars || {}).map(([key, value]) => ({ key, value }))
      );
    }
  }, [stack]);

  if (!isOpen || !stack) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const envVarsObj = envVars.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const result = await updateStackAction({
        id: stack.id,
        content,
        envVars: envVarsObj,
      });

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || '스택 수정에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    setLoading(true);
    try {
      await deployStackAction(stack.id);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!confirm('스택을 중지하시겠습니까?')) return;
    setLoading(true);
    try {
      await stopStackAction(stack.id);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    setLoading(true);
    try {
      await restartStackAction(stack.id);
      onSuccess?.();
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
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {stack.type === 'compose' ? (
              <SiDocker className="text-2xl text-blue-400" />
            ) : (
              <SiKubernetes className="text-2xl text-blue-500" />
            )}
            <div>
              <h2 className="text-lg font-semibold">{stack.name}</h2>
              <p className="text-xs text-slate-400">
                {stack.type === 'compose' ? 'Docker Compose' : 'Kubernetes'} ·
                <span className={cn(
                  "ml-1",
                  stack.status === 'active' ? "text-emerald-400" :
                  stack.status === 'deploying' ? "text-amber-400" : "text-slate-500"
                )}>
                  {stack.status === 'active' ? '실행 중' :
                   stack.status === 'deploying' ? '배포 중' : '중지됨'}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stack.status === 'active' ? (
              <>
                <Button variant="outline" size="sm" onClick={handleRestart} disabled={loading}>
                  <FiRefreshCw className={cn("mr-1", loading && "animate-spin")} /> 재시작
                </Button>
                <Button variant="outline" size="sm" onClick={handleStop} disabled={loading} className="text-red-400">
                  <FiSquare className="mr-1" /> 중지
                </Button>
              </>
            ) : stack.status === 'inactive' ? (
              <Button size="sm" onClick={handleDeploy} disabled={loading}>
                <FiPlay className="mr-1" /> 배포
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <FiX />
            </Button>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-slate-700">
          {(['config', 'env', 'yaml'] as const).map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              )}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'config' ? '설정' : tab === 'env' ? '환경변수' : 'YAML'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-medium mb-3">스택 정보</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">ID:</span>
                    <span className="ml-2 font-mono">{stack.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">유형:</span>
                    <span className="ml-2">{stack.type === 'compose' ? 'Docker Compose' : 'Kubernetes'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">생성일:</span>
                    <span className="ml-2">{new Date(stack.createdAt).toLocaleString('ko-KR')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">수정일:</span>
                    <span className="ml-2">{new Date(stack.updatedAt).toLocaleString('ko-KR')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>환경변수</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addEnvVar}>
                  <FiPlus className="mr-1" /> 추가
                </Button>
              </div>
              <div className="space-y-2">
                {envVars.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                    환경변수가 없습니다.
                  </div>
                ) : (
                  envVars.map((env, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="KEY"
                        value={env.key}
                        onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                        className="w-1/3 font-mono"
                      />
                      <Input
                        placeholder="VALUE"
                        value={env.value}
                        onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                        className="flex-1 font-mono"
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
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'yaml' && (
            <div className="space-y-2">
              <Label>{stack.type === 'compose' ? 'docker-compose.yml' : 'manifest.yaml'}</Label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[400px] px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-slate-700">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            닫기
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? '저장 중...' : '변경사항 저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
