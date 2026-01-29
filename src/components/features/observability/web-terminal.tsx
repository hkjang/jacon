"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export function WebTerminal() {
  const [history, setHistory] = useState<string[]>(['Jacon 원격 셸 v1.0에 오신 것을 환영합니다', '사용 가능한 명령어를 보려면 "help"를 입력하세요.']);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [history]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    
    let output = '';
    
    switch(command) {
        case 'help':
            output = '사용 가능한 명령어: help, ls, ps, whoami, top, clear, exit';
            break;
        case 'ls':
            output = 'index.js  package.json  node_modules/  src/  public/';
            break;
        case 'ps':
             output = 'PID TTY          TIME CMD\n    1 ?        00:00:01 node\n   23 ?        00:00:00 sh';
             break;
        case 'whoami':
            output = 'root';
            break;
        case 'top':
            output = 'Mem: 24652K used, 143324K free, 0K shrd, 0K buff, 13436K cached\nCPU:   0% usr   0% sys   0% nic 100% idle   0% io   0% irq   0% sirq';
            break;
        case 'clear':
            setHistory(['콘솔이 지워졌습니다.']);
            return;
        case 'exit':
             output = '세션이 종료되었습니다.';
             break;
        case '':
            break;
        default:
            output = `bash: ${command}: 명령어를 찾을 수 없음`;
    }

    setHistory(prev => [...prev, `$ ${cmd}`, ...(output ? output.split('\n') : [])]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleCommand(input);
        setInput('');
    }
  };

  return (
    <Card className="h-[500px] bg-black border-slate-800 text-green-500 font-mono text-sm p-4 overflow-hidden flex flex-col font-bold" onClick={() => inputRef.current?.focus()}>
        <div className="flex-1 overflow-auto space-y-1">
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap break-all">{line}</div>
            ))}
            <div ref={bottomRef} />
        </div>
        <div className="flex items-center gap-2 mt-2">
            <span className="text-blue-500">$</span>
            <input 
                ref={inputRef}
                className="bg-transparent border-none outline-none flex-1 text-green-500 placeholder-green-900/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete="off"
            />
        </div>
    </Card>
  );
}
