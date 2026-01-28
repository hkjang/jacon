
export type AdminRole = 'System Admin' | 'Security Admin' | 'Org Admin' | 'Audit Admin' | 'Platform Admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Active' | 'Locked' | 'Pending';
  lastLogin: string;
}

export interface SystemSetting {
    key: string;
    label: string;
    value: boolean | string | number;
    category: 'Security' | 'System' | 'Network'
}

export const MOCK_ADMIN_USERS: AdminUser[] = [
    { id: 'admin-1', name: 'Alice System', email: 'alice@jacon.io', role: 'System Admin', status: 'Active', lastLogin: '2024-05-12 10:42' },
    { id: 'admin-2', name: 'Bob Security', email: 'bob@jacon.io', role: 'Security Admin', status: 'Active', lastLogin: '2024-05-11 09:15' },
    { id: 'admin-3', name: 'Charlie Audit', email: 'charlie@jacon.io', role: 'Audit Admin', status: 'Active', lastLogin: '2024-05-10 14:22' },
    { id: 'admin-4', name: 'Dave Suspicious', email: 'dave@external.io', role: 'Org Admin', status: 'Locked', lastLogin: '2024-04-30 01:00' },
];

export const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [
    { key: 'mfa_enforcement', label: '모든 관리자 MFA 강제', value: true, category: 'Security' },
    { key: 'session_timeout', label: '관리자 세션 타임아웃 (분)', value: 30, category: 'Security' },
    { key: 'maintenance_mode', label: '유지보수 모드 (읽기 전용)', value: false, category: 'System' },
    { key: 'allow_public_endpoints', label: '공용 엔드포인트 허용', value: false, category: 'Network' },
];
