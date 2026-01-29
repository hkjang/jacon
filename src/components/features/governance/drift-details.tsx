"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DiffViewer } from '@/components/ui/diff-viewer';
import { DriftItem } from '@/lib/mock-drift';
import { FiRefreshCw, FiGitMerge, FiAlertCircle } from 'react-icons/fi';

interface DriftDetailsProps {
  item: DriftItem;
  onSync: () => void;
}

export function DriftDetails({ item, onSync }: DriftDetailsProps) {
  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2 text-amber-500">
           <FiAlertCircle />
           <CardTitle className="text-base">드리프트 감지됨: {item.resourceKind} / {item.resourceName}</CardTitle>
        </div>
        <div className="flex gap-2">
           <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
              무시
           </Button>
           <Button size="sm" onClick={onSync}>
              <FiGitMerge className="mr-2" /> 상태 조정 (동기화)
           </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
            <div>선언된 상태 (Git/템플릿)</div>
            <div>실제 상태 (라이브 클러스터)</div>
         </div>
         
         <DiffViewer 
            oldValue={item.declaredState} 
            newValue={item.actualState} 
         />

         <div className="text-xs text-slate-400 text-center">
            감지 시간: {new Date(item.detectedAt).toLocaleString()}
         </div>
      </CardContent>
    </Card>
  );
}
