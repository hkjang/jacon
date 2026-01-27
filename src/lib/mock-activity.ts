export interface Activity {
  id: string;
  type: 'deploy' | 'scale' | 'alert' | 'config';
  message: string;
  user: string;
  timestamp: string;
  status: 'success' | 'failure' | 'warning';
}

export const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', type: 'deploy', message: 'Deployed backend/api-server:v1.2.0', user: 'admin', timestamp: '10 mins ago', status: 'success' },
  { id: '2', type: 'scale', message: 'Scaled up frontend/web-app to 5 replicas', user: 'sre-team', timestamp: '1 hour ago', status: 'success' },
  { id: '3', type: 'alert', message: 'High CPU usage on node-03 (95%)', user: 'system', timestamp: '2 hours ago', status: 'warning' },
  { id: '4', type: 'config', message: 'Updated Secret backend/db-creds', user: 'admin', timestamp: '5 hours ago', status: 'success' },
  { id: '5', type: 'deploy', message: 'Failed deployment staging/monolith (CrashLoopBackOff)', user: 'ci-bot', timestamp: '1 day ago', status: 'failure' },
];
