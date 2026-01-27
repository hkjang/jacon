"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export function Terminal({ containerName }: { containerName: string }) {
  const [history, setHistory] = useState<string[]>([
    `Welcome to Jacon Web Terminal`,
    `Connected to container: ${containerName}`,
    `Type 'help' for available commands.`,
    ''
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newHistory = [...history, `$ ${cmd}`];
      
      if (cmd === 'clear') {
        setHistory([]);
      } else if (cmd === 'ls') {
        setHistory([...newHistory, 'bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var']);
      } else if (cmd === 'help') {
        setHistory([...newHistory, 'Available commands: ls, clear, help, exit']);
      } else if (cmd) {
        setHistory([...newHistory, `sh: command not found: ${cmd}`]);
      } else {
        setHistory(newHistory);
      }
      
      setInput('');
      if (cmd === 'clear') setInput('');
    }
  };

  return (
    <Card className="h-[500px] bg-black border-slate-800 font-mono text-sm p-4 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {history.map((line, i) => (
          <div key={i} className="text-green-500 min-h-[1.2em]">{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-green-500 font-bold">$</span>
        <input 
          autoFocus
          className="bg-transparent border-none outline-none text-slate-200 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </Card>
  );
}
