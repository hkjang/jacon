export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    details: string;
    severity: 'Info' | 'High' | 'Critical' | 'Warning';
    ip: string;
    status: 'allowed' | 'blocked';
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 'evt-101', timestamp: '2024-05-20 11:45:22', user: 'kim.cs@jacon.io', action: 'Login', resource: 'System', details: 'Successful login from internal network', severity: 'Info', ip: '10.0.1.25', status: 'allowed' },
    { id: 'evt-102', timestamp: '2024-05-20 11:42:05', user: 'lee.yh@jacon.io', action: 'Update', resource: 'Policy/P-102', details: 'Changed enforcement mode to "Blocking"', severity: 'High', ip: '192.168.0.55', status: 'allowed' },
    { id: 'evt-103', timestamp: '2024-05-20 11:30:00', user: 'System', action: 'Scale', resource: 'Deployment/backend-api', details: 'Auto-scaled to 5 replicas due to CPU load > 80%', severity: 'Info', ip: 'System', status: 'allowed' },
    { id: 'evt-104', timestamp: '2024-05-20 11:15:40', user: 'choi.jh@partner.io', action: 'Delete', resource: 'Secret/db-creds-prod', details: 'Attempted deletion of critical secret without approval', severity: 'Critical', ip: '203.0.113.42', status: 'blocked' },
    { id: 'evt-105', timestamp: '2024-05-20 11:15:41', user: 'System', action: 'Block', resource: 'User/choi.jh', details: 'Account locked due to suspicious destructive action', severity: 'High', ip: 'System', status: 'allowed' },
    { id: 'evt-106', timestamp: '2024-05-20 10:55:12', user: 'park.ms@jacon.io', action: 'Export', resource: 'Audit/Logs', details: 'Exported compliance report for Q2', severity: 'Info', ip: '10.0.2.10', status: 'allowed' },
    { id: 'evt-107', timestamp: '2024-05-20 10:20:33', user: 'jung.sj@jacon.io', action: 'Create', resource: 'Endpoint/aws-prod-eks', details: 'Registered new EKS cluster endpoint', severity: 'Info', ip: '10.0.1.100', status: 'allowed' },
    { id: 'evt-108', timestamp: '2024-05-20 09:45:00', user: 'kim.cs@jacon.io', action: 'Restart', resource: 'Pod/payment-service-x8d9', details: 'Manual restart triggered for memory leak investigation', severity: 'Warning', ip: '10.0.1.25', status: 'allowed' },
    { id: 'evt-109', timestamp: '2024-05-20 09:10:15', user: 'System', action: 'Backup', resource: 'Etcd/Snapshot', details: 'Scheduled hourly backup completed successfully', severity: 'Info', ip: 'System', status: 'allowed' },
    { id: 'evt-110', timestamp: '2024-05-20 08:30:45', user: 'yoon.sy@jacon.io', action: 'Scan', resource: 'Image/frontend:v2.4', details: 'Vulnerability scan detected 2 high severity CVEs', severity: 'High', ip: '192.168.0.88', status: 'allowed' },
    { id: 'evt-111', timestamp: '2024-05-20 08:05:11', user: 'han.js@jacon.io', action: 'Alert', resource: 'Monitor/DiskUsage', details: 'Acknowledged disk usage alert on node-worker-03', severity: 'Info', ip: '10.0.3.5', status: 'allowed' },
    { id: 'evt-112', timestamp: '2024-05-19 23:55:00', user: 'System', action: 'Heal', resource: 'Pod/redis-cache', details: 'Restarted crashed pod (OOMKilled)', severity: 'Warning', ip: 'System', status: 'allowed' },
    { id: 'evt-113', timestamp: '2024-05-19 18:40:22', user: 'kim.cs@jacon.io', action: 'Deploy', resource: 'Deployment/inventory-service', details: 'Rolled out version v1.2.0', severity: 'Info', ip: '10.0.1.25', status: 'allowed' },
    { id: 'evt-114', timestamp: '2024-05-19 15:30:10', user: 'lee.yh@jacon.io', action: 'Update', resource: 'Rbac/DeveloperRole', details: 'Removed "delete" permission on "production" namespace', severity: 'High', ip: '192.168.0.55', status: 'allowed' },
    { id: 'evt-115', timestamp: '2024-05-19 14:15:00', user: 'choi.jh@partner.io', action: 'Login', resource: 'System', details: 'Login successful', severity: 'Info', ip: '203.0.113.42', status: 'allowed' },
];
