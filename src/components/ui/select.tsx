"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { FiChevronDown } from 'react-icons/fi';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, value, onChange, placeholder, label, error, fullWidth = true, className, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-slate-400">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2 pr-10 bg-slate-950 border border-slate-700 rounded-lg text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'appearance-none cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-800',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// 다중 선택 컴포넌트
interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  maxSelection?: number;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = '선택...',
  label,
  error,
  maxSelection,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else if (!maxSelection || value.length < maxSelection) {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-400">{label}</label>
      )}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-3 py-2 pr-10 bg-slate-950 border border-slate-700 rounded-lg text-sm text-left',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            error && 'border-red-500'
          )}
        >
          {selectedLabels.length > 0 ? (
            <span className="truncate block">{selectedLabels.join(', ')}</span>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                disabled={option.disabled}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-700',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  readOnly
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800"
                />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
