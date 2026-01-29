export type Theme = 'light' | 'dark';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// K8s 타입 Re-export
export * from './k8s';

// 공통 API 응답 타입
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션 타입
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 필터 타입
export interface FilterOptions {
  search?: string;
  status?: string[];
  namespace?: string[];
  cluster?: string[];
  type?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

// 정렬 타입
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
