"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, login as apiLogin } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing session (mock implementation using localStorage)
    try {
      const storedUser = localStorage.getItem('jacon_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
          setUser(parsedUser);
        } else {
          // Invalid user data, clear it
          localStorage.removeItem('jacon_user');
          localStorage.removeItem('jacon_token');
        }
      }
    } catch {
      // Corrupted localStorage data, clear it
      console.error('Failed to parse stored user data');
      localStorage.removeItem('jacon_user');
      localStorage.removeItem('jacon_token');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Protect dashboard routes
    if (!loading && !user && pathname.startsWith('/dashboard')) {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, pass: string) => {
    const { user: loggedInUser, token } = await apiLogin(email, pass);
    setUser(loggedInUser);
    localStorage.setItem('jacon_user', JSON.stringify(loggedInUser));
    localStorage.setItem('jacon_token', token);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jacon_user');
    localStorage.removeItem('jacon_token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
