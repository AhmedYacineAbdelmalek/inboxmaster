'use client';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, Save } from 'lucide-react';
import { type Filters } from '@/lib/hooks';
import { mockUsers, type Channel, type MessageType, type ThreadStatus, type Priority, type AICategory } from '@/lib/mock-data';
import { useState } from 'react';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onSaveView?: () => void;
}

export function FilterBar({ filters, onFiltersChange, onSaveView }: FilterBarProps) {
  const [showSaveView, setShowSaveView] = useState(false);
  const [viewName, setViewName] = useState('');

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  const clearFilters = () => {
    onFiltersChange({});
  };

  const handleSaveView = () => {
    if (onSaveView && viewName) {
      onSaveView();
      setShowSaveView(false);
      setViewName('');
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Channel filter */}
        <Select
          value={filters.channel || ''}
          onChange={(e) => onFiltersChange({ ...filters, channel: e.target.value as Channel })}
        >
          <option value="">All channels</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="tiktok">TikTok</option>
          <option value="twitter">Twitter</option>
        </Select>

        {/* Type filter */}
        <Select
          value={filters.type || ''}
          onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as MessageType })}
        >
          <option value="">All types</option>
          <option value="dm">DMs</option>
          <option value="comment">Comments</option>
          <option value="mention">Mentions</option>
        </Select>

        {/* Status filter */}
        <Select
          value={filters.status || ''}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as ThreadStatus })}
        >
          <option value="">All status</option>
          <option value="open">Open</option>
          <option value="done">Done</option>
        </Select>

        {/* Assignee filter */}
        <Select
          value={filters.assignee || ''}
          onChange={(e) => onFiltersChange({ ...filters, assignee: e.target.value })}
        >
          <option value="">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {mockUsers.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </Select>

        {/* Priority filter */}
        <Select
          value={filters.priority || ''}
          onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as Priority })}
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>

        {/* AI Category filter */}
        <Select
          value={filters.category || ''}
          onChange={(e) => onFiltersChange({ ...filters, category: e.target.value as AICategory })}
        >
          <option value="">All categories</option>
          <option value="question">Question</option>
          <option value="complaint">Complaint</option>
          <option value="praise">Praise</option>
          <option value="sales">Sales</option>
          <option value="support">Support</option>
          <option value="spam">Spam</option>
        </Select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}

        {/* Save view */}
        {hasActiveFilters && onSaveView && !showSaveView && (
          <Button variant="outline" size="sm" onClick={() => setShowSaveView(true)}>
            <Save className="w-4 h-4 mr-1" />
            Save View
          </Button>
        )}
      </div>

      {/* Save view dialog */}
      {showSaveView && (
        <div className="mt-3 flex gap-2">
          <Input
            type="text"
            placeholder="View name..."
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
            className="max-w-xs"
          />
          <Button size="sm" onClick={handleSaveView} disabled={!viewName}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => {
            setShowSaveView(false);
            setViewName('');
          }}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
