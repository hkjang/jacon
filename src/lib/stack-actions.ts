'use server';

import { db, Stack } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStackAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'compose' | 'kubernetes';
    const endpointId = formData.get('endpointId') as string;
    const content = formData.get('content') as string;

    // Validate required fields
    if (!name || !name.trim()) {
      return { error: '스택 이름을 입력해주세요.' };
    }

    if (!content || !content.trim()) {
      return { error: '스택 콘텐츠를 입력해주세요.' };
    }

    if (!type || !['compose', 'kubernetes'].includes(type)) {
      return { error: '올바른 스택 타입을 선택해주세요.' };
    }

    // Create in DB
    const newStack = db.createStack({
        name: name.trim(),
        type,
        endpointId: endpointId || '',
        content,
        envVars: {} // TODO: Parse env vars from form if needed
    });

    if (!newStack) {
      return { error: '스택 생성에 실패했습니다.' };
    }

    revalidatePath('/stacks');
  } catch (error) {
    console.error('Create stack error:', error);
    return { error: '스택 생성 중 오류가 발생했습니다.' };
  }
  redirect('/stacks');
}

export async function deleteStackAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;

  if (!id) {
    redirect('/stacks');
    return;
  }

  // Check if stack exists before deleting
  const stack = db.getStack(id);
  if (!stack) {
    redirect('/stacks');
    return;
  }

  db.deleteStack(id);
  revalidatePath('/stacks');
  redirect('/stacks');
}
