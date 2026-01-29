"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import styles from './sidebar.module.css';
import {
  FiGrid,
  FiBox,
  FiServer,
  FiActivity,
  FiSettings,
  FiShield,
  FiLayers,
  FiGlobe,
  FiGitBranch,
  FiHardDrive,
  FiCloud,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiPackage,
  FiCpu,
  FiMonitor,
  FiUsers,
  FiFileText,
  FiLock
} from 'react-icons/fi';
import { SiKubernetes, SiDocker } from 'react-icons/si';
import { ProjectSwitcher } from '@/components/features/layout/project-switcher';

// 네비게이션 아이템 타입
interface NavItemType {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
  children?: NavItemType[];
}

// 네비게이션 그룹 타입
interface NavGroup {
  title: string;
  items: NavItemType[];
  defaultOpen?: boolean;
}

// 네비게이션 구조 정의
const NAV_STRUCTURE: NavGroup[] = [
  {
    title: '개요',
    defaultOpen: true,
    items: [
      { label: '대시보드', href: '/dashboard', icon: FiGrid },
      { label: '인벤토리', href: '/inventory', icon: FiBox },
    ],
  },
  {
    title: '인프라스트럭처',
    defaultOpen: true,
    items: [
      {
        label: '엔드포인트',
        href: '/endpoints',
        icon: FiServer,
        children: [
          { label: '전체 목록', href: '/endpoints', icon: FiServer },
          { label: '그룹 관리', href: '/endpoints/groups', icon: FiLayers },
        ],
      },
      {
        label: '멀티 클러스터',
        href: '/multi-cluster',
        icon: FiGlobe,
        children: [
          { label: '개요', href: '/multi-cluster/overview', icon: FiGlobe },
          { label: '클러스터 목록', href: '/multi-cluster/clusters', icon: SiKubernetes },
        ],
      },
      { label: '노드', href: '/nodes', icon: FiCpu },
    ],
  },
  {
    title: '워크로드',
    defaultOpen: true,
    items: [
      { label: '워크로드', href: '/workloads', icon: FiLayers },
      { label: '네임스페이스', href: '/namespaces', icon: FiPackage },
      { label: '서비스', href: '/services', icon: FiCloud },
    ],
  },
  {
    title: '스토리지 & 구성',
    defaultOpen: true,
    items: [
      { label: '스토리지', href: '/storage', icon: FiHardDrive },
      {
        label: '구성 관리',
        href: '/config',
        icon: FiFileText,
        children: [
          { label: 'ConfigMap', href: '/config?type=ConfigMap', icon: FiFileText },
          { label: 'Secret', href: '/config?type=Secret', icon: FiLock },
        ],
      },
    ],
  },
  {
    title: '배포 & GitOps',
    defaultOpen: false,
    items: [
      { label: '스택', href: '/stacks', icon: FiLayers },
      { label: 'GitOps', href: '/gitops', icon: FiGitBranch },
      { label: '배포', href: '/deploy', icon: FiPackage },
    ],
  },
  {
    title: '관측성',
    defaultOpen: false,
    items: [
      { label: '모니터링', href: '/observability', icon: FiActivity },
      { label: '에지 컴퓨트', href: '/edge', icon: FiMonitor },
    ],
  },
  {
    title: '보안 & 정책',
    defaultOpen: false,
    items: [
      { label: '정책 (OPA)', href: '/policy', icon: FiShield },
      { label: 'IAM', href: '/settings/iam', icon: FiUsers },
      { label: '레지스트리', href: '/settings/registries', icon: SiDocker },
    ],
  },
];

// 네비게이션 아이템 컴포넌트
const NavItemComponent = ({
  item,
  currentPath,
  depth = 0,
}: {
  item: NavItemType;
  currentPath: string;
  depth?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = currentPath === item.href || (currentPath.startsWith(item.href + '/') && item.href !== '/');
  const isChildActive = hasChildren && item.children!.some(
    (child) => currentPath === child.href || currentPath.startsWith(child.href.split('?')[0])
  );

  // 자식이 활성화되면 자동으로 펼침
  React.useEffect(() => {
    if (isChildActive) {
      setIsExpanded(true);
    }
  }, [isChildActive]);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            styles.navItem,
            'w-full justify-between',
            (isActive || isChildActive) && styles.active
          )}
          style={{ paddingLeft: `${1 + depth * 0.75}rem` }}
        >
          <span className="flex items-center gap-3">
            <Icon size={18} />
            <span>{item.label}</span>
          </span>
          {isExpanded ? (
            <FiChevronDown size={16} className="text-slate-500" />
          ) : (
            <FiChevronRight size={16} className="text-slate-500" />
          )}
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.href}
                item={child}
                currentPath={currentPath}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(styles.navItem, isActive && styles.active)}
      style={{ paddingLeft: `${1 + depth * 0.75}rem` }}
    >
      <Icon size={18} />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

// 네비게이션 그룹 컴포넌트
const NavGroupComponent = ({
  group,
  currentPath,
}: {
  group: NavGroup;
  currentPath: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(group.defaultOpen ?? true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
      >
        <span>{group.title}</span>
        {isExpanded ? (
          <FiChevronDown size={14} />
        ) : (
          <FiChevronRight size={14} />
        )}
      </button>
      {isExpanded && (
        <nav className="space-y-1">
          {group.items.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              currentPath={currentPath}
            />
          ))}
        </nav>
      )}
    </div>
  );
};

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(styles.sidebar, isCollapsed && styles.collapsed)}>
      {/* 헤더 */}
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            J
          </div>
          {!isCollapsed && <span className={styles.logoText}>Jacon</span>}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <FiMenu size={18} />
        </button>
      </div>

      {/* 프로젝트 선택기 */}
      {!isCollapsed && <ProjectSwitcher />}

      {/* 네비게이션 */}
      <div className={styles.nav}>
        {NAV_STRUCTURE.map((group) => (
          <NavGroupComponent
            key={group.title}
            group={group}
            currentPath={pathname}
          />
        ))}
      </div>

      {/* 푸터 */}
      <div className={styles.footer}>
        {!isCollapsed && (
          <Link
            href="/settings"
            className={cn(
              styles.navItem,
              pathname.startsWith('/settings') && styles.active
            )}
          >
            <FiSettings size={18} />
            <span>설정</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
