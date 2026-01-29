"use client";

import React, { useState, use } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import {
  PageHeader,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatusBadge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DataTable,
  Column,
} from '@/components/ui';
import { db, Endpoint } from '@/lib/db';
import {
  FiServer,
  FiCpu,
  FiHardDrive,
  FiActivity,
  FiRefreshCw,
  FiSettings,
  FiTrash2,
  FiExternalLink,
  FiCopy,
  FiLayers,
  FiTerminal,
} from 'react-icons/fi';
import { SiKubernetes, SiDocker } from 'react-icons/si';
import { useRouter } from 'next/navigation';

// Mock 상세 데이터
const MOCK_ENDPOINT_DETAILS: Record<string, {
  metrics: { cpu: number; memory: number; network: { in: string; out: string }; storage: string };
  containers: { id: string; name: string; image: string; status: string; cpu: string; memory: string }[];
  events: { id: string; type: string; reason: string; message: string; time: string }[];
  info: { os: string; architecture: string; kernelVersion: string; containerRuntime: string };
}> = {
  'ep-1': {
    metrics: { cpu: 45, memory: 68, network: { in: '125 MB/s', out: '89 MB/s' }, storage: '450 GB' },
    containers: [
      { id: 'c1', name: 'nginx-proxy', image: 'nginx:1.25', status: 'Running', cpu: '50m', memory: '128Mi' },
      { id: 'c2', name: 'api-server', image: 'api:v2.1.0', status: 'Running', cpu: '200m', memory: '512Mi' },
      { id: 'c3', name: 'redis-cache', image: 'redis:7.0', status: 'Running', cpu: '100m', memory: '256Mi' },
      { id: 'c4', name: 'worker', image: 'worker:latest', status: 'Running', cpu: '150m', memory: '384Mi' },
    ],
    events: [
      { id: 'e1', type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned pod to node', time: '5분 전' },
      { id: 'e2', type: 'Normal', reason: 'Pulled', message: 'Container image pulled successfully', time: '4분 전' },
      { id: 'e3', type: 'Normal', reason: 'Started', message: 'Container started', time: '4분 전' },
    ],
    info: { os: 'Ubuntu 22.04 LTS', architecture: 'amd64', kernelVersion: '5.15.0-91', containerRuntime: 'containerd://1.6.24' },
  },
  'ep-5': {
    metrics: { cpu: 25, memory: 42, network: { in: '45 MB/s', out: '32 MB/s' }, storage: '120 GB' },
    containers: [
      { id: 'c5', name: 'edge-agent', image: 'edge-agent:v1.0', status: 'Running', cpu: '30m', memory: '64Mi' },
      { id: 'c6', name: 'metrics-collector', image: 'metrics:v0.5', status: 'Running', cpu: '20m', memory: '48Mi' },
    ],
    events: [
      { id: 'e4', type: 'Normal', reason: 'Connected', message: 'Edge agent connected to management server', time: '10분 전' },
      { id: 'e5', type: 'Warning', reason: 'HighCPU', message: 'CPU usage exceeded 80%', time: '2시간 전' },
    ],
    info: { os: 'Alpine Linux 3.18', architecture: 'arm64', kernelVersion: '5.15.79', containerRuntime: 'docker://24.0.7' },
  },
};

// 기본 상세 데이터
const DEFAULT_DETAILS = {
  metrics: { cpu: 30, memory: 50, network: { in: '50 MB/s', out: '40 MB/s' }, storage: '200 GB' },
  containers: [],
  events: [],
  info: { os: 'Unknown', architecture: 'amd64', kernelVersion: 'N/A', containerRuntime: 'N/A' },
};

// 리소스 게이지 컴포넌트
const ResourceGauge = ({
  label,
  value,
  unit = '%',
  icon: Icon,
}: {
  label: string;
  value: number;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  const color = value > 85 ? 'text-red-500' : value > 70 ? 'text-amber-500' : 'text-emerald-500';
  const bgColor = value > 85 ? 'bg-red-500' : value > 70 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="text-slate-400" />
            <span className="text-sm text-slate-400">{label}</span>
          </div>
          <span className={`text-xl font-bold ${color}`}>
            {value}{unit}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${bgColor}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function EndpointDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // 엔드포인트 데이터 조회
  const endpoints = db.getEndpoints();
  const endpoint = endpoints.find((ep) => ep.id === id);

  // 상세 데이터
  const details = MOCK_ENDPOINT_DETAILS[id] || DEFAULT_DETAILS;

  // 새로고침
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // 클립보드 복사
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!endpoint) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <FiServer className="w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-300 mb-2">엔드포인트를 찾을 수 없습니다</h2>
          <p className="text-slate-500 mb-4">요청하신 엔드포인트가 존재하지 않습니다.</p>
          <Button onClick={() => router.push('/endpoints')}>
            엔드포인트 목록으로
          </Button>
        </div>
      </MainLayout>
    );
  }

  const ProviderIcon = endpoint.type === 'Docker' ? SiDocker : SiKubernetes;

  // 컨테이너 테이블 컬럼
  const containerColumns: Column<typeof details.containers[0]>[] = [
    {
      key: 'name',
      header: '이름',
      accessor: (c) => <span className="font-medium text-slate-200">{c.name}</span>,
    },
    {
      key: 'image',
      header: '이미지',
      accessor: (c) => (
        <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{c.image}</code>
      ),
    },
    {
      key: 'status',
      header: '상태',
      accessor: (c) => <StatusBadge status={c.status as any} />,
    },
    {
      key: 'cpu',
      header: 'CPU',
      accessor: (c) => <span className="text-slate-400">{c.cpu}</span>,
    },
    {
      key: 'memory',
      header: '메모리',
      accessor: (c) => <span className="text-slate-400">{c.memory}</span>,
    },
  ];

  // 이벤트 테이블 컬럼
  const eventColumns: Column<typeof details.events[0]>[] = [
    {
      key: 'type',
      header: '유형',
      accessor: (e) => (
        <span className={`px-2 py-0.5 rounded text-xs ${
          e.type === 'Warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'
        }`}>
          {e.type}
        </span>
      ),
    },
    {
      key: 'reason',
      header: '이유',
      accessor: (e) => <span className="font-medium text-slate-300">{e.reason}</span>,
    },
    {
      key: 'message',
      header: '메시지',
      accessor: (e) => <span className="text-slate-400">{e.message}</span>,
    },
    {
      key: 'time',
      header: '시간',
      accessor: (e) => <span className="text-slate-500 text-sm">{e.time}</span>,
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title={endpoint.name}
        breadcrumbs={[
          { label: '엔드포인트', href: '/endpoints' },
          { label: endpoint.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <Button variant="outline" size="sm">
              <FiTerminal className="mr-2" />
              터미널
            </Button>
            <Button variant="outline" size="sm">
              <FiSettings className="mr-2" />
              설정
            </Button>
          </div>
        }
      />

      {/* 헤더 정보 */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ProviderIcon className="text-blue-400 text-3xl" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-100">{endpoint.name}</h2>
                  <StatusBadge status={endpoint.status} showDot pulseDot={endpoint.status !== 'Online'} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-400">{endpoint.type}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-sm text-slate-400">{endpoint.version}</span>
                  {endpoint.isEdge && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">Edge</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{endpoint.url}</code>
                  <button
                    onClick={() => copyToClipboard(endpoint.url)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-slate-500">
              <div>마지막 확인: {endpoint.lastSeen}</div>
              <div>연결 모드: {endpoint.connectionMode === 'agent' ? '에이전트' : '직접 연결'}</div>
            </div>
          </div>

          {/* 태그 */}
          {endpoint.tags && endpoint.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
              <span className="text-sm text-slate-500">태그:</span>
              {endpoint.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="containers">컨테이너</TabsTrigger>
          <TabsTrigger value="events">이벤트</TabsTrigger>
          <TabsTrigger value="info">시스템 정보</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ResourceGauge label="CPU 사용률" value={details.metrics.cpu} icon={FiCpu} />
            <ResourceGauge label="메모리 사용률" value={details.metrics.memory} icon={FiHardDrive} />
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiActivity className="text-slate-400" />
                  <span className="text-sm text-slate-400">네트워크</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">↓ {details.metrics.network.in}</span>
                  <span className="text-blue-400">↑ {details.metrics.network.out}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiHardDrive className="text-slate-400" />
                  <span className="text-sm text-slate-400">스토리지</span>
                </div>
                <div className="text-xl font-bold text-slate-200">{details.metrics.storage}</div>
              </CardContent>
            </Card>
          </div>

          {/* 빠른 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-100">{details.containers.length}</div>
                    <div className="text-sm text-slate-400">실행 중인 컨테이너</div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <FiLayers className="text-emerald-400 text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-100">{details.events.length}</div>
                    <div className="text-sm text-slate-400">최근 이벤트</div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FiActivity className="text-blue-400 text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">정상</div>
                    <div className="text-sm text-slate-400">연결 상태</div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <FiServer className="text-emerald-400 text-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 컨테이너 탭 */}
        <TabsContent value="containers">
          <DataTable
            data={details.containers}
            columns={containerColumns}
            keyExtractor={(c) => c.id}
            emptyMessage="실행 중인 컨테이너가 없습니다."
          />
        </TabsContent>

        {/* 이벤트 탭 */}
        <TabsContent value="events">
          <DataTable
            data={details.events}
            columns={eventColumns}
            keyExtractor={(e) => e.id}
            emptyMessage="최근 이벤트가 없습니다."
          />
        </TabsContent>

        {/* 시스템 정보 탭 */}
        <TabsContent value="info">
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">운영체제</h4>
                  <p className="text-slate-200">{details.info.os}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">아키텍처</h4>
                  <p className="text-slate-200">{details.info.architecture}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">커널 버전</h4>
                  <p className="text-slate-200">{details.info.kernelVersion}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">컨테이너 런타임</h4>
                  <p className="text-slate-200">{details.info.containerRuntime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
