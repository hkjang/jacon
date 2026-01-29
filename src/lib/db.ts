
import { AdminUser, MOCK_ADMIN_USERS, SystemSetting, MOCK_SYSTEM_SETTINGS } from './mock-admin';
import { Workload, MOCK_WORKLOADS } from './mock-workloads';
import { AuditLog, MOCK_AUDIT_LOGS } from './mock-audit';
import { User, MOCK_USERS } from './auth';

// Enterprise Auth Interfaces
export interface Session {
  sessionId: string;
  userId: string;
  createdAt: string;
  expiresAt: number; // Timestamp
  ip: string;
  userAgent: string;
  lastActive: number;
}

export interface ApiToken {
  id: string;
  userId: string;
  name: string;
  tokenHash: string; // Stored securely
  scopes: string[];
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
}

export interface Stack {
  id: string;
  name: string;
  type: 'compose' | 'kubernetes';
  content: string; // YAML content
  envVars: Record<string, string>;
  status: 'active' | 'inactive' | 'deploying' | 'failed';
  endpointId: string; // Where it is deployed
  createdAt: string;
  updatedAt: string;
}

// Simulated Database Class
class MockDatabase {
  private static instance: MockDatabase;
  
  public users: User[];
  public adminUsers: AdminUser[];
  public settings: SystemSetting[];
  public workloads: Workload[];
  public auditLogs: AuditLog[];
  public sessions: Session[];
  public apiTokens: ApiToken[];
  public stacks: Stack[];

  private constructor() {
    this.users = MOCK_USERS.map(u => ({
        ...u,
        passwordHash: 'hashed_password', // Default mock password
        mfaEnabled: u.role === 'admin', // Admins have MFA by default for testing
        failedLoginAttempts: 0
    }));
    this.adminUsers = [...MOCK_ADMIN_USERS];
    this.settings = [...MOCK_SYSTEM_SETTINGS];
    this.workloads = [...MOCK_WORKLOADS];
    this.auditLogs = [...MOCK_AUDIT_LOGS];
    this.sessions = [];
    this.apiTokens = [];
    this.stacks = [
        {
            id: 'stack-1',
            name: 'web-app-production',
            type: 'compose',
            content: 'version: "3"\nservices:\n  web:\n    image: nginx:latest\n    ports:\n      - "80:80"',
            envVars: { 'NODE_ENV': 'production' },
            status: 'active',
            endpointId: 'ep-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    console.log('Mock Database Initialized with Enterprise Schema');
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // --- Stack Operations ---
  getStacks() { return this.stacks; }
  
  getStack(id: string) { return this.stacks.find(s => s.id === id); }
  
  createStack(stack: Partial<Stack>) {
      const newStack: Stack = {
          id: `stack-${Date.now()}`,
          name: stack.name || 'Untitled Stack',
          type: stack.type || 'compose',
          content: stack.content || '',
          envVars: stack.envVars || {},
          status: 'deploying', // Start as deploying mostly
          endpointId: stack.endpointId || 'default',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
      };
      this.stacks.push(newStack);
      
      // Simulate deployment finish
      setTimeout(() => {
          newStack.status = 'active';
      }, 2000);
      
      this.addAuditLog('System', 'Create', `Stack/${newStack.name}`, 'Stack created and deployment started', 'Info');
      return newStack;
  }

  updateStack(id: string, updates: Partial<Stack>) {
      const stack = this.stacks.find(s => s.id === id);
      if (stack) {
          Object.assign(stack, updates);
          stack.updatedAt = new Date().toISOString();
          
          if (updates.content || updates.envVars) {
             stack.status = 'deploying';
             setTimeout(() => { stack.status = 'active'; }, 2000);
             this.addAuditLog('System', 'Update', `Stack/${stack.name}`, 'Stack re-deployed due to changes', 'Info');
          }
          return stack;
      }
      return null;
  }

  deleteStack(id: string) {
      const idx = this.stacks.findIndex(s => s.id === id);
      if (idx !== -1) {
          const removed = this.stacks[idx];
          this.stacks.splice(idx, 1);
          this.addAuditLog('System', 'Delete', `Stack/${removed.name}`, 'Stack deleted', 'Warning');
          return true;
      }
      return false;
  }

  // --- Session Operations ---
  createSession(userId: string, ip: string, userAgent: string): Session {
      // Clean up expired sessions first
      const now = Date.now();
      this.sessions = this.sessions.filter(s => s.expiresAt > now);

      const session: Session = {
          sessionId: `sess_${Math.random().toString(36).substring(2)}_${Date.now()}`,
          userId,
          createdAt: new Date().toISOString(),
          expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
          ip,
          userAgent,
          lastActive: now
      };
      this.sessions.push(session);
      return session;
  }

  getSession(sessionId: string): Session | undefined {
      const session = this.sessions.find(s => s.sessionId === sessionId);
      if (session && session.expiresAt > Date.now()) {
          session.lastActive = Date.now(); // Touch session
          return session;
      }
      return undefined;
  }

  revokeSession(sessionId: string) {
      this.sessions = this.sessions.filter(s => s.sessionId !== sessionId);
  }

  revokeAllUserSessions(userId: string) {
      this.sessions = this.sessions.filter(s => s.userId !== userId);
  }

  getUserSessions(userId: string) {
      return this.sessions.filter(s => s.userId === userId && s.expiresAt > Date.now());
  }

  // --- User Auth Operations ---
  findUserByEmail(email: string) {
      return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  incrementFailedLogin(userId: string) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
          user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
          if (user.failedLoginAttempts >= 5) {
              user.lockUntil = Date.now() + (15 * 60 * 1000); // 15 min lock
              this.addAuditLog(user.email, 'Security', 'User/Lockout', 'Account locked due to excessive failed attempts', 'High', 'System');
          }
      }
  }

  resetFailedLogin(userId: string) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
          user.failedLoginAttempts = 0;
          user.lockUntil = undefined;
      }
  }

  // --- API Token Operations ---
  createApiToken(userId: string, name: string, scopes: string[] = ['read']): string {
      const rawToken = `jat_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
      const tokenHash = `hash_${rawToken}`; // Mock hash
      
      this.apiTokens.push({
          id: `tok_${Date.now()}`,
          userId,
          name,
          tokenHash,
          scopes,
          createdAt: new Date().toISOString()
      });
      
      this.addAuditLog(userId, 'Create', 'ApiToken', `Created API token: ${name}`, 'Warning');
      return rawToken;
  }

  getApiTokens(userId: string) {
      return this.apiTokens.filter(t => t.userId === userId);
  }

  revokeApiToken(id: string) {
     const idx = this.apiTokens.findIndex(t => t.id === id);
     if (idx !== -1) {
         this.apiTokens.splice(idx, 1);
         return true;
     }
     return false;
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
      id: `evt-${Date.now()}_${Math.random().toString(36).substring(7)}`, // Improved uniqueness
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
