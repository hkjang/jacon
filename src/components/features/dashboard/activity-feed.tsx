"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_ACTIVITIES } from '@/lib/mock-activity';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiLayers, FiActivity, FiSettings } from 'react-icons/fi';

export function ActivityFeed() {
  const getIcon = (type: string, status: string) => {
    if (status === 'failure') return <FiXCircle className="text-red-500" />;
    if (status === 'warning') return <FiAlertTriangle className="text-amber-500" />;
    
    switch (type) {
      case 'deploy': return <FiLayers className="text-blue-500" />;
      case 'scale': return <FiActivity className="text-emerald-500" />;
      case 'config': return <FiSettings className="text-slate-400" />;
      default: return <FiCheckCircle className="text-emerald-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {MOCK_ACTIVITIES.map((activity, index) => (
            <div key={activity.id} className="relative flex gap-4">
              {/* Connector Line */}
              {index !== MOCK_ACTIVITIES.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-[-24px] w-px bg-slate-800" />
              )}
              
              <div className="relative z-10 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 ring-2 ring-slate-800">
                {getIcon(activity.type, activity.status)}
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none text-slate-200">
                  {activity.message}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
