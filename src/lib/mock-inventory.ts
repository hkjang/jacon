import { TreeNode } from '@/components/ui/tree-view';
import { FiServer, FiLayers, FiBox } from 'react-icons/fi';

export const MOCK_INVENTORY: TreeNode[] = [
  {
    id: 'cluster-1',
    label: 'production-us-east',
    icon: FiServer,
    children: [
      {
        id: 'ns-backend',
        label: 'backend',
        icon: FiLayers,
        children: [
          { id: 'deploy-api', label: 'api-server (Deployment)', icon: FiBox },
          { id: 'deploy-worker', label: 'worker (Deployment)', icon: FiBox },
          { id: 'sts-db', label: 'postgres (StatefulSet)', icon: FiBox },
        ]
      },
      {
        id: 'ns-frontend',
        label: 'frontend',
        icon: FiLayers,
        children: [
          { id: 'deploy-web', label: 'web-app (Deployment)', icon: FiBox },
        ]
      }
    ]
  },
  {
    id: 'cluster-2',
    label: 'staging-eu-west',
    icon: FiServer,
    children: [
      {
        id: 'ns-staging',
        label: 'staging',
        icon: FiLayers,
        children: [
          { id: 'deploy-monolith', label: 'monolith (Deployment)', icon: FiBox },
        ]
      }
    ]
  },
  {
    id: 'docker-standalone',
    label: 'docker-host-01',
    icon: FiServer,
    children: [
      { id: 'c-redis', label: 'redis (Container)', icon: FiBox },
      { id: 'c-nginx', label: 'nginx (Container)', icon: FiBox },
    ]
  }
];
