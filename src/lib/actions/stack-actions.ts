'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db, Stack } from '@/lib/db';

export interface StackCreateInput {
  name: string;
  type: 'compose' | 'kubernetes';
  content: string;
  envVars?: Record<string, string>;
  endpointId: string;
}

export interface StackUpdateInput {
  id: string;
  name?: string;
  content?: string;
  envVars?: Record<string, string>;
  endpointId?: string;
}

export async function createStackAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'compose' | 'kubernetes';
    const content = formData.get('content') as string;
    const endpointId = formData.get('endpointId') as string;
    const envVarsRaw = formData.get('envVars') as string;

    if (!name || !content || !endpointId) {
      return { success: false, error: '필수 항목을 입력해주세요.' };
    }

    let envVars: Record<string, string> = {};
    if (envVarsRaw) {
      try {
        envVars = JSON.parse(envVarsRaw);
      } catch {
        // 환경변수 파싱 실패 시 빈 객체 유지
      }
    }

    const stack = db.createStack({
      name,
      type,
      content,
      envVars,
      endpointId,
    });

    db.addAuditLog('System', 'Create', `Stack/${name}`, `${type} stack created and deployment initiated`, 'Info');

    revalidatePath('/stacks');
    redirect('/stacks');
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Failed to create stack:', error);
    return { success: false, error: error.message };
  }
}

export async function updateStackAction(input: StackUpdateInput) {
  try {
    const stack = db.getStack(input.id);

    if (!stack) {
      return { success: false, error: '스택을 찾을 수 없습니다.' };
    }

    const updatedStack = db.updateStack(input.id, {
      name: input.name,
      content: input.content,
      envVars: input.envVars,
      endpointId: input.endpointId,
    });

    db.addAuditLog('System', 'Update', `Stack/${stack.name}`, 'Stack configuration updated and redeployed', 'Info');

    revalidatePath('/stacks');
    revalidatePath(`/stacks/${input.id}`);
    return { success: true, stack: updatedStack };
  } catch (error: any) {
    console.error('Failed to update stack:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteStackAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const confirmName = formData.get('confirmName') as string;

    const stack = db.getStack(id);

    if (!stack) {
      return { success: false, error: '스택을 찾을 수 없습니다.' };
    }

    if (confirmName !== stack.name) {
      return { success: false, error: '스택 이름이 일치하지 않습니다.' };
    }

    db.deleteStack(id);

    db.addAuditLog('System', 'Delete', `Stack/${stack.name}`, 'Stack deleted', 'Warning');

    revalidatePath('/stacks');
    redirect('/stacks');
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Failed to delete stack:', error);
    return { success: false, error: error.message };
  }
}

export async function deployStackAction(id: string) {
  try {
    const stack = db.getStack(id);

    if (!stack) {
      return { success: false, error: '스택을 찾을 수 없습니다.' };
    }

    // 배포 상태로 변경
    stack.status = 'deploying';
    stack.updatedAt = new Date().toISOString();

    // 배포 시뮬레이션
    setTimeout(() => {
      stack.status = 'active';
    }, 3000);

    db.addAuditLog('System', 'Deploy', `Stack/${stack.name}`, 'Stack deployment started', 'Info');

    revalidatePath('/stacks');
    revalidatePath(`/stacks/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to deploy stack:', error);
    return { success: false, error: error.message };
  }
}

export async function stopStackAction(id: string) {
  try {
    const stack = db.getStack(id);

    if (!stack) {
      return { success: false, error: '스택을 찾을 수 없습니다.' };
    }

    stack.status = 'inactive';
    stack.updatedAt = new Date().toISOString();

    db.addAuditLog('System', 'Stop', `Stack/${stack.name}`, 'Stack stopped', 'Warning');

    revalidatePath('/stacks');
    revalidatePath(`/stacks/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to stop stack:', error);
    return { success: false, error: error.message };
  }
}

export async function restartStackAction(id: string) {
  try {
    const stack = db.getStack(id);

    if (!stack) {
      return { success: false, error: '스택을 찾을 수 없습니다.' };
    }

    stack.status = 'deploying';
    stack.updatedAt = new Date().toISOString();

    // 재시작 시뮬레이션
    setTimeout(() => {
      stack.status = 'active';
    }, 2000);

    db.addAuditLog('System', 'Restart', `Stack/${stack.name}`, 'Stack restarted', 'Info');

    revalidatePath('/stacks');
    revalidatePath(`/stacks/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to restart stack:', error);
    return { success: false, error: error.message };
  }
}

export async function getStacksAction() {
  return db.getStacks();
}

export async function getStackAction(id: string) {
  return db.getStack(id);
}

// 스택 로그 조회 (시뮬레이션)
export async function getStackLogsAction(id: string) {
  const stack = db.getStack(id);

  if (!stack) {
    return { success: false, error: '스택을 찾을 수 없습니다.' };
  }

  // 시뮬레이션된 로그
  const logs = [
    `[${new Date().toISOString()}] Starting ${stack.type} stack: ${stack.name}`,
    `[${new Date().toISOString()}] Pulling images...`,
    `[${new Date().toISOString()}] Creating networks...`,
    `[${new Date().toISOString()}] Creating volumes...`,
    `[${new Date().toISOString()}] Starting services...`,
    `[${new Date().toISOString()}] Stack ${stack.name} is now ${stack.status}`,
  ].join('\n');

  return { success: true, logs };
}

// 환경변수 업데이트
export async function updateStackEnvVarsAction(id: string, envVars: Record<string, string>) {
  try {
    const stack = db.getStack(id);

    if (!stack) {
      return { success: false, error: '스택을 찾을 수 없습니다.' };
    }

    stack.envVars = envVars;
    stack.updatedAt = new Date().toISOString();

    // 환경변수 변경 시 재배포 필요
    stack.status = 'deploying';
    setTimeout(() => {
      stack.status = 'active';
    }, 2000);

    db.addAuditLog('System', 'Update', `Stack/${stack.name}`, 'Environment variables updated, redeploying', 'Info');

    revalidatePath('/stacks');
    revalidatePath(`/stacks/${id}`);
    return { success: true, stack };
  } catch (error: any) {
    console.error('Failed to update stack env vars:', error);
    return { success: false, error: error.message };
  }
}
