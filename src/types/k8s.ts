// Kubernetes 리소스 타입 정의

// 공통 메타데이터
export interface K8sMetadata {
  name: string;
  namespace: string;
  uid?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  creationTimestamp?: string;
  resourceVersion?: string;
}

// 리소스 조건
export interface K8sCondition {
  type: string;
  status: 'True' | 'False' | 'Unknown';
  reason?: string;
  message?: string;
  lastTransitionTime?: string;
  lastUpdateTime?: string;
}

// =============================================================================
// 워크로드 리소스
// =============================================================================

export type WorkloadType = 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'Job' | 'CronJob' | 'Pod' | 'ReplicaSet';

export type WorkloadStatus =
  | 'Running'
  | 'Pending'
  | 'Failed'
  | 'CrashLoopBackOff'
  | 'ImagePullBackOff'
  | 'Unknown'
  | 'Terminating'
  | 'Succeeded'
  | 'ContainerCreating'
  | 'ErrImagePull';

// 컨테이너 정의
export interface Container {
  name: string;
  image: string;
  imagePullPolicy?: 'Always' | 'IfNotPresent' | 'Never';
  ports?: ContainerPort[];
  env?: EnvVar[];
  envFrom?: EnvFromSource[];
  resources?: ResourceRequirements;
  volumeMounts?: VolumeMount[];
  command?: string[];
  args?: string[];
  livenessProbe?: Probe;
  readinessProbe?: Probe;
  startupProbe?: Probe;
}

export interface ContainerPort {
  name?: string;
  containerPort: number;
  protocol?: 'TCP' | 'UDP' | 'SCTP';
}

export interface EnvVar {
  name: string;
  value?: string;
  valueFrom?: EnvVarSource;
}

export interface EnvVarSource {
  configMapKeyRef?: ConfigMapKeySelector;
  secretKeyRef?: SecretKeySelector;
  fieldRef?: ObjectFieldSelector;
}

export interface ConfigMapKeySelector {
  name: string;
  key: string;
  optional?: boolean;
}

export interface SecretKeySelector {
  name: string;
  key: string;
  optional?: boolean;
}

export interface ObjectFieldSelector {
  fieldPath: string;
}

export interface EnvFromSource {
  configMapRef?: { name: string; optional?: boolean };
  secretRef?: { name: string; optional?: boolean };
  prefix?: string;
}

export interface ResourceRequirements {
  limits?: { cpu?: string; memory?: string; [key: string]: string | undefined };
  requests?: { cpu?: string; memory?: string; [key: string]: string | undefined };
}

export interface VolumeMount {
  name: string;
  mountPath: string;
  subPath?: string;
  readOnly?: boolean;
}

export interface Probe {
  httpGet?: { path: string; port: number | string; scheme?: 'HTTP' | 'HTTPS' };
  tcpSocket?: { port: number | string };
  exec?: { command: string[] };
  initialDelaySeconds?: number;
  periodSeconds?: number;
  timeoutSeconds?: number;
  successThreshold?: number;
  failureThreshold?: number;
}

// 워크로드 (확장된 버전)
export interface Workload {
  id: string;
  name: string;
  namespace: string;
  type: WorkloadType;
  status: WorkloadStatus;
  cluster: string;

  // 레플리카 정보
  replicas: string; // "3/3" 형식
  desiredReplicas?: number;
  readyReplicas?: number;
  availableReplicas?: number;

  // 컨테이너 정보
  image: string;
  containers?: Container[];

  // 리소스
  cpu: string;
  memory: string;

  // 상태 정보
  restarts: number;
  age: string;
  lastUpdated?: string;

  // 조건
  conditions?: K8sCondition[];

  // 라벨 및 셀렉터
  labels?: Record<string, string>;
  selector?: Record<string, string>;

  // 전략
  strategy?: {
    type: 'RollingUpdate' | 'Recreate';
    rollingUpdate?: {
      maxSurge?: string | number;
      maxUnavailable?: string | number;
    };
  };
}

// =============================================================================
// 네임스페이스
// =============================================================================

export type NamespacePhase = 'Active' | 'Terminating';

export interface Namespace {
  id: string;
  name: string;
  status: NamespacePhase;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  createdAt: string;

  // 리소스 사용량 (집계)
  resourceUsage?: {
    pods: number;
    deployments: number;
    services: number;
    configMaps: number;
    secrets: number;
    cpuUsed?: string;
    cpuLimit?: string;
    memoryUsed?: string;
    memoryLimit?: string;
  };

  // 리소스 쿼터
  resourceQuota?: ResourceQuota;

  // 리밋 레인지
  limitRange?: LimitRange;
}

