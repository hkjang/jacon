'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { ConfigItem, MOCK_CONFIGS } from '@/lib/mock-config';

// Mock 데이터를 db에 저장하기 위한 확장
let configs: ConfigItem[] = [...MOCK_CONFIGS];

export interface ConfigCreateInput {
  name: string;
  namespace: string;
  type: 'ConfigMap' | 'Secret';
  data: Record<string, string>;
}

export interface ConfigUpdateInput {
  id: string;
  name?: string;
  data?: Record<string, string>;
}

export async function createConfigAction(input: ConfigCreateInput) {
  try {
    const newConfig: ConfigItem = {
      id: `config-${Date.now()}`,
      name: input.name,
      namespace: input.namespace,
      type: input.type,
      keys: Object.keys(input.data),
      age: 'Just now',
      data: input.type === 'Secret'
        ? Object.fromEntries(
            Object.entries(input.data).map(([k, v]) => [k, btoa(v)]) // Base64 인코딩 시뮬레이션
          )
        : input.data,
    };

    configs.push(newConfig);

    db.addAuditLog(
      'System',
      'Create',
      `${input.type}/${input.name}`,
      `${input.type} created in namespace ${input.namespace}`,
      input.type === 'Secret' ? 'Warning' : 'Info'
    );

    revalidatePath('/config');
    return { success: true, config: newConfig };
  } catch (error: any) {
    console.error('Failed to create config:', error);
    return { success: false, error: error.message };
  }
}

export async function updateConfigAction(input: ConfigUpdateInput) {
  try {
    const config = configs.find(c => c.id === input.id);

    if (!config) {
      return { success: false, error: '구성 요소를 찾을 수 없습니다.' };
    }

    if (input.name) config.name = input.name;
    if (input.data) {
      config.data = config.type === 'Secret'
        ? Object.fromEntries(
            Object.entries(input.data).map(([k, v]) => [k, btoa(v)])
          )
        : input.data;
      config.keys = Object.keys(input.data);
    }

    db.addAuditLog(
      'System',
      'Update',
      `${config.type}/${config.name}`,
      `${config.type} updated`,
      config.type === 'Secret' ? 'Warning' : 'Info'
    );

    revalidatePath('/config');
    revalidatePath(`/config/${input.id}`);
    return { success: true, config };
  } catch (error: any) {
    console.error('Failed to update config:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteConfigAction(id: string) {
  try {
    const config = configs.find(c => c.id === id);

    if (!config) {
      return { success: false, error: '구성 요소를 찾을 수 없습니다.' };
    }

    const configName = config.name;
    const configType = config.type;

    const index = configs.findIndex(c => c.id === id);
    if (index !== -1) {
      configs.splice(index, 1);
    }

    db.addAuditLog(
      'System',
      'Delete',
      `${configType}/${configName}`,
      `${configType} deleted`,
      configType === 'Secret' ? 'High' : 'Warning'
    );

    revalidatePath('/config');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete config:', error);
    return { success: false, error: error.message };
  }
}

export async function getConfigsAction() {
  return configs;
}

export async function getConfigAction(id: string) {
  return configs.find(c => c.id === id);
}

// ConfigMap/Secret 데이터 내보내기
export async function exportConfigAction(id: string, format: 'yaml' | 'json' = 'yaml') {
  const config = configs.find(c => c.id === id);

  if (!config) {
    return { success: false, error: '구성 요소를 찾을 수 없습니다.' };
  }

  if (format === 'json') {
    const jsonData = {
      apiVersion: 'v1',
      kind: config.type,
      metadata: {
        name: config.name,
        namespace: config.namespace,
      },
      data: config.data,
    };
    return { success: true, data: JSON.stringify(jsonData, null, 2), format: 'json' };
  }

  // YAML 형식
  const yamlLines = [
    'apiVersion: v1',
    `kind: ${config.type}`,
    'metadata:',
    `  name: ${config.name}`,
    `  namespace: ${config.namespace}`,
    'data:',
  ];

  Object.entries(config.data).forEach(([key, value]) => {
    if (value.includes('\n')) {
      yamlLines.push(`  ${key}: |`);
      value.split('\n').forEach(line => {
        yamlLines.push(`    ${line}`);
      });
    } else {
      yamlLines.push(`  ${key}: "${value}"`);
    }
  });

  return { success: true, data: yamlLines.join('\n'), format: 'yaml' };
}

// ConfigMap/Secret 키 추가
export async function addConfigKeyAction(id: string, key: string, value: string) {
  try {
    const config = configs.find(c => c.id === id);

    if (!config) {
      return { success: false, error: '구성 요소를 찾을 수 없습니다.' };
    }

    if (config.keys.includes(key)) {
      return { success: false, error: '이미 존재하는 키입니다.' };
    }

    config.data[key] = config.type === 'Secret' ? btoa(value) : value;
    config.keys.push(key);

    db.addAuditLog(
      'System',
      'Update',
      `${config.type}/${config.name}`,
      `Key "${key}" added`,
      'Info'
    );

    revalidatePath('/config');
    revalidatePath(`/config/${id}`);
    return { success: true, config };
  } catch (error: any) {
    console.error('Failed to add config key:', error);
    return { success: false, error: error.message };
  }
}

// ConfigMap/Secret 키 삭제
export async function deleteConfigKeyAction(id: string, key: string) {
  try {
    const config = configs.find(c => c.id === id);

    if (!config) {
      return { success: false, error: '구성 요소를 찾을 수 없습니다.' };
    }

    if (!config.keys.includes(key)) {
      return { success: false, error: '존재하지 않는 키입니다.' };
    }

    delete config.data[key];
    config.keys = config.keys.filter(k => k !== key);

    db.addAuditLog(
      'System',
      'Update',
      `${config.type}/${config.name}`,
      `Key "${key}" removed`,
      'Warning'
    );

    revalidatePath('/config');
    revalidatePath(`/config/${id}`);
    return { success: true, config };
  } catch (error: any) {
    console.error('Failed to delete config key:', error);
    return { success: false, error: error.message };
  }
}
