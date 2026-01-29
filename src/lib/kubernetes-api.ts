/**
 * Kubernetes API Service Layer
 * Kubernetes API Server와 통신하는 서비스 레이어
 */

// ============== Kubernetes 리소스 타입 정의 ==============

export interface K8sMetadata {
  name: string;
  namespace?: string;
  uid?: string;
  resourceVersion?: string;
  creationTimestamp?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
}

export interface K8sListMeta {
  resourceVersion?: string;
  continue?: string;
}

export interface K8sCondition {
  type: string;
  status: string;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
}

// Pod 타입
export interface K8sPod {
  apiVersion: 'v1';
  kind: 'Pod';
  metadata: K8sMetadata;
  spec: {
    containers: K8sContainer[];
    initContainers?: K8sContainer[];
    nodeName?: string;
    serviceAccountName?: string;
    restartPolicy?: 'Always' | 'OnFailure' | 'Never';
    volumes?: K8sVolume[];
  };
  status?: {
    phase: 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown';
    conditions?: K8sCondition[];
    containerStatuses?: K8sContainerStatus[];
    podIP?: string;
    hostIP?: string;
    startTime?: string;
  };
}

export interface K8sContainer {
  name: string;
  image: string;
  command?: string[];
  args?: string[];
  env?: Array<{ name: string; value?: string; valueFrom?: any }>;
  ports?: Array<{ containerPort: number; protocol?: string; name?: string }>;
  resources?: {
    limits?: { cpu?: string; memory?: string };
    requests?: { cpu?: string; memory?: string };
  };
  volumeMounts?: Array<{ name: string; mountPath: string; readOnly?: boolean }>;
  livenessProbe?: K8sProbe;
  readinessProbe?: K8sProbe;
}

export interface K8sProbe {
  httpGet?: { path: string; port: number | string; scheme?: string };
  tcpSocket?: { port: number | string };
  exec?: { command: string[] };
  initialDelaySeconds?: number;
  periodSeconds?: number;
  timeoutSeconds?: number;
  failureThreshold?: number;
}

export interface K8sContainerStatus {
  name: string;
  ready: boolean;
  restartCount: number;
  state: {
    running?: { startedAt: string };
    waiting?: { reason: string; message?: string };
    terminated?: { exitCode: number; reason: string; startedAt: string; finishedAt: string };
  };
  image: string;
  imageID: string;
}

export interface K8sVolume {
  name: string;
  configMap?: { name: string; items?: Array<{ key: string; path: string }> };
  secret?: { secretName: string; items?: Array<{ key: string; path: string }> };
  persistentVolumeClaim?: { claimName: string };
  emptyDir?: { medium?: string; sizeLimit?: string };
  hostPath?: { path: string; type?: string };
}

// Deployment 타입
export interface K8sDeployment {
  apiVersion: 'apps/v1';
  kind: 'Deployment';
  metadata: K8sMetadata;
  spec: {
    replicas?: number;
    selector: { matchLabels: Record<string, string> };
    template: {
      metadata: K8sMetadata;
      spec: K8sPod['spec'];
    };
    strategy?: {
      type: 'RollingUpdate' | 'Recreate';
      rollingUpdate?: { maxSurge?: number | string; maxUnavailable?: number | string };
    };
  };
  status?: {
    replicas: number;
    readyReplicas?: number;
    availableReplicas?: number;
    unavailableReplicas?: number;
    updatedReplicas?: number;
    conditions?: K8sCondition[];
  };
}

// StatefulSet 타입
export interface K8sStatefulSet {
  apiVersion: 'apps/v1';
  kind: 'StatefulSet';
  metadata: K8sMetadata;
  spec: {
    replicas?: number;
    serviceName: string;
    selector: { matchLabels: Record<string, string> };
    template: {
      metadata: K8sMetadata;
      spec: K8sPod['spec'];
    };
    volumeClaimTemplates?: K8sPersistentVolumeClaim[];
  };
  status?: {
    replicas: number;
    readyReplicas?: number;
    currentReplicas?: number;
    updatedReplicas?: number;
  };
}

// DaemonSet 타입
export interface K8sDaemonSet {
  apiVersion: 'apps/v1';
  kind: 'DaemonSet';
  metadata: K8sMetadata;
  spec: {
    selector: { matchLabels: Record<string, string> };
    template: {
      metadata: K8sMetadata;
      spec: K8sPod['spec'];
    };
  };
  status?: {
    currentNumberScheduled: number;
    desiredNumberScheduled: number;
    numberReady: number;
    numberAvailable?: number;
  };
}

