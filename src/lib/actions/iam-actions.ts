'use server';

import { revalidatePath } from 'next/cache';
import { db, IamRole } from '@/lib/db';

export interface IamRoleCreateInput {
  name: string;
  description: string;
  permissions: string[];
  type?: 'system' | 'custom';
}

export interface IamRoleUpdateInput {
  id: string;
  name?: string;
  description?: string;
  permissions?: string[];
}

// 사용 가능한 권한 목록
export const AVAILABLE_PERMISSIONS = [
  // 리소스 관련
  { category: 'Workloads', permissions: ['workloads:read', 'workloads:create', 'workloads:update', 'workloads:delete', 'workloads:restart', 'workloads:scale'] },
  { category: 'Endpoints', permissions: ['endpoints:read', 'endpoints:create', 'endpoints:update', 'endpoints:delete', 'endpoints:test'] },
  { category: 'Stacks', permissions: ['stacks:read', 'stacks:create', 'stacks:update', 'stacks:delete', 'stacks:deploy'] },
  { category: 'Config', permissions: ['configmaps:read', 'configmaps:create', 'configmaps:update', 'configmaps:delete', 'secrets:read', 'secrets:create', 'secrets:update', 'secrets:delete'] },
  { category: 'GitOps', permissions: ['gitops:read', 'gitops:create', 'gitops:sync', 'gitops:delete'] },
  { category: 'Registries', permissions: ['registries:read', 'registries:create', 'registries:update', 'registries:delete'] },
  // 관리 관련
  { category: 'Users', permissions: ['users:read', 'users:create', 'users:update', 'users:delete', 'users:invite'] },
  { category: 'Roles', permissions: ['roles:read', 'roles:create', 'roles:update', 'roles:delete'] },
  { category: 'Policies', permissions: ['policies:read', 'policies:create', 'policies:update', 'policies:delete'] },
  { category: 'Audit', permissions: ['audit:read', 'audit:export'] },
  { category: 'Settings', permissions: ['settings:read', 'settings:update'] },
];

export async function createIamRoleAction(input: IamRoleCreateInput) {
  try {
    // 이름 중복 체크
    const existingRole = db.getIamRoles().find(r => r.name.toLowerCase() === input.name.toLowerCase());
    if (existingRole) {
      return { success: false, error: '동일한 이름의 역할이 이미 존재합니다.' };
    }

    const role: IamRole = {
      id: `role-${Date.now()}`,
      name: input.name,
      description: input.description,
      permissions: input.permissions,
      type: input.type || 'custom',
    };

    db.iamRoles.push(role);

    db.addAuditLog('System', 'Create', `Role/${input.name}`, `IAM role created with ${input.permissions.length} permissions`, 'Warning');

    revalidatePath('/settings/iam');
    return { success: true, role };
  } catch (error: any) {
    console.error('Failed to create IAM role:', error);
    return { success: false, error: error.message };
  }
}

export async function updateIamRoleAction(input: IamRoleUpdateInput) {
  try {
    const roles = db.getIamRoles();
    const role = roles.find(r => r.id === input.id);

    if (!role) {
      return { success: false, error: '역할을 찾을 수 없습니다.' };
    }

    // 시스템 역할은 수정 불가
    if (role.type === 'system') {
      return { success: false, error: '시스템 역할은 수정할 수 없습니다.' };
    }

    if (input.name) role.name = input.name;
    if (input.description) role.description = input.description;
    if (input.permissions) role.permissions = input.permissions;

    db.addAuditLog('System', 'Update', `Role/${role.name}`, 'IAM role updated', 'Warning');

    revalidatePath('/settings/iam');
    return { success: true, role };
  } catch (error: any) {
    console.error('Failed to update IAM role:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteIamRoleAction(id: string) {
  try {
    const roles = db.getIamRoles();
    const role = roles.find(r => r.id === id);

    if (!role) {
      return { success: false, error: '역할을 찾을 수 없습니다.' };
    }

    // 시스템 역할은 삭제 불가
    if (role.type === 'system') {
      return { success: false, error: '시스템 역할은 삭제할 수 없습니다.' };
    }

    const roleName = role.name;

    const index = roles.findIndex(r => r.id === id);
    if (index !== -1) {
      roles.splice(index, 1);
    }

    db.addAuditLog('System', 'Delete', `Role/${roleName}`, 'IAM role deleted', 'High');

    revalidatePath('/settings/iam');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete IAM role:', error);
    return { success: false, error: error.message };
  }
}

export async function getIamRolesAction() {
  return db.getIamRoles();
}

export async function getIamRoleAction(id: string) {
  return db.getIamRoles().find(r => r.id === id);
}

// 역할에 권한 추가
export async function addPermissionToRoleAction(roleId: string, permission: string) {
  try {
    const roles = db.getIamRoles();
    const role = roles.find(r => r.id === roleId);

    if (!role) {
      return { success: false, error: '역할을 찾을 수 없습니다.' };
    }

    if (role.type === 'system') {
      return { success: false, error: '시스템 역할은 수정할 수 없습니다.' };
    }

    if (!role.permissions.includes(permission)) {
      role.permissions.push(permission);
    }

    db.addAuditLog('System', 'Update', `Role/${role.name}`, `Permission "${permission}" added`, 'Warning');

    revalidatePath('/settings/iam');
    return { success: true, role };
  } catch (error: any) {
    console.error('Failed to add permission:', error);
    return { success: false, error: error.message };
  }
}

// 역할에서 권한 제거
export async function removePermissionFromRoleAction(roleId: string, permission: string) {
  try {
    const roles = db.getIamRoles();
    const role = roles.find(r => r.id === roleId);

    if (!role) {
      return { success: false, error: '역할을 찾을 수 없습니다.' };
    }

    if (role.type === 'system') {
      return { success: false, error: '시스템 역할은 수정할 수 없습니다.' };
    }

    role.permissions = role.permissions.filter(p => p !== permission);

    db.addAuditLog('System', 'Update', `Role/${role.name}`, `Permission "${permission}" removed`, 'Warning');

    revalidatePath('/settings/iam');
    return { success: true, role };
  } catch (error: any) {
    console.error('Failed to remove permission:', error);
    return { success: false, error: error.message };
  }
}

// 역할 복제
export async function cloneIamRoleAction(id: string, newName: string) {
  try {
    const roles = db.getIamRoles();
    const sourceRole = roles.find(r => r.id === id);

    if (!sourceRole) {
      return { success: false, error: '원본 역할을 찾을 수 없습니다.' };
    }

    // 이름 중복 체크
    const existingRole = roles.find(r => r.name.toLowerCase() === newName.toLowerCase());
    if (existingRole) {
      return { success: false, error: '동일한 이름의 역할이 이미 존재합니다.' };
    }

    const newRole: IamRole = {
      id: `role-${Date.now()}`,
      name: newName,
      description: `${sourceRole.description} (복제됨)`,
      permissions: [...sourceRole.permissions],
      type: 'custom',
    };

    roles.push(newRole);

    db.addAuditLog('System', 'Create', `Role/${newName}`, `IAM role cloned from "${sourceRole.name}"`, 'Info');

    revalidatePath('/settings/iam');
    return { success: true, role: newRole };
  } catch (error: any) {
    console.error('Failed to clone IAM role:', error);
    return { success: false, error: error.message };
  }
}

// 사용 가능한 권한 목록 조회
export async function getAvailablePermissionsAction() {
  return AVAILABLE_PERMISSIONS;
}
