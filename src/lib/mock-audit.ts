export interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'allowed' | 'denied';
  ip: string;
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', user: 'admin', action: 'create', resource: 'deployment/api-server', timestamp: '2023-10-27 10:00:00', status: 'allowed', ip: '192.168.1.5' },
  { id: '2', user: 'bob', action: 'delete', resource: 'secret/db-creds', timestamp: '2023-10-27 10:05:00', status: 'denied', ip: '192.168.1.10' },
  { id: '3', user: 'admin', action: 'update', resource: 'configmap/settings', timestamp: '2023-10-27 10:10:00', status: 'allowed', ip: '192.168.1.5' },
  { id: '4', user: 'sre-bot', action: 'scale', resource: 'deployment/worker', timestamp: '2023-10-27 10:15:00', status: 'allowed', ip: '10.0.0.5' },
  { id: '5', user: 'alice', action: 'get', resource: 'secret/tls-key', timestamp: '2023-10-27 10:20:00', status: 'denied', ip: '192.168.1.20' },
];
