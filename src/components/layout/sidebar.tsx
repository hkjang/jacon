"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import styles from './sidebar.module.css';
import { FiGrid, FiBox, FiServer, FiActivity, FiSettings, FiShield, FiLayers } from 'react-icons/fi';
import { ProjectSwitcher } from '@/components/features/layout/project-switcher';

const NAV_ITEMS = [
  { label: '대시보드', href: '/dashboard', icon: FiGrid },
  { label: '인벤토리', href: '/inventory', icon: FiBox },
  { label: '엔드포인트', href: '/endpoints', icon: FiServer },
  { label: '워크로드', href: '/workloads', icon: FiLayers }, // Changed icon to Layers for Workloads to avoid duplicate
  { label: '정책 및 IAM', href: '/policy', icon: FiShield },
  { label: '구성 관리', href: '/config', icon: FiSettings },  // Reusing Settings icon for now, usually Sliders or Database
  { label: '관측성', href: '/observability', icon: FiActivity },
  // { label: 'Settings', href: '/settings', icon: FiSettings }, // Move Settings to bottom or keep as general settings
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-sm">J</div>
          <span className={styles.logoText}>Jacon</span>
        </Link>
      </div>
      
      <ProjectSwitcher />
      
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(styles.navItem, isActive && styles.active)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {/* User profile or collapsed toggle place holder */}
      </div>
    </aside>
  );
}
