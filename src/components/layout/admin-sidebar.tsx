"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
// Reusing sidebar styles for consistency, but we could add specific admin overrides
import styles from '@/components/layout/sidebar.module.css'; 
import { FiGrid, FiUsers, FiSettings, FiShield, FiLogOut } from 'react-icons/fi';

const ADMIN_NAV_ITEMS = [
  { label: '관리자 대시보드', href: '/admin', icon: FiGrid },
  { label: '사용자 관리', href: '/admin/users', icon: FiUsers },
  { label: '시스템 설정', href: '/admin/settings', icon: FiSettings },
  { label: '글로벌 감사', href: '/admin/audit', icon: FiShield },
  // { label: '플랫폼 상태', href: '/admin/health', icon: FiActivity },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={cn(styles.sidebar, "border-r border-indigo-900/30 bg-slate-950")}>
      <div className={styles.header}>
        <Link href="/admin" className={styles.logo}>
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(79,70,229,0.5)]">A</div>
          <span className={cn(styles.logoText, "text-indigo-100")}>Jacon 관리자</span>
        </Link>
      </div>
      
      <div className="px-4 py-2 mb-2">
          <div className="bg-indigo-900/20 text-indigo-300 text-xs font-bold uppercase tracking-wider py-1 px-2 rounded border border-indigo-500/20 text-center">
              시스템 컨텍스트
          </div>
      </div>
      
      <nav className={styles.nav}>
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          // Exact match for root, startsWith for others
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                  styles.navItem, 
                  isActive && "bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500"
              )}
            >
              <Icon size={20} className={isActive ? "text-indigo-400" : "text-slate-500"} />
              <span className={isActive ? "text-indigo-100" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-800 space-y-2">
         <Link href="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-slate-200 text-sm font-medium p-2 rounded hover:bg-slate-900 transition-colors">
            <FiLogOut /> 관리자 모드 종료
         </Link>
      </div>
    </aside>
  );
}
