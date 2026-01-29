"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { FiChevronUp, FiChevronDown, FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent } from './card';

// 컬럼 정의
export interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

// 테이블 Props
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;

  // 검색
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];

  // 정렬
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';

  // 페이지네이션
  pagination?: boolean;
  pageSize?: number;

  // 스타일
  className?: string;
  rowClassName?: string | ((row: T) => string);
  emptyMessage?: string;

  // 헤더 액션
  headerActions?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  loading = false,
  error,
  onRetry,
  searchable = false,
  searchPlaceholder = '검색...',
  searchFields,
  defaultSortKey,
  defaultSortDirection = 'asc',
  pagination = false,
  pageSize = 10,
  className,
  rowClassName,
  emptyMessage = '데이터가 없습니다.',
  headerActions,
  onRefresh,
  refreshing = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 필터링
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchable) return data;

    const term = searchTerm.toLowerCase();
    return data.filter((row) => {
      const fieldsToSearch = searchFields || (Object.keys(row as object) as (keyof T)[]);
      return fieldsToSearch.some((field) => {
        const value = row[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (typeof value === 'number') {
          return value.toString().includes(term);
        }
        return false;
      });
    });
  }, [data, searchTerm, searchable, searchFields]);

  // 정렬
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // 페이지네이션
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // 정렬 토글
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // 페이지 변경 시 첫 페이지로
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* 헤더 영역 */}
      {(searchable || headerActions || onRefresh) && (
        <div className="flex items-center justify-between gap-4">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
                <FiRefreshCw className={cn('mr-2 w-4 h-4', refreshing && 'animate-spin')} />
                새로고침
              </Button>
            )}
            {headerActions}
          </div>
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          {onRetry && (
            <button onClick={onRetry} className="underline hover:no-underline">
              다시 시도
            </button>
          )}
        </div>
      )}

      {/* 테이블 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-800 text-slate-400">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        'px-6 py-3 whitespace-nowrap',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        column.sortable && 'cursor-pointer select-none hover:bg-slate-700',
                        column.className
                      )}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-1">
                        {column.header}
                        {column.sortable && sortKey === column.key && (
                          sortDirection === 'asc' ? (
                            <FiChevronUp className="w-4 h-4" />
                          ) : (
                            <FiChevronDown className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                      <FiRefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
                      로딩 중...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                      {searchTerm ? '검색 결과가 없습니다.' : emptyMessage}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr
                      key={keyExtractor(row)}
                      className={cn(
                        'border-b border-slate-700 hover:bg-slate-800/50 transition-colors',
                        onRowClick && 'cursor-pointer',
                        typeof rowClassName === 'function' ? rowClassName(row) : rowClassName
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={cn(
                            'px-6 py-4',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {column.accessor
                            ? column.accessor(row)
                            : (row as Record<string, unknown>)[column.key] as React.ReactNode}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            총 {sortedData.length}개 중 {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, sortedData.length)}개
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
