"use client";

import React, { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { FiX, FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi';

// 기본 모달 Props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

// 기본 모달 컴포넌트
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  footer,
}: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeOnEscape, isOpen, onClose]);

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 백드롭 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* 모달 컨텐츠 */}
      <div
        className={cn(
          'relative bg-slate-900 border border-slate-700 rounded-lg w-full shadow-xl',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizeClasses[size],
          className
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
            {description && (
              <p className="text-sm text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
          {showCloseButton && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <FiX className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* 바디 */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* 푸터 */}
        {footer && (
          <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// 폼 모달 Props
interface FormModalProps extends Omit<ModalProps, 'children' | 'footer'> {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string | null;
  submitDisabled?: boolean;
  submitVariant?: 'primary' | 'danger';
}

// 폼 모달 컴포넌트
export function FormModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = '저장',
  cancelLabel = '취소',
  loading = false,
  error,
  submitDisabled = false,
  submitVariant = 'primary',
  ...props
}: FormModalProps) {
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit(e);
    },
    [onSubmit]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      {...props}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {children}

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            variant={submitVariant}
            disabled={loading || submitDisabled}
          >
            {loading ? '처리 중...' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// 확인 모달 Props
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: () => any;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'warning' | 'danger' | 'info';
  loading?: boolean;
  requireConfirmation?: boolean;
  confirmationText?: string;
  resourceName?: string;
}

// 확인 모달 컴포넌트
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'danger',
  loading = false,
  requireConfirmation = false,
  confirmationText,
  resourceName,
}: ConfirmModalProps) {
  const [confirmInput, setConfirmInput] = React.useState('');
  const expectedText = confirmationText || resourceName || '';
  const isConfirmed = !requireConfirmation || confirmInput === expectedText;

  const handleConfirm = useCallback(async () => {
    if (!isConfirmed) return;
    await onConfirm();
    setConfirmInput('');
  }, [isConfirmed, onConfirm]);

  const handleClose = useCallback(() => {
    setConfirmInput('');
    onClose();
  }, [onClose]);

  const variantConfig = {
    warning: {
      icon: FiAlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      buttonVariant: 'primary' as const,
    },
    danger: {
      icon: FiAlertTriangle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
      buttonVariant: 'danger' as const,
    },
    info: {
      icon: FiInfo,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      buttonVariant: 'primary' as const,
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="sm"
      closeOnBackdrop={!loading}
    >
      <div className="space-y-4">
        <div className={cn('p-4 rounded-lg flex gap-3', config.bgColor)}>
          <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
          <p className="text-sm text-slate-300">{description}</p>
        </div>

        {requireConfirmation && expectedText && (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              계속하려면 <span className="font-mono text-red-400">{expectedText}</span>을(를) 입력하세요:
            </p>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={expectedText}
              autoFocus
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={loading || !isConfirmed}
          >
            {loading ? '처리 중...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// 삭제 확인 모달 (ProtectedActionModal 대체)
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: () => any;
  resourceType: string;
  resourceName: string;
  loading?: boolean;
  additionalWarning?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  resourceType,
  resourceName,
  loading = false,
  additionalWarning,
}: DeleteConfirmModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`${resourceType} 삭제`}
      description={`정말 '${resourceName}'을(를) 삭제하시겠습니까? ${additionalWarning || '이 작업은 되돌릴 수 없습니다.'}`}
      confirmLabel="삭제"
      variant="danger"
      loading={loading}
      requireConfirmation
      resourceName={resourceName}
    />
  );
}
