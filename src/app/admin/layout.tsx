
import React from 'react';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { FiBell, FiSearch } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-14 border-b border-slate-800 bg-slate-950/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
               {/* Breadcrumbs or Title could go here */}
               <h2 className="text-sm font-semibold text-slate-400">플랫폼 관리</h2>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="text-slate-400 hover:text-white transition-colors">
                    <FiSearch size={18} />
                </button>
                <button className="text-slate-400 hover:text-white transition-colors relative">
                    <FiBell size={18} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-slate-700"></div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
           {children}
        </main>
      </div>
    </div>
  );
}
