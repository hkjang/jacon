/**
 * Docker API Service Layer
 * Docker Engine API와 통신하는 서비스 레이어
 */

export interface DockerContainer {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  State: string;
  Status: string;
  Ports: DockerPort[];
  Labels: Record<string, string>;
  NetworkSettings: {
    Networks: Record<string, DockerNetwork>;
  };
}

export interface DockerPort {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: string;
}

export interface DockerNetwork {
  IPAddress: string;
  Gateway: string;
  MacAddress: string;
}

export interface DockerImage {
  Id: string;
  RepoTags: string[];
  RepoDigests: string[];
  Created: number;
  Size: number;
  VirtualSize: number;
  Labels: Record<string, string>;
}

export interface DockerVolume {
  Name: string;
  Driver: string;
  Mountpoint: string;
  CreatedAt: string;
  Labels: Record<string, string>;
  Scope: string;
}

export interface DockerNetworkInfo {
  Id: string;
  Name: string;
  Driver: string;
  Scope: string;
  IPAM: {
    Driver: string;
    Config: Array<{
      Subnet: string;
      Gateway: string;
    }>;
  };
  Containers: Record<string, { Name: string; IPv4Address: string }>;
}

export interface DockerServiceInfo {
  ID: string;
  Version: { Index: number };
  CreatedAt: string;
  UpdatedAt: string;
  Spec: {
    Name: string;
    TaskTemplate: {
      ContainerSpec: {
        Image: string;
      };
    };
    Mode: {
      Replicated?: { Replicas: number };
      Global?: object;
    };
  };
}

export interface DockerComposeStack {
  Name: string;
  Services: number;
  Containers: DockerContainer[];
}

export interface ContainerCreateOptions {
  name: string;
  Image: string;
  Env?: string[];
  ExposedPorts?: Record<string, object>;
  HostConfig?: {
    PortBindings?: Record<string, Array<{ HostPort: string }>>;
    Binds?: string[];
    RestartPolicy?: { Name: string; MaximumRetryCount?: number };
    Memory?: number;
    CpuShares?: number;
  };
  Labels?: Record<string, string>;
  Cmd?: string[];
  WorkingDir?: string;
}

export interface ContainerExecOptions {
  AttachStdin?: boolean;
  AttachStdout?: boolean;
  AttachStderr?: boolean;
  Cmd: string[];
  Tty?: boolean;
}

export interface DockerInfo {
  ID: string;
  Name: string;
  ServerVersion: string;
  Containers: number;
  ContainersRunning: number;
  ContainersPaused: number;
  ContainersStopped: number;
  Images: number;
  Driver: string;
  MemTotal: number;
  NCPU: number;
  OperatingSystem: string;
  Architecture: string;
  KernelVersion: string;
  Swarm?: {
    LocalNodeState: string;
    ControlAvailable: boolean;
    Cluster?: {
      ID: string;
      Version: { Index: number };
    };
  };
}

class DockerApiService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(endpoint?: string) {
    // Docker API 엔드포인트 설정 (기본: 로컬 Docker 소켓)
    this.baseUrl = endpoint || process.env.DOCKER_HOST || 'http://localhost:2375';
    this.headers = {
      'Content-Type': 'application/json',
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
        throw new Error(error.message || `Docker API Error: ${response.status}`);
      }

