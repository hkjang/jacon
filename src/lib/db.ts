
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

export interface GitRepo {
  id: string;
  name: string;
  url: string;
  branch: string;
  authType: 'public' | 'token' | 'ssh';
  lastSync: string | null;
  status: 'synced' | 'syncing' | 'failed' | 'pending';
  autoSync: boolean;
  createdAt: string;
}

export interface Endpoint {
  id: string;
  projectId: string;
  name: string;
  type: 'Kubernetes' | 'Docker' | 'Swarm';
  status: 'Online' | 'Offline' | 'Degraded' | 'Warning';
  url: string;
  version: string;
  tags: string[];
  lastSeen: string;
  isEdge: boolean;
  connectionMode: 'direct' | 'agent';
  groupId?: string;
}

export interface EndpointGroup {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface Registry {
  id: string;
  name: string;
  type: 'dockerhub' | 'acr' | 'ecr' | 'gcr' | 'other';
  url: string;
  username?: string;
  associatedEndpoints: string[];
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  regoContent: string;
  enforcementLevel: 'mandatory' | 'advisory';
  target: 'kubernetes' | 'terraform' | 'api';
  status: 'active' | 'disabled';
}

export interface IamRole {
  id: string;
  name: string;
  type: 'system' | 'custom';
  permissions: string[];
  description: string;
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
  public gitRepos: GitRepo[];
  public endpoints: Endpoint[];
  public endpointGroups: EndpointGroup[];
  public registries: Registry[];
  public policies: Policy[];
  public iamRoles: IamRole[];

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
    this.gitRepos = [
        {
            id: 'repo-1',
            name: 'jacon-demo-apps',
            url: 'https://github.com/jacon-io/demo-apps.git',
            branch: 'main',
            authType: 'public',
            lastSync: new Date().toISOString(),
            status: 'synced',
            autoSync: true,
            createdAt: new Date().toISOString()
        }
    ];
    this.endpoints = [
        {
            id: 'ep-1',
            projectId: 'default',
            name: 'Production Cluster',
            type: 'Kubernetes',
            status: 'Online',
            url: 'https://k8s.example.com',
            version: 'v1.28.0',
            tags: ['production'],
            lastSeen: 'Just now',
            isEdge: false,
            connectionMode: 'direct'
        },
        {
            id: 'ep-5',
            projectId: 'default',
            name: 'Edge Node 1',
            type: 'Docker',
            status: 'Online',
            url: 'tcp://edge1.example.com:2375',
            version: '24.0.0',
            tags: ['edge'],
            lastSeen: '5 minutes ago',
            isEdge: true,
            connectionMode: 'agent'
        }
    ];
    this.endpointGroups = [
        {
            id: 'group-1',
            name: 'Production',
            description: 'Production environment endpoints',
            tags: ['production']
        }
    ];
    this.registries = [
        { id: 'reg-1', name: 'Docker Hub', type: 'dockerhub', url: 'https://index.docker.io/v1/', associatedEndpoints: ['ep-1', 'ep-5'] }
    ];
    this.policies = [
        {
            id: 'pol-1',
            name: 'Disallow Latest Tag',
            description: 'Ensure containers do not use the :latest tag',
            regoContent: 'package kubernetes.validating\n\ndeny[msg] {\n  input.request.kind.kind == "Pod"\n  image := input.request.object.spec.containers[_].image\n  endswith(image, ":latest")\n  msg := sprintf("Image %v uses :latest tag", [image])\n}',
            enforcementLevel: 'advisory',
            target: 'kubernetes',
            status: 'active'
        }
    ];
    this.iamRoles = [
        { id: 'role-admin', name: 'Administrator', type: 'system', description: 'Full access to all resources', permissions: ['*'] },
        { id: 'role-readonly', name: 'Read Only', type: 'system', description: 'View-only access', permissions: ['read:*'] }
    ];
    
    console.log('Mock Database Initialized with Enterprise Schema');
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // --- Endpoint Operations ---
  getEndpoints() { return this.endpoints ?? []; }

  getEdgeEndpoints() { return (this.endpoints ?? []).filter(e => e.isEdge); }

  addEndpoint(ep: Partial<Endpoint>) {
      const newEp: Endpoint = {
          id: `ep-${Date.now()}`,
          projectId: ep.projectId || 'default',
          name: ep.name || 'New Endpoint',
          type: ep.type || 'Kubernetes',
          status: 'Online',
          url: ep.url || '',
          version: 'v1.0.0',
          tags: ep.tags || [],
          lastSeen: 'Just now',
          isEdge: ep.isEdge || false,
          connectionMode: ep.connectionMode || 'direct',
          groupId: ep.groupId
      };
      this.endpoints.push(newEp);
      this.addAuditLog('System', 'Register', `Endpoint/${newEp.name}`, 'Endpoint registered', 'Info');
      return newEp;
  }

  // --- Endpoint Group Operations ---
  getEndpointGroups() { return this.endpointGroups ?? []; }

  createEndpointGroup(group: Partial<EndpointGroup>) {
      const newGroup: EndpointGroup = {
          id: `group-${Date.now()}`,
          name: group.name || 'Untitled Group',
          description: group.description || '',
          tags: group.tags || []
      };
      this.endpointGroups.push(newGroup);
      return newGroup;
  }

  // --- Registry Operations ---
  getRegistries() { return this.registries ?? []; }

