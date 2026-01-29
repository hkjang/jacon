'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { Workload } from '@/lib/mock-workloads';

export interface WorkloadCreateInput {
  name: string;
  namespace: string;
  type: Workload['type'];
  image: string;
  replicas?: number;
  cpu?: string;
  memory?: string;
  cluster?: string;
  envVars?: Record<string, string>;
  ports?: Array<{ containerPort: number; protocol?: string }>;
  command?: string[];
  args?: string[];
}

export interface WorkloadUpdateInput {
  id: string;
  replicas?: number;
  image?: string;
  cpu?: string;
  memory?: string;
  envVars?: Record<string, string>;
}

export async function createWorkloadAction(input: WorkloadCreateInput) {
  try {
    const workload = db.addWorkload({
      name: input.name,
      namespace: input.namespace,
      type: input.type,
      image: input.image,
      replicas: `0/${input.replicas || 1}`,
      cpu: input.cpu || '100m',
      memory: input.memory || '128Mi',
      cluster: input.cluster || 'default-cluster',
      status: 'Pending',
    });

    // 실제 환경에서는 Kubernetes API 호출
    // const k8s = getKubernetesApi();
    // await k8s.createDeployment({ ... });

    // 2초 후 Running 상태로 변경 (시뮬레이션)
    setTimeout(() => {
      db.updateWorkloadStatus(workload.id, 'Running');
      // 레플리카 업데이트
      const w = db.getWorkload(workload.id);
      if (w) {
        w.replicas = `${input.replicas || 1}/${input.replicas || 1}`;
      }
    }, 2000);

    db.addAuditLog('System', 'Create', `Workload/${input.name}`, `Workload created in namespace ${input.namespace}`, 'Info');

    revalidatePath('/workloads');
    return { success: true, workload };
  } catch (error: any) {
    console.error('Failed to create workload:', error);
    return { success: false, error: error.message };
  }
}

export async function updateWorkloadAction(input: WorkloadUpdateInput) {
  try {
    const workload = db.getWorkload(input.id);
    if (!workload) {
      return { success: false, error: '워크로드를 찾을 수 없습니다.' };
    }

    // 업데이트 적용
    if (input.image) workload.image = input.image;
    if (input.cpu) workload.cpu = input.cpu;
    if (input.memory) workload.memory = input.memory;
    if (input.replicas !== undefined) {
      const currentReplicas = parseInt(workload.replicas.split('/')[0]);
      workload.replicas = `${currentReplicas}/${input.replicas}`;

      // 스케일링 시뮬레이션
      workload.status = 'Pending';
      setTimeout(() => {
        workload.replicas = `${input.replicas}/${input.replicas}`;
        workload.status = 'Running';
      }, 1500);
    }

    db.addAuditLog('System', 'Update', `Workload/${workload.name}`, 'Workload configuration updated', 'Info');

    revalidatePath('/workloads');
    revalidatePath(`/workloads/${input.id}`);
    return { success: true, workload };
  } catch (error: any) {
    console.error('Failed to update workload:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteWorkloadAction(id: string) {
  try {
    const workload = db.getWorkload(id);
    if (!workload) {
      return { success: false, error: '워크로드를 찾을 수 없습니다.' };
    }

    const workloadName = workload.name;

    // 워크로드 삭제 (배열에서 제거)
    const workloads = db.getWorkloads();
    const index = workloads.findIndex(w => w.id === id);
    if (index !== -1) {
      workloads.splice(index, 1);
    }

    db.addAuditLog('System', 'Delete', `Workload/${workloadName}`, 'Workload deleted', 'Warning');

    revalidatePath('/workloads');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete workload:', error);
    return { success: false, error: error.message };
  }
}

export async function restartWorkloadAction(id: string) {
  try {
    const workload = db.getWorkload(id);
    if (!workload) {
      return { success: false, error: '워크로드를 찾을 수 없습니다.' };
    }

    // Pending 상태로 변경
    db.updateWorkloadStatus(id, 'Pending');
    workload.restarts += 1;

    // 3초 후 Running 상태로 복구
    setTimeout(() => {
      db.updateWorkloadStatus(id, 'Running');
    }, 3000);

    db.addAuditLog('System', 'Restart', `Workload/${workload.name}`, 'Workload restarted', 'Info');

    revalidatePath('/workloads');
    revalidatePath(`/workloads/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to restart workload:', error);
    return { success: false, error: error.message };
  }
}

export async function scaleWorkloadAction(id: string, replicas: number) {
  try {
    const workload = db.getWorkload(id);
    if (!workload) {
      return { success: false, error: '워크로드를 찾을 수 없습니다.' };
    }

    const currentReplicas = parseInt(workload.replicas.split('/')[0]);
    workload.replicas = `${currentReplicas}/${replicas}`;
    workload.status = 'Pending';

    // 스케일링 시뮬레이션
    setTimeout(() => {
      workload.replicas = `${replicas}/${replicas}`;
      workload.status = 'Running';
    }, 2000);

    db.addAuditLog('System', 'Scale', `Workload/${workload.name}`, `Scaled to ${replicas} replicas`, 'Info');

    revalidatePath('/workloads');
    revalidatePath(`/workloads/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to scale workload:', error);
    return { success: false, error: error.message };
  }
}

export async function getWorkloadsAction() {
  return db.getWorkloads();
}

export async function getWorkloadAction(id: string) {
  return db.getWorkload(id);
}
