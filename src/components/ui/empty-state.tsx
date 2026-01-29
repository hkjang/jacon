"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { FiInbox, FiSearch, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { Button } from './button';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  variant?: 'default' | 'search' | 'error';
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const variantIcons = {
    default: FiInbox,
    search: FiSearch,
    error: FiAlertCircle,
  };

  const Icon = icon || variantIcons[variant];
  const ActionIcon = action?.icon || FiPlus;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-200 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-md mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          <ActionIcon className="w-4 h-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

// 검색 결과 없음
interface NoSearchResultsProps {
  searchTerm: string;
  onClear?: () => void;
  className?: string;
}

export function NoSearchResults({ searchTerm, onClear, className }: NoSearchResultsProps) {
  return (
    <EmptyState
      variant="search"
      title="검색 결과 없음"
      description={`'${searchTerm}'에 대한 검색 결과가 없습니다.`}
      action={onClear ? { label: '검색어 지우기', onClick: onClear } : undefined}
      className={className}
    />
  );
}

// 로딩 상태
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = '로딩 중...', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}

// 에러 상태
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = '오류가 발생했습니다',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      variant="error"
      title={title}
      description={message}
      action={onRetry ? { label: '다시 시도', onClick: onRetry } : undefined}
      className={className}
    />
  );
}
