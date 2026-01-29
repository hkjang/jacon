"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX, FiPlus, FiTrash2, FiFileText, FiLock } from 'react-icons/fi';
import { createConfigAction, ConfigCreateInput } from '@/lib/actions/config-actions';
import { cn } from '@/lib/utils';

interface ConfigCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ConfigCreateModal({ isOpen, onClose, onSuccess }: ConfigCreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ConfigCreateInput, 'data'>>({
    name: '',
    namespace: 'default',
    type: 'ConfigMap',
  });
  const [entries, setEntries] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 빈 키 필터링
    const data: Record<string, string> = {};
    entries.forEach(({ key, value }) => {
      if (key.trim()) {
        data[key.trim()] = value;
      }
    });

    if (Object.keys(data).length === 0) {
      setError('최소 하나의 키-값 쌍을 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const result = await createConfigAction({
        ...formData,
        data,
      });

      if (result.success) {
        onSuccess?.();
        onClose();
        setFormData({
          name: '',
          namespace: 'default',
          type: 'ConfigMap',
        });
        setEntries([{ key: '', value: '' }]);
      } else {
        setError(result.error || '구성 요소 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addEntry = () => {
    setEntries([...entries, { key: '', value: '' }]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold">새 구성 요소 생성</h2>
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
            <Label>유형</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  "p-3 rounded-lg border flex items-center gap-3 transition-colors",
                  formData.type === 'ConfigMap'
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-slate-700 bg-slate-800 hover:border-slate-600"
                )}
                onClick={() => setFormData({ ...formData, type: 'ConfigMap' })}
              >
                <FiFileText className="text-xl" />
                <div className="text-left">
                  <div className="font-medium">ConfigMap</div>
                  <div className="text-xs text-slate-400">일반 설정 데이터</div>
                </div>
              </button>
              <button
                type="button"
                className={cn(
                  "p-3 rounded-lg border flex items-center gap-3 transition-colors",
                  formData.type === 'Secret'
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-slate-700 bg-slate-800 hover:border-slate-600"
                )}
                onClick={() => setFormData({ ...formData, type: 'Secret' })}
              >
                <FiLock className="text-xl" />
                <div className="text-left">
                  <div className="font-medium">Secret</div>
                  <div className="text-xs text-slate-400">민감한 데이터 (암호화됨)</div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                placeholder="my-config"
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

          {/* 키-값 쌍 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>데이터 *</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addEntry}>
                <FiPlus className="mr-1" /> 항목 추가
              </Button>
            </div>
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="키"
                    value={entry.key}
                    onChange={(e) => updateEntry(index, 'key', e.target.value)}
                    className="w-1/3"
                  />
                  <div className="flex-1 relative">
                    {formData.type === 'Secret' ? (
                      <Input
                        type="password"
                        placeholder="값 (암호화됨)"
                        value={entry.value}
                        onChange={(e) => updateEntry(index, 'value', e.target.value)}
                      />
                    ) : (
                      <textarea
                        placeholder="값"
                        value={entry.value}
                        onChange={(e) => updateEntry(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[38px] resize-y"
                        rows={1}
                      />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(index)}
                    className="text-red-400 hover:text-red-300"
                    disabled={entries.length === 1}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
            </div>
            {formData.type === 'Secret' && (
              <p className="text-xs text-amber-400/70">
                Secret 값은 Base64로 인코딩되어 저장됩니다.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '생성 중...' : '구성 요소 생성'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