  addRegistry(reg: Partial<Registry>) {
      const newReg: Registry = {
          id: `reg-${Date.now()}`,
          name: reg.name || 'New Registry',
          type: reg.type || 'other',
          url: reg.url || '',
          associatedEndpoints: []
      };
      this.registries.push(newReg);
      return newReg;
  }

  // --- Policy Operations ---
  getPolicies() { return this.policies ?? []; }
  
  addPolicy(policy: Partial<Policy>) {
      const newPol: Policy = {
          id: `pol-${Date.now()}`,
          name: policy.name || 'New Policy',
          description: policy.description || '',
          regoContent: policy.regoContent || '',
          enforcementLevel: policy.enforcementLevel || 'advisory',
          target: policy.target || 'kubernetes',
          status: 'active'
      };
      this.policies.push(newPol);
      this.addAuditLog('System', 'Create', `Policy/${newPol.name}`, 'Policy created', 'Warning');
      return newPol;
  }

  updatePolicy(id: string, updates: Partial<Policy>) {
      if (!id) return null;
      const pol = this.policies?.find(p => p.id === id);
      if (pol) {
          Object.assign(pol, updates);
          return pol;
      }
      return null;
  }

  // --- IAM Operations ---
  getIamRoles() { return this.iamRoles ?? []; }

  // --- GitOps Operations ---
  getGitRepos() { return this.gitRepos ?? []; }
  
  addGitRepo(repo: Partial<GitRepo>) {
      const newRepo: GitRepo = {
          id: `repo-${Date.now()}`,
          name: repo.name || 'Untitled Repo',
          url: repo.url || '',
          branch: repo.branch || 'main',
          authType: repo.authType || 'public',
          lastSync: null,
          status: 'pending',
          autoSync: repo.autoSync || false,
          createdAt: new Date().toISOString()
      };
      this.gitRepos.push(newRepo);
      this.addAuditLog('System', 'Register', `GitRepo/${newRepo.name}`, 'Repository connected', 'Info');
      return newRepo;
  }

  removeGitRepo(id: string) {
      if (!id) return false;
      const idx = this.gitRepos?.findIndex(r => r.id === id) ?? -1;
      if (idx !== -1) {
          const removed = this.gitRepos[idx];
          this.gitRepos.splice(idx, 1);
          this.addAuditLog('System', 'Remove', `GitRepo/${removed.name}`, 'Repository disconnected', 'Warning');
          return true;
      }
      return false;
  }

  updateGitRepoStatus(id: string, status: GitRepo['status'], lastSync?: string) {
      if (!id) return false;
      const repo = this.gitRepos?.find(r => r.id === id);
      if (repo) {
          repo.status = status;
          if (lastSync) repo.lastSync = lastSync;
          return true;
      }
      return false;
  }

  // --- Stack Operations ---
  getStacks() { return this.stacks ?? []; }

  getStack(id: string) {
    if (!id) return undefined;
    return this.stacks?.find(s => s.id === id);
  }
  
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
      if (!id) return false;
      const idx = this.stacks?.findIndex(s => s.id === id) ?? -1;
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
      if (!email) return undefined;
      return this.users?.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  incrementFailedLogin(userId: string) {
      if (!userId) return false;
      const user = this.users?.find(u => u.id === userId);
      if (user) {
          user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
          if (user.failedLoginAttempts >= 5) {
              user.lockUntil = Date.now() + (15 * 60 * 1000); // 15 min lock
              this.addAuditLog(user.email, 'Security', 'User/Lockout', 'Account locked due to excessive failed attempts', 'High', 'System');
          }
          return true;
      }
      return false;
  }

  resetFailedLogin(userId: string) {
      if (!userId) return false;
      const user = this.users?.find(u => u.id === userId);
      if (user) {
          user.failedLoginAttempts = 0;
          user.lockUntil = undefined;
          return true;
      }
      return false;
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
  getUsers() { return this.users ?? []; }

  getAdminUsers() { return this.adminUsers ?? []; }
  
  updateAdminUserStatus(id: string, status: 'Active' | 'Locked' | 'Pending') {
    if (!id) return false;
    const user = this.adminUsers?.find(u => u.id === id);
    if (user) {
      user.status = status;
      this.addAuditLog('System', 'Update', `User/${user.name}`, `Changed status to ${status}`, 'Info', 'System');
      return true;
    }
    return false;
  }

  deleteAdminUser(id: string) {
    if (!id) return false;
    const idx = this.adminUsers?.findIndex(u => u.id === id) ?? -1;
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
  getSettings() { return this.settings ?? []; }

  updateSetting(key: string, value: any) {
    if (!key) return false;
    const setting = this.settings?.find(s => s.key === key);
    if (setting) {
      const oldValue = setting.value;
      setting.value = value;
      this.addAuditLog('System', 'Update', `Setting/${key}`, `Changed from ${oldValue} to ${value}`, 'High', 'System');
      return true;
    }
    return false;
  }


  // --- Workload Operations ---
  getWorkloads() { return this.workloads ?? []; }

  getWorkload(id: string) {
    if (!id) return undefined;
    return this.workloads?.find(w => w.id === id);
  }

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
      if (!id) return null;
      const w = this.workloads?.find(w => w.id === id);
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
  getAuditLogs() { return (this.auditLogs ?? []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); }

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
