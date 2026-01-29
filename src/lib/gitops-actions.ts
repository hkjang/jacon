'use server';

import { db, GitRepo } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addGitRepoAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const branch = formData.get('branch') as string;
    const autoSync = formData.get('autoSync') === 'on';

    if (!url || !url.trim()) {
      return { error: '저장소 URL을 입력해주세요.' };
    }

    // Basic mock validation
    if (!url.startsWith('http') && !url.startsWith('git@')) {
        return { error: '올바른 URL 형식이 아닙니다. http://, https://, 또는 git@으로 시작해야 합니다.' };
    }

    if (!name || !name.trim()) {
      return { error: '저장소 이름을 입력해주세요.' };
    }

    const newRepo = db.addGitRepo({
        name: name.trim(),
        url: url.trim(),
        branch: branch || 'main',
        autoSync,
        status: 'pending' // Initial status
    });

    if (!newRepo) {
      return { error: 'Git 저장소 추가에 실패했습니다.' };
    }

    revalidatePath('/gitops');
  } catch (error) {
    console.error('Add git repo error:', error);
    return { error: 'Git 저장소 추가 중 오류가 발생했습니다.' };
  }
  redirect('/gitops');
}

export async function syncGitRepoAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;

  if (!id) {
    return;
  }

  // Check if repo exists
  const repos = db.getGitRepos();
  const repo = repos?.find(r => r.id === id);
  if (!repo) {
    return;
  }

  // Set to syncing immediately
  db.updateGitRepoStatus(id, 'syncing');

  // NOTE: This blocks the response for 1s.
  await new Promise(r => setTimeout(r, 1000));
  db.updateGitRepoStatus(id, 'synced', new Date().toISOString());

  revalidatePath('/gitops');
}

export async function deleteGitRepoAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;

  if (!id) {
    return;
  }

  // Check if repo exists
  const repos = db.getGitRepos();
  const repo = repos?.find(r => r.id === id);
  if (!repo) {
    return;
  }

  db.removeGitRepo(id);
  revalidatePath('/gitops');
}
