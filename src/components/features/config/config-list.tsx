"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_CONFIGS } from '@/lib/mock-config';
import { FiFileText, FiLock, FiPlus, FiMoreVertical } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export function ConfigList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConfigs = MOCK_CONFIGS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.namespace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <div className="w-1/3">
           <Input 
             placeholder="구성 요소 검색..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
         <Button>
           <FiPlus className="mr-2" /> 새 구성 생성
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConfigs.map((config) => (
          <Card 
            key={config.id} 
            className="cursor-pointer hover:border-blue-500 transition-colors bg-slate-900 border-slate-800"
            onClick={() => router.push(`/config/${config.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {config.type === 'Secret' ? 
                    <FiLock className="text-amber-500" /> : 
                    <FiFileText className="text-blue-500" />
                  }
                  <h3 className="font-semibold text-lg">{config.name}</h3>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                  <FiMoreVertical />
                </Button>
              </div>
              
              <div className="text-sm text-slate-400 mb-4">
                Namespace: <span className="text-slate-300">{config.namespace}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {config.keys.map(key => (
                  <span key={key} className="px-2 py-1 bg-slate-950 rounded text-xs font-mono text-slate-500 border border-slate-800">
                    {key}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
