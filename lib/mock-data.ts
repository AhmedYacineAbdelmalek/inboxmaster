export type Channel = 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'twitter';

export type MessageType = 'dm' | 'comment' | 'mention';

export type ThreadStatus = 'open' | 'done';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type AICategory = 'question' | 'complaint' | 'praise' | 'sales' | 'support' | 'spam';

export interface Workspace {
  id: string;
  name: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  handle: string;
}

export interface Message {
  id: string;
  threadId: string;
  content: string;
  timestamp: Date;
  isCustomer: boolean;
  isInternal: boolean;
  authorId: string;
  author: User | Customer;
}

export interface Thread {
  id: string;
  workspaceId: string;
  customerId: string;
  customer: Customer;
  channel: Channel;
  messageType: MessageType;
  status: ThreadStatus;
  priority: Priority;
  assigneeId: string | null;
  assignee: User | null;
  aiCategory: AICategory | null;
  aiConfidence: number | null;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  slaDeadline: Date | null;
  tags: string[];
}

export interface ActivityEvent {
  id: string;
  threadId: string;
  type: 'assignment' | 'status' | 'priority' | 'tag' | 'note' | 'category';
  userId: string;
  user: User;
  timestamp: Date;
  oldValue?: string;
  newValue?: string;
  note?: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: {
    search?: string;
    channel?: Channel;
    type?: MessageType;
    status?: ThreadStatus;
    assignee?: string;
    category?: AICategory;
    priority?: Priority;
  };
}

// Mock workspaces
export const mockWorkspaces: Workspace[] = [
  { id: 'ws-1', name: 'Acme Corp', avatar: '🏢' },
  { id: 'ws-2', name: 'TechStart Inc', avatar: '🚀' },
  { id: 'ws-3', name: 'GreenLeaf Co', avatar: '🌿' },
];

// Mock users (team members)
export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@acme.com', avatar: '👩' },
  { id: 'user-2', name: 'Bob Smith', email: 'bob@acme.com', avatar: '👨' },
  { id: 'user-3', name: 'Carol White', email: 'carol@acme.com', avatar: '👩‍💼' },
];

// Mock customers
export const mockCustomers: Customer[] = [
  { id: 'cust-1', name: 'John Doe', avatar: '😀', handle: '@johndoe' },
  { id: 'cust-2', name: 'Jane Smith', avatar: '😊', handle: '@janesmith' },
  { id: 'cust-3', name: 'Mike Wilson', avatar: '🙂', handle: '@mikewilson' },
  { id: 'cust-4', name: 'Sarah Brown', avatar: '😃', handle: '@sarahb' },
  { id: 'cust-5', name: 'Tom Davis', avatar: '😎', handle: '@tomdavis' },
  { id: 'cust-6', name: 'Emma Garcia', avatar: '🥰', handle: '@emmagarcia' },
  { id: 'cust-7', name: 'Chris Lee', avatar: '😄', handle: '@chrislee' },
  { id: 'cust-8', name: 'Lisa Martinez', avatar: '😌', handle: '@lisamartinez' },
];

