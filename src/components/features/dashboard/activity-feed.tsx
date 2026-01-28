"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiLayers, FiActivity, FiSettings } from 'react-icons/fi';


export function ActivityFeed() {
  const [logs, setLogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Poll for new activity
    const updateLogs = () => {
        setLogs(db.getAuditLogs().slice(0, 5)); // Get latest 5
    };
    updateLogs();
    const interval = setInterval(updateLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (action: string, severity: string) => {
    if (severity === 'Critical') return <FiXCircle className="text-red-500" />;
    if (severity === 'High') return <FiAlertTriangle className="text-amber-500" />;
    
    if (action.includes('Deploy')) return <FiLayers className="text-blue-500" />;
    if (action.includes('Scale')) return <FiActivity className="text-emerald-500" />;
    if (action.includes('Setting')) return <FiSettings className="text-slate-400" />;
    return <FiCheckCircle className="text-emerald-500" />;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {logs.map((log, index) => (
            <div key={log.id} className="relative flex gap-4">
              {/* Connector Line */}
              {index !== logs.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-[-24px] w-px bg-slate-800" />
              )}
              
              <div className="relative z-10 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 ring-2 ring-slate-800">
                {getIcon(log.action, log.severity)}
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none text-slate-200">
                  {log.action}: {log.resource}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{log.user}</span>
                  <span>•</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{log.details}</p>
              </div>
            </div>
          ))}
          {logs.length === 0 && <div className="text-center text-slate-500 text-sm">최근 활동이 없습니다.</div>}
        </div>
      </CardContent>
    </Card>
  );
}

