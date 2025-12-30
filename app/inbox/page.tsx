'use client';

import { useWorkspace } from '@/lib/workspace-context';
import { useInboxData, useFilteredThreads, type Filters } from '@/lib/hooks';
import { FilterBar } from '@/components/filter-bar';
import { ConversationListItem } from '@/components/conversation-list-item';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckSquare, Inbox as InboxIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { mockUsers } from '@/lib/mock-data';

function InboxContent() {
  const { currentWorkspace } = useWorkspace();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'all';
  
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(false);

  const {
    threads,
    selectedThreadIds,
    updateThread,
    bulkUpdateThreads,
    toggleThreadSelection,
    clearSelection,
  } = useInboxData(currentWorkspace.id);

  const filteredThreads = useFilteredThreads(threads, filters, view);

  // Simulate loading
  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 500);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [currentWorkspace.id, view]);

  const handleBulkMarkDone = () => {
    const ids = Array.from(selectedThreadIds);
    bulkUpdateThreads(ids, { status: 'done' });
    clearSelection();
  };

  const handleBulkAssign = (assigneeId: string) => {
    const ids = Array.from(selectedThreadIds);
    const assignee = mockUsers.find(u => u.id === assigneeId);
    bulkUpdateThreads(ids, { assigneeId, assignee: assignee || null });
    clearSelection();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <FilterBar filters={filters} onFiltersChange={setFilters} />
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-gray-200">
              <div className="flex gap-3">
                <Skeleton className="w-4 h-4 mt-1" />
                <Skeleton className="w-2 h-2 mt-2 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Bulk actions bar */}
      {selectedThreadIds.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 flex items-center gap-3">
          <span className="text-sm font-medium">
            {selectedThreadIds.size} selected
          </span>
          <Button size="sm" variant="outline" onClick={handleBulkMarkDone}>
            <CheckSquare className="w-4 h-4 mr-1" />
            Mark done
          </Button>
          <select
            className="h-8 rounded-md border border-gray-300 bg-white px-3 text-sm"
            onChange={(e) => {
              if (e.target.value) {
                handleBulkAssign(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Assign to...</option>
            {mockUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <Button size="sm" variant="ghost" onClick={clearSelection}>
            Clear
          </Button>
        </div>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <InboxIcon className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No conversations</p>
            <p className="text-sm">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <ConversationListItem
              key={thread.id}
              thread={thread}
              isSelected={selectedThreadIds.has(thread.id)}
              onToggleSelect={() => toggleThreadSelection(thread.id)}
              onUpdateThread={(updates) => updateThread(thread.id, updates)}
            />
          ))
        )}
      </div>

      {/* Status bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-600">
        Showing {filteredThreads.length} of {threads.length} conversations
      </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <InboxContent />
    </Suspense>
  );
}
