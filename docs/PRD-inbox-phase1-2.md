# Product Requirements Document: Unified Social Inbox (Phase 1 + Phase 2)

## Overview

InboxMaster is a multi-tenant SaaS unified social inbox designed for SMB teams to manage social conversations (DMs, comments, mentions) across multiple channels in one place. This document covers Phase 1 (UI skeleton + mocked data) and Phase 2 (interactive features + Tier 2 foundations).

## Product Vision

Build a mature, efficient inbox experience that enables teams to:
- Triage incoming social conversations quickly
- Respond to customers across channels from a single interface
- Collaborate effectively with clear assignment and status tracking
- Leverage AI to categorize and prioritize conversations
- Meet SLA deadlines and handle urgent issues promptly

## Target Users

- **Customer Support Teams**: Frontline agents responding to customer inquiries
- **Social Media Managers**: Managing brand conversations across social platforms
- **Sales Teams**: Following up on leads from social channels
- **Team Leads/Managers**: Monitoring workload and team performance

## Core Features

### Phase 1: UI Skeleton + Mocked Data ✅

#### 1.1 Application Scaffolding
- **Tech Stack**:
  - Next.js 16 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - pnpm as package manager
  - shadcn/ui component library
  - lucide-react for icons

#### 1.2 App Shell Layout
- **Workspace Switcher**:
  - Multi-tenant support with workspace selection
  - Quick switch between different workspaces
  - Persistent workspace selection via localStorage
  
- **Sidebar Navigation**:
  - Static views: All, Unassigned, Assigned to me, Done, Mentions, Comments, DMs
  - Keyboard shortcuts reference
  - Clean, modern design

#### 1.3 Inbox Routes
- **Main Inbox** (`/inbox`): 3-pane layout
  - Left: Sidebar with views
  - Center: Conversation list
  - No thread selected state
  
- **Thread Detail** (`/inbox/[threadId]`): 3-pane layout
  - Left: Sidebar with views
  - Center: Message timeline
  - Right: Thread metadata and details

#### 1.4 Mock Data Structure
- **Workspaces**: Multiple tenant organizations
- **Users**: Team members with avatars and roles
- **Customers**: Social media users with handles
- **Threads**: Conversations with all metadata
  - Channel (Facebook, Instagram, WhatsApp, TikTok, Twitter)
  - Message type (DM, comment, mention)
  - Status (open, done)
  - Priority (low, medium, high, urgent)
  - AI category and confidence
  - Assignee
  - SLA deadline
  - Tags
- **Messages**: Customer and agent messages, internal notes
- **Activity Events**: Timeline of changes (assignments, status, priority, tags)
- **Templates**: Quick reply templates

#### 1.5 Core UI States
- **Loading State**: Skeleton screens while data loads
- **Empty State**: Clean "no conversations" message with helpful text
- **Disconnected State**: (Placeholder) For when channels are disconnected

### Phase 2: Interactive Features + Tier 2 Foundations ✅

#### 2.1 Views & Filtering

**Predefined Views**:
- **All**: Show all conversations
- **Unassigned**: Only unassigned threads
- **Assigned to me**: Only threads assigned to current user
- **Done**: Completed conversations
- **Mentions**: Only @mentions
- **Comments**: Only comment threads
- **DMs**: Only direct messages

**Filter Controls**:
- **Search**: Full-text search across customer name, handle, message content, tags
- **Channel**: Filter by social platform
- **Type**: Filter by message type (DM, comment, mention)
- **Status**: Filter by open/done
- **Assignee**: Filter by assigned team member or unassigned
- **Priority**: Filter by priority level
- **AI Category**: Filter by AI-detected category

**Filter Features**:
- Clear all filters button
- Active filter indicators
- URL query params for shareable filtered views
- Saved views (stored in localStorage)

#### 2.2 Conversation List

**List Item Components**:
- Channel and type icons
- Status indicator (colored dot)
- Priority badge with color coding
- AI category with confidence percentage and sparkle icon
- Assignee avatar or "Unassigned" label
- Unread count badge
- Last message preview with timestamp
- Tags as secondary badges
- SLA status (overdue/due soon warnings)

