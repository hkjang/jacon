'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { DEFAULT_PASSWORD } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = db.findUserByEmail(email);

  // 1. User check
  if (!user) {
    return { error: '계정을 찾을 수 없습니다.' };
  }

  // 2. Lockout check
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remainingMins = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
    return { error: `계정이 잠겼습니다. ${remainingMins}분 후에 다시 시도하세요.` };
  }

  // 3. Password check (Mock)
  // In real app: await bcrypt.compare(password, user.passwordHash)
  if (password !== DEFAULT_PASSWORD && password !== 'admin') {
    db.incrementFailedLogin(user.id);
    return { error: '비밀번호가 올바르지 않습니다.' };
  }

  // 4. Success - Reset failures
  db.resetFailedLogin(user.id);

  // 5. MFA Check
  if (user.mfaEnabled) { 
      return { 
          status: 'mfa_required', 
          userId: user.id,
          // In a real app, we would sign a temporary JWT here to authorize the MFA step
          tempToken: `mfa_pending_${user.id}_${Date.now()}` 
      }; 
  }

  // 6. Create Session
  const session = db.createSession(user.id, '127.0.0.1', 'Mozilla/5.0');
  
  // 7. Audit Log
  db.addAuditLog(user.email, 'Login', 'System', 'Login successful via Web', 'Info', '127.0.0.1');

  // 8. Set Cookie
  const cookieStore = await cookies();
  cookieStore.set('jacon_session', session.sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(session.expiresAt)
  });

  return { success: true };
}

export async function verifyMfaAction(prevState: any, formData: FormData) {
  const userId = formData.get('userId') as string;
  const code = formData.get('code') as string;
  
  // Mock validation: accept '123456'
  if (code !== '123456') {
      return { error: '인증 코드가 올바르지 않습니다.' };
  }

  const user = db.getUsers().find(u => u.id === userId);
  if (!user) return { error: '사용자를 찾을 수 없습니다.' };

  // Create Session (Success)
  const session = db.createSession(user.id, '127.0.0.1', 'Mozilla/5.0');
  
  db.addAuditLog(user.email, 'Login', 'System', 'MFA verified, Login successful', 'Info', '127.0.0.1');

  const cookieStore = await cookies();
  cookieStore.set('jacon_session', session.sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(session.expiresAt)
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('jacon_session')?.value;

  if (sessionId) {
    db.revokeSession(sessionId);
    // Audit log? We might need user info, but session might be gone or we can look it up before revoke.
    // For simplicity, we just revoke here.
  }

  cookieStore.delete('jacon_session');
  redirect('/login');
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('jacon_session')?.value;
  
  if (!sessionId) return null;

  const session = db.getSession(sessionId);
  if (!session) return null;

  return db.getUsers().find(u => u.id === session.userId) || null;
}
