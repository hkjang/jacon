"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { db, Policy } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiShield, FiPlus, FiCode, FiSave, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { Input } from '@/components/ui/input';

export default function PolicyPage() {
  const [policies, setPolicies] = useState(db.getPolicies());
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [editorContent, setEditorContent] = useState('');

  const handleSelectPolicy = (policy: Policy) => {
      setSelectedPolicy(policy);
      setEditorContent(policy.regoContent);
  };

  const handleCreatePolicy = () => {
       const newOne: Policy = {
           id: 'temp',
           name: 'New Policy',
           description: 'Description here',
           regoContent: 'package main\n\ndeny[msg] {\n  msg := "violation"\n}',
           enforcementLevel: 'advisory',
           target: 'kubernetes',
           status: 'active'
       };
       setSelectedPolicy(newOne);
       setEditorContent(newOne.regoContent);
  };

  const handleSave = () => {
      // Logic would go here to server action
      alert('Policy Saved (Simulation)');
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Policy as Code (OPA)</h1>
                <p className="text-slate-400">Open Policy Agent를 사용하여 인프라 및 워크로드 규정을 준수합니다.</p>
            </div>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={handleCreatePolicy}>
                <FiPlus /> New Policy
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* List */}
            <div className="space-y-4 overflow-auto pr-2">
                {policies.map(pol => (
                    <Card 
                        key={pol.id} 
                        className={`cursor-pointer transition-all hover:border-indigo-500/50 ${selectedPolicy?.id === pol.id ? 'border-indigo-500 bg-indigo-500/5' : ''}`}
                        onClick={() => handleSelectPolicy(pol)}
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-200">{pol.name}</h3>
                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${
                                    pol.enforcementLevel === 'mandatory' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>
                                    {pol.enforcementLevel}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{pol.description}</p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                                <FiCode /> {pol.target}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Editor */}
            <div className="lg:col-span-2 flex flex-col h-full">
                {selectedPolicy ? (
                    <Card className="flex-1 flex flex-col h-full border-slate-700 bg-[#1e1e1e]">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                            <div className="flex-1 mr-4">
                                <Input 
                                    value={selectedPolicy.name} 
                                    className="bg-transparent border-none text-lg font-bold p-0 focus-visible:ring-0 h-auto" 
                                    onChange={(e) => setSelectedPolicy({...selectedPolicy, name: e.target.value})}
                                />
                                <Input 
                                    value={selectedPolicy.description} 
                                    className="bg-transparent border-none text-sm text-slate-400 p-0 focus-visible:ring-0 h-auto mt-1" 
                                    onChange={(e) => setSelectedPolicy({...selectedPolicy, description: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <FiCheckCircle /> Test
                                </Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={handleSave}>
                                    <FiSave /> Save
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <textarea 
                                className="w-full h-full bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none"
                                value={editorContent}
                                onChange={(e) => setEditorContent(e.target.value)}
                                spellCheck={false}
                            />
                             <div className="absolute bottom-4 right-4 text-xs text-slate-500 pointer-events-none">
                                OPA Rego Language
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="flex-1 flex items-center justify-center text-slate-500 border-dashed bg-slate-900/50">
                        <div className="text-center">
                            <FiShield size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Select a policy to edit or create a new one.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
