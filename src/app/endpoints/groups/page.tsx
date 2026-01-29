import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiLayers, FiPlus, FiMoreHorizontal, FiTag } from 'react-icons/fi';

export default function EndpointGroupsPage() {
  const groups = db.getEndpointGroups();
  const endpoints = db.getEndpoints();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">엔드포인트 그룹</h1>
                <p className="text-slate-400">엔드포인트를 논리적 그룹으로 묶어 관리하고 정책을 적용합니다.</p>
            </div>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <FiPlus /> 그룹 생성
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map(group => {
                const groupEndpoints = endpoints.filter(e => e.groupId === group.id);
                
                return (
                    <Card key={group.id} className="hover:border-slate-600 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{group.name}</CardTitle>
                                    <CardDescription className="mt-1">{group.description}</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm"><FiMoreHorizontal /></Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {group.tags.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700 flex items-center gap-1">
                                        <FiTag size={10} /> {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <div className="bg-slate-900 rounded-lg p-3">
                                <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                                    할당된 엔드포인트 ({groupEndpoints.length})
                                </div>
                                {groupEndpoints.length > 0 ? (
                                    <ul className="space-y-2">
                                        {groupEndpoints.map(ep => (
                                            <li key={ep.id} className="text-sm text-slate-300 flex items-center justify-between">
                                                <span>{ep.name}</span>
                                                <div className={`w-2 h-2 rounded-full ${ep.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-xs text-slate-600 italic">할당된 엔드포인트가 없습니다.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
            
            {/* Add Group Placeholder Card */}
            <button className="border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center p-8 hover:bg-slate-900/50 hover:border-slate-700 transition-all text-slate-500 hover:text-slate-300">
                <FiPlus size={32} className="mb-2" />
                <span className="font-medium">새 그룹 만들기</span>
            </button>
        </div>
      </div>
    </MainLayout>
  );
}
