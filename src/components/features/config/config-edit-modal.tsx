"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiX, FiPlus, FiTrash2, FiFileText, FiLock, FiDownload, FiCopy } from 'react-icons/fi';
import { updateConfigAction, exportConfigAction, addConfigKeyAction, deleteConfigKeyAction } from '@/lib/actions/config-actions';
import { ConfigItem } from '@/lib/mock-config';
import { cn } from '@/lib/utils';

interface ConfigEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigItem | null;
  onSuccess?: () => void;
}

export function ConfigEditModal({ isOpen, onClose, config, onSuccess }: ConfigEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<Array<{ key: string; value: string; isNew?: boolean }>>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (config) {
      const data = config.data || {};
      setEntries(
        Object.entries(data).map(([key, value]) => ({
          key,
          value: config.type === 'Secret' ? atob(value) : value,
        }))
      );
    }
  }, [config]);

  if (!isOpen || !config) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const data: Record<string, string> = {};
      entries.forEach(({ key, value }) => {
        if (key.trim()) {
          data[key.trim()] = value;
        }
      });

      const result = await updateConfigAction({
        id: config.id,
        data,
      });

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || '구성 요소 수정에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async () => {
    if (!newKey.trim()) return;

    setLoading(true);
    try {
      const result = await addConfigKeyAction(config.id, newKey.trim(), newValue);
      if (result.success) {
        setEntries([...entries, { key: newKey.trim(), value: newValue, isNew: true }]);
        setNewKey('');
        setNewValue('');
        setShowAddForm(false);
        onSuccess?.();
      } else {
        setError(result.error || '키 추가에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (key: string) => {
    if (!confirm(`'${key}' 키를 삭제하시겠습니까?`)) return;

    setLoading(true);
    try {
      const result = await deleteConfigKeyAction(config.id, key);
      if (result.success) {
        setEntries(entries.filter(e => e.key !== key));
        onSuccess?.();
      } else {
        setError(result.error || '키 삭제에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'yaml' | 'json') => {
    const result = await exportConfigAction(config.id, format);
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.name}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyToClipboard = async () => {
    const result = await exportConfigAction(config.id, 'yaml');
    if (result.success && result.data) {
      await navigator.clipboard.writeText(result.data);
      alert('클립보드에 복사되었습니다.');
    }
  };

  const updateEntry = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {config.type === 'Secret' ? (
              <FiLock className="text-xl text-amber-500" />
            ) : (
              <FiFileText className="text-xl text-blue-500" />
            )}
            <div>
              <h2 className="text-lg font-semibold">{config.name}</h2>
              <p className="text-xs text-slate-400">
                {config.type} · {config.namespace} · {config.keys.length}개 항목
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyToClipboard} title="YAML 복사">
              <FiCopy />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleExport('yaml')} title="YAML 다운로드">
              <FiDownload />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <FiX />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* 데이터 항목 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>데이터 항목</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                <FiPlus className="mr-1" /> 항목 추가
              </Button>
            </div>

            {/* 새 항목 추가 폼 */}
            {showAddForm && (
              <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="키"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="값"
                    type={config.type === 'Secret' ? 'password' : 'text'}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={handleAddKey} disabled={loading || !newKey.trim()}>
                    추가
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                    취소
                  </Button>
                </div>
              </div>
            )}

            {/* 기존 항목 */}
            <div className="space-y-2">
              {entries.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  데이터가 없습니다.
                </div>
              ) : (
                entries.map((entry, index) => (
                  <div
                    key={entry.key}
                    className={cn(
                      "flex gap-2 p-2 rounded-lg",
                      entry.isNew ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-800/30"
                    )}
                  >
                    <div className="w-1/4 min-w-0">
                      <div className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm font-mono truncate">
                        {entry.key}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {config.type === 'Secret' ? (
                        <Input
                          type="password"
                          value={entry.value}
                          onChange={(e) => updateEntry(index, 'value', e.target.value)}
                        />
                      ) : (
                        <textarea
                          value={entry.value}
                          onChange={(e) => updateEntry(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y min-h-[38px]"
                          rows={entry.value.split('\n').length}
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteKey(entry.key)}
                      className="text-red-400 hover:text-red-300"
                      disabled={loading}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              닫기
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? '저장 중...' : '변경사항 저장'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
