'use client';

import { Thread } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Instagram, 
  MessageCircle,
  Video,
  Twitter,
  CheckCircle,
  Circle,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ConversationListItemProps {
  thread: Thread;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdateThread: (updates: Partial<Thread>) => void;
}

const channelIcons = {
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  tiktok: Video,
  twitter: Twitter,
};

const priorityColors = {
  low: 'text-gray-500',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500',
};

const statusColors = {
  open: 'bg-green-500',
  done: 'bg-gray-400',
};

export function ConversationListItem({ 
  thread, 
  isSelected, 
  onToggleSelect,
  onUpdateThread 
}: ConversationListItemProps) {
  const [showActions, setShowActions] = useState(false);
  const pathname = usePathname();
  const isActive = pathname.includes(thread.id);

  const ChannelIcon = channelIcons[thread.channel];
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const isSLAOverdue = thread.slaDeadline && thread.slaDeadline < new Date();
  const isSLAUrgent = thread.slaDeadline && 
    thread.slaDeadline > new Date() && 
    thread.slaDeadline.getTime() - new Date().getTime() < 60 * 60 * 1000; // 1 hour

  return (
    <div
      className={cn(
        "border-b border-gray-200 hover:bg-gray-50 transition-colors",
        isActive && "bg-blue-50 hover:bg-blue-50",
        thread.unreadCount > 0 && "bg-blue-50/30"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Link href={`/inbox/${thread.id}`} className="block">
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.preventDefault();
                onToggleSelect();
              }}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 rounded border-gray-300"
            />

            {/* Status indicator */}
            <div className={cn(
              "w-2 h-2 rounded-full mt-2",
              statusColors[thread.status]
            )} />

            {/* Avatar */}
            <div className="text-2xl">{thread.customer.avatar}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-sm truncate">
                    {thread.customer.name}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {thread.customer.handle}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <ChannelIcon className="w-4 h-4 text-gray-400" />
                  <Badge variant="outline" className="text-xs">
                    {thread.messageType}
                  </Badge>
                </div>
              </div>

              {/* Last message */}
              <p className="text-sm text-gray-600 truncate mb-2">
                {thread.lastMessage}
              </p>

              {/* Metadata row */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{formatTime(thread.lastMessageTime)}</span>
                
                {thread.unreadCount > 0 && (
                  <Badge variant="info" className="text-xs">
                    {thread.unreadCount} new
                  </Badge>
                )}

                {/* Priority */}
                <div className={cn("flex items-center gap-1", priorityColors[thread.priority])}>
                  <AlertCircle className="w-3 h-3" />
                  <span className="capitalize">{thread.priority}</span>
                </div>

                {/* AI Category */}
                {thread.aiCategory && (
                  <div className="flex items-center gap-1" title={`AI Confidence: ${(thread.aiConfidence! * 100).toFixed(0)}%`}>
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span className="capitalize">{thread.aiCategory}</span>
                    <span className="text-gray-400">
                      {(thread.aiConfidence! * 100).toFixed(0)}%
                    </span>
                  </div>
                )}

                {/* Assignee */}
                {thread.assignee ? (
                  <div className="flex items-center gap-1">
                    <span>{thread.assignee.avatar}</span>
                    <span>{thread.assignee.name.split(' ')[0]}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}

                {/* SLA */}
                {isSLAOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
                {isSLAUrgent && !isSLAOverdue && (
                  <Badge variant="warning" className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due soon
                  </Badge>
                )}
              </div>

              {/* Tags */}
              {thread.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {thread.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Quick actions */}
              {showActions && (
                <div className="flex gap-2 mt-2" onClick={(e) => e.preventDefault()}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onUpdateThread({ status: thread.status === 'open' ? 'done' : 'open' });
                    }}
                  >
                    {thread.status === 'open' ? (
                      <><CheckCircle className="w-3 h-3 mr-1" /> Mark done</>
                    ) : (
                      <><Circle className="w-3 h-3 mr-1" /> Reopen</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Would open assign dialog
                    }}
                  >
                    Assign
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Would open priority menu
                    }}
                  >
                    Priority
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
