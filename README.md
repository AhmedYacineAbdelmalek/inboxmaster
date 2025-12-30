# InboxMaster - Unified Social Inbox

A modern, multi-tenant unified social inbox for managing conversations across social media channels. Built with Next.js, React, TypeScript, and Tailwind CSS.

![InboxMaster](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

## 🚀 Features

### Phase 1: UI Skeleton + Mocked Data ✅
- **Multi-tenant Workspace Management**: Switch between different organization workspaces
- **App Shell Layout**: Clean sidebar navigation with predefined views
- **3-Pane Inbox Layout**: Sidebar, conversation list, and thread detail
- **Mock Data**: Realistic conversations, messages, users, and activities
- **Loading States**: Skeleton screens for better UX
- **Empty States**: Helpful messages when no conversations match filters

### Phase 2: Interactive Features ✅

#### Views & Filtering
- **7 Predefined Views**:
  - 🗂️ **All**: See all conversations
  - 👤 **Unassigned**: Find conversations needing assignment
  - 👨‍💼 **Assigned to me**: Your personal queue
  - ✅ **Done**: Completed conversations
  - 📢 **Mentions**: @mentions from customers
  - 💬 **Comments**: Comment threads
  - 📨 **DMs**: Direct messages

- **Advanced Filters**:
  - 🔍 **Search**: Full-text search across names, handles, messages, tags
  - 📱 **Channel**: Facebook, Instagram, WhatsApp, TikTok, Twitter
  - 💬 **Type**: DMs, Comments, Mentions
  - 📊 **Status**: Open, Done
  - 👥 **Assignee**: Team members or Unassigned
  - ⚡ **Priority**: Low, Medium, High, Urgent
  - 🤖 **AI Category**: Question, Complaint, Praise, Sales, Support, Spam
  - 💾 **Save Views**: Save filter combinations for quick access

#### Conversation List
- **Rich List Items**: Channel icons, status indicators, priority badges
- **AI Triage**: AI-detected categories with confidence scores
- **SLA Tracking**: Overdue and due-soon indicators
- **Unread Counts**: See new message counts at a glance
- **Tags**: Conversation categorization
- **Quick Actions** (on hover):
  - ✅ Mark done / Reopen
  - 👤 Assign to team member
  - ⚡ Change priority
  - 🏷️ Add tags

#### Bulk Actions
- ☑️ **Multi-select**: Use checkboxes to select multiple conversations
- **Bulk Operations**:
  - Assign multiple threads to team member
  - Mark multiple as done
  - Change priority for multiple threads
  - Add tags in bulk

#### Thread View
- **Message Timeline**: Customer messages, agent replies, and internal notes
- **Activity Stream**: See all changes (assignments, status, priority, tags)
- **Thread Metadata**: Priority, assignee, tags, AI category, SLA deadline
- **Presence Indicator**: (Placeholder) See who else is viewing

#### Reply Composer
- 📝 **Rich Composer**: Full-featured text area for replies
- 🔒 **Internal Notes**: Add notes only your team can see
- 📋 **Quick Reply Templates**: Pre-written responses with variables
- ⌨️ **Keyboard Shortcut**: Cmd/Ctrl + Enter to send

#### AI Triage
- 🤖 **Smart Categorization**: AI detects conversation type
- 🎯 **Confidence Scores**: See AI certainty for each category
- ✨ **Accept Triage**: One-click to apply AI suggestions
- 📈 **Auto-prioritization**: Complaints become urgent, questions become high priority

#### Keyboard Shortcuts
- `/` - Focus search bar
- `r` - Focus reply composer
- `e` - Mark done / Reopen thread
- `a` - Assign thread (placeholder)

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) patterns
- **Icons**: [lucide-react](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📦 Installation

### Prerequisites
- Node.js 20+ 
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/AhmedYacineAbdelmalek/inboxmaster.git
cd inboxmaster

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app. You'll be redirected to `/inbox`.

## 🏗️ Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 📁 Project Structure

```
inboxmaster/
├── app/
│   ├── inbox/
│   │   ├── [threadId]/
│   │   │   └── page.tsx          # Thread detail view
│   │   ├── layout.tsx             # Inbox layout with sidebar
│   │   └── page.tsx               # Conversation list
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home (redirects to inbox)
│   └── globals.css                # Global styles
├── components/
│   ├── ui/                        # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── select.tsx
│   │   └── skeleton.tsx
│   ├── conversation-list-item.tsx # Conversation list item
│   ├── filter-bar.tsx             # Filter controls
│   ├── sidebar.tsx                # Navigation sidebar
│   └── workspace-switcher.tsx     # Workspace selector
├── lib/
│   ├── hooks.ts                   # Custom React hooks
│   ├── mock-data.ts               # Mock data and types
│   ├── utils.ts                   # Utility functions
│   └── workspace-context.tsx      # Workspace state
├── docs/
│   └── PRD-inbox-phase1-2.md      # Product requirements
└── package.json
```

## 🎯 Usage Guide

### Switch Workspaces
Click the workspace name in the sidebar to see all available workspaces. Select one to switch.

### Filter Conversations
Use the filter bar at the top to narrow down conversations by search, channel, type, status, assignee, priority, or AI category.

### Triage Conversations
1. Click "Unassigned" view to see conversations needing attention
2. Look for AI category badges and priority indicators
3. Click a conversation to open the thread view
4. Review the AI triage banner and click "Accept Triage" if appropriate
5. Assign to yourself or a team member
6. Reply to the customer or add an internal note

### Use Quick Actions
Hover over a conversation in the list to reveal quick action buttons for marking done, assigning, and changing priority.

### Bulk Operations
1. Check the boxes next to multiple conversations
2. Use the bulk actions bar that appears at the top
3. Assign all selected threads, mark them done, or perform other bulk actions

### Reply to Customers
1. Click a conversation to open the thread view
2. Review the message timeline on the left
3. Use the composer at the bottom to type a reply
4. Optionally select a template from the dropdown
5. Check "Internal Note" if the message is for your team only
6. Click Send or press Cmd/Ctrl + Enter

### Save Custom Views
1. Apply filters to create your desired view
2. Click "Save View"
3. Enter a name for the view
4. Access saved views from the sidebar (stored in browser localStorage)

## 🎨 Design Principles

- **Speed First**: Fast triage is the #1 priority
- **Visual Hierarchy**: Color-coded priorities and statuses
- **Progressive Disclosure**: Show details on demand, keep list items scannable
- **Keyboard-Driven**: Power users can navigate without mouse
- **Consistent Patterns**: Reusable components, predictable interactions

## 🔮 Future Enhancements

### Phase 3+
- Real-time updates via WebSockets
- Backend API integration
- OAuth flows for social platforms
- Rich media attachments
- Sentiment analysis
- Team analytics dashboard
- Mobile responsive design
- Dark mode
- Multi-language support

## 🤝 Contributing

This is a demonstration project. For production use, you would need:
1. Backend API for data persistence
2. Authentication and authorization
3. Real social platform integrations
4. Webhook handlers for incoming messages
5. Rate limiting and caching
6. Production database

## 📄 License

MIT License - feel free to use this code for learning and demonstration purposes.

## 📚 Documentation

See [docs/PRD-inbox-phase1-2.md](./docs/PRD-inbox-phase1-2.md) for detailed product requirements and feature specifications.

## 🐛 Known Limitations

- **No Backend**: All data is mocked and stored in memory/localStorage
- **No Real Integrations**: Social platform connections are simulated
- **No Real-time**: Changes don't sync between tabs or users
- **No Authentication**: No login system (assumes single user)
- **Browser Storage Only**: Data doesn't persist between sessions (except workspace/saved views)

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, React, and TypeScript
