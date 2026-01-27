export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface Role {
  id: string;
  name: string;
  type: 'ClusterRole' | 'Role';
  description: string;
  permissions: Permission[];
}

export const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: 'cluster-admin',
    type: 'ClusterRole',
    description: 'Allows super-user access to perform any action on any resource.',
    permissions: [
      { resource: '*', actions: ['create', 'read', 'update', 'delete'] }
    ]
  },
  {
    id: '2',
    name: 'view',
    type: 'ClusterRole',
    description: 'Allows read-only access to see most objects in a namespace.',
    permissions: [
      { resource: '*', actions: ['read'] }
    ]
  },
  {
    id: '3',
    name: 'developer',
    type: 'Role',
    description: 'Can manage deployments and services in specific namespaces.',
    permissions: [
      { resource: 'deployments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'services', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'pods', actions: ['read', 'delete'] }
    ]
  }
];
