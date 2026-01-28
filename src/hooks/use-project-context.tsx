"use client";

import React, { createContext, useContext, useState } from 'react';
import { MOCK_ORGS, Organization, Project } from '@/lib/mock-tenancy';

interface ProjectContextType {
  currentOrg: Organization;
  currentProject: Project;
  setCurrentOrg: (org: Organization) => void;
  setCurrentProject: (project: Project) => void;
  availableOrgs: Organization[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentOrg, _setCurrentOrg] = useState<Organization>(MOCK_ORGS[0]);
  const [currentProject, setCurrentProject] = useState<Project>(MOCK_ORGS[0].projects[0]);

  const setCurrentOrg = (org: Organization) => {
    _setCurrentOrg(org);
    // Auto-select first project of the new org
    if (org.projects.length > 0) {
        setCurrentProject(org.projects[0]);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
        currentOrg, 
        currentProject, 
        setCurrentOrg, 
        setCurrentProject,
        availableOrgs: MOCK_ORGS
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
