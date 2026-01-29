"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';

// 리스트 컨트롤러 상태 타입
interface ListControllerState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortKey: string | null;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  selectedItems: Set<string>;
}

// 리스트 컨트롤러 옵션
interface UseListControllerOptions<T> {
  // 데이터 로드 함수
  fetchData: () => Promise<T[]> | T[];

  // 키 추출 함수
  keyExtractor: (item: T) => string;

  // 검색 필터 필드
  searchFields?: (keyof T)[];

  // 기본 정렬
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';

  // 페이지네이션
  pageSize?: number;

  // 자동 로드
  autoLoad?: boolean;

  // 로드 딜레이 (디바운스용)
  loadDelay?: number;
}

// 리스트 컨트롤러 반환 타입
interface UseListControllerReturn<T> {
  // 상태
  data: T[];
  filteredData: T[];
  paginatedData: T[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  // 검색
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // 정렬
  sortKey: string | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (key: string) => void;

  // 페이지네이션
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;

  // 선택
  selectedItems: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;

  // 액션
  loadData: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useListController<T>({
  fetchData,
  keyExtractor,
  searchFields,
  defaultSortKey,
  defaultSortDirection = 'asc',
  pageSize = 10,
  autoLoad = true,
  loadDelay = 300,
}: UseListControllerOptions<T>): UseListControllerReturn<T> {
  // 상태
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // 데이터 로드
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 로드 딜레이 시뮬레이션 (실제 API에서는 제거)
      await new Promise((resolve) => setTimeout(resolve, loadDelay));
      const result = await fetchData();
      setData(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchData, loadDelay]);

  // 새로고침
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  // 자동 로드
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  // 검색 필터링
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter((item) => {
      const fields = searchFields || (Object.keys(item as object) as (keyof T)[]);
      return fields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (typeof value === 'number') {
          return value.toString().includes(term);
        }
        return false;
      });
    });
  }, [data, searchTerm, searchFields]);

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
  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // 정렬 핸들러
  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }, [sortKey]);

  // 검색어 변경 시 첫 페이지로
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 선택 관련 함수들
  const toggleSelect = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allIds = filteredData.map(keyExtractor);
    setSelectedItems(new Set(allIds));
  }, [filteredData, keyExtractor]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedItems.has(id);
  }, [selectedItems]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 상태
    data,
    filteredData: sortedData,
    paginatedData,
    loading,
    refreshing,
    error,

    // 검색
    searchTerm,
    setSearchTerm,

    // 정렬
    sortKey,
    sortDirection,
    handleSort,

    // 페이지네이션
    currentPage,
    totalPages,
    setCurrentPage,

    // 선택
    selectedItems,
    toggleSelect,
    selectAll,
    clearSelection,
    isSelected,

    // 액션
    loadData,
    refresh,
    clearError,
  };
}
