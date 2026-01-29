'use server';

import { revalidatePath } from 'next/cache';
import { db, Registry } from '@/lib/db';

export interface RegistryCreateInput {
  name: string;
  type: 'dockerhub' | 'acr' | 'ecr' | 'gcr' | 'harbor' | 'other';
  url: string;
  username?: string;
  password?: string;
  associatedEndpoints?: string[];
}

export interface RegistryUpdateInput {
  id: string;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  associatedEndpoints?: string[];
}

export async function createRegistryAction(input: RegistryCreateInput) {
  try {
    const registry = db.addRegistry({
      name: input.name,
      type: input.type,
      url: input.url,
      username: input.username,
      associatedEndpoints: input.associatedEndpoints || [],
    });

    db.addAuditLog('System', 'Create', `Registry/${input.name}`, `Container registry added (${input.type})`, 'Info');

    revalidatePath('/settings/registries');
    return { success: true, registry };
  } catch (error: any) {
    console.error('Failed to create registry:', error);
    return { success: false, error: error.message };
  }
}

export async function updateRegistryAction(input: RegistryUpdateInput) {
  try {
    const registries = db.getRegistries();
    const registry = registries.find(r => r.id === input.id);

    if (!registry) {
      return { success: false, error: '레지스트리를 찾을 수 없습니다.' };
    }

    if (input.name) registry.name = input.name;
    if (input.url) registry.url = input.url;
    if (input.username !== undefined) registry.username = input.username;
    if (input.associatedEndpoints) registry.associatedEndpoints = input.associatedEndpoints;

    db.addAuditLog('System', 'Update', `Registry/${registry.name}`, 'Registry configuration updated', 'Info');

    revalidatePath('/settings/registries');
    return { success: true, registry };
  } catch (error: any) {
    console.error('Failed to update registry:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteRegistryAction(id: string) {
  try {
    const registries = db.getRegistries();
    const registry = registries.find(r => r.id === id);

    if (!registry) {
      return { success: false, error: '레지스트리를 찾을 수 없습니다.' };
    }

    const registryName = registry.name;

    const index = registries.findIndex(r => r.id === id);
    if (index !== -1) {
      registries.splice(index, 1);
    }

    db.addAuditLog('System', 'Delete', `Registry/${registryName}`, 'Registry removed', 'Warning');

    revalidatePath('/settings/registries');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete registry:', error);
    return { success: false, error: error.message };
  }
}

export async function testRegistryConnectionAction(id: string) {
  try {
    const registry = db.getRegistries().find(r => r.id === id);

    if (!registry) {
      return { success: false, error: '레지스트리를 찾을 수 없습니다.' };
    }

    // 실제 환경에서는 레지스트리 API 호출
    // Docker Hub: https://hub.docker.com/v2/repositories/{username}/
    // ACR: https://{name}.azurecr.io/v2/_catalog
    // ECR: aws ecr describe-repositories
    // GCR: https://gcr.io/v2/{project}/tags/list

    // 시뮬레이션: 랜덤하게 성공/실패
    const isConnected = Math.random() > 0.2; // 80% 성공률

    db.addAuditLog(
      'System',
      'Test',
      `Registry/${registry.name}`,
      `Connection test: ${isConnected ? 'Success' : 'Failed'}`,
      isConnected ? 'Info' : 'Warning'
    );

    return {
      success: true,
      connected: isConnected,
      message: isConnected ? '연결 성공' : '연결 실패 - 인증 정보를 확인해주세요.',
    };
  } catch (error: any) {
    console.error('Failed to test registry connection:', error);
    return { success: false, error: error.message };
  }
}

export async function getRegistriesAction() {
  return db.getRegistries();
}

export async function getRegistryAction(id: string) {
  return db.getRegistries().find(r => r.id === id);
}

// 레지스트리에 엔드포인트 연결
export async function associateEndpointAction(registryId: string, endpointId: string) {
  try {
    const registries = db.getRegistries();
    const registry = registries.find(r => r.id === registryId);

    if (!registry) {
      return { success: false, error: '레지스트리를 찾을 수 없습니다.' };
    }

    if (!registry.associatedEndpoints.includes(endpointId)) {
      registry.associatedEndpoints.push(endpointId);
    }

    db.addAuditLog('System', 'Update', `Registry/${registry.name}`, `Endpoint associated`, 'Info');

    revalidatePath('/settings/registries');
    return { success: true, registry };
  } catch (error: any) {
    console.error('Failed to associate endpoint:', error);
    return { success: false, error: error.message };
  }
}

// 레지스트리에서 엔드포인트 연결 해제
export async function disassociateEndpointAction(registryId: string, endpointId: string) {
  try {
    const registries = db.getRegistries();
    const registry = registries.find(r => r.id === registryId);

    if (!registry) {
      return { success: false, error: '레지스트리를 찾을 수 없습니다.' };
    }

    registry.associatedEndpoints = registry.associatedEndpoints.filter(id => id !== endpointId);

    db.addAuditLog('System', 'Update', `Registry/${registry.name}`, `Endpoint disassociated`, 'Info');

    revalidatePath('/settings/registries');
    return { success: true, registry };
  } catch (error: any) {
    console.error('Failed to disassociate endpoint:', error);
    return { success: false, error: error.message };
  }
}

// 이미지 목록 조회 (시뮬레이션)
export async function listRegistryImagesAction(id: string) {
  const registry = db.getRegistries().find(r => r.id === id);

  if (!registry) {
    return { success: false, error: '레지스트리를 찾을 수 없습니다.' };
  }

  // 시뮬레이션된 이미지 목록
  const images = [
    { name: 'nginx', tags: ['latest', '1.21', '1.20'], size: '142MB', lastPush: '2 days ago' },
    { name: 'redis', tags: ['latest', '6.2', '6.0'], size: '117MB', lastPush: '5 days ago' },
    { name: 'postgres', tags: ['latest', '14', '13'], size: '376MB', lastPush: '1 week ago' },
    { name: 'node', tags: ['18', '16', '14'], size: '998MB', lastPush: '3 days ago' },
    { name: 'python', tags: ['3.11', '3.10', '3.9'], size: '1.02GB', lastPush: '4 days ago' },
  ];

  return { success: true, images };
}
