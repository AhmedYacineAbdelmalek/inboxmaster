'use client';

import { useParams } from 'next/navigation';
import { useWorkspace } from '@/lib/workspace-context';
import { useInboxData } from '@/lib/hooks';
import { mockMessages, mockActivities, mockTemplates, mockUsers, type Priority, type User as UserType } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { 
  ArrowLeft,
  Clock,
  User,
  CheckCircle,
  Sparkles,
  Send,
  Facebook,
  Instagram,
  MessageCircle,
  Video,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { Message as MessageType } from '@/lib/mock-data';

const channelIcons = {
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  tiktok: Video,
  twitter: Twitter,
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;
  const { currentWorkspace, currentUser } = useWorkspace();
  const { threads, updateThread, addMessage, addActivity } = useInboxData(currentWorkspace.id);
  
  const thread = threads.find(t => t.id === threadId);
  const messages = mockMessages[threadId] || [];
  const activities = mockActivities[threadId] || [];
  
  const [replyContent, setReplyContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showAITriage, setShowAITriage] = useState(Boolean(thread?.aiCategory && thread?.aiConfidence));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'r':
          e.preventDefault();
          document.getElementById('reply-textarea')?.focus();
          break;
        case 'e':
          e.preventDefault();
          if (thread) {
            updateThread(thread.id, { status: thread.status === 'open' ? 'done' : 'open' });
          }
          break;
        case 'a':
          e.preventDefault();
          // Focus assign dropdown (would be implemented with a proper modal)
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [thread, updateThread]);

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">Thread not found</p>
          <Link href="/inbox">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to inbox
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ChannelIcon = channelIcons[thread.channel];
  const isSLAOverdue = thread.slaDeadline && thread.slaDeadline < new Date();

  const handleSend = () => {
    if (!replyContent.trim()) return;

    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      threadId: thread.id,
      content: replyContent,
      timestamp: new Date(),
      isCustomer: false,
      isInternal,
      authorId: currentUser.id,
      author: currentUser,
    };

    addMessage(thread.id, newMessage);
    setReplyContent('');
    setIsInternal(false);
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      setReplyContent(template.content);
    }
    setSelectedTemplate('');
  };

  const handleAcceptAITriage = () => {
    if (thread.aiCategory && thread.priority !== 'high' && thread.priority !== 'urgent') {
      updateThread(thread.id, { 
        priority: thread.aiCategory === 'complaint' ? 'urgent' : 'high' 
      });
    }
    setShowAITriage(false);
    
    // Add activity
    addActivity(thread.id, {
      id: `activity-${Date.now()}`,
      threadId: thread.id,
      type: 'category',
      userId: currentUser.id,
      user: currentUser,
      timestamp: new Date(),
      newValue: `AI triage accepted: ${thread.aiCategory}`,
    });
  };

  const combinedTimeline = [
    ...messages.map(m => ({ type: 'message' as const, data: m, timestamp: m.timestamp })),
    ...activities.map(a => ({ type: 'activity' as const, data: a, timestamp: a.timestamp })),
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main thread view */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/inbox">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="text-2xl">{thread.customer.avatar}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{thread.customer.name}</h2>
                  <span className="text-sm text-gray-500">{thread.customer.handle}</span>
                  <ChannelIcon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={thread.status === 'open' ? 'success' : 'secondary'}>
                    {thread.status}
                  </Badge>
                  <Badge className={priorityColors[thread.priority]}>
                    {thread.priority}
                  </Badge>
                  {isSLAOverdue && (
                    <Badge variant="destructive">
                      <Clock className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {thread.assignee ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">{thread.assignee.avatar}</span>
                  <span>{thread.assignee.name}</span>
                </div>
              ) : (
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-1" />
                  Assign
                </Button>
              )}
              <Button
                variant={thread.status === 'open' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateThread(thread.id, { 
                  status: thread.status === 'open' ? 'done' : 'open' 
                })}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {thread.status === 'open' ? 'Mark Done' : 'Reopen'}
              </Button>
            </div>
          </div>

          {/* AI Triage Banner */}
          {showAITriage && thread.aiCategory && (
            <div className="bg-purple-50 border border-purple-200 rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">
                    AI detected: <span className="capitalize">{thread.aiCategory}</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Confidence: {(thread.aiConfidence! * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAcceptAITriage}>
                  Accept Triage
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAITriage(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {combinedTimeline.map((item) => {
              if (item.type === 'message') {
                const msg = item.data;
                const isCustomer = msg.isCustomer;
                const isInternal = msg.isInternal;
                const author = msg.author as { avatar?: string };
                
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      !isCustomer && "flex-row-reverse"
                    )}
                  >
                    <div className="text-2xl flex-shrink-0">
                      {isCustomer ? thread.customer.avatar : author.avatar}
                    </div>
                    <div className={cn(
                      "max-w-md rounded-lg px-4 py-3",
                      isInternal
                        ? "bg-yellow-100 border border-yellow-300"
                        : isCustomer
                        ? "bg-white border border-gray-200"
                        : "bg-blue-600 text-white"
                    )}>
                      {isInternal && (
                        <div className="text-xs font-semibold mb-1 text-yellow-800">
                          Internal Note
                        </div>
                      )}
                      <p className={cn(
                        "text-sm",
                        isInternal && "text-gray-900"
                      )}>
                        {msg.content}
                      </p>
                      <div className={cn(
                        "text-xs mt-2",
                        isInternal ? "text-gray-600" : isCustomer ? "text-gray-500" : "text-blue-100"
                      )}>
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                );
              } else {
                const activity = item.data;
                return (
                  <div key={activity.id} className="flex justify-center">
                    <div className="bg-gray-200 rounded-full px-4 py-1 text-xs text-gray-600">
                      <span className="font-medium">{activity.user.name}</span>
                      {' '}
                      {activity.type === 'assignment' && 'assigned to ' + activity.newValue}
                      {activity.type === 'status' && `changed status from ${activity.oldValue} to ${activity.newValue}`}
                      {activity.type === 'priority' && `changed priority from ${activity.oldValue} to ${activity.newValue}`}
                      {activity.type === 'tag' && 'added tags: ' + activity.newValue}
                      {activity.type === 'category' && activity.newValue}
                      {' • '}
                      {activity.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Internal Note
              </label>
              
              <Select
                value={selectedTemplate}
                onChange={(e) => handleApplyTemplate(e.target.value)}
                className="ml-auto"
              >
                <option value="">Use template...</option>
                {mockTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Textarea
                id="reply-textarea"
                placeholder={isInternal ? "Add an internal note..." : "Type your reply..."}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSend();
                  }
                }}
                className="flex-1"
                rows={3}
              />
              <Button onClick={handleSend} disabled={!replyContent.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded">Cmd/Ctrl + Enter</kbd> to send
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar with metadata */}
      <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Priority
            </label>
            <Select
              value={thread.priority}
              onChange={(e) => updateThread(thread.id, { priority: e.target.value as Priority })}
              className="mt-1"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Assignee
            </label>
            <Select
              value={thread.assigneeId || ''}
              onChange={(e) => {
                const assignee = mockUsers.find(u => u.id === e.target.value);
                updateThread(thread.id, { 
                  assigneeId: e.target.value || null,
                  assignee: (assignee as UserType) || null,
                });
              }}
              className="mt-1"
            >
              <option value="">Unassigned</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tags
            </label>
            <div className="mt-1 flex flex-wrap gap-1">
              {thread.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {thread.aiCategory && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                AI Category
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm capitalize">{thread.aiCategory}</span>
                <Badge variant="outline" className="text-xs">
                  {(thread.aiConfidence! * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          )}

          {thread.slaDeadline && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                SLA Deadline
              </label>
              <div className={cn(
                "mt-1 flex items-center gap-2 text-sm",
                isSLAOverdue && "text-red-600"
              )}>
                <Clock className="w-4 h-4" />
                {thread.slaDeadline.toLocaleString()}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Activity
            </label>
            <div className="space-y-2">
              {activities.map(activity => (
                <div key={activity.id} className="text-xs text-gray-600 border-l-2 border-gray-200 pl-3">
                  <div className="font-medium">{activity.user.name}</div>
                  <div>
                    {activity.type === 'assignment' && 'assigned to ' + activity.newValue}
                    {activity.type === 'status' && `changed status to ${activity.newValue}`}
                    {activity.type === 'priority' && `changed priority to ${activity.newValue}`}
                    {activity.type === 'tag' && 'added tags'}
                    {activity.type === 'category' && activity.newValue}
                  </div>
                  <div className="text-gray-400 mt-1">
                    {activity.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Presence
            </label>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              No one else viewing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
