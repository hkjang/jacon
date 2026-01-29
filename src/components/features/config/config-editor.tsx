"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_CONFIGS } from '@/lib/mock-config';
import { FiSave, FiCopy, FiEye, FiEyeOff } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export function ConfigEditor({ configId }: { configId: string }) {
  // Safely find config with null checks
  const config = configId ? MOCK_CONFIGS?.find(c => c.id === configId) : undefined;
  const [activeKey, setActiveKey] = useState<string>('');
  const [showSecret, setShowSecret] = useState(false);

  // Set initial active key when config loads
  React.useEffect(() => {
    if (config?.keys?.length) {
      setActiveKey(config.keys[0]);
    }
  }, [config]);

  if (!configId) {
    return <div className="text-center text-red-400 mt-10">구성 ID가 제공되지 않았습니다</div>;
  }

  if (!config) {
    return <div className="text-center text-slate-500 mt-10">구성을 찾을 수 없습니다</div>;
  }

  const content = activeKey && config.data ? (config.data[activeKey] ?? '') : '';
  const isSecret = config.type === 'Secret';

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Sidebar: Keys */}
      <Card className="w-1/4 min-w-[200px]">
        <CardHeader>
          <CardTitle className="text-sm uppercase text-slate-400">키</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {config.keys.map(key => (
              <button
                key={key}
                onClick={() => { setActiveKey(key); setShowSecret(false); }}
                className={cn(
                  "text-left px-4 py-3 text-sm font-mono border-l-2 hover:bg-slate-900 transition-colors",
                  activeKey === key ? "border-blue-500 bg-slate-900 text-blue-400" : "border-transparent text-slate-400"
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor Area */}
      <Card className="flex-1 flex flex-col">
        <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-950 rounded-t-lg">
          <div className="font-mono text-sm text-slate-300">{activeKey}</div>
          <div className="flex gap-2">
            {isSecret && (
              <Button variant="ghost" size="sm" onClick={() => setShowSecret(!showSecret)}>
                {showSecret ? <FiEyeOff className="mr-2" /> : <FiEye className="mr-2" />}
                {showSecret ? '숨기기' : '표시'}
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <FiCopy />
            </Button>
            <Button size="sm">
              <FiSave className="mr-2" /> 저장
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-black p-4 font-mono text-sm text-slate-300 overflow-auto">
          {isSecret && !showSecret ? (
            <div className="text-slate-600 italic select-none">
              • • • • • • • • • • • • • • • •
            </div>
          ) : (
            <pre className="whitespace-pre-wrap">{content}</pre>
          )}
        </div>
      </Card>
    </div>
  );
}
