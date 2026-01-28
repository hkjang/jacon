"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiTrash2, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface ProtectedActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  resourceName: string;
  actionType: 'delete' | 'restart' | 'scale';
  impactLevel?: 'high' | 'medium' | 'low';
}

export function ProtectedActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  resourceName,
  actionType,
  impactLevel = 'high'
}: ProtectedActionModalProps) {
  const [confirmInput, setConfirmInput] = useState('');
  const [impactAnalysis, setImpactAnalysis] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const getMockImpact = (type: string, _name: string) => {
    if (type === 'delete') {
       return [
         `Dependent Service 'api-gateway' will lose connectivity`,
         `3 active persistent volumes will be detached`,
         `Audit log will mark this as a CRITICAL event`
       ];
    }
    return [
       `Service unavailable for approx 30-60 seconds`,
       `Active connections (45) will be dropped`
    ];
  };

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {
          setConfirmInput('');
          setAnalyzing(true);
      }, 0);
      
      // Simulate checking impact
      const timer = setTimeout(() => {
        setImpactAnalysis(getMockImpact(actionType, resourceName));
        setAnalyzing(false);
      }, 800);
      
      return () => {
          clearTimeout(t);
          clearTimeout(timer);
      };
    }
  }, [isOpen, actionType, resourceName]);

  if (!isOpen) return null;

  const isConfirmed = confirmInput === resourceName;
  


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start gap-4">
           <div className={cn(
               "p-3 rounded-full flex items-center justify-center shrink-0",
               actionType === 'delete' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
           )}>
              {actionType === 'delete' ? <FiTrash2 size={24} /> : <FiRefreshCw size={24} />}
           </div>
           <div>
              <h2 className="text-xl font-bold text-slate-100">{title}</h2>
              <p className="text-sm text-slate-400 mt-1">{description}</p>
           </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
           
           {/* Impact Analysis */}
           <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                 <FiAlertCircle /> Impact Analysis
              </h4>
              <div className="space-y-2">
                 {analyzing ? (
                    <div className="text-sm text-slate-500 italic">Analyzing dependencies...</div>
                 ) : (
                    impactAnalysis.map((item, i) => (
                       <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-slate-600 mt-1">•</span>
                          {item}
                       </div>
                    ))
                 )}
              </div>
           </div>

           {/* Confirmation Input */}
           <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300 block">
                 Type <strong>{resourceName}</strong> to confirm:
              </label>
              <Input 
                 value={confirmInput}
                 onChange={(e) => setConfirmInput(e.target.value)}
                 className={cn(
                    "bg-slate-900 border-slate-700 font-mono",
                    isConfirmed ? "border-emerald-500 ring-1 ring-emerald-500" : ""
                 )}
                 placeholder={resourceName}
                 autoFocus
              />
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-3 rounded-b-lg">
           <Button variant="ghost" onClick={onClose} className="hover:bg-slate-800">
              Cancel
           </Button>
           <Button 
              variant={actionType === 'delete' ? 'danger' : 'primary'} // Assuming destructive variant exists or fallback
              className={cn(
                 actionType === 'delete' ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700",
                 !isConfirmed && "opacity-50 cursor-not-allowed"
              )}
              disabled={!isConfirmed}
              onClick={onConfirm}
           >
              {actionType === 'delete' ? 'Delete Resource' : 'Execute Action'}
           </Button>
        </div>
      </div>
    </div>
  );
}
