"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { MOCK_ENDPOINTS } from '@/lib/mock-endpoints';
import { db } from '@/lib/db';
import { FiCheckCircle, FiAlertTriangle, FiUpload } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { DiffViewer } from '@/components/ui/diff-viewer';

import { checkPolicy, PolicyResult } from '@/lib/policy-engine';

export default function DeployPage() {
  const router = useRouter();

  const [manifest, setManifest] = useState('');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | 'dry-run' | null>(null);


  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment
    setTimeout(() => {
        // Parse manifest (mock)
        const nameMatch = manifest.match(/name:\s*([a-z0-9-]+)/);
        const name = nameMatch ? nameMatch[1] : `app-${Date.now()}`;
        
        db.addWorkload({
            name: name,
            namespace: 'default',
            type: 'Deployment',
            status: 'Running',
            cluster: 'prod-cluster-1',
            restarts: 0,
            age: '1m',
            image: 'nginx:latest' // Mock default
        });

        db.addAuditLog(
            'Admin',
            'Deploy',
            name,
            'Deployment created successfully via UI'
        );

        setIsDeploying(false);
        setResult('success');
    }, 2000);
  };

  const [policyResult, setPolicyResult] = useState<PolicyResult | null>(null);

  useEffect(() => {
     const runPolicy = async () => {
        if (!manifest) {
            setPolicyResult(null);
            return;
        }
        const result = await checkPolicy(manifest);
        setPolicyResult(result);
     };
     // Debounce check
     const timer = setTimeout(runPolicy, 800);
     return () => clearTimeout(timer);
  }, [manifest]);

  return (
    <MainLayout>
       <div className="flex flex-col h-[calc(100vh-6rem)] p-6 gap-6">
          <div className="flex items-center justify-between">
             <h1 className="text-2xl font-bold">리소스 배포</h1>
          </div>
          
          <div className="grid grid-cols-3 gap-6 h-full">
             <div className="col-span-1 space-y-6">
                <Card>
                   <CardHeader>
                      <CardTitle>구성 설정</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-300">대상 엔드포인트</label>
                         <select 
                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={selectedEndpointId}
                            onChange={(e) => setSelectedEndpointId(e.target.value)}
                         >
                            <option value="" disabled>엔드포인트를 선택하세요...</option>
                            {MOCK_ENDPOINTS.map(ep => (
                               <option key={ep.id} value={ep.id}>{ep.name} ({ep.type}) - {ep.status}</option>
                            ))}
                         </select>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-300">네임스페이스</label>
                         <Input placeholder="default" defaultValue="default" />
                      </div>
                      
                      {/* Policy Status Box */}
                      {policyResult ? (
                          <div className={`p-3 border rounded text-xs ${policyResult.allowed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                              <div className="font-bold flex items-center gap-1 mb-1">
                                  {policyResult.allowed ? <FiCheckCircle /> : <FiAlertTriangle />} 
                                  {policyResult.allowed ? '정책 준수 (Policy Compliant)' : '정책 위반 (Policy Violation)'}
                              </div>
                              <ul className="list-disc list-inside space-y-1 opacity-90">
                                  {policyResult.violations.map((v, i) => <li key={i}>{v}</li>)}
                                  {policyResult.warnings.map((w, i) => <li key={i} className="text-amber-500">{w}</li>)}
                              </ul>
                          </div>
                      ) : (
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded text-slate-500 text-xs text-center">
                             매니페스트를 입력하여 정책을 검사하세요.
                          </div>
                      )}
                  </CardContent>
               </Card>
            </div>

            {/* Editor Area */}
            <Card className="col-span-2 flex flex-col h-full bg-slate-950 border-slate-800">
               <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div className="text-xs font-mono text-slate-400">manifest.yaml</div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                     <FiUpload className="mr-1" /> 파일 불러오기
                  </Button>
               </div>
               
               <textarea 
                  className="flex-1 w-full bg-transparent p-4 font-mono text-sm text-slate-200 focus:outline-none resize-none"
                  placeholder="여기에 YAML 내용을 붙여넣으세요..."
                  value={manifest}
                  onChange={(e) => setManifest(e.target.value)}
                  spellCheck={false}
               />

               <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-4">
                  {/* Diff Viewer Area */}
                  {result === 'dry-run' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2">
                         <div className="text-xs font-bold text-slate-500 uppercase mb-2">사전 검사: 드라이 런 결과</div>
                         <DiffViewer 
                            oldValue={`apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: old-app\n  replicas: 1`}
                            newValue={manifest || '...'}
                         />
                         <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                            <FiCheckCircle className="text-emerald-500" />
                            검증 통과. 고위험 정책 위반이 발견되지 않았습니다.
                         </div>
                      </div>
                  )}

                  <div className="flex justify-between items-center">
                     <div>
                        {result === 'success' && (
                           <span className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in">
                              <FiCheckCircle /> 배포 성공
                           </span>
                        )}
                        {result === 'error' && (
                           <span className="flex items-center gap-2 text-red-500 text-sm font-bold animate-in fade-in">
                              <FiAlertTriangle /> 배포 실패
                           </span>
                        )}
                     </div>
                     <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => router.back()}>취소</Button>
                        <Button 
                           variant="secondary"
                           disabled={!selectedEndpointId || !manifest || isDeploying}
                           onClick={() => setResult('dry-run')}
                           className="bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                           드라이 런 / 변경사항 확인
                        </Button>
                        <Button 
                           disabled={!selectedEndpointId || !manifest || isDeploying} 
                           onClick={handleDeploy}
                           className={isDeploying ? 'opacity-70' : ''}
                        >
                           {isDeploying ? '배포 중...' : '리소스 배포'}
                        </Button>
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </MainLayout>
  );
}
