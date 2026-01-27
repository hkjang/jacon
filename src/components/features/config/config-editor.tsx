"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_CONFIGS } from '@/lib/mock-config';
import { FiSave, FiCopy, FiEye, FiEyeOff } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export function ConfigEditor({ configId }: { configId: string }) {
  const config = MOCK_CONFIGS.find(c => c.id === configId);
  const [activeKey, setActiveKey] = useState<string>(config?.keys[0] || '');
  const [showSecret, setShowSecret] = useState(false);

  if (!config) {
    return <div className="text-center text-slate-500 mt-10">Configuration not found</div>;
  }

  const content = config.data[activeKey] || '';
  const isSecret = config.type === 'Secret';

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      {/* Sidebar: Keys */}
      <Card className="w-1/4 min-w-[200px]">
        <CardHeader>
          <CardTitle className="text-sm uppercase text-slate-400">Keys</CardTitle>
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
                {showSecret ? 'Hide' : 'Reveal'}
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <FiCopy />
            </Button>
            <Button size="sm">
              <FiSave className="mr-2" /> Save
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