export interface ResourceQuota {
  hard: Record<string, string>;
  used?: Record<string, string>;
}

export interface LimitRange {
  limits: LimitRangeItem[];
}

export interface LimitRangeItem {
  type: 'Container' | 'Pod' | 'PersistentVolumeClaim';
  default?: { cpu?: string; memory?: string };
  defaultRequest?: { cpu?: string; memory?: string };
  max?: { cpu?: string; memory?: string };
  min?: { cpu?: string; memory?: string };
}

// =============================================================================
// 서비스 & 네트워킹
// =============================================================================

export type ServiceType = 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName';

export interface Service {
  id: string;
  name: string;
  namespace: string;
  type: ServiceType;
  clusterIP?: string;
  externalIP?: string;
  ports: ServicePort[];
  selector?: Record<string, string>;
  createdAt: string;

  // 상태
  status?: 'Active' | 'Pending';

  // 로드밸런서 정보
  loadBalancerIngress?: { ip?: string; hostname?: string }[];
}

export interface ServicePort {
  name?: string;
  port: number;
  targetPort: number | string;
  nodePort?: number;
  protocol?: 'TCP' | 'UDP' | 'SCTP';
}

export type IngressClassName = string;

export interface Ingress {
  id: string;
  name: string;
  namespace: string;
  className?: IngressClassName;
  rules: IngressRule[];
  tls?: IngressTLS[];
  createdAt: string;

  // 상태
  loadBalancerIngress?: { ip?: string; hostname?: string }[];
}

export interface IngressRule {
  host?: string;
  http?: {
    paths: IngressPath[];
  };
}

export interface IngressPath {
  path: string;
  pathType: 'Prefix' | 'Exact' | 'ImplementationSpecific';
  backend: {
    service: {
      name: string;
      port: { number?: number; name?: string };
    };
  };
}

export interface IngressTLS {
  hosts?: string[];
  secretName?: string;
}

// =============================================================================
// 스토리지
// =============================================================================

export type PVAccessMode = 'ReadWriteOnce' | 'ReadOnlyMany' | 'ReadWriteMany' | 'ReadWriteOncePod';
export type PVReclaimPolicy = 'Retain' | 'Delete' | 'Recycle';
export type PVPhase = 'Available' | 'Bound' | 'Released' | 'Failed' | 'Pending';
export type PVCPhase = 'Pending' | 'Bound' | 'Lost';

export interface PersistentVolume {
  id: string;
  name: string;
  capacity: string;
  accessModes: PVAccessMode[];
  reclaimPolicy: PVReclaimPolicy;
  storageClassName?: string;
  status: PVPhase;
  claimRef?: {
    name: string;
    namespace: string;
  };
  createdAt: string;

  // 볼륨 소스 (하나만 설정)
  source?: {
    type: 'hostPath' | 'nfs' | 'csi' | 'local' | 'awsElasticBlockStore' | 'gcePersistentDisk' | 'azureDisk';
    path?: string;
    server?: string;
    driver?: string;
  };
}

export interface PersistentVolumeClaim {
  id: string;
  name: string;
  namespace: string;
  storageClassName?: string;
  accessModes: PVAccessMode[];
  requestedStorage: string;
  status: PVCPhase;
  volumeName?: string;
  createdAt: string;

  // 사용량
  usedBy?: {
    type: 'Pod' | 'Deployment' | 'StatefulSet';
    name: string;
  }[];
}

export interface StorageClass {
  id: string;
  name: string;
  provisioner: string;
  reclaimPolicy?: PVReclaimPolicy;
  volumeBindingMode?: 'Immediate' | 'WaitForFirstConsumer';
  allowVolumeExpansion?: boolean;
  isDefault?: boolean;
  parameters?: Record<string, string>;
  createdAt: string;
}

// =============================================================================
// ConfigMap & Secret
// =============================================================================

export type ConfigType = 'ConfigMap' | 'Secret';
export type SecretType =
  | 'Opaque'
  | 'kubernetes.io/service-account-token'
  | 'kubernetes.io/dockercfg'
  | 'kubernetes.io/dockerconfigjson'
  | 'kubernetes.io/basic-auth'
  | 'kubernetes.io/ssh-auth'
  | 'kubernetes.io/tls'
  | 'bootstrap.kubernetes.io/token';

export interface ConfigItem {
  id: string;
  name: string;
  namespace: string;
  type: ConfigType;
  data: Record<string, string>;
  keys: string[];
  createdAt: string;

  // Secret 전용
  secretType?: SecretType;

  // 불변 여부
  immutable?: boolean;

