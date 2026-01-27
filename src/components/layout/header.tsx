"use client";

import React from 'react';
import styles from './header.module.css';
import { useAuth } from '@/components/features/auth/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiBell } from 'react-icons/fi';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h2 className={styles.title}>Dashboard</h2>
      </div>
      
      <div className={styles.right}>
        <div style={{ width: '240px' }}>
          <Input placeholder="Search resources..." className="bg-slate-800 border-none" />
        </div>
        
        <Button variant="ghost" size="sm">
          <FiBell size={20} />
        </Button>
        
        <div className={styles.profileAvatar} onClick={logout} title="Click to logout">
          {user ? user.name.substring(0, 2).toUpperCase() : 'JD'}
        </div>
      </div>
    </header>
  );
}
