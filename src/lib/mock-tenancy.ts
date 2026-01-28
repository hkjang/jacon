export interface Project {
  id: string;
  name: string;
  orgId: string;
}

export interface Organization {
  id: string;
  name: string;
  projects: Project[];
}

export const MOCK_ORGS: Organization[] = [
  {
    id: 'org-1',
    name: 'Acme Corp',
    projects: [
      { id: 'proj-1', name: 'Production', orgId: 'org-1' },
      { id: 'proj-2', name: 'Staging', orgId: 'org-1' },
      { id: 'proj-3', name: 'Dev-Team-A', orgId: 'org-1' },
    ]
  },
  {
    id: 'org-2',
    name: 'StartUp Inc',
    projects: [
      { id: 'proj-4', name: 'MVP', orgId: 'org-2' },
    ]
  }
];
