"use client";

import React, { useState } from 'react';
import { useAuth } from './auth-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Router push is handled in auth-context
    } catch {
      setError('Invalid credentials. Try admin@jacon.io / admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Welcome Back</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="admin@jacon.io" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading}
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>

          {/* Development Helper: Quick Login */}
          <div className="w-full pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center mb-2">⚡ 개발용 빠른 로그인</p>
            <div className="grid grid-cols-2 gap-2">
                <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs h-auto py-2 flex flex-col items-start gap-1"
                    onClick={() => {
                        setFormData({ email: 'kim.cs@jacon.io', password: 'password' });
                        // Optional: auto submit
                        login('kim.cs@jacon.io', 'password'); 
                    }}
                >
                    <span className="font-bold">시스템 관리자</span>
                    <span className="text-[10px] text-slate-400">kim.cs@jacon.io</span>
                </Button>
                <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs h-auto py-2 flex flex-col items-start gap-1"
                    onClick={() => {
                        setFormData({ email: 'park.jm@jacon.io', password: 'password' });
                        login('park.jm@jacon.io', 'password');
                    }}
                >
                    <span className="font-bold">개발자</span>
                    <span className="text-[10px] text-slate-400">park.jm@jacon.io</span>
                </Button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
