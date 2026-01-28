"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '@/hooks/use-project-context';
import { FiChevronDown, FiLayers, FiBriefcase, FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Project, Organization } from '@/lib/mock-tenancy';

export function ProjectSwitcher() {
  const { currentOrg, currentProject, setCurrentOrg, setCurrentProject, availableOrgs } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrgSelect = (org: Organization) => {
      setCurrentOrg(org);
      // Project will actomated update via context effect
  };

  const handleProjectSelect = (project: Project) => {
      setCurrentProject(project);
      setIsOpen(false);
  }

  return (
    <div className="relative px-4 mb-4" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
           <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
             <span className="font-bold text-xs">{currentOrg.name.substring(0,2).toUpperCase()}</span>
           </div>
           <div className="flex flex-col items-start min-w-0">
              <span className="text-xs text-slate-400 font-medium truncate w-full text-left">{currentOrg.name}</span>
              <span className="text-sm font-bold text-slate-100 truncate w-full text-left">{currentProject.name}</span>
           </div>
        </div>
        <FiChevronDown className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
           {/* Org Selection */}
           <div className="bg-slate-950 p-2 border-b border-slate-800">
              <p className="text-[10px] uppercase text-slate-500 font-bold px-2 py-1">Organization</p>
              {availableOrgs.map(org => (
                  <button 
                    key={org.id} 
                    onClick={() => handleOrgSelect(org)}
                    className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors",
                        currentOrg.id === org.id ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    )}
                  >
                     <FiBriefcase className="w-3 h-3" />
                     {org.name}
                     {currentOrg.id === org.id && <FiCheck className="ml-auto w-3 h-3" />}
                  </button>
              ))}
           </div>

           {/* Project Selection */}
           <div className="p-2">
              <p className="text-[10px] uppercase text-slate-500 font-bold px-2 py-1">Project</p>
              {currentOrg.projects.map(proj => (
                  <button 
                    key={proj.id} 
                    onClick={() => handleProjectSelect(proj)}
                    className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors",
                        currentProject.id === proj.id ? "bg-emerald-500/10 text-emerald-400" : "text-slate-300 hover:text-white hover:bg-slate-800"
                    )}
                  >
                     <FiLayers className="w-3 h-3" />
                     {proj.name}
                     {currentProject.id === proj.id && <FiCheck className="ml-auto w-3 h-3" />}
                  </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
