'use server';

import { revalidatePath } from 'next/cache';
import { db, Endpoint } from '@/lib/db';
import { getDockerApi } from '@/lib/docker-api';
import { getKubernetesApi } from '@/lib/kubernetes-api';

export interface EndpointCreateInput {
  name: string;
  type: 'Kubernetes' | 'Docker' | 'Swarm';
  url: string;
  tags?: string[];
  isEdge?: boolean;
  connectionMode?: 'direct' | 'agent';
  groupId?: string;
  // 인증 정보
  token?: string;  // Kubernetes bearer token
  tlsCert?: string;
  tlsKey?: string;
  tlsCa?: string;
}

export interface EndpointUpdateInput {
  id: string;
  name?: string;
  url?: string;
  tags?: string[];
  isEdge?: boolean;
  connectionMode?: 'direct' | 'agent';
  groupId?: string;
  token?: string;
}

export async function createEndpointAction(input: EndpointCreateInput) {
  try {
    const endpoint = db.addEndpoint({
      name: input.name,
      type: input.type,
      url: input.url,
      tags: input.tags || [],
      isEdge: input.isEdge || false,
      connectionMode: input.connectionMode || 'direct',
      groupId: input.groupId,
    });

    db.addAuditLog('System', 'Create', `Endpoint/${input.name}`, `Endpoint registered (${input.type})`, 'Info');

    revalidatePath('/endpoints');
    return { success: true, endpoint };
  } catch (error: any) {
    console.error('Failed to create endpoint:', error);
    return { success: false, error: error.message };
  }
}

export async function updateEndpointAction(input: EndpointUpdateInput) {
  try {
    const endpoints = db.getEndpoints();
    const endpoint = endpoints.find(e => e.id === input.id);

    if (!endpoint) {
      return { success: false, error: '엔드포인트를 찾을 수 없습니다.' };
    }

    // 업데이트 적용
    if (input.name) endpoint.name = input.name;
    if (input.url) endpoint.url = input.url;
    if (input.tags) endpoint.tags = input.tags;
    if (input.isEdge !== undefined) endpoint.isEdge = input.isEdge;
    if (input.connectionMode) endpoint.connectionMode = input.connectionMode;
    if (input.groupId !== undefined) endpoint.groupId = input.groupId;

    endpoint.lastSeen = 'Just now';

    db.addAuditLog('System', 'Update', `Endpoint/${endpoint.name}`, 'Endpoint configuration updated', 'Info');

    revalidatePath('/endpoints');
    revalidatePath(`/endpoints/${input.id}`);
    return { success: true, endpoint };
  } catch (error: any) {
    console.error('Failed to update endpoint:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteEndpointAction(id: string) {
  try {
    const endpoints = db.getEndpoints();
    const endpoint = endpoints.find(e => e.id === id);

    if (!endpoint) {
      return { success: false, error: '엔드포인트를 찾을 수 없습니다.' };
    }

    const endpointName = endpoint.name;

    // 엔드포인트 삭제
    const index = endpoints.findIndex(e => e.id === id);
    if (index !== -1) {
      endpoints.splice(index, 1);
    }

    db.addAuditLog('System', 'Delete', `Endpoint/${endpointName}`, 'Endpoint removed', 'Warning');

    revalidatePath('/endpoints');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete endpoint:', error);
    return { success: false, error: error.message };
  }
}

export async function testEndpointConnectionAction(id: string) {
  try {
    const endpoint = db.getEndpoints().find(e => e.id === id);

    if (!endpoint) {
      return { success: false, error: '엔드포인트를 찾을 수 없습니다.', status: 'unknown' };
    }

    let isConnected = false;
    let version = '';
    let details: any = {};

    if (endpoint.type === 'Docker' || endpoint.type === 'Swarm') {
      try {
        const docker = getDockerApi(endpoint.url);
        isConnected = await docker.ping();
        if (isConnected) {
          const info = await docker.getVersion();
          version = info.Version;
          details = {
            apiVersion: info.ApiVersion,
            os: info.Os,
            arch: info.Arch,
          };
        }
      } catch (e) {
        isConnected = false;
      }
    } else if (endpoint.type === 'Kubernetes') {
      try {
        const k8s = getKubernetesApi(endpoint.url);
        isConnected = await k8s.healthCheck();
        if (isConnected) {
          const serverVersion = await k8s.getServerVersion();
          version = serverVersion.gitVersion;
          details = {
            major: serverVersion.major,
            minor: serverVersion.minor,
            platform: serverVersion.platform,
          };
        }
      } catch (e) {
        isConnected = false;
      }
    }

    // 상태 업데이트
    endpoint.status = isConnected ? 'Online' : 'Offline';
    endpoint.lastSeen = isConnected ? 'Just now' : endpoint.lastSeen;
    if (version) endpoint.version = version;

    db.addAuditLog('System', 'Test', `Endpoint/${endpoint.name}`, `Connection test: ${isConnected ? 'Success' : 'Failed'}`, isConnected ? 'Info' : 'Warning');

    revalidatePath('/endpoints');

    return {
      success: true,
      connected: isConnected,
      status: isConnected ? 'Online' : 'Offline',
      version,
      details,
    };
  } catch (error: any) {
    console.error('Failed to test endpoint connection:', error);
    return { success: false, error: error.message, status: 'error' };
  }
}

export async function refreshEndpointStatusAction(id: string) {
  // testEndpointConnectionAction과 동일
  return testEndpointConnectionAction(id);
}

export async function getEndpointsAction() {
  return db.getEndpoints();
}

export async function getEndpointAction(id: string) {
  return db.getEndpoints().find(e => e.id === id);
}

// 엔드포인트 그룹 관리
export async function createEndpointGroupAction(input: { name: string; description?: string; tags?: string[] }) {
  try {
    const group = db.createEndpointGroup({
      name: input.name,
      description: input.description || '',
      tags: input.tags || [],
    });

    db.addAuditLog('System', 'Create', `EndpointGroup/${input.name}`, 'Endpoint group created', 'Info');

    revalidatePath('/endpoints');
    return { success: true, group };
  } catch (error: any) {
    console.error('Failed to create endpoint group:', error);
    return { success: false, error: error.message };
  }
}

export async function getEndpointGroupsAction() {
  return db.getEndpointGroups();
}