      // 일부 API는 빈 응답을 반환할 수 있음
      const text = await response.text();
      return text ? JSON.parse(text) : {} as T;
    } catch (error) {
      console.error(`Docker API request failed: ${path}`, error);
      throw error;
    }
  }

  // ============== 시스템 정보 ==============

  async getInfo(): Promise<DockerInfo> {
    return this.request<DockerInfo>('/info');
  }

  async getVersion(): Promise<{ Version: string; ApiVersion: string; Os: string; Arch: string }> {
    return this.request('/version');
  }

  async ping(): Promise<boolean> {
    try {
      await this.request('/_ping');
      return true;
    } catch {
      return false;
    }
  }

  // ============== 컨테이너 관리 ==============

  async listContainers(all: boolean = false): Promise<DockerContainer[]> {
    return this.request<DockerContainer[]>(`/containers/json?all=${all}`);
  }

  async getContainer(id: string): Promise<DockerContainer & { Config: any; State: any }> {
    return this.request(`/containers/${id}/json`);
  }

  async createContainer(options: ContainerCreateOptions): Promise<{ Id: string; Warnings: string[] }> {
    const { name, ...body } = options;
    return this.request(`/containers/create?name=${encodeURIComponent(name)}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async startContainer(id: string): Promise<void> {
    await this.request(`/containers/${id}/start`, { method: 'POST' });
  }

  async stopContainer(id: string, timeout: number = 10): Promise<void> {
    await this.request(`/containers/${id}/stop?t=${timeout}`, { method: 'POST' });
  }

  async restartContainer(id: string, timeout: number = 10): Promise<void> {
    await this.request(`/containers/${id}/restart?t=${timeout}`, { method: 'POST' });
  }

  async killContainer(id: string, signal: string = 'SIGKILL'): Promise<void> {
    await this.request(`/containers/${id}/kill?signal=${signal}`, { method: 'POST' });
  }

  async removeContainer(id: string, force: boolean = false, removeVolumes: boolean = false): Promise<void> {
    await this.request(`/containers/${id}?force=${force}&v=${removeVolumes}`, { method: 'DELETE' });
  }

  async pauseContainer(id: string): Promise<void> {
    await this.request(`/containers/${id}/pause`, { method: 'POST' });
  }

  async unpauseContainer(id: string): Promise<void> {
    await this.request(`/containers/${id}/unpause`, { method: 'POST' });
  }

  async getContainerLogs(id: string, options: { stdout?: boolean; stderr?: boolean; tail?: number; since?: number } = {}): Promise<string> {
    const params = new URLSearchParams();
    params.set('stdout', String(options.stdout ?? true));
    params.set('stderr', String(options.stderr ?? true));
    if (options.tail) params.set('tail', String(options.tail));
    if (options.since) params.set('since', String(options.since));

    const response = await fetch(`${this.baseUrl}/containers/${id}/logs?${params}`, {
      headers: this.headers,
    });
    return response.text();
  }

  async getContainerStats(id: string, stream: boolean = false): Promise<any> {
    return this.request(`/containers/${id}/stats?stream=${stream}`);
  }

  async execInContainer(id: string, options: ContainerExecOptions): Promise<{ Id: string }> {
    return this.request(`/containers/${id}/exec`, {
      method: 'POST',
      body: JSON.stringify({
        AttachStdin: options.AttachStdin ?? false,
        AttachStdout: options.AttachStdout ?? true,
        AttachStderr: options.AttachStderr ?? true,
        Tty: options.Tty ?? false,
        Cmd: options.Cmd,
      }),
    });
  }

  // ============== 이미지 관리 ==============

  async listImages(): Promise<DockerImage[]> {
    return this.request<DockerImage[]>('/images/json');
  }

  async getImage(name: string): Promise<DockerImage> {
    return this.request(`/images/${encodeURIComponent(name)}/json`);
  }

  async pullImage(image: string, tag: string = 'latest'): Promise<void> {
    await this.request(`/images/create?fromImage=${encodeURIComponent(image)}&tag=${tag}`, {
      method: 'POST',
    });
  }

  async removeImage(id: string, force: boolean = false): Promise<void> {
    await this.request(`/images/${id}?force=${force}`, { method: 'DELETE' });
  }

  async tagImage(id: string, repo: string, tag: string): Promise<void> {
    await this.request(`/images/${id}/tag?repo=${encodeURIComponent(repo)}&tag=${encodeURIComponent(tag)}`, {
      method: 'POST',
    });
  }

  async buildImage(dockerfile: string, options: { t?: string; nocache?: boolean } = {}): Promise<void> {
    const params = new URLSearchParams();
    if (options.t) params.set('t', options.t);
    if (options.nocache) params.set('nocache', 'true');

    await this.request(`/build?${params}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-tar' },
      body: dockerfile,
    });
  }

  // ============== 볼륨 관리 ==============

  async listVolumes(): Promise<{ Volumes: DockerVolume[] }> {
    return this.request('/volumes');
  }

  async createVolume(options: { Name: string; Driver?: string; Labels?: Record<string, string> }): Promise<DockerVolume> {
    return this.request('/volumes/create', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async getVolume(name: string): Promise<DockerVolume> {
    return this.request(`/volumes/${encodeURIComponent(name)}`);
  }

  async removeVolume(name: string, force: boolean = false): Promise<void> {
    await this.request(`/volumes/${encodeURIComponent(name)}?force=${force}`, { method: 'DELETE' });
  }

  // ============== 네트워크 관리 ==============

  async listNetworks(): Promise<DockerNetworkInfo[]> {
    return this.request<DockerNetworkInfo[]>('/networks');
  }

  async createNetwork(options: { Name: string; Driver?: string; IPAM?: any; Labels?: Record<string, string> }): Promise<{ Id: string }> {
    return this.request('/networks/create', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async getNetwork(id: string): Promise<DockerNetworkInfo> {
    return this.request(`/networks/${id}`);
  }

  async removeNetwork(id: string): Promise<void> {
    await this.request(`/networks/${id}`, { method: 'DELETE' });
  }

  async connectContainerToNetwork(networkId: string, containerId: string): Promise<void> {
    await this.request(`/networks/${networkId}/connect`, {
      method: 'POST',
      body: JSON.stringify({ Container: containerId }),
    });
  }

  async disconnectContainerFromNetwork(networkId: string, containerId: string, force: boolean = false): Promise<void> {
    await this.request(`/networks/${networkId}/disconnect`, {
      method: 'POST',
      body: JSON.stringify({ Container: containerId, Force: force }),
    });
  }

  // ============== Docker Compose / Stack 관리 ==============

  async listStacks(): Promise<DockerComposeStack[]> {
    // Docker Compose 스택은 라벨로 그룹화된 컨테이너들
    const containers = await this.listContainers(true);
    const stacks = new Map<string, DockerContainer[]>();

    for (const container of containers) {
      const projectName = container.Labels?.['com.docker.compose.project'];
      if (projectName) {
        if (!stacks.has(projectName)) {
          stacks.set(projectName, []);
        }
        stacks.get(projectName)!.push(container);
      }
    }

    return Array.from(stacks.entries()).map(([name, containers]) => ({
      Name: name,
      Services: new Set(containers.map(c => c.Labels?.['com.docker.compose.service'])).size,
      Containers: containers,
    }));
  }

  // ============== Swarm 서비스 관리 (Swarm 모드일 때) ==============

  async listServices(): Promise<DockerServiceInfo[]> {
    return this.request<DockerServiceInfo[]>('/services');
  }

  async getService(id: string): Promise<DockerServiceInfo> {
    return this.request(`/services/${id}`);
  }

  async createService(spec: any): Promise<{ ID: string }> {
    return this.request('/services/create', {
      method: 'POST',
      body: JSON.stringify(spec),
    });
  }

  async updateService(id: string, version: number, spec: any): Promise<void> {
    await this.request(`/services/${id}/update?version=${version}`, {
      method: 'POST',
      body: JSON.stringify(spec),
    });
  }

  async removeService(id: string): Promise<void> {
    await this.request(`/services/${id}`, { method: 'DELETE' });
  }

  async scaleService(id: string, replicas: number): Promise<void> {
    const service = await this.getService(id);
    if (service.Spec.Mode.Replicated) {
      service.Spec.Mode.Replicated.Replicas = replicas;
      await this.updateService(id, service.Version.Index, service.Spec);
    }
  }

  async getServiceLogs(id: string, options: { stdout?: boolean; stderr?: boolean; tail?: number } = {}): Promise<string> {
    const params = new URLSearchParams();
    params.set('stdout', String(options.stdout ?? true));
    params.set('stderr', String(options.stderr ?? true));
    if (options.tail) params.set('tail', String(options.tail));

    const response = await fetch(`${this.baseUrl}/services/${id}/logs?${params}`, {
      headers: this.headers,
    });
    return response.text();
  }
}

// 싱글톤 인스턴스 (기본)
let defaultInstance: DockerApiService | null = null;

export function getDockerApi(endpoint?: string): DockerApiService {
  if (endpoint) {
    return new DockerApiService(endpoint);
  }
  if (!defaultInstance) {
    defaultInstance = new DockerApiService();
  }
  return defaultInstance;
}

export { DockerApiService };