**Inline Quick Actions** (on hover):
- Mark done/Reopen
- Assign to team member
- Change priority
- Add category/tag

**Bulk Actions**:
- Checkbox selection for multiple threads
- Bulk assign to team member
- Bulk mark as done
- Bulk change priority
- Bulk add category/tag
- Selection counter and clear button

#### 2.3 Thread View & Reply Composer

**Thread Header**:
- Customer name, handle, and avatar
- Channel icon
- Status badge (open/done)
- Priority badge
- SLA deadline indicator (overdue warning)
- Assignee with quick assign button
- Mark done/Reopen button

**Message Timeline**:
- Customer messages (left-aligned, white background)
- Agent replies (right-aligned, blue background)
- Internal notes (yellow background, labeled)
- Activity events (centered, gray pills)
- Auto-scroll to latest message
- Timestamps for all items

**Reply Composer**:
- Rich textarea for message composition
- Toggle between Reply and Internal Note
- Template dropdown for quick replies
- Template variables support (e.g., {name}, {tracking})
- Send button
- Keyboard shortcut (Cmd/Ctrl + Enter to send)

**Keyboard Shortcuts**:
- `/` - Focus search
- `r` - Focus reply composer
- `e` - Mark done/Reopen
- `a` - Assign to team member

#### 2.4 AI Triage UI

**AI Category Display**:
- Category badge with confidence percentage
- Sparkle icon to indicate AI detection
- Tooltip showing confidence level
- Categories: Question, Complaint, Praise, Sales, Support, Spam

**Accept Triage Feature**:
- Prominent banner when AI has triaged a thread
- Shows detected category and confidence
- "Accept Triage" button applies suggested priority
- Creates activity event when accepted
- Dismissible banner

**Suggested Actions**:
- Complaints → Urgent priority
- Other categories → High priority
- Auto-updates thread metadata

#### 2.5 Tier 2 Foundations

**Activity Timeline**:
- Assignment changes
- Status changes (open ↔ done)
- Priority changes
- Tag additions
- Category changes
- Internal notes
- User attribution and timestamps

**SLA & Urgency Badges**:
- SLA deadline display in thread header
- "Overdue" badge (red) for missed deadlines
- "Due soon" badge (yellow) for deadlines within 1 hour
- Priority-based SLA rules (mock implementation)

**Presence Indicators**:
- Placeholder for showing who else is viewing a thread
- "No one else viewing" message
- Foundation for real-time presence (future)

## Data Model

### Thread
```typescript
{
  id: string
  workspaceId: string
  customerId: string
  customer: Customer
  channel: 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'twitter'
  messageType: 'dm' | 'comment' | 'mention'
  status: 'open' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigneeId: string | null
  assignee: User | null
  aiCategory: AICategory | null
  aiConfidence: number | null  // 0-1
  unreadCount: number
  lastMessage: string
  lastMessageTime: Date
  slaDeadline: Date | null
  tags: string[]
}
```

### Message
```typescript
{
  id: string
  threadId: string
  content: string
  timestamp: Date
  isCustomer: boolean
  isInternal: boolean
  authorId: string
  author: User | Customer
}
```

### ActivityEvent
```typescript
{
  id: string
  threadId: string
  type: 'assignment' | 'status' | 'priority' | 'tag' | 'note' | 'category'
  userId: string
  user: User
  timestamp: Date
  oldValue?: string
  newValue?: string
  note?: string
}
```

## User Flows

### 1. Triage Incoming Conversations
1. User opens inbox, sees all unassigned conversations
2. Clicks "Unassigned" view
3. Scans list for priority (AI categories, SLA indicators)
4. Clicks high-priority complaint thread
5. Reviews AI triage banner
6. Clicks "Accept Triage" to apply suggested priority
7. Assigns to self or team member
8. Adds relevant tags
9. Moves to next thread

### 2. Respond to Customer
1. User clicks on assigned thread
2. Reviews conversation history
3. Checks AI category for context
4. Optionally selects template from dropdown
5. Edits template or writes custom reply
6. Clicks Send (or uses Cmd+Enter)
7. Message appears in timeline
8. Thread marked as done or kept open