// Mock threads
export const mockThreads: Thread[] = [
  {
    id: 'thread-1',
    workspaceId: 'ws-1',
    customerId: 'cust-1',
    customer: mockCustomers[0],
    channel: 'instagram',
    messageType: 'dm',
    status: 'open',
    priority: 'high',
    assigneeId: 'user-1',
    assignee: mockUsers[0],
    aiCategory: 'question',
    aiConfidence: 0.92,
    unreadCount: 2,
    lastMessage: 'Hi! I have a question about your product pricing...',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    tags: ['pricing', 'sales'],
  },
  {
    id: 'thread-2',
    workspaceId: 'ws-1',
    customerId: 'cust-2',
    customer: mockCustomers[1],
    channel: 'facebook',
    messageType: 'comment',
    status: 'open',
    priority: 'urgent',
    assigneeId: null,
    assignee: null,
    aiCategory: 'complaint',
    aiConfidence: 0.87,
    unreadCount: 5,
    lastMessage: 'This is unacceptable! I need a refund immediately!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    slaDeadline: new Date(Date.now() - 1000 * 60 * 30), // overdue by 30 mins
    tags: ['refund', 'urgent'],
  },
  {
    id: 'thread-3',
    workspaceId: 'ws-1',
    customerId: 'cust-3',
    customer: mockCustomers[2],
    channel: 'whatsapp',
    messageType: 'dm',
    status: 'open',
    priority: 'medium',
    assigneeId: 'user-2',
    assignee: mockUsers[1],
    aiCategory: 'support',
    aiConfidence: 0.95,
    unreadCount: 1,
    lastMessage: 'Can you help me reset my password?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
    tags: ['support', 'password'],
  },
  {
    id: 'thread-4',
    workspaceId: 'ws-1',
    customerId: 'cust-4',
    customer: mockCustomers[3],
    channel: 'tiktok',
    messageType: 'mention',
    status: 'done',
    priority: 'low',
    assigneeId: 'user-1',
    assignee: mockUsers[0],
    aiCategory: 'praise',
    aiConfidence: 0.98,
    unreadCount: 0,
    lastMessage: 'Love your product! @acmecorp you guys rock!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    slaDeadline: null,
    tags: ['feedback', 'positive'],
  },
  {
    id: 'thread-5',
    workspaceId: 'ws-1',
    customerId: 'cust-5',
    customer: mockCustomers[4],
    channel: 'instagram',
    messageType: 'dm',
    status: 'open',
    priority: 'low',
    assigneeId: null,
    assignee: null,
    aiCategory: 'sales',
    aiConfidence: 0.78,
    unreadCount: 3,
    lastMessage: 'Do you offer bulk discounts?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 8), // 8 hours from now
    tags: ['sales', 'bulk'],
  },
  {
    id: 'thread-6',
    workspaceId: 'ws-1',
    customerId: 'cust-6',
    customer: mockCustomers[5],
    channel: 'facebook',
    messageType: 'comment',
    status: 'open',
    priority: 'medium',
    assigneeId: 'user-3',
    assignee: mockUsers[2],
    aiCategory: 'question',
    aiConfidence: 0.85,
    unreadCount: 1,
    lastMessage: 'When will the new features be available?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    tags: ['features', 'roadmap'],
  },
  {
    id: 'thread-7',
    workspaceId: 'ws-1',
    customerId: 'cust-7',
    customer: mockCustomers[6],
    channel: 'whatsapp',
    messageType: 'dm',
    status: 'open',
    priority: 'high',
    assigneeId: 'user-1',
    assignee: mockUsers[0],
    aiCategory: 'support',
    aiConfidence: 0.91,
    unreadCount: 4,
    lastMessage: "My account has been locked, can't login!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 1), // 1 hour from now
    tags: ['urgent', 'account'],
  },
  {
    id: 'thread-8',
    workspaceId: 'ws-1',
    customerId: 'cust-8',
    customer: mockCustomers[7],
    channel: 'twitter',
    messageType: 'mention',
    status: 'done',
    priority: 'low',
    assigneeId: 'user-2',
    assignee: mockUsers[1],
    aiCategory: 'spam',
    aiConfidence: 0.65,
    unreadCount: 0,
    lastMessage: 'Check out my amazing crypto deal! 🚀💰',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    slaDeadline: null,
    tags: ['spam'],
  },
];

