'use server';

import { db, GitRepo } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addGitRepoAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const url = formData.get('url') as string;
  const branch = formData.get('branch') as string;
  const autoSync = formData.get('autoSync') === 'on';

  if (!url) {
    return { error: 'Repository URL is required.' };
  }

  // Basic mock validation
  if (!url.startsWith('http') && !url.startsWith('git@')) {
      return { error: 'Invalid URL format. Must start with http://, https://, or git@' };
  }

  db.addGitRepo({
      name,
      url,
      branch,
      autoSync,
      status: 'pending' // Initial status
  });

  revalidatePath('/gitops');
  redirect('/gitops');
}

export async function syncGitRepoAction(formData: FormData) {
    const id = formData.get('id') as string;
    
    // Set to syncing immediately
    db.updateGitRepoStatus(id, 'syncing');
    
    // In a real app, this would queue a job. Here we just revalidate to show 'syncing'
    // But since server actions are request/response, we can't easily do background updates 
    // without an external worker or efficient state polling. 
    // For this mock, we will wait 2 seconds then set to synced.
    
    // NOTE: This blocks the response for 1s.
    await new Promise(r => setTimeout(r, 1000));
    db.updateGitRepoStatus(id, 'synced', new Date().toISOString());
    
    revalidatePath('/gitops');
}

export async function deleteGitRepoAction(formData: FormData) {
    const id = formData.get('id') as string;
    db.removeGitRepo(id);
    revalidatePath('/gitops');
}
