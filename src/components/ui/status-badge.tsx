"use client";

import React from 'react';
import { cn } from '@/lib/utils';

// K8s 워크로드 상태
export type WorkloadStatus = 'Running' | 'Pending' | 'Failed' | 'CrashLoopBackOff' | 'Unknown' | 'Terminating' | 'Succeeded' | 'ImagePullBackOff';

// 엔드포인트 상태
export type EndpointStatus = 'Online' | 'Offline' | 'Degraded' | 'Warning' | 'Connecting';

// 스택 상태
export type StackStatus = 'active' | 'inactive' | 'deploying' | 'failed' | 'rolling_back' | 'paused';

// ConfigMap/Secret 타입
export type ConfigType = 'ConfigMap' | 'Secret';

// 일반 상태
export type GeneralStatus = 'success' | 'error' | 'warning' | 'info' | 'pending' | 'neutral';

// 모든 상태 타입
export type StatusType = WorkloadStatus | EndpointStatus | StackStatus | ConfigType | GeneralStatus | string;

// 상태별 색상 매핑
const STATUS_COLORS: Record<string, { bg: string; text: string; border?: string }> = {
  // 성공/실행 중
  'Running': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'Online': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'active': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'Succeeded': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'success': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'synced': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },

  // 경고/대기
  'Pending': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'Warning': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'warning': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'deploying': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'syncing': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'pending': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'Connecting': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'rolling_back': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'paused': { bg: 'bg-amber-500/10', text: 'text-amber-500' },

  // 오류/실패
  'Failed': { bg: 'bg-red-500/10', text: 'text-red-500' },
  'CrashLoopBackOff': { bg: 'bg-red-500/10', text: 'text-red-500' },
  'ImagePullBackOff': { bg: 'bg-red-500/10', text: 'text-red-500' },
  'Offline': { bg: 'bg-red-500/10', text: 'text-red-500' },
  'failed': { bg: 'bg-red-500/10', text: 'text-red-500' },
  'error': { bg: 'bg-red-500/10', text: 'text-red-500' },

  // 비활성/알 수 없음
  'Unknown': { bg: 'bg-slate-500/10', text: 'text-slate-500' },
  'inactive': { bg: 'bg-slate-500/10', text: 'text-slate-500' },
  'neutral': { bg: 'bg-slate-500/10', text: 'text-slate-500' },
  'Terminating': { bg: 'bg-slate-500/10', text: 'text-slate-500' },

  // 정보/특수
  'Degraded': { bg: 'bg-orange-500/10', text: 'text-orange-500' },
  'info': { bg: 'bg-blue-500/10', text: 'text-blue-500' },

  // ConfigMap/Secret
  'ConfigMap': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Secret': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

// 한국어 상태 라벨 매핑
const STATUS_LABELS: Record<string, string> = {
  // 워크로드
  'Running': '실행 중',
  'Pending': '대기 중',
  'Failed': '실패',
  'CrashLoopBackOff': '오류 반복',
  'ImagePullBackOff': '이미지 오류',
  'Unknown': '알 수 없음',
  'Terminating': '종료 중',
  'Succeeded': '완료',

  // 엔드포인트
  'Online': '온라인',
  'Offline': '오프라인',
  'Degraded': '저하됨',
  'Warning': '경고',
  'Connecting': '연결 중',

  // 스택
  'active': '활성',
  'inactive': '비활성',
  'deploying': '배포 중',
  'failed': '실패',
  'rolling_back': '롤백 중',
  'paused': '일시 중지',

  // GitOps
  'synced': '동기화됨',
  'syncing': '동기화 중',
  'pending': '대기 중',

  // Config
  'ConfigMap': 'ConfigMap',
  'Secret': 'Secret',

  // 일반
  'success': '성공',
  'error': '오류',
  'warning': '경고',
  'info': '정보',
  'neutral': '중립',
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;  // 커스텀 라벨 (선택)
  size?: 'xs' | 'sm' | 'md';
  showDot?: boolean;  // 상태 점 표시
  pulseDot?: boolean; // 점 애니메이션
  className?: string;
}

export function StatusBadge({
  status,
  label,
  size = 'sm',
  showDot = false,
  pulseDot = false,
  className,
}: StatusBadgeProps) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['neutral'];
  const displayLabel = label || STATUS_LABELS[status] || status;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        colors.bg,
        colors.text,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span className="relative flex">
          <span
            className={cn(
              'rounded-full',
              dotSizeClasses[size],
              colors.text.replace('text-', 'bg-').replace('/10', '')
            )}
          />
          {pulseDot && (
            <span
              className={cn(
                'absolute inset-0 rounded-full animate-ping opacity-75',
                colors.text.replace('text-', 'bg-').replace('/10', '')
              )}
            />
          )}
        </span>
      )}
      {displayLabel}
    </span>
  );
}

// 상태 아이콘 컴포넌트
interface StatusDotProps {
  status: StatusType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ status, size = 'sm', pulse = false, className }: StatusDotProps) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['neutral'];

  const sizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'rounded-full',
          sizeClasses[size],
          colors.text.replace('text-', 'bg-')
        )}
      />
      {pulse && (
        <span
          className={cn(
            'absolute inset-0 rounded-full animate-ping opacity-75',
            colors.text.replace('text-', 'bg-')
          )}
        />
      )}
    </span>
  );
}

// 상태 색상 가져오기 유틸
export function getStatusColor(status: StatusType) {
  return STATUS_COLORS[status] || STATUS_COLORS['neutral'];
}

// 상태 라벨 가져오기 유틸
export function getStatusLabel(status: StatusType) {
  return STATUS_LABELS[status] || status;
}
