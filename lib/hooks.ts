'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  mockThreads,
  mockMessages,
  mockActivities,
  type Thread,
  type Message,
  type ActivityEvent,
  type Channel,
  type MessageType,
  type ThreadStatus,
  type Priority,
  type AICategory,
  type SavedView,
} from './mock-data';

export interface Filters {
  search?: string;
  channel?: Channel;
  type?: MessageType;
  status?: ThreadStatus;
  assignee?: string;
  category?: AICategory;
  priority?: Priority;
}

export function useInboxData(workspaceId: string) {
  const [threads, setThreads] = useState<Thread[]>(
    mockThreads.filter(t => t.workspaceId === workspaceId)
  );
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [activities, setActivities] = useState<Record<string, ActivityEvent[]>>(mockActivities);
  const [selectedThreadIds, setSelectedThreadIds] = useState<Set<string>>(new Set());

  // Update threads when workspace changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThreads(mockThreads.filter(t => t.workspaceId === workspaceId));
  }, [workspaceId]);

  const updateThread = (threadId: string, updates: Partial<Thread>) => {
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, ...updates } : t));
  };

  const addMessage = (threadId: string, message: Message) => {
    setMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), message],
    }));
    
    // Update thread's last message
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      updateThread(threadId, {
        lastMessage: message.content,
        lastMessageTime: message.timestamp,
        unreadCount: message.isCustomer ? thread.unreadCount + 1 : 0,
      });
    }
  };

  const addActivity = (threadId: string, activity: ActivityEvent) => {
    setActivities(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), activity],
    }));
  };

  const bulkUpdateThreads = (threadIds: string[], updates: Partial<Thread>) => {
    setThreads(prev => prev.map(t => threadIds.includes(t.id) ? { ...t, ...updates } : t));
  };

  const toggleThreadSelection = (threadId: string) => {
    setSelectedThreadIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedThreadIds(new Set());
  };

  return {
    threads,
    messages,
    activities,
    selectedThreadIds,
    updateThread,
    addMessage,
    addActivity,
    bulkUpdateThreads,
    toggleThreadSelection,
    clearSelection,
  };
}

export function useFilteredThreads(threads: Thread[], filters: Filters, view?: string) {
  return useMemo(() => {
    let filtered = [...threads];

    // Apply view filter
    if (view) {
      switch (view) {
        case 'unassigned':
          filtered = filtered.filter(t => !t.assigneeId);
          break;
        case 'assigned-to-me':
          // Assuming current user is user-1 (Alice)
          filtered = filtered.filter(t => t.assigneeId === 'user-1');
          break;
        case 'done':
          filtered = filtered.filter(t => t.status === 'done');
          break;
        case 'mentions':
          filtered = filtered.filter(t => t.messageType === 'mention');
          break;
        case 'comments':
          filtered = filtered.filter(t => t.messageType === 'comment');
          break;
        case 'dms':
          filtered = filtered.filter(t => t.messageType === 'dm');
          break;
        default:
          // 'all' - no filter
          break;
      }
    }

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.customer.name.toLowerCase().includes(search) ||
        t.customer.handle.toLowerCase().includes(search) ||
        t.lastMessage.toLowerCase().includes(search) ||
        t.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Apply channel filter
    if (filters.channel) {
      filtered = filtered.filter(t => t.channel === filters.channel);
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(t => t.messageType === filters.type);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Apply assignee filter
    if (filters.assignee) {
      if (filters.assignee === 'unassigned') {
        filtered = filtered.filter(t => !t.assigneeId);
      } else {
        filtered = filtered.filter(t => t.assigneeId === filters.assignee);
      }
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(t => t.aiCategory === filters.category);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    // Sort by last message time (newest first)
    filtered.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());

    return filtered;
  }, [threads, filters, view]);
}

export function useSavedViews() {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedViews');
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedViews(JSON.parse(saved));
      }
    }
  }, []);

  const saveView = (name: string, filters: Filters) => {
    const newView: SavedView = {
      id: `view-${Date.now()}`,
      name,
      filters,
    };
    const updated = [...savedViews, newView];
    setSavedViews(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedViews', JSON.stringify(updated));
    }
  };

  const deleteView = (id: string) => {
    const updated = savedViews.filter(v => v.id !== id);
    setSavedViews(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedViews', JSON.stringify(updated));
    }
  };

  return { savedViews, saveView, deleteView };
}
