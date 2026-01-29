"use client";

import { useState, useCallback } from 'react';

// 액션 결과 타입
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// 모달 상태 타입
interface ModalState<T> {
  isOpen: boolean;
  item: T | null;
}

// 리소스 액션 옵션
interface UseResourceActionsOptions<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  // CRUD 액션들
  createAction?: (data: TCreate) => Promise<ActionResult<T>>;
  updateAction?: (id: string, data: TUpdate) => Promise<ActionResult<T>>;
  deleteAction?: (id: string) => Promise<ActionResult>;

  // 추가 액션들
  customActions?: {
    [key: string]: (id: string, ...args: unknown[]) => Promise<ActionResult>;
  };

  // 콜백
  onSuccess?: (action: string, data?: unknown) => void;
  onError?: (action: string, error: string) => void;

  // 새로고침 콜백
  onRefresh?: () => void;
}

// 리소스 액션 반환 타입
interface UseResourceActionsReturn<T, TCreate, TUpdate> {
  // 모달 상태
  createModalOpen: boolean;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  selectedItem: T | null;

  // 모달 제어
  openCreateModal: () => void;
  openEditModal: (item: T) => void;
  openDeleteModal: (item: T) => void;
  closeCreateModal: () => void;
  closeEditModal: () => void;
  closeDeleteModal: () => void;

  // 액션 상태
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  actionError: string | null;

  // 액션 함수
  handleCreate: (data: TCreate) => Promise<ActionResult<T>>;
  handleUpdate: (data: TUpdate) => Promise<ActionResult<T>>;
  handleDelete: () => Promise<ActionResult>;
  executeCustomAction: (actionName: string, id: string, ...args: unknown[]) => Promise<ActionResult>;

  // 유틸
  clearError: () => void;
}

export function useResourceActions<T, TCreate = Partial<T>, TUpdate = Partial<T>>({
  createAction,
  updateAction,
  deleteAction,
  customActions = {},
  onSuccess,
  onError,
  onRefresh,
}: UseResourceActionsOptions<T, TCreate, TUpdate>): UseResourceActionsReturn<T, TCreate, TUpdate> {
  // 모달 상태
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<ModalState<T>>({ isOpen: false, item: null });
  const [deleteModal, setDeleteModal] = useState<ModalState<T>>({ isOpen: false, item: null });

  // 액션 상태
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // 모달 제어 함수들
  const openCreateModal = useCallback(() => {
    setActionError(null);
    setCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setCreateModalOpen(false);
    setActionError(null);
  }, []);

  const openEditModal = useCallback((item: T) => {
    setActionError(null);
    setEditModal({ isOpen: true, item });
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModal({ isOpen: false, item: null });
    setActionError(null);
  }, []);

  const openDeleteModal = useCallback((item: T) => {
    setActionError(null);
    setDeleteModal({ isOpen: true, item });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, item: null });
    setActionError(null);
  }, []);

  // 생성 핸들러
  const handleCreate = useCallback(async (data: TCreate): Promise<ActionResult<T>> => {
    if (!createAction) {
      return { success: false, error: '생성 액션이 정의되지 않았습니다.' };
    }

    setCreating(true);
    setActionError(null);

    try {
      const result = await createAction(data);
      if (result.success) {
        closeCreateModal();
        onSuccess?.('create', result.data);
        onRefresh?.();
      } else {
        setActionError(result.error || '생성에 실패했습니다.');
        onError?.('create', result.error || '생성에 실패했습니다.');
      }
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setActionError(errorMessage);
      onError?.('create', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCreating(false);
    }
  }, [createAction, closeCreateModal, onSuccess, onError, onRefresh]);

  // 수정 핸들러
  const handleUpdate = useCallback(async (data: TUpdate): Promise<ActionResult<T>> => {
    if (!updateAction || !editModal.item) {
      return { success: false, error: '수정할 항목이 선택되지 않았습니다.' };
    }

    const id = (editModal.item as unknown as { id: string }).id;
    if (!id) {
      return { success: false, error: 'ID가 없습니다.' };
    }

    setUpdating(true);
    setActionError(null);

    try {
      const result = await updateAction(id, data);
      if (result.success) {
        closeEditModal();
        onSuccess?.('update', result.data);
        onRefresh?.();
      } else {
        setActionError(result.error || '수정에 실패했습니다.');
        onError?.('update', result.error || '수정에 실패했습니다.');
      }
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setActionError(errorMessage);
      onError?.('update', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  }, [updateAction, editModal.item, closeEditModal, onSuccess, onError, onRefresh]);

  // 삭제 핸들러
  const handleDelete = useCallback(async (): Promise<ActionResult> => {
    if (!deleteAction || !deleteModal.item) {
      return { success: false, error: '삭제할 항목이 선택되지 않았습니다.' };
    }

    const id = (deleteModal.item as unknown as { id: string }).id;
    if (!id) {
      return { success: false, error: 'ID가 없습니다.' };
    }

    setDeleting(true);
    setActionError(null);

    try {
      const result = await deleteAction(id);
      if (result.success) {
        closeDeleteModal();
        onSuccess?.('delete');
        onRefresh?.();
      } else {
        setActionError(result.error || '삭제에 실패했습니다.');
        onError?.('delete', result.error || '삭제에 실패했습니다.');
      }
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setActionError(errorMessage);
      onError?.('delete', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setDeleting(false);
    }
  }, [deleteAction, deleteModal.item, closeDeleteModal, onSuccess, onError, onRefresh]);

  // 커스텀 액션 실행
  const executeCustomAction = useCallback(
    async (actionName: string, id: string, ...args: unknown[]): Promise<ActionResult> => {
      const action = customActions[actionName];
      if (!action) {
        return { success: false, error: `액션 '${actionName}'을(를) 찾을 수 없습니다.` };
      }

      try {
        const result = await action(id, ...args);
        if (result.success) {
          onSuccess?.(actionName);
          onRefresh?.();
        } else {
          onError?.(actionName, result.error || '액션 실행에 실패했습니다.');
        }
        return result;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : '오류가 발생했습니다.';
        onError?.(actionName, errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [customActions, onSuccess, onError, onRefresh]
  );

  const clearError = useCallback(() => {
    setActionError(null);
  }, []);

  return {
    // 모달 상태
    createModalOpen,
    editModalOpen: editModal.isOpen,
    deleteModalOpen: deleteModal.isOpen,
    selectedItem: editModal.item || deleteModal.item,

    // 모달 제어
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,

    // 액션 상태
    creating,
    updating,
    deleting,
    actionError,

    // 액션 함수
    handleCreate,
    handleUpdate,
    handleDelete,
    executeCustomAction,

    // 유틸
    clearError,
  };
}
