"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProject } from '@/hooks/use-project-context';
import { MOCK_ENDPOINTS } from '@/lib/mock-endpoints';
import { FiPlay, FiCheckCircle, FiAlertTriangle, FiUpload, FiServer } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function DeployPage() {
  const router = useRouter();
  const { currentProject } = useProject();
  const [selectedEndpointId, setSelectedEndpointId] = useState('');
  const [manifest, setManifest] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  const projectEndpoints = MOCK_ENDPOINTS.filter(ep => ep.projectId === currentProject.id && ep.type === 'Kubernetes');

  const handleDeploy = () => {
    if (!selectedEndpointId || !manifest) return;
    
    setIsDeploying(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
        setIsDeploying(false);
        // Simulate success for now
        setResult('success');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-6 h-full">
         <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
               <FiPlay className="text-blue-500" /> Deploy Resources
            </h1>
            <p className="text-slate-400">Apply Kubernetes manifests or Docker Compose files.</p>
         </div>

         <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Sidebar Config */}
            <div className="col-span-1 flex flex-col gap-4">
               <Card>
                  <CardHeader>
                     <CardTitle className="text-sm uppercase text-slate-400">Target Endpoint</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     {projectEndpoints.length === 0 ? (
                        <div className="text-sm text-slate-500">No Kubernetes endpoints in this project.</div>
                     ) : (
                        projectEndpoints.map(ep => (
                           <div 
                              key={ep.id}
                              onClick={() => setSelectedEndpointId(ep.id)}
                              className={`p-3 rounded border cursor-pointer transition-colors ${
                                 selectedEndpointId === ep.id 
                                 ? 'bg-blue-500/10 border-blue-500' 
                                 : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                              }`}
                           >
                              <div className="font-bold text-sm flex items-center gap-2">
                                 <FiServer /> {ep.name}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">{ep.url}</div>
                           </div>
                        ))
                     )}
                  </CardContent>
               </Card>

               <Card className="flex-1">
                  <CardHeader>
                     <CardTitle className="text-sm uppercase text-slate-400">Deployment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-300">Namespace</label>
                         <Input placeholder="default" defaultValue="default" />
                      </div>
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-amber-500 text-xs">
                         <FiAlertTriangle className="inline mr-1" />
                         Policy check enabled. High-risk resources (e.g. Privileged Pods) requiring approval.
                      </div>
                  </CardContent>
               </Card>
            </div>

            {/* Editor Area */}
            <Card className="col-span-2 flex flex-col h-full bg-slate-950 border-slate-800">
               <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div className="text-xs font-mono text-slate-400">manifest.yaml</div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                     <FiUpload className="mr-1" /> Load File
                  </Button>
               </div>
               
               <textarea 
                  className="flex-1 w-full bg-transparent p-4 font-mono text-sm text-slate-200 focus:outline-none resize-none"
                  placeholder="Paste YAML content here..."
                  value={manifest}
                  onChange={(e) => setManifest(e.target.value)}
                  spellCheck={false}
               />

               <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <div>
                     {result === 'success' && (
                        <span className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in">
                           <FiCheckCircle /> Deployment Successful
                        </span>
                     )}
                     {result === 'error' && (
                        <span className="flex items-center gap-2 text-red-500 text-sm font-bold animate-in fade-in">
                           <FiAlertTriangle /> Deployment Failed
                        </span>
                     )}
                  </div>
                  <div className="flex gap-2">
                     <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                     <Button 
                        disabled={!selectedEndpointId || !manifest || isDeploying} 
                        onClick={handleDeploy}
                        className={isDeploying ? 'opacity-70' : ''}
                     >
                        {isDeploying ? 'Deploying...' : 'Deploy Resources'}
                     </Button>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </MainLayout>
  );
}
