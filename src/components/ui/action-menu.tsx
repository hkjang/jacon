"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FiMoreVertical, FiMoreHorizontal } from 'react-icons/fi';
import { Button } from './button';

export interface ActionMenuItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  divider?: boolean;  // 구분선 표시
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  trigger?: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
  align?: 'left' | 'right';
  className?: string;
}

export function ActionMenu({
  items,
  trigger,
  orientation = 'vertical',
  align = 'right',
  className,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleItemClick = (e: React.MouseEvent, item: ActionMenuItem) => {
    e.stopPropagation();
    if (item.disabled) return;
    item.onClick(e);
    setIsOpen(false);
  };

  const Icon = orientation === 'vertical' ? FiMoreVertical : FiMoreHorizontal;

  return (
    <div ref={menuRef} className={cn('relative inline-block', className)}>
      {/* 트리거 */}
      {trigger ? (
        <div onClick={handleToggle}>{trigger}</div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleToggle}
        >
          <Icon className="w-4 h-4" />
        </Button>
      )}

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 py-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-[160px]',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div key={index} className="my-1 border-t border-slate-700" />
              );
            }

            const ItemIcon = item.icon;

            return (
              <button
                key={index}
                onClick={(e) => handleItemClick(e, item)}
                disabled={item.disabled}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors',
                  item.disabled
                    ? 'text-slate-500 cursor-not-allowed'
                    : item.variant === 'danger'
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-slate-300 hover:bg-slate-700'
                )}
              >
                {ItemIcon && <ItemIcon className="w-4 h-4" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 인라인 액션 버튼 그룹
interface ActionButtonsProps {
  items: ActionMenuItem[];
  size?: 'sm' | 'md';
  className?: string;
}

export function ActionButtons({ items, size = 'sm', className }: ActionButtonsProps) {
  const buttonSize = size === 'sm' ? 'h-8 w-8 p-0' : 'h-9 w-9 p-0';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {items.map((item, index) => {
        if (item.divider) return null;
        const Icon = item.icon;

        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={cn(
              buttonSize,
              item.variant === 'danger' && 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
            )}
            onClick={item.onClick}
            disabled={item.disabled}
            title={item.label}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </Button>
        );
      })}
    </div>
  );
}

// 컨텍스트 메뉴용 컴포넌트
interface ContextMenuProps {
  items: ActionMenuItem[];
  children: React.ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!position) return;

    const handleClick = () => setPosition(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [position]);

  return (
    <div onContextMenu={handleContextMenu} className={className}>
      {children}

      {position && (
        <div
          ref={menuRef}
          className="fixed z-50 py-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-[160px]"
          style={{ left: position.x, top: position.y }}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div key={index} className="my-1 border-t border-slate-700" />
              );
            }

            const ItemIcon = item.icon;

            return (
              <button
                key={index}
                onClick={(e) => {
                  if (!item.disabled) {
                    item.onClick(e);
                  }
                  setPosition(null);
                }}
                disabled={item.disabled}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors',
                  item.disabled
                    ? 'text-slate-500 cursor-not-allowed'
                    : item.variant === 'danger'
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-slate-300 hover:bg-slate-700'
                )}
              >
                {ItemIcon && <ItemIcon className="w-4 h-4" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
