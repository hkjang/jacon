"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_ENDPOINTS } from '@/lib/mock-endpoints';
import { FiPlus, FiServer, FiActivity, FiTag, FiMoreVertical } from 'react-icons/fi';
import { SiKubernetes, SiDocker } from 'react-icons/si';
import { cn } from '@/lib/utils';
import { useProject } from '@/hooks/use-project-context';
import { useRouter } from 'next/navigation';

export function EndpointList() {
  const router = useRouter();
  const { currentProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEndpoints = MOCK_ENDPOINTS.filter(ep => 
    (ep.projectId === currentProject.id) &&
    (ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     ep.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <div className="w-1/3">
           <Input 
             placeholder="Search endpoints (name, tags)..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
         <Button onClick={() => router.push('/endpoints/new')}>
           <FiPlus className="mr-2" /> Register Endpoint
         </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEndpoints.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                <FiServer className="mx-auto h-10 w-10 mb-3 opacity-50" />
                <p>No endpoints found in project <strong>{currentProject.name}</strong>.</p>
                <Button variant="link" className="text-blue-500" onClick={() => router.push('/endpoints/new')}>Register your first endpoint</Button>
            </div>
        ) : (
            filteredEndpoints.map((ep) => (
              <Card key={ep.id} className="hover:bg-slate-900 transition-colors bg-slate-950 border-slate-800">
                <CardContent className="p-4 flex items-center gap-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-2xl">
                     {ep.type === 'Kubernetes' ? <SiKubernetes className="text-blue-500" /> : <SiDocker className="text-blue-400" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-slate-200">{ep.name}</h3>
                        <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                            ep.status === 'Online' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                            ep.status === 'Warning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            "bg-slate-800 text-slate-500 border-slate-700"
                        )}>
                            {ep.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><FiActivity className="w-3 h-3" /> {ep.version}</span>
                        <span className="flex items-center gap-1"><FiServer className="w-3 h-3" /> {ep.url}</span>
                     </div>
                  </div>

                  {/* Tags */}
                  <div className="hidden md:flex gap-2">
                     {ep.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-slate-900 rounded text-xs text-slate-400 border border-slate-800">
                           <FiTag className="w-3 h-3" /> {tag}
                        </span>
                     ))}
                  </div>

                  {/* Actions */}
                  <Button variant="ghost" size="sm">
                     <FiMoreVertical />
                  </Button>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
