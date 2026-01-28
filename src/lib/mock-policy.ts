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
    description: '모든 리소스에 대해 모든 작업을 수행할 수 있는 슈퍼유저 권한을 허용합니다.',
    permissions: [
      { resource: '*', actions: ['create', 'read', 'update', 'delete'] }
    ]
  },
  {
    id: '2',
    name: 'view',
    type: 'ClusterRole',
    description: '대부분의 네임스페이스 객체를 볼 수 있는 읽기 전용 권한을 허용합니다.',
    permissions: [
      { resource: '*', actions: ['read'] }
    ]
  },
  {
    id: '3',
    name: 'developer',
    type: 'Role',
    description: '특정 네임스페이스에서 배포 및 서비스를 관리할 수 있습니다.',
    permissions: [
      { resource: 'deployments', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'services', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'pods', actions: ['read', 'delete'] }
    ]
  }
];
