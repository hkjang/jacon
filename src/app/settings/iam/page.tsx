"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { IamRoleList } from '@/components/features/iam/iam-role-list';
import { Card, CardContent } from '@/components/ui/card';
import { FiUsers } from 'react-icons/fi';

export default function IamPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">ID 및 접근 관리 (IAM)</h1>
          <p className="text-slate-400">역할 기반 접근 제어(RBAC)를 관리합니다.</p>
        </div>

        <IamRoleList />

        <Card className="mt-4 border-dashed border-2 bg-slate-900/30">
          <CardContent className="py-8 text-center text-slate-500">
            <FiUsers size={32} className="mx-auto mb-2 opacity-50" />
            <p>역할에 대한 사용자 할당은 <span className="text-blue-400 underline cursor-pointer">사용자 및 팀</span> 섹션에서 관리됩니다.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