// Job 타입
export interface K8sJob {
  apiVersion: 'batch/v1';
  kind: 'Job';
  metadata: K8sMetadata;
  spec: {
    parallelism?: number;
    completions?: number;
    backoffLimit?: number;
    activeDeadlineSeconds?: number;
    template: {
      metadata?: K8sMetadata;
      spec: K8sPod['spec'];
    };
  };
  status?: {
    active?: number;
    succeeded?: number;
    failed?: number;
    startTime?: string;
    completionTime?: string;
    conditions?: K8sCondition[];
  };
}

// CronJob 타입
export interface K8sCronJob {
  apiVersion: 'batch/v1';
  kind: 'CronJob';
  metadata: K8sMetadata;
  spec: {
    schedule: string;
    concurrencyPolicy?: 'Allow' | 'Forbid' | 'Replace';
    suspend?: boolean;
    jobTemplate: {
      spec: K8sJob['spec'];
    };
  };
  status?: {
    active?: Array<{ name: string; namespace: string }>;
    lastScheduleTime?: string;
    lastSuccessfulTime?: string;
  };
}

// Service 타입
export interface K8sService {
  apiVersion: 'v1';
  kind: 'Service';
  metadata: K8sMetadata;
  spec: {
    type?: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName';
    selector?: Record<string, string>;
    ports: Array<{
      name?: string;
      port: number;
      targetPort?: number | string;
      nodePort?: number;
      protocol?: string;
    }>;
    clusterIP?: string;
    externalIPs?: string[];
    loadBalancerIP?: string;
  };
  status?: {
    loadBalancer?: {
      ingress?: Array<{ ip?: string; hostname?: string }>;
    };
  };
}

// ConfigMap 타입
export interface K8sConfigMap {
  apiVersion: 'v1';
  kind: 'ConfigMap';
  metadata: K8sMetadata;
  data?: Record<string, string>;
  binaryData?: Record<string, string>;
}

// Secret 타입
export interface K8sSecret {
  apiVersion: 'v1';
  kind: 'Secret';
  metadata: K8sMetadata;
  type?: string;
  data?: Record<string, string>;
  stringData?: Record<string, string>;
}

// PersistentVolumeClaim 타입
export interface K8sPersistentVolumeClaim {
  apiVersion: 'v1';
  kind: 'PersistentVolumeClaim';
  metadata: K8sMetadata;
  spec: {
    accessModes: Array<'ReadWriteOnce' | 'ReadOnlyMany' | 'ReadWriteMany'>;
    resources: {
      requests: { storage: string };
    };
    storageClassName?: string;
  };
  status?: {
    phase: 'Pending' | 'Bound' | 'Lost';
    accessModes?: string[];
    capacity?: { storage: string };
  };
}

// Namespace 타입
export interface K8sNamespace {
  apiVersion: 'v1';
  kind: 'Namespace';
  metadata: K8sMetadata;
  status?: {
    phase: 'Active' | 'Terminating';
  };
}

// Ingress 타입
export interface K8sIngress {
  apiVersion: 'networking.k8s.io/v1';
  kind: 'Ingress';
  metadata: K8sMetadata;
  spec: {
    ingressClassName?: string;
    tls?: Array<{ hosts?: string[]; secretName?: string }>;
    rules?: Array<{
      host?: string;
      http?: {
        paths: Array<{
          path: string;
          pathType: 'Prefix' | 'Exact' | 'ImplementationSpecific';
          backend: {
            service: { name: string; port: { number?: number; name?: string } };
          };
        }>;
      };
    }>;
  };
  status?: {
    loadBalancer?: {
      ingress?: Array<{ ip?: string; hostname?: string }>;
    };
  };
}

// Node 타입
export interface K8sNode {
  apiVersion: 'v1';
  kind: 'Node';
  metadata: K8sMetadata;
  spec?: {
    podCIDR?: string;
    taints?: Array<{ key: string; value?: string; effect: string }>;
    unschedulable?: boolean;
  };
  status?: {
    capacity?: { cpu: string; memory: string; pods: string };
    allocatable?: { cpu: string; memory: string; pods: string };
    conditions?: K8sCondition[];
    addresses?: Array<{ type: string; address: string }>;
    nodeInfo?: {
      kubeletVersion: string;
      containerRuntimeVersion: string;
      osImage: string;
      architecture: string;
    };
  };
}

