import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiPlus, FiPackage, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { SiDocker, SiAmazon } from 'react-icons/si';

export default function RegistriesPage() {
  const registries = db.getRegistries();

  const getIcon = (type: string) => {
      switch(type) {
          case 'dockerhub': return <SiDocker className="text-blue-500 font-bold" size={24} />;
          case 'ecr': return <SiAmazon className="text-orange-500" size={24} />;
          default: return <FiPackage className="text-slate-400" size={24} />;
      }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">컨테이너 레지스트리</h1>
                <p className="text-slate-400">Private 이미지를 가져오기 위한 레지스트리 자격 증명을 관리합니다.</p>
            </div>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <FiPlus /> 레지스트리 추가
            </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {registries.map(reg => (
                <Card key={reg.id} className="hover:border-slate-600 transition-colors">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-900 rounded-lg">
                                {getIcon(reg.type)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">{reg.name}</h3>
                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                    <span className="font-mono bg-slate-900 px-1 rounded">{reg.url}</span>
                                    {reg.username && <span>• 사용자: {reg.username}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="text-xs text-slate-500 mr-4">
                                {reg.associatedEndpoints.length}개 엔드포인트에서 사용 중
                             </div>
                             <Button variant="ghost" size="sm"><FiExternalLink /></Button>
                             <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-400"><FiTrash2 /></Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {registries.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <p>등록된 레지스트리가 없습니다.</p>
                </div>
            )}
        </div>
      </div>
    </MainLayout>
  );
}
