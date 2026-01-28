"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiAlertCircle, FiCpu, FiUsers, FiActivity } from 'react-icons/fi';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-white mb-6">관리자 대시보드</h1>
       
       {/* Top Metrics */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                   <FiUsers size={24} />
                </div>
                <div>
                   <div className="text-2xl font-bold text-slate-100">1,248</div>
                   <div className="text-xs text-slate-500 uppercase font-bold">전체 사용자</div>
                </div>
             </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                   <FiCpu size={24} />
                </div>
                <div>
                   <div className="text-2xl font-bold text-slate-100">84%</div>
                   <div className="text-xs text-slate-500 uppercase font-bold">플랫폼 가동률</div>
                </div>
             </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
                   <FiActivity size={24} />
                </div>
                <div>
                   <div className="text-2xl font-bold text-slate-100">32</div>
                   <div className="text-xs text-slate-500 uppercase font-bold">활성 알림</div>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                   <FiAlertCircle size={24} />
                </div>
                <div>
                   <div className="text-2xl font-bold text-slate-100">3</div>
                   <div className="text-xs text-slate-500 uppercase font-bold">심각한 취약점</div>
                </div>
             </CardContent>
          </Card>
       </div>

       {/* Security Alerts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800 h-full">
             <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-base text-slate-200">최근 보안 알림</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-slate-800">
                   {[
                       { msg: 'cluster-alpha에 대한 무단 루트 접근 시도', time: '10분 전', severity: 'critical' },
                       { msg: '정책 위반: 특권 컨테이너 차단됨', time: '1시간 전', severity: 'medium' },
                       { msg: 'APAC 지역에서 의심스러운 로그인 급증', time: '3시간 전', severity: 'high' },
                       { msg: '사용자 alice@jacon.io에게 새 관리자 역할 할당', time: '5시간 전', severity: 'low' },
                   ].map((alert, i) => (
                       <div key={i} className="p-4 flex items-start justify-between hover:bg-slate-800/30 transition-colors">
                           <div className="flex gap-3">
                               <div className={`mt-1 w-2 h-2 rounded-full ${
                                   alert.severity === 'critical' ? 'bg-red-500' : 
                                   alert.severity === 'high' ? 'bg-orange-500' :
                                   alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                               }`}></div>
                               <span className="text-sm text-slate-300">{alert.msg}</span>
                           </div>
                           <span className="text-xs text-slate-500 whitespace-nowrap">{alert.time}</span>
                       </div>
                   ))}
                </div>
             </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 h-full">
             <CardHeader className="border-b border-slate-800">
                <CardTitle className="text-base text-slate-200">시스템 리소스 (글로벌)</CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                 {/* Mock Chart Area */}
                 <div className="space-y-6">
                     <div className="space-y-2">
                         <div className="flex justify-between text-xs text-slate-400">
                             <span>CPU 사용량 (통합)</span>
                             <span>62%</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 w-[62%]"></div>
                         </div>
                     </div>
                     
                     <div className="space-y-2">
                         <div className="flex justify-between text-xs text-slate-400">
                             <span>메모리 사용량 (통합)</span>
                             <span>78%</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-purple-500 w-[78%]"></div>
                         </div>
                     </div>

                     <div className="space-y-2">
                         <div className="flex justify-between text-xs text-slate-400">
                             <span>스토리지 I/O</span>
                             <span>45%</span>
                         </div>
                         <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 w-[45%]"></div>
                         </div>
                     </div>
                     
                     <div className="pt-4 border-t border-slate-800">
                         <div className="text-xs text-slate-500 text-center">
                             시스템 부하가 정상 범위 내에 있습니다. 스케일링 작업이 필요하지 않습니다.
                         </div>
                     </div>
                 </div>
             </CardContent>
          </Card>
       </div>
    </div>
  );
}