### 3. Collaborate with Team
1. User adds internal note about customer issue
2. Reassigns thread to specialist team member
3. Changes priority to urgent
4. Adds tags for tracking
5. Activity timeline shows all changes
6. Other team members can see history

### 4. Bulk Triage
1. User applies filters (e.g., channel=Instagram, status=open)
2. Selects multiple threads using checkboxes
3. Uses bulk assign to team member
4. Or bulk marks as done
5. Selection cleared, threads updated

### 5. Use Saved Views
1. User applies complex filters (channel + type + priority)
2. Clicks "Save View" button
3. Names view "Instagram Urgent DMs"
4. View saved to sidebar
5. Can quickly access filtered view later

## Technical Architecture

### Frontend Structure
```
app/
  layout.tsx              # Root layout with WorkspaceProvider
  page.tsx                # Redirects to /inbox
  inbox/
    layout.tsx            # Inbox layout with sidebar
    page.tsx              # Conversation list
    [threadId]/
      page.tsx            # Thread detail view

components/
  ui/                     # Base UI components (shadcn/ui)
    button.tsx
    input.tsx
    textarea.tsx
    badge.tsx
    select.tsx
    skeleton.tsx
  workspace-switcher.tsx
  sidebar.tsx
  filter-bar.tsx
  conversation-list-item.tsx

lib/
  utils.ts                # Utility functions (cn)
  mock-data.ts            # Mock data and types
  workspace-context.tsx   # Workspace state management
  hooks.ts                # Custom hooks for inbox state
```

### State Management
- **React Context**: Workspace selection (global)
- **React Hooks**: Thread list, filters, selections (local)
- **localStorage**: Workspace preference, saved views

### Styling Approach
- Tailwind CSS utility classes
- Consistent color palette:
  - Primary: Blue (actions, links)
  - Success: Green (open status)
  - Warning: Yellow (due soon, internal notes)
  - Danger: Red (urgent, overdue)
  - Gray: Neutral elements
  - Purple: AI features

## Future Enhancements (Phase 3+)

### Real-time Features
- WebSocket connections for live updates
- Typing indicators
- Real presence (who's viewing threads)
- Push notifications

### Backend Integration
- REST API for CRUD operations
- Authentication & authorization
- Rate limiting & caching
- Webhook handlers for social platforms

### Advanced Features
- Sentiment analysis
- Smart routing rules
- Canned responses with variables
- Conversation analytics
- Team performance metrics
- Multi-language support
- Dark mode
- Mobile app

### Social Platform Integration
- OAuth flows for Facebook, Instagram, WhatsApp, TikTok, Twitter
- Platform-specific features (reactions, story replies, etc.)
- Media attachments (images, videos)
- Rich message formatting

## Success Metrics

### User Efficiency
- Average response time per conversation
- Conversations handled per agent per hour
- First response time
- Resolution time

### Quality Metrics
- SLA compliance rate
- Customer satisfaction (if feedback collected)
- Re-open rate for "done" conversations

### Team Collaboration
- Conversations reassigned vs resolved by original assignee
- Internal notes per conversation
- Bulk action usage

### AI Effectiveness
- AI triage acceptance rate
- AI category accuracy (vs manual corrections)
- Time saved through AI suggestions

## Deliverables

- ✅ Fully functional Next.js application
- ✅ Phase 1: UI skeleton with mock data
- ✅ Phase 2: Interactive features with state management
- ✅ PRD document (this file)
- ⏳ Updated README with instructions and features
- ⏳ Passing `pnpm lint` and `pnpm build`
- ⏳ Screenshots of key features

## Timeline

- **Phase 1**: UI skeleton + mock data - ~4 hours
- **Phase 2**: Interactive features - ~6 hours
- **Documentation**: PRD + README - ~1 hour
- **Testing & Polish**: ~1 hour

**Total**: ~12 hours for Phase 1 + Phase 2

## Conclusion

This PRD documents the implementation of a production-quality unified social inbox interface. While backend integrations and real social platform connections are future work, the frontend provides a complete, realistic user experience with all essential features for managing customer conversations at scale.

The mock data approach allows teams to demo the product, gather feedback, and iterate on UX before investing in backend infrastructure. The codebase is structured for easy extension with real APIs and additional features.
