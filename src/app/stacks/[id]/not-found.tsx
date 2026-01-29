import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function StackNotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">스택을 찾을 수 없습니다</h1>
        <p className="text-slate-400 mt-2">요청한 스택이 존재하지 않거나 삭제되었습니다.</p>
        <Link href="/stacks" className="mt-4">
          <Button variant="outline">
            <FiArrowLeft className="mr-2" /> 스택 목록으로 돌아가기
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
}
