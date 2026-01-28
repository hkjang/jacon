"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SystemSetting } from '@/lib/mock-admin';
import { db } from '@/lib/db';
import { FiSave, FiAlertTriangle } from 'react-icons/fi';

export default function SystemSettingsPage() {
   const [settings, setSettings] = useState<SystemSetting[]>([]);
   const [hasChanges, setHasChanges] = useState(false);
   const [localUpdates, setLocalUpdates] = useState<Record<string, any>>({});
   // Unused loading state removed for now or should be used with spinner

   // Load settings
   useEffect(() => {
     loadSettings();
   }, []);

   const loadSettings = () => {
       const data = db.getSettings();
       // Deep copy to separate UI state from DB state until save
       setSettings(JSON.parse(JSON.stringify(data)));
       setHasChanges(false);
       setLocalUpdates({});
   };

   const handleToggle = (key: string, currentValue: boolean) => {
       setLocalUpdates(prev => ({ ...prev, [key]: !currentValue }));
       setHasChanges(true);
   };
   
   const handleChange = (key: string, value: any) => {
       setLocalUpdates(prev => ({ ...prev, [key]: value }));
       setHasChanges(true);
   };

   const handleSave = () => {
       Object.entries(localUpdates).forEach(([key, value]) => {
           db.updateSetting(key, value);
       });
       loadSettings(); 
       alert('설정이 저장되었습니다.');
   };

   // Helper to get display value (local update > loaded setting)
   const getValue = (setting: SystemSetting) => {
       return localUpdates.hasOwnProperty(setting.key) ? localUpdates[setting.key] : setting.value;
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
              onClick={handleSave}
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
                       <div key={setting.key} className="flex justify-between items-center">
                           <div className="space-y-0.5">
                               <Label className="text-base text-slate-200">{setting.label}</Label>
                               {setting.description && <p className="text-xs text-slate-500">{setting.description}</p>}
                           </div>
                           
                           {typeof setting.value === 'boolean' ? (
                               <Switch 
                                   checked={getValue(setting) as boolean}
                                   onCheckedChange={(checked) => handleToggle(setting.key, getValue(setting) as boolean)}
                               />
                           ) : (
                               <Input 
                                   className="w-24 bg-slate-950 border-slate-700 h-8" 
                                   type="number"
                                   value={getValue(setting) as string}
                                   onChange={(e) => handleChange(setting.key, parseInt(e.target.value))}
                               />
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
                       <div key={setting.key} className="flex justify-between items-center">
                           <div className="space-y-0.5">
                               <Label className="text-base text-slate-200">{setting.label}</Label>
                               {setting.description && <p className="text-xs text-slate-500">{setting.description}</p>}
                           </div>
                           <Switch 
                               checked={getValue(setting) as boolean}
                               onCheckedChange={() => handleToggle(setting.key, getValue(setting) as boolean)}
                           />
                       </div>
                   ))}
               </CardContent>
           </Card>
       </div>
    </div>
   );
}
