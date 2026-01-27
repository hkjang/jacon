"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import styles from './sidebar.module.css';
import { FiGrid, FiBox, FiServer, FiActivity, FiSettings, FiShield } from 'react-icons/fi';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: FiGrid },
  { label: 'Inventory', href: '/inventory', icon: FiBox },
  { label: 'Workloads', href: '/workloads', icon: FiServer },
  { label: 'Policy & IAM', href: '/policy', icon: FiShield },
  { label: 'Observability', href: '/observability', icon: FiActivity },
  { label: 'Settings', href: '/settings', icon: FiSettings },
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
