import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiActivity, FiWifi, FiWifiOff, FiMapPin, FiPlus, FiSettings } from 'react-icons/fi';
import Link from 'next/link';

export default function EdgeDashboardPage() {
  const edgeEndpoints = db.getEdgeEndpoints();
  
  // Calculate stats
  const total = edgeEndpoints.length;
  const online = edgeEndpoints.filter(e => e.status === 'Online').length;
  const offline = total - online;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Edge Compute Dashboard</h1>
                <p className="text-slate-400">분산된 에지 디바이스 및 리모트 클러스터 상태를 모니터링합니다.</p>
            </div>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <FiPlus /> New Edge Agent
            </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-500">
                        <FiActivity size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-400">Total Agents</div>
                        <div className="text-2xl font-bold text-white">{total}</div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500">
                        <FiWifi size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-400">Online</div>
                        <div className="text-2xl font-bold text-emerald-500">{online}</div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-4 rounded-full bg-slate-700/30 text-slate-400">
                        <FiWifiOff size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-400">Offline</div>
                        <div className="text-2xl font-bold text-slate-400">{offline}</div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <h2 className="text-lg font-semibold text-slate-200 mt-4">Active Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {edgeEndpoints.map(ep => (
                <Card key={ep.id} className="hover:border-indigo-500/30 transition-all cursor-pointer">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                             <CardTitle className="flex items-center gap-2 text-lg">
                                {ep.name}
                             </CardTitle>
                             {ep.status === 'Online' ? (
                                 <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Connected
                                 </div>
                             ) : (
                                 <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                                    Offline
                                 </div>
                             )}
                        </div>
                        <CardDescription className="flex items-center gap-2">
                             <FiMapPin /> {ep.tags.find(t => !['edge', 'retail'].includes(t)) || 'Unknown Location'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm py-1 border-b border-slate-800">
                                <span className="text-slate-500">Version</span>
                                <span className="text-slate-300 font-mono">{ep.version}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1 border-b border-slate-800">
                                <span className="text-slate-500">Heartbeat</span>
                                <span className="text-slate-300">{ep.lastSeen}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1">
                                <span className="text-slate-500">Latency</span>
                                <span className="text-emerald-400">45ms</span>
                            </div>
                            
                            <div className="pt-2 flex gap-2">
                                <Button size="sm" variant="outline" className="w-full">
                                    Terminal
                                </Button>
                                <Button size="sm" variant="outline" className="w-full">
                                    Logs
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            {/* Placeholder for Map */}
            <Card className="col-span-full bg-slate-900/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <FiMapPin size={32} className="mb-2 opacity-50" />
                    <p>Global Map Visualization requires external library (e.g., Leaflet)</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
