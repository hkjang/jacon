"use client";

import React, { useState } from 'react';
import styles from './header.module.css';
import { useAuth } from '@/components/features/auth/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiBell, FiPlay, FiUser, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // Call context logout (clears local state)
    // Server compliance is handled by Next.js actions if we switched strictly, 
    // but typically we want to hit the server logout route/action too.
    // For now, let's trust the auth-context which handles client side.
    // If we migrated to server actions, we might need to fetch('/api/auth/logout') or similar.
    // But let's stick to the prompt's context: "Fix View Profile".
    logout();
  };

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
        
        <div className="relative">
            <div 
                className={`${styles.profileAvatar} cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all`} 
                onClick={() => setMenuOpen(!menuOpen)} 
                title="사용자 메뉴"
            >
              {user ? user.name.substring(0, 2).toUpperCase() : 'JD'}
            </div>

            {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3 border-b border-slate-800">
                        <div className="font-bold text-slate-200">{user?.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                    </div>
                    <div className="p-1">
                        <button 
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded"
                            onClick={() => {
                                setMenuOpen(false);
                                router.push('/profile');
                            }}
                        >
                            <FiUser className="w-4 h-4" /> 프로필 보기
                        </button>
                        <button 
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded"
                            onClick={handleLogout}
                        >
                            <FiLogOut className="w-4 h-4" /> 로그아웃
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}