  // 사용처
  usedBy?: {
    type: 'Pod' | 'Deployment' | 'StatefulSet' | 'DaemonSet';
    name: string;
    mountType: 'env' | 'volume';
  }[];
}

// =============================================================================
// 이벤트
// =============================================================================

export type EventType = 'Normal' | 'Warning';

export interface K8sEvent {
  id: string;
  type: EventType;
  reason: string;
  message: string;
  source: {
    component?: string;
    host?: string;
  };
  involvedObject: {
    kind: string;
    name: string;
    namespace?: string;
    uid?: string;
  };
  firstTimestamp?: string;
  lastTimestamp?: string;
  count?: number;
}

// =============================================================================
// 노드
// =============================================================================

export type NodeConditionType = 'Ready' | 'MemoryPressure' | 'DiskPressure' | 'PIDPressure' | 'NetworkUnavailable';

export interface Node {
  id: string;
  name: string;
  status: 'Ready' | 'NotReady' | 'Unknown';
  roles: string[]; // ['control-plane', 'worker', 'master']
  version: string;
  internalIP?: string;
  externalIP?: string;
  os?: string;
  architecture?: string;
  containerRuntime?: string;
  createdAt: string;

  // 리소스
  capacity: {
    cpu: string;
    memory: string;
    pods: string;
  };
  allocatable: {
    cpu: string;
    memory: string;
    pods: string;
  };

  // 사용량
  usage?: {
    cpu: string;
    cpuPercent: number;
    memory: string;
    memoryPercent: number;
    pods: number;
  };

  // 조건
  conditions?: K8sCondition[];

  // 테인트
  taints?: {
    key: string;
    value?: string;
    effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
  }[];

  // 라벨
  labels?: Record<string, string>;
}

// =============================================================================
// 클러스터
// =============================================================================

export interface Cluster {
  id: string;
  name: string;
  provider: 'kubernetes' | 'docker' | 'swarm' | 'eks' | 'aks' | 'gke' | 'custom';
  version: string;
  status: 'Online' | 'Offline' | 'Degraded' | 'Warning';
  apiServer: string;

  // 노드 정보
  nodes: {
    total: number;
    ready: number;
  };

  // 리소스 사용량
  resources: {
    cpuCapacity: string;
    cpuUsed: string;
    cpuPercent: number;
    memoryCapacity: string;
    memoryUsed: string;
    memoryPercent: number;
    podsCapacity: number;
    podsUsed: number;
  };

  // 워크로드 개수
  workloads: {
    deployments: number;
    statefulSets: number;
    daemonSets: number;
    jobs: number;
    pods: number;
  };

  // 연결 정보
  lastSeen: string;
  createdAt: string;

  // 태그
  tags?: string[];

  // 인증 정보
  authType?: 'kubeconfig' | 'token' | 'certificate';
}

// =============================================================================
// RBAC
// =============================================================================

export interface Role {
  id: string;
  name: string;
  namespace?: string; // null이면 ClusterRole
  rules: PolicyRule[];
  createdAt: string;
}

export interface PolicyRule {
  apiGroups: string[];
  resources: string[];
  verbs: ('get' | 'list' | 'watch' | 'create' | 'update' | 'patch' | 'delete' | '*')[];
  resourceNames?: string[];
}

export interface RoleBinding {
  id: string;
  name: string;
  namespace?: string; // null이면 ClusterRoleBinding
  roleRef: {
    kind: 'Role' | 'ClusterRole';
    name: string;
  };
  subjects: Subject[];
  createdAt: string;
}

export interface Subject {
  kind: 'User' | 'Group' | 'ServiceAccount';
  name: string;
  namespace?: string;
}

// =============================================================================
// 네트워크 정책
// =============================================================================

export interface NetworkPolicy {
  id: string;
  name: string;
  namespace: string;
  podSelector: Record<string, string>;
  policyTypes: ('Ingress' | 'Egress')[];
  ingress?: NetworkPolicyIngressRule[];
  egress?: NetworkPolicyEgressRule[];
  createdAt: string;
}

export interface NetworkPolicyIngressRule {
  from?: NetworkPolicyPeer[];
  ports?: NetworkPolicyPort[];
}

export interface NetworkPolicyEgressRule {
  to?: NetworkPolicyPeer[];
  ports?: NetworkPolicyPort[];
}

export interface NetworkPolicyPeer {
  podSelector?: Record<string, string>;
  namespaceSelector?: Record<string, string>;
  ipBlock?: {
    cidr: string;
    except?: string[];
  };
}

export interface NetworkPolicyPort {
  protocol?: 'TCP' | 'UDP' | 'SCTP';
  port?: number | string;
  endPort?: number;
}
