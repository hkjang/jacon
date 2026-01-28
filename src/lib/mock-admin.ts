
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
    { key: 'mfa_enforcement', label: 'Enforce MFA for All Admins', value: true, category: 'Security' },
    { key: 'session_timeout', label: 'Admin Session Timeout (mins)', value: 30, category: 'Security' },
    { key: 'maintenance_mode', label: 'Maintenance Mode (Read-Only)', value: false, category: 'System' },
    { key: 'allow_public_endpoints', label: 'Allow Public Endpoints', value: false, category: 'Network' },
];
