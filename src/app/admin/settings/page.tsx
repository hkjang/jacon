"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_SYSTEM_SETTINGS } from '@/lib/mock-admin';
import { FiSave, FiAlertTriangle } from 'react-icons/fi';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState(MOCK_SYSTEM_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: string) => {
     setSettings(settings.map(s => {
         if (s.key === key && typeof s.value === 'boolean') {
             return { ...s, value: !s.value };
         }
         return s;
     }));
     setHasChanges(true);
  };

  return (
    <div className="space-y-6 max-w-4xl">
       <div className="flex justify-between items-center">
           <div>
               <h1 className="text-2xl font-bold text-white">시스템 설정</h1>
               <p className="text-slate-400 text-sm">전역 구성 및 보안 정책을 관리합니다.</p>
           </div>
           <Button 
              disabled={!hasChanges} 
              className={hasChanges ? "bg-indigo-600 hover:bg-indigo-700" : ""}
           >
               <FiSave className="mr-2" /> 변경사항 저장
           </Button>
       </div>

       <div className="grid gap-6">
           {/* Security Settings */}
           <Card className="bg-slate-900 border-slate-800">
               <CardHeader>
                   <CardTitle>보안 정책</CardTitle>
                   <CardDescription>인증 및 접근 제어 설정</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                   {settings.filter(s => s.category === 'Security').map(setting => (
                       <div key={setting.key} className="flex items-center justify-between py-2">
                           <div>
                               <div className="font-medium text-slate-200">{setting.label}</div>
                               <div className="text-xs text-slate-500">Key: {setting.key}</div>
                           </div>
                           
                           {typeof setting.value === 'boolean' ? (
                               <button 
                                  onClick={() => handleToggle(setting.key)}
                                  className={`w-12 h-6 rounded-full transition-colors relative ${setting.value ? 'bg-indigo-600' : 'bg-slate-700'}`}
                               >
                                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${setting.value ? 'left-7' : 'left-1'}`}></div>
                               </button>
                           ) : (
                               <div className="bg-slate-950 px-3 py-1 rounded border border-slate-800 text-slate-300">
                                   {setting.value}
                               </div>
                           )}
                       </div>
                   ))}
               </CardContent>
           </Card>

           {/* System Controls */}
           <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-red-500">
               <CardHeader>
                   <CardTitle className="text-red-500 flex items-center gap-2">
                       <FiAlertTriangle /> 중요 시스템 제어
                   </CardTitle>
                   <CardDescription>이 설정은 전체 플랫폼의 가용성에 영향을 미칩니다.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                   {settings.filter(s => s.category === 'System').map(setting => (
                       <div key={setting.key} className="flex items-center justify-between py-2">
                           <div>
                               <div className="font-medium text-slate-200">{setting.label}</div>
                               <div className="text-xs text-slate-500">Key: {setting.key}</div>
                           </div>
                           
                           {typeof setting.value === 'boolean' ? (
                               <button 
                                  onClick={() => handleToggle(setting.key)}
                                  className={`w-12 h-6 rounded-full transition-colors relative ${setting.value ? 'bg-red-600' : 'bg-slate-700'}`}
                               >
                                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${setting.value ? 'left-7' : 'left-1'}`}></div>
                               </button>
                           ) : null}
                       </div>
                   ))}
               </CardContent>
           </Card>
       </div>
    </div>
  );
}
