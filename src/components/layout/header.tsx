"use client";

import React from 'react';
import styles from './header.module.css';
import { useAuth } from '@/components/features/auth/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiBell, FiPlay } from 'react-icons/fi';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h2 className={styles.title}>대시보드</h2>
      </div>
      
      <div className={styles.right}>
        <div style={{ width: '240px' }}>
          <Input placeholder="리소스 검색..." className="bg-slate-800 border-none" />
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
          onClick={() => window.location.href='/deploy'}
        >
          <FiPlay className="mr-2 w-3 h-3" /> 배포
        </Button>
        
        <Button variant="ghost" size="sm">
          <FiBell size={20} />
        </Button>
        
        <div className={styles.profileAvatar} onClick={logout} title="클릭하여 로그아웃">
          {user ? user.name.substring(0, 2).toUpperCase() : 'JD'}
        </div>
      </div>
    </header>
  );
}
