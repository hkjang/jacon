
export interface Workload {
    id: string;
    name: string;
    namespace: string;
    cluster: string;
    status: 'Running' | 'Pending' | 'Failed' | 'Unknown' | 'CrashLoopBackOff';
    replicas: string;
    age: string;
    image: string;
    cpu: string;
    memory: string;
    restarts: number;
    type: 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'Job' | 'CronJob';
}

export const MOCK_WORKLOADS: Workload[] = [
    { id: 'w-1', name: 'api-gateway', namespace: 'production', cluster: 'prod-cluster-01', status: 'Running', replicas: '3/3', age: '14d', image: 'nginx:1.21-alpine', cpu: '120m', memory: '256Mi', restarts: 0, type: 'Deployment' },
    { id: 'w-2', name: 'auth-service', namespace: 'production', cluster: 'prod-cluster-01', status: 'Running', replicas: '2/2', age: '14d', image: 'auth-svc:v2.4.1', cpu: '300m', memory: '512Mi', restarts: 2, type: 'Deployment' },
    { id: 'w-3', name: 'payment-processor', namespace: 'production', cluster: 'prod-cluster-01', status: 'Running', replicas: '5/5', age: '3d', image: 'payment:v1.0.9', cpu: '800m', memory: '1.2Gi', restarts: 0, type: 'Deployment' },
    { id: 'w-4', name: 'data-analytics', namespace: 'analytics', cluster: 'prod-cluster-02', status: 'Pending', replicas: '0/2', age: '5m', image: 'spark-job:latest', cpu: '2000m', memory: '8Gi', restarts: 0, type: 'Job' },
    { id: 'w-5', name: 'notification-sender', namespace: 'production', cluster: 'prod-cluster-01', status: 'Failed', replicas: '1/3', age: '12h', image: 'notifier:v3.1.0-beta', cpu: '100m', memory: '128Mi', restarts: 15, type: 'Deployment' },
    { id: 'w-6', name: 'redis-cache-primary', namespace: 'production', cluster: 'prod-cluster-01', status: 'Running', replicas: '1/1', age: '30d', image: 'redis:6.2', cpu: '500m', memory: '2Gi', restarts: 1, type: 'StatefulSet' },
    { id: 'w-7', name: 'frontend-web', namespace: 'frontend', cluster: 'prod-cluster-01', status: 'Running', replicas: '4/4', age: '2d', image: 'react-app:v4.5.2', cpu: '150m', memory: '300Mi', restarts: 0, type: 'Deployment' },
    { id: 'w-8', name: 'log-collector', namespace: 'monitoring', cluster: 'mgmt-cluster', status: 'Running', replicas: '10/10', age: '45d', image: 'fluentd:v1.14', cpu: '200m', memory: '400Mi', restarts: 5, type: 'DaemonSet' },
    { id: 'w-9', name: 'db-migration-job', namespace: 'production', cluster: 'prod-cluster-01', status: 'Failed', replicas: '0/1', age: '1h', image: 'migrate:v0.2', cpu: '0m', memory: '0Mi', restarts: 1, type: 'Job' },
    { id: 'w-10', name: 'kafka-broker', namespace: 'streaming', cluster: 'data-cluster', status: 'Running', replicas: '3/3', age: '60d', image: 'kafka:2.8', cpu: '1500m', memory: '4Gi', restarts: 0, type: 'StatefulSet' },
    { id: 'w-11', name: 'inventory-svc', namespace: 'inventory', cluster: 'prod-cluster-01', status: 'Running', replicas: '2/2', age: '5d', image: 'inventory:v1.1', cpu: '100m', memory: '200Mi', restarts: 0, type: 'Deployment' },
    { id: 'w-12', name: 'search-engine', namespace: 'search', cluster: 'prod-cluster-01', status: 'Unknown', replicas: '1/2', age: '1d', image: 'elasticsearch:7.10', cpu: '2500m', memory: '6Gi', restarts: 3, type: 'StatefulSet' },
];
