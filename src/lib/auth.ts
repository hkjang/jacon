
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'readonly';
  title?: string; // Job title
}

// Combine Admin Users and some regular users for login testing
export const MOCK_USERS: User[] = [
  // Admins (matching mock-admin.ts)
  { id: 'admin-1', name: '김철수 (시스템 팀장)', email: 'kim.cs@jacon.io', role: 'admin', title: 'System Admin' },
  { id: 'admin-2', name: '이영희 (보안 담당)', email: 'lee.yh@jacon.io', role: 'admin', title: 'Security Admin' },
  { id: 'admin-5', name: '정수진 (플랫폼 리드)', email: 'jung.sj@jacon.io', role: 'admin', title: 'Platform Admin' },
  { id: 'admin-8', name: '한재석 (모니터링)', email: 'han.js@jacon.io', role: 'admin', title: 'System Admin' },
  
  // Developers / Regular Users
  { id: 'user-1', name: '박지민 (백엔드 개발)', email: 'park.jm@jacon.io', role: 'user', title: 'Senior Backend Dev' },
  { id: 'user-2', name: '최유리 (프론트엔드)', email: 'choi.yr@jacon.io', role: 'user', title: 'Frontend Dev' },
  { id: 'user-3', name: 'Dave (External)', email: 'dave@partner.io', role: 'readonly', title: 'External Consultant' },
];

export const DEFAULT_PASSWORD = 'password';

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log(`Attempting login for: ${email}`);

  // Find user
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (user) {
     // For mock purposes, accept 'password' or 'admin' or purely empty check if needed
     // But let's enforce a simple password for realism
     if (password === 'password' || password === 'admin') {
         return {
             user,
             token: `mock-jwt-token-${user.id}-${Date.now()}`,
         };
     }
  }

  throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
}

