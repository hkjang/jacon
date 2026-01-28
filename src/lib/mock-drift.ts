export interface DriftItem {
  id: string;
  resourceName: string;
  resourceKind: string;
  namespace: string;
  cluster: string;
  detectedAt: string;
  status: 'drifted' | 'synced';
  declaredState: string;
  actualState: string;
}

export const MOCK_DRIFT_ITEMS: DriftItem[] = [
  {
    id: 'drift-1',
    resourceName: 'payment-service',
    resourceKind: 'Deployment',
    namespace: 'payments',
    cluster: 'production-cluster-us',
    detectedAt: '2024-05-20T10:30:00Z',
    status: 'drifted',
    declaredState: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: payment
        image: payment:v1.2.0`,
    actualState: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
spec:
  replicas: 1  # Changed manually!
  template:
    spec:
      containers:
      - name: payment
        image: payment:v1.2.0`
  },
  {
    id: 'drift-2',
    resourceName: 'frontend-ingress',
    resourceKind: 'Ingress',
    namespace: 'frontend',
    cluster: 'production-cluster-eu',
    detectedAt: '2024-05-20T09:15:00Z',
    status: 'drifted',
    declaredState: `spec:
  rules:
  - host: app.jacon.io
    http:
      paths:
      - path: /
        pathType: Prefix`,
    actualState: `spec:
  rules:
  - host: app.jacon.io
    http:
      paths:
      - path: /
        pathType: Prefix
      - path: /admin
        pathType: Prefix`
  }
];
