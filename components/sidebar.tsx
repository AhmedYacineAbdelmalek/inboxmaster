'use client';

import { WorkspaceSwitcher } from './workspace-switcher';
import { Inbox, UserX, User, CheckCircle, AtSign, MessageSquare, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

const views = [
  { id: 'all', label: 'All', icon: Inbox, count: null },
  { id: 'unassigned', label: 'Unassigned', icon: UserX, count: null },
  { id: 'assigned-to-me', label: 'Assigned to me', icon: User, count: null },
  { id: 'done', label: 'Done', icon: CheckCircle, count: null },
  { id: 'mentions', label: 'Mentions', icon: AtSign, count: null },
  { id: 'comments', label: 'Comments', icon: MessageSquare, count: null },
  { id: 'dms', label: 'DMs', icon: MessageCircle, count: null },
];

function SidebarContent() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'all';

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <WorkspaceSwitcher />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Views
          </div>
          <nav className="space-y-1">
            {views.map((view) => {
              const Icon = view.icon;
              const isActive = currentView === view.id;
              return (
                <Link
                  key={view.id}
                  href={`/inbox?view=${view.id}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{view.label}</span>
                  {view.count !== null && (
                    <span className="ml-auto text-xs text-gray-500">{view.count}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="mb-2">
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> Search
        </div>
        <div className="mb-2">
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">r</kbd> Reply
        </div>
        <div className="mb-2">
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">e</kbd> Mark done
        </div>
        <div>
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">a</kbd> Assign
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 border-r border-gray-200 bg-white h-screen" />}>
      <SidebarContent />
    </Suspense>
  );
}
