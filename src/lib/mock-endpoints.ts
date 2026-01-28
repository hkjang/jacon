export interface Endpoint {
  id: string;
  projectId: string; // Foreign key to Project
  name: string;
  type: 'Kubernetes' | 'Docker';
  status: 'Online' | 'Offline' | 'Warning';
  url: string;
  version: string;
  tags: string[];
  lastSeen: string;
}

export const MOCK_ENDPOINTS: Endpoint[] = [
  {
    id: 'ep-1',
    projectId: 'proj-1',
    name: 'production-cluster-us',
    type: 'Kubernetes',
    status: 'Online',
    url: 'https://api.k8s.prod.us:6443',
    version: 'v1.28.2',
    tags: ['aws', 'production', 'east'],
    lastSeen: 'Now'
  },
  {
    id: 'ep-2',
    projectId: 'proj-1',
    name: 'production-cluster-eu',
    type: 'Kubernetes',
    status: 'Online',
    url: 'https://api.k8s.prod.eu:6443',
    version: 'v1.27.5',
    tags: ['gcp', 'production', 'west'],
    lastSeen: '1 min ago'
  },
  {
    id: 'ep-3',
    projectId: 'proj-2',
    name: 'staging-docker-swarm',
    type: 'Docker',
    status: 'Warning',
    url: 'tcp://swarm.staging:2376',
    version: '24.0.5',
    tags: ['on-prem', 'staging'],
    lastSeen: '5 mins ago'
  },
  {
    id: 'ep-4',
    projectId: 'proj-3',
    name: 'dev-k3s',
    type: 'Kubernetes',
    status: 'Offline',
    url: 'https://192.168.1.50:6443',
    version: 'v1.29.0+k3s1',
    tags: ['iot', 'dev', 'edge'],
    lastSeen: '2 days ago'
  }
];
