'use server';

import { db, Stack } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStackAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'compose' | 'kubernetes';
  const endpointId = formData.get('endpointId') as string;
  const content = formData.get('content') as string;

  // Simulate validation
  if (!name || !content) {
    return { error: 'Name and Content are required.' };
  }

  // Create in DB
  const newStack = db.createStack({
      name,
      type,
      endpointId,
      content,
      envVars: {} // TODO: Parse env vars from form if needed
  });

  revalidatePath('/stacks');
  redirect('/stacks');
}

export async function deleteStackAction(formData: FormData) {
    const id = formData.get('id') as string;
    db.deleteStack(id);
    revalidatePath('/stacks');
    redirect('/stacks');
}