// 공통 List 응답 타입
export interface K8sList<T> {
  apiVersion: string;
  kind: string;
  metadata: K8sListMeta;
  items: T[];
}

// 클러스터 정보 타입
export interface K8sClusterInfo {
  serverVersion: {
    major: string;
    minor: string;
    gitVersion: string;
    platform: string;
  };
  nodes: number;
  namespaces: number;
  pods: number;
  healthy: boolean;
}

// ============== Kubernetes API 서비스 클래스 ==============

class KubernetesApiService {
  private baseUrl: string;
  private token: string;
  private headers: Record<string, string>;

  constructor(endpoint?: string, token?: string) {
    this.baseUrl = endpoint || process.env.KUBERNETES_API_URL || 'https://kubernetes.default.svc';
    this.token = token || process.env.KUBERNETES_TOKEN || '';
    this.headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Kubernetes API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Kubernetes API request failed: ${path}`, error);
      throw error;
    }
  }

  // ============== 클러스터 정보 ==============

  async getClusterInfo(): Promise<K8sClusterInfo> {
    const [version, nodes, namespaces, pods] = await Promise.all([
      this.getServerVersion(),
      this.listNodes(),
      this.listNamespaces(),
      this.listPods(),
    ]);

    return {
      serverVersion: version,
      nodes: nodes.items.length,
      namespaces: namespaces.items.length,
      pods: pods.items.length,
      healthy: true,
    };
  }

  async getServerVersion(): Promise<K8sClusterInfo['serverVersion']> {
    return this.request('/version');
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/healthz');
      return true;
    } catch {
      return false;
    }
  }

  // ============== Namespace 관리 ==============

  async listNamespaces(): Promise<K8sList<K8sNamespace>> {
    return this.request('/api/v1/namespaces');
  }

  async getNamespace(name: string): Promise<K8sNamespace> {
    return this.request(`/api/v1/namespaces/${name}`);
  }

  async createNamespace(name: string, labels?: Record<string, string>): Promise<K8sNamespace> {
    return this.request('/api/v1/namespaces', {
      method: 'POST',
      body: JSON.stringify({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: { name, labels },
      }),
    });
  }

  async deleteNamespace(name: string): Promise<void> {
    await this.request(`/api/v1/namespaces/${name}`, { method: 'DELETE' });
  }

  // ============== Pod 관리 ==============

  async listPods(namespace?: string): Promise<K8sList<K8sPod>> {
    const path = namespace
      ? `/api/v1/namespaces/${namespace}/pods`
      : '/api/v1/pods';
    return this.request(path);
  }

  async getPod(name: string, namespace: string = 'default'): Promise<K8sPod> {
    return this.request(`/api/v1/namespaces/${namespace}/pods/${name}`);
  }

  async createPod(pod: K8sPod, namespace: string = 'default'): Promise<K8sPod> {
    return this.request(`/api/v1/namespaces/${namespace}/pods`, {
      method: 'POST',
      body: JSON.stringify(pod),
    });
  }

  async deletePod(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/api/v1/namespaces/${namespace}/pods/${name}`, {
      method: 'DELETE',
    });
  }

  async getPodLogs(
    name: string,
    namespace: string = 'default',
    options: { container?: string; tailLines?: number; sinceSeconds?: number; follow?: boolean } = {}
  ): Promise<string> {
    const params = new URLSearchParams();
    if (options.container) params.set('container', options.container);
    if (options.tailLines) params.set('tailLines', String(options.tailLines));
    if (options.sinceSeconds) params.set('sinceSeconds', String(options.sinceSeconds));
    if (options.follow) params.set('follow', 'true');

    const response = await fetch(`${this.baseUrl}/api/v1/namespaces/${namespace}/pods/${name}/log?${params}`, {
      headers: this.headers,
    });
    return response.text();
  }

  async execInPod(
    name: string,
    namespace: string,
    command: string[],
    container?: string
  ): Promise<{ stdout: string; stderr: string }> {
    const params = new URLSearchParams();
    params.set('command', command.join(' '));
    params.set('stdout', 'true');
    params.set('stderr', 'true');
    if (container) params.set('container', container);

    return this.request(`/api/v1/namespaces/${namespace}/pods/${name}/exec?${params}`, {
      method: 'POST',
    });
  }

  // ============== Deployment 관리 ==============

  async listDeployments(namespace?: string): Promise<K8sList<K8sDeployment>> {
    const path = namespace
      ? `/apis/apps/v1/namespaces/${namespace}/deployments`
      : '/apis/apps/v1/deployments';
    return this.request(path);
  }

  async getDeployment(name: string, namespace: string = 'default'): Promise<K8sDeployment> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`);
  }

  async createDeployment(deployment: K8sDeployment, namespace: string = 'default'): Promise<K8sDeployment> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/deployments`, {
      method: 'POST',
      body: JSON.stringify(deployment),
    });
  }

  async updateDeployment(name: string, deployment: K8sDeployment, namespace: string = 'default'): Promise<K8sDeployment> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`, {
      method: 'PUT',
      body: JSON.stringify(deployment),
    });
  }

  async patchDeployment(name: string, patch: Partial<K8sDeployment>, namespace: string = 'default'): Promise<K8sDeployment> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/strategic-merge-patch+json' },
      body: JSON.stringify(patch),
    });
  }

  async deleteDeployment(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`, {
      method: 'DELETE',
    });
  }

  async scaleDeployment(name: string, replicas: number, namespace: string = 'default'): Promise<K8sDeployment> {
    return this.patchDeployment(name, {
      spec: { replicas },
    } as Partial<K8sDeployment>, namespace);
  }

  async restartDeployment(name: string, namespace: string = 'default'): Promise<K8sDeployment> {
    // 롤링 업데이트를 트리거하기 위해 annotation 변경
    return this.patchDeployment(name, {
      spec: {
        template: {
          metadata: {
            annotations: {
              'kubectl.kubernetes.io/restartedAt': new Date().toISOString(),
            },
          },
        },
      },
    } as any, namespace);
  }

  // ============== StatefulSet 관리 ==============

  async listStatefulSets(namespace?: string): Promise<K8sList<K8sStatefulSet>> {
    const path = namespace
      ? `/apis/apps/v1/namespaces/${namespace}/statefulsets`
      : '/apis/apps/v1/statefulsets';
    return this.request(path);
  }

  async getStatefulSet(name: string, namespace: string = 'default'): Promise<K8sStatefulSet> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`);
  }

  async createStatefulSet(statefulSet: K8sStatefulSet, namespace: string = 'default'): Promise<K8sStatefulSet> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/statefulsets`, {
      method: 'POST',
      body: JSON.stringify(statefulSet),
    });
  }

  async deleteStatefulSet(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}`, {
      method: 'DELETE',
    });
  }

  async scaleStatefulSet(name: string, replicas: number, namespace: string = 'default'): Promise<K8sStatefulSet> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/statefulsets/${name}/scale`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/strategic-merge-patch+json' },
      body: JSON.stringify({ spec: { replicas } }),
    });
  }

  // ============== DaemonSet 관리 ==============

  async listDaemonSets(namespace?: string): Promise<K8sList<K8sDaemonSet>> {
    const path = namespace
      ? `/apis/apps/v1/namespaces/${namespace}/daemonsets`
      : '/apis/apps/v1/daemonsets';
    return this.request(path);
  }

  async getDaemonSet(name: string, namespace: string = 'default'): Promise<K8sDaemonSet> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/daemonsets/${name}`);
  }

  async createDaemonSet(daemonSet: K8sDaemonSet, namespace: string = 'default'): Promise<K8sDaemonSet> {
    return this.request(`/apis/apps/v1/namespaces/${namespace}/daemonsets`, {
      method: 'POST',
      body: JSON.stringify(daemonSet),
    });
  }

  async deleteDaemonSet(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/apis/apps/v1/namespaces/${namespace}/daemonsets/${name}`, {
      method: 'DELETE',
    });
  }

  // ============== Job 관리 ==============

  async listJobs(namespace?: string): Promise<K8sList<K8sJob>> {
    const path = namespace
      ? `/apis/batch/v1/namespaces/${namespace}/jobs`
      : '/apis/batch/v1/jobs';
    return this.request(path);
  }

  async getJob(name: string, namespace: string = 'default'): Promise<K8sJob> {
    return this.request(`/apis/batch/v1/namespaces/${namespace}/jobs/${name}`);
  }

  async createJob(job: K8sJob, namespace: string = 'default'): Promise<K8sJob> {
    return this.request(`/apis/batch/v1/namespaces/${namespace}/jobs`, {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async deleteJob(name: string, namespace: string = 'default', propagationPolicy: 'Foreground' | 'Background' = 'Background'): Promise<void> {
    await this.request(`/apis/batch/v1/namespaces/${namespace}/jobs/${name}`, {
      method: 'DELETE',
      body: JSON.stringify({ propagationPolicy }),
    });
  }

  // ============== CronJob 관리 ==============

  async listCronJobs(namespace?: string): Promise<K8sList<K8sCronJob>> {
    const path = namespace
      ? `/apis/batch/v1/namespaces/${namespace}/cronjobs`
      : '/apis/batch/v1/cronjobs';
    return this.request(path);
  }

  async getCronJob(name: string, namespace: string = 'default'): Promise<K8sCronJob> {
    return this.request(`/apis/batch/v1/namespaces/${namespace}/cronjobs/${name}`);
  }

  async createCronJob(cronJob: K8sCronJob, namespace: string = 'default'): Promise<K8sCronJob> {
    return this.request(`/apis/batch/v1/namespaces/${namespace}/cronjobs`, {
      method: 'POST',
      body: JSON.stringify(cronJob),
    });
  }

  async deleteCronJob(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/apis/batch/v1/namespaces/${namespace}/cronjobs/${name}`, {
      method: 'DELETE',
    });
  }

  async suspendCronJob(name: string, suspend: boolean, namespace: string = 'default'): Promise<K8sCronJob> {
    return this.request(`/apis/batch/v1/namespaces/${namespace}/cronjobs/${name}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/strategic-merge-patch+json' },
      body: JSON.stringify({ spec: { suspend } }),
    });
  }

  // ============== Service 관리 ==============

  async listServices(namespace?: string): Promise<K8sList<K8sService>> {
    const path = namespace
      ? `/api/v1/namespaces/${namespace}/services`
      : '/api/v1/services';
    return this.request(path);
  }

  async getService(name: string, namespace: string = 'default'): Promise<K8sService> {
    return this.request(`/api/v1/namespaces/${namespace}/services/${name}`);
  }

  async createService(service: K8sService, namespace: string = 'default'): Promise<K8sService> {
    return this.request(`/api/v1/namespaces/${namespace}/services`, {
      method: 'POST',
      body: JSON.stringify(service),
    });
  }

  async deleteService(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/api/v1/namespaces/${namespace}/services/${name}`, {
      method: 'DELETE',
    });
  }

  // ============== ConfigMap 관리 ==============

  async listConfigMaps(namespace?: string): Promise<K8sList<K8sConfigMap>> {
    const path = namespace
      ? `/api/v1/namespaces/${namespace}/configmaps`
      : '/api/v1/configmaps';
    return this.request(path);
  }

  async getConfigMap(name: string, namespace: string = 'default'): Promise<K8sConfigMap> {
    return this.request(`/api/v1/namespaces/${namespace}/configmaps/${name}`);
  }

  async createConfigMap(configMap: K8sConfigMap, namespace: string = 'default'): Promise<K8sConfigMap> {
    return this.request(`/api/v1/namespaces/${namespace}/configmaps`, {
      method: 'POST',
      body: JSON.stringify(configMap),
    });
  }

  async updateConfigMap(name: string, configMap: K8sConfigMap, namespace: string = 'default'): Promise<K8sConfigMap> {
    return this.request(`/api/v1/namespaces/${namespace}/configmaps/${name}`, {
      method: 'PUT',
      body: JSON.stringify(configMap),
    });
  }

  async deleteConfigMap(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/api/v1/namespaces/${namespace}/configmaps/${name}`, {
      method: 'DELETE',
    });
  }

  // ============== Secret 관리 ==============

  async listSecrets(namespace?: string): Promise<K8sList<K8sSecret>> {
    const path = namespace
      ? `/api/v1/namespaces/${namespace}/secrets`
      : '/api/v1/secrets';
    return this.request(path);
  }

  async getSecret(name: string, namespace: string = 'default'): Promise<K8sSecret> {
    return this.request(`/api/v1/namespaces/${namespace}/secrets/${name}`);
  }

  async createSecret(secret: K8sSecret, namespace: string = 'default'): Promise<K8sSecret> {
    return this.request(`/api/v1/namespaces/${namespace}/secrets`, {
      method: 'POST',
      body: JSON.stringify(secret),
    });
  }

  async updateSecret(name: string, secret: K8sSecret, namespace: string = 'default'): Promise<K8sSecret> {
    return this.request(`/api/v1/namespaces/${namespace}/secrets/${name}`, {
      method: 'PUT',
      body: JSON.stringify(secret),
    });
  }

  async deleteSecret(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/api/v1/namespaces/${namespace}/secrets/${name}`, {
      method: 'DELETE',
    });
  }

  // ============== PVC 관리 ==============

  async listPVCs(namespace?: string): Promise<K8sList<K8sPersistentVolumeClaim>> {
    const path = namespace
      ? `/api/v1/namespaces/${namespace}/persistentvolumeclaims`
      : '/api/v1/persistentvolumeclaims';
    return this.request(path);
  }

  async getPVC(name: string, namespace: string = 'default'): Promise<K8sPersistentVolumeClaim> {
    return this.request(`/api/v1/namespaces/${namespace}/persistentvolumeclaims/${name}`);
  }

  async createPVC(pvc: K8sPersistentVolumeClaim, namespace: string = 'default'): Promise<K8sPersistentVolumeClaim> {
    return this.request(`/api/v1/namespaces/${namespace}/persistentvolumeclaims`, {
      method: 'POST',
      body: JSON.stringify(pvc),
    });
  }

  async deletePVC(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/api/v1/namespaces/${namespace}/persistentvolumeclaims/${name}`, {
      method: 'DELETE',
    });
  }

  // ============== Ingress 관리 ==============

  async listIngresses(namespace?: string): Promise<K8sList<K8sIngress>> {
    const path = namespace
      ? `/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`
      : '/apis/networking.k8s.io/v1/ingresses';
    return this.request(path);
  }

  async getIngress(name: string, namespace: string = 'default'): Promise<K8sIngress> {
    return this.request(`/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses/${name}`);
  }

  async createIngress(ingress: K8sIngress, namespace: string = 'default'): Promise<K8sIngress> {
    return this.request(`/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`, {
      method: 'POST',
      body: JSON.stringify(ingress),
    });
  }

  async deleteIngress(name: string, namespace: string = 'default'): Promise<void> {
    await this.request(`/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses/${name}`, {
      method: 'DELETE',
    });
  }

  // ============== Node 관리 ==============

  async listNodes(): Promise<K8sList<K8sNode>> {
    return this.request('/api/v1/nodes');
  }

  async getNode(name: string): Promise<K8sNode> {
    return this.request(`/api/v1/nodes/${name}`);
  }

  async cordonNode(name: string): Promise<K8sNode> {
    return this.request(`/api/v1/nodes/${name}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/strategic-merge-patch+json' },
      body: JSON.stringify({ spec: { unschedulable: true } }),
    });
  }

  async uncordonNode(name: string): Promise<K8sNode> {
    return this.request(`/api/v1/nodes/${name}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/strategic-merge-patch+json' },
      body: JSON.stringify({ spec: { unschedulable: false } }),
    });
  }

  // ============== 이벤트 조회 ==============

  async listEvents(namespace?: string): Promise<K8sList<any>> {
    const path = namespace
      ? `/api/v1/namespaces/${namespace}/events`
      : '/api/v1/events';
    return this.request(path);
  }

  // ============== YAML 적용 (kubectl apply 유사) ==============

  async applyYaml(yaml: string, namespace: string = 'default'): Promise<any> {
    // 실제로는 YAML 파싱 후 적절한 API 호출 필요
    // 이 구현은 단순화된 버전
    const obj = JSON.parse(yaml); // 실제로는 YAML 파서 필요
    const kind = obj.kind?.toLowerCase();

    const apiPaths: Record<string, string> = {
      deployment: `/apis/apps/v1/namespaces/${namespace}/deployments`,
      service: `/api/v1/namespaces/${namespace}/services`,
      configmap: `/api/v1/namespaces/${namespace}/configmaps`,
      secret: `/api/v1/namespaces/${namespace}/secrets`,
      pod: `/api/v1/namespaces/${namespace}/pods`,
      ingress: `/apis/networking.k8s.io/v1/namespaces/${namespace}/ingresses`,
    };

    const path = apiPaths[kind];
    if (!path) {
      throw new Error(`Unsupported resource kind: ${obj.kind}`);
    }

    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(obj),
    });
  }
}

// 싱글톤 인스턴스
let defaultInstance: KubernetesApiService | null = null;

export function getKubernetesApi(endpoint?: string, token?: string): KubernetesApiService {
  if (endpoint || token) {
    return new KubernetesApiService(endpoint, token);
  }
  if (!defaultInstance) {
    defaultInstance = new KubernetesApiService();
  }
  return defaultInstance;
}

export { KubernetesApiService };
