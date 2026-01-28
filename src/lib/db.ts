
import { AdminUser, MOCK_ADMIN_USERS, SystemSetting, MOCK_SYSTEM_SETTINGS } from './mock-admin';
import { Workload, MOCK_WORKLOADS } from './mock-workloads';
import { AuditLog, MOCK_AUDIT_LOGS } from './mock-audit';
import { User, MOCK_USERS } from './auth';

// Simulated Database Class
class MockDatabase {
  private static instance: MockDatabase;
  
  public users: User[];
  public adminUsers: AdminUser[];
  public settings: SystemSetting[];
  public workloads: Workload[];
  public auditLogs: AuditLog[];

  private constructor() {
    this.users = [...MOCK_USERS];
    this.adminUsers = [...MOCK_ADMIN_USERS];
    this.settings = [...MOCK_SYSTEM_SETTINGS];
    this.workloads = [...MOCK_WORKLOADS];
    this.auditLogs = [...MOCK_AUDIT_LOGS];
    
    console.log('Mock Database Initialized');
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // --- User Operations ---
  getUsers() { return this.users; }
  
  getAdminUsers() { return this.adminUsers; }
  
  updateAdminUserStatus(id: string, status: 'Active' | 'Locked' | 'Pending') {
    const user = this.adminUsers.find(u => u.id === id);
    if (user) {
      user.status = status;
      this.addAuditLog('System', 'Update', `User/${user.name}`, `Changed status to ${status}`, 'Info', 'System');
      return true;
    }
    return false;
  }

  deleteAdminUser(id: string) {
    const idx = this.adminUsers.findIndex(u => u.id === id);
    if (idx !== -1) {
      const removed = this.adminUsers[idx];
      this.adminUsers.splice(idx, 1);
      this.addAuditLog('System', 'Delete', `User/${removed.name}`, 'User deleted', 'High', 'System');
      return true;
    }
    return false;
  }

  inviteUser(email: string, role: any, name: string) {
      const newUser: AdminUser = {
          id: `admin-${Date.now()}`,
          name: name,
          email: email,
          role: role,
          status: 'Pending',
          lastLogin: '-',
          department: 'Pending Assignment'
      };
      this.adminUsers.push(newUser);
      this.addAuditLog('System', 'Create', `User/${name}`, 'User invited', 'Info', 'System');
      return newUser;
  }

  // --- Settings Operations ---
  getSettings() { return this.settings; }
  
  updateSetting(key: string, value: any) {
    const setting = this.settings.find(s => s.key === key);
    if (setting) {
      const oldValue = setting.value;
      setting.value = value;
      this.addAuditLog('System', 'Update', `Setting/${key}`, `Changed from ${oldValue} to ${value}`, 'High', 'System');
      return true;
    }
    return false;
  }


  // --- Workload Operations ---
  getWorkloads() { return this.workloads; }
  
  getWorkload(id: string) { return this.workloads.find(w => w.id === id); }

  addWorkload(workload: Partial<Workload>) {
      const newWorkload: Workload = {
          id: `w-${Date.now()}`,
          name: workload.name || 'unnamed',
          namespace: workload.namespace || 'default',
          type: workload.type || 'Deployment',
          status: workload.status || 'Pending',
          cluster: workload.cluster || 'default-cluster',
          restarts: 0,
          age: 'Just now',
          image: workload.image || 'nginx:latest',
          replicas: workload.replicas || '1/1',
          cpu: workload.cpu || '100m',
          memory: workload.memory || '128Mi'
      };
      this.workloads.push(newWorkload);
      return newWorkload;
  }

  updateWorkloadStatus(id: string, status: any) {
      const w = this.workloads.find(w => w.id === id);
      if (w) {
          w.status = status;
          if (status === 'Running' && w.status !== 'Running') {
             // Status recovery
          } else {
             w.restarts += 0; // Only increment on crash logic usually
          }
          this.addAuditLog('System', 'Update', `Workload/${w.name}`, `Status update: ${status}`, 'Info', 'System');
          return w;
      }
      return null;
  }

  // --- Audit Operations ---
  getAuditLogs() { return this.auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); }

  addAuditLog(user: string, action: string, resource: string, details: string, severity: 'Info' | 'High' | 'Critical' | 'Warning' = 'Info', ip: string = '127.0.0.1') {
    const newLog: AuditLog = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      action,
      resource,
      details,
      severity,
      ip,
      status: 'allowed'
    };
    this.auditLogs.unshift(newLog);
  }
}

export const db = MockDatabase.getInstance();
