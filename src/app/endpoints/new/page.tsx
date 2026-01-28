"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiArrowLeft, FiUploadCloud, FiTerminal } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewEndpointPage() {
  const router = useRouter();
  const [type, setType] = useState<'k8s' | 'docker'>('k8s');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate validation and creation
    setTimeout(() => {
        router.push('/endpoints');
    }, 500);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-4 mb-4">
           <Link href="/endpoints">
              <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                  <FiArrowLeft />
              </Button>
           </Link>
           <div>
              <h1 className="text-2xl font-bold">Register Endpoint</h1>
              <p className="text-slate-400">Add a new cluster or host to this project.</p>
           </div>
        </div>

        <div className="flex gap-4 mb-4">
           <Card 
             className={`flex-1 cursor-pointer transition-all ${type === 'k8s' ? 'border-blue-500 bg-slate-900 ring-1 ring-blue-500' : 'hover:bg-slate-900'}`}
             onClick={() => setType('k8s')}
           >
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
                    <FiUploadCloud />
                 </div>
                 <div className="font-bold">Kubernetes Cluster</div>
                 <p className="text-xs text-slate-400">Import via Kubeconfig file or URL</p>
              </CardContent>
           </Card>
           
           <Card 
             className={`flex-1 cursor-pointer transition-all ${type === 'docker' ? 'border-blue-500 bg-slate-900 ring-1 ring-blue-500' : 'hover:bg-slate-900'}`}
             onClick={() => setType('docker')}
           >
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-blue-400/10 text-blue-400 flex items-center justify-center text-2xl">
                    <FiTerminal />
                 </div>
                 <div className="font-bold">Docker Engine</div>
                 <p className="text-xs text-slate-400">Connect via TCP or SSH</p>
              </CardContent>
           </Card>
        </div>

        <Card>
           <CardHeader>
              <CardTitle>Connection Details</CardTitle>
           </CardHeader>
           <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Display Name</label>
                    <Input placeholder="e.g. Production Cluster US-East" required />
                 </div>
                 
                 {type === 'k8s' ? (
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Kubeconfig (YAML)</label>
                        <textarea 
                           className="w-full h-40 bg-slate-950 border border-slate-800 rounded-md p-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                           placeholder="Paste your kubeconfig here..."
                        />
                     </div>
                 ) : (
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Host URL</label>
                        <Input placeholder="tcp://docker.host:2376" required />
                        <p className="text-xs text-slate-500">Ensure the Docker daemon API is exposed and accessible.</p>
                     </div>
                 )}

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Tags (Comma separated)</label>
                    <Input placeholder="production, aws, east" />
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit">Verify & Register</Button>
                 </div>
              </form>
           </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
