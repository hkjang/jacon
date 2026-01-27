export interface Workload {
  id: string;
  name: string;
  type: 'Pod' | 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'Container';
  namespace: string;
  cluster: string;
  status: 'Running' | 'Pending' | 'Failed' | 'CrashLoopBackOff' | 'Completed';
  restarts: number;
  age: string;
}

export const MOCK_WORKLOADS: Workload[] = [
  { id: '1', name: 'api-server-7fb96c8d4-5z2lx', type: 'Pod', namespace: 'backend', cluster: 'production-us-east', status: 'Running', restarts: 0, age: '2d' },
  { id: '2', name: 'api-server-7fb96c8d4-x9q2m', type: 'Pod', namespace: 'backend', cluster: 'production-us-east', status: 'Running', restarts: 0, age: '2d' },
  { id: '3', name: 'postgres-0', type: 'Pod', namespace: 'backend', cluster: 'production-us-east', status: 'Running', restarts: 1, age: '5d' },
  { id: '4', name: 'web-app-84c9b9f7f-k2l9p', type: 'Pod', namespace: 'frontend', cluster: 'production-us-east', status: 'Running', restarts: 0, age: '12h' },
  { id: '5', name: 'monolith-5d468f7c9-p8m2j', type: 'Pod', namespace: 'staging', cluster: 'staging-eu-west', status: 'CrashLoopBackOff', restarts: 12, age: '30m' },
  { id: '6', name: 'redis', type: 'Container', namespace: '-', cluster: 'docker-host-01', status: 'Running', restarts: 0, age: '10d' },
  { id: '7', name: 'nginx-proxy', type: 'Container', namespace: '-', cluster: 'docker-host-01', status: 'Running', restarts: 0, age: '10d' },
];
