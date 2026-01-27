"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FiChevronRight, FiChevronDown, FiFolder, FiBox } from 'react-icons/fi';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ElementType;
  children?: TreeNode[];
  data?: unknown;
}

interface TreeViewProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  className?: string;
}

const TreeItem = ({ node, level, onSelect }: { node: TreeNode; level: number; onSelect?: (n: TreeNode) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const Icon = node.icon || (hasChildren ? FiFolder : FiBox);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setExpanded(!expanded);
    }
    if (onSelect) {
      onSelect(node);
    }
  };

  return (
    <div className="select-none">
      <div 
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer hover:bg-slate-800 transition-colors",
          "text-sm text-slate-300"
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={handleClick}
      >
        <span className="text-slate-500">
          {hasChildren ? (
            expanded ? <FiChevronDown /> : <FiChevronRight />
          ) : <span className="w-4" />}
        </span>
        <Icon className="text-blue-500" />
        <span>{node.label}</span>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export function TreeView({ data, onSelect, className }: TreeViewProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {data.map((node) => (
        <TreeItem key={node.id} node={node} level={0} onSelect={onSelect} />
      ))}
    </div>
  );
}