// Mock messages for threads
export const mockMessages: Record<string, Message[]> = {
  'thread-1': [
    {
      id: 'msg-1-1',
      threadId: 'thread-1',
      content: 'Hi! I have a question about your product pricing...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-1',
      author: mockCustomers[0],
    },
    {
      id: 'msg-1-2',
      threadId: 'thread-1',
      content: 'Hi John! Thanks for reaching out. I\'d be happy to help you with pricing information.',
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 mins ago
      isCustomer: false,
      isInternal: false,
      authorId: 'user-1',
      author: mockUsers[0],
    },
    {
      id: 'msg-1-3',
      threadId: 'thread-1',
      content: 'This customer seems interested in enterprise pricing. Should I send the custom quote form?',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      isCustomer: false,
      isInternal: true,
      authorId: 'user-1',
      author: mockUsers[0],
    },
    {
      id: 'msg-1-4',
      threadId: 'thread-1',
      content: 'Specifically, I\'m looking at the Professional plan. Do you offer any discounts for annual billing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-1',
      author: mockCustomers[0],
    },
    {
      id: 'msg-1-5',
      threadId: 'thread-1',
      content: 'Also, what\'s included in the support package?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-1',
      author: mockCustomers[0],
    },
  ],
  'thread-2': [
    {
      id: 'msg-2-1',
      threadId: 'thread-2',
      content: 'I ordered a product last week and it still hasn\'t arrived!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-2',
      author: mockCustomers[1],
    },
    {
      id: 'msg-2-2',
      threadId: 'thread-2',
      content: 'The tracking number doesn\'t even work!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-2',
      author: mockCustomers[1],
    },
    {
      id: 'msg-2-3',
      threadId: 'thread-2',
      content: 'This is ridiculous! I want a full refund!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-2',
      author: mockCustomers[1],
    },
    {
      id: 'msg-2-4',
      threadId: 'thread-2',
      content: 'Hello??? Is anyone there???',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-2',
      author: mockCustomers[1],
    },
    {
      id: 'msg-2-5',
      threadId: 'thread-2',
      content: 'This is unacceptable! I need a refund immediately!',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-2',
      author: mockCustomers[1],
    },
  ],
  'thread-3': [
    {
      id: 'msg-3-1',
      threadId: 'thread-3',
      content: 'Hi there, I\'m having trouble logging into my account.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-3',
      author: mockCustomers[2],
    },
    {
      id: 'msg-3-2',
      threadId: 'thread-3',
      content: 'Hi Mike! I\'d be happy to help. What error message are you seeing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      isCustomer: false,
      isInternal: false,
      authorId: 'user-2',
      author: mockUsers[1],
    },
    {
      id: 'msg-3-3',
      threadId: 'thread-3',
      content: 'It says "Invalid password" but I\'m sure I\'m using the right one.',
      timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 mins ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-3',
      author: mockCustomers[2],
    },
    {
      id: 'msg-3-4',
      threadId: 'thread-3',
      content: 'Can you help me reset my password?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      isCustomer: true,
      isInternal: false,
      authorId: 'cust-3',
      author: mockCustomers[2],
    },
  ],
};

// Mock activity events
export const mockActivities: Record<string, ActivityEvent[]> = {
  'thread-1': [
    {
      id: 'activity-1-1',
      threadId: 'thread-1',
      type: 'assignment',
      userId: 'user-1',
      user: mockUsers[0],
      timestamp: new Date(Date.now() - 1000 * 60 * 70), // 70 mins ago
      newValue: 'Alice Johnson',
    },
    {
      id: 'activity-1-2',
      threadId: 'thread-1',
      type: 'priority',
      userId: 'user-1',
      user: mockUsers[0],
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 mins ago
      oldValue: 'medium',
      newValue: 'high',
    },
    {
      id: 'activity-1-3',
      threadId: 'thread-1',
      type: 'tag',
      userId: 'user-1',
      user: mockUsers[0],
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      newValue: 'pricing, sales',
    },
  ],
  'thread-2': [
    {
      id: 'activity-2-1',
      threadId: 'thread-2',
      type: 'category',
      userId: 'user-1',
      user: mockUsers[0],
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      newValue: 'complaint',
    },
    {
      id: 'activity-2-2',
      threadId: 'thread-2',
      type: 'priority',
      userId: 'user-1',
      user: mockUsers[0],
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      oldValue: 'high',
      newValue: 'urgent',
    },
  ],
};

// Mock templates
export const mockTemplates = [
  {
    id: 'template-1',
    name: 'Welcome',
    content: 'Hi {name}! Thanks for reaching out. How can I help you today?',
  },
  {
    id: 'template-2',
    name: 'Pricing Info',
    content: 'Thanks for your interest in our pricing! Our plans start at $29/month for the basic plan. Would you like me to send you more details?',
  },
  {
    id: 'template-3',
    name: 'Shipping Update',
    content: 'I\'ve checked on your order status. Your package is currently in transit and should arrive within 2-3 business days. Tracking number: {tracking}',
  },
  {
    id: 'template-4',
    name: 'Refund Process',
    content: 'I understand your concern. I\'ve initiated a refund for your order. You should see the credit in your account within 5-7 business days.',
  },
  {
    id: 'template-5',
    name: 'Password Reset',
    content: 'I can help you reset your password. I\'ve sent a password reset link to your registered email address. Please check your inbox (and spam folder) and follow the instructions.',
  },
];
