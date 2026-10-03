import { User, Board, Task } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    _id: 'usr_01',
    name: 'Yash Verma',
    email: 'yash@nexusflow.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    jobTitle: 'Lead Platform Architect',
    department: 'Engineering'
  },
  {
    _id: 'usr_02',
    name: 'Elena Rostova',
    email: 'elena@nexusflow.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'manager',
    jobTitle: 'Senior Technical Product Manager',
    department: 'Product'
  },
  {
    _id: 'usr_03',
    name: 'Alex Rivera',
    email: 'alex@nexusflow.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'developer',
    jobTitle: 'Senior Frontend Engineer',
    department: 'Engineering'
  },
  {
    _id: 'usr_04',
    name: 'Marcus Brody',
    email: 'marcus@nexusflow.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'developer',
    jobTitle: 'Security & Cloud DevOps Lead',
    department: 'Infrastructure'
  }
];

export const INITIAL_BOARDS: Board[] = [
  {
    _id: 'board_01',
    title: 'Core Platform Sprint 42',
    description: 'Sprint planning and engineering delivery for Edge APIs, Auth tokens, and Drag & Drop performance.',
    icon: 'Layers',
    members: INITIAL_USERS,
    columns: [
      { id: 'col_backlog', title: 'Backlog', color: 'slate', taskIds: ['tsk_01', 'tsk_02'] },
      { id: 'col_todo', title: 'To Do', color: 'sky', taskIds: ['tsk_03', 'tsk_04'] },
      { id: 'col_progress', title: 'In Progress', color: 'amber', taskIds: ['tsk_05', 'tsk_06'] },
      { id: 'col_review', title: 'Code Review', color: 'purple', taskIds: ['tsk_07'] },
      { id: 'col_done', title: 'Done / Shipped', color: 'emerald', taskIds: ['tsk_08', 'tsk_09'] }
    ],
    createdAt: '2024-03-01T08:00:00Z'
  },
  {
    _id: 'board_02',
    title: 'Q4 Product Roadmap & Vision',
    description: 'Strategic feature milestones, UX research, and enterprise integrations roadmap.',
    icon: 'Compass',
    members: INITIAL_USERS,
    columns: [
      { id: 'col_backlog_2', title: 'Ideation', color: 'slate', taskIds: ['tsk_10'] },
      { id: 'col_todo_2', title: 'Specification', color: 'sky', taskIds: [] },
      { id: 'col_progress_2', title: 'In Development', color: 'amber', taskIds: [] },
      { id: 'col_done_2', title: 'Released', color: 'emerald', taskIds: [] }
    ],
    createdAt: '2024-02-15T10:00:00Z'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    _id: 'tsk_01',
    boardId: 'board_01',
    columnId: 'col_backlog',
    title: 'Architect Real-Time Multi-Cursor Collaboration for Task Cards',
    description: 'Investigate WebRTC / CRDT state sync primitives to enable real-time presence indicators on cards.',
    priority: 'medium',
    labels: ['Architecture', 'WebSockets'],
    assignees: [INITIAL_USERS[0]],
    dueDate: '2026-10-18',
    estimatedHours: 16,
    subtasks: [
      { id: 'sub_1', title: 'Benchmark Yjs vs Automerge', completed: true },
      { id: 'sub_2', title: 'Design presence broadcast packet', completed: false }
    ],
    comments: [],
    attachmentsCount: 2,
    order: 0,
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z'
  },
  {
    _id: 'tsk_02',
    boardId: 'board_01',
    columnId: 'col_backlog',
    title: 'Migrate PostgreSQL Database Connection Pooling to Prisma Accelerate',
    description: 'Reduce serverless cold-start latency by offloading connection pooling to edge proxies.',
    priority: 'low',
    labels: ['Database', 'DevOps'],
    assignees: [INITIAL_USERS[3]],
    dueDate: '2026-10-25',
    estimatedHours: 8,
    subtasks: [],
    comments: [],
    attachmentsCount: 0,
    order: 1,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  },
  {
    _id: 'tsk_03',
    boardId: 'board_01',
    columnId: 'col_todo',
    title: 'Implement Dark / Light Theme Persistence with System Preference Hook',
    description: 'Ensure smooth transition and zero flicker when hydration executes.',
    priority: 'medium',
    labels: ['Frontend', 'UI/UX'],
    assignees: [INITIAL_USERS[2]],
    dueDate: '2026-10-12',
    estimatedHours: 6,
    subtasks: [
      { id: 'sub_3', title: 'Add CSS variables for neutral-850', completed: true },
      { id: 'sub_4', title: 'Write unit tests for useTheme', completed: false }
    ],
    comments: [],
    attachmentsCount: 1,
    order: 0,
    createdAt: '2024-03-02T11:00:00Z',
    updatedAt: '2024-03-02T11:00:00Z'
  },
  {
    _id: 'tsk_04',
    boardId: 'board_01',
    columnId: 'col_todo',
    title: 'Setup Automated CI/CD Pipeline on GitHub Actions with Lint & Build Validation',
    description: 'Trigger automated runs on all pull requests targeting the main branch.',
    priority: 'high',
    labels: ['DevOps', 'Security'],
    assignees: [INITIAL_USERS[3], INITIAL_USERS[0]],
    dueDate: '2026-10-10',
    estimatedHours: 12,
    subtasks: [
      { id: 'sub_5', title: 'Configure Node 20 runner matrix', completed: true },
      { id: 'sub_6', title: 'Add Vercel preview deployment webhook', completed: false }
    ],
    comments: [],
    attachmentsCount: 3,
    order: 1,
    createdAt: '2024-03-02T14:30:00Z',
    updatedAt: '2024-03-02T14:30:00Z'
  },
  {
    _id: 'tsk_05',
    boardId: 'board_01',
    columnId: 'col_progress',
    title: 'Build Drag-and-Drop Task Reordering with Visual Drop Target Indicators',
    description: 'Smooth HTML5 Drag & Drop with animated drop placeholders and optimistic column state changes.',
    priority: 'urgent',
    labels: ['Frontend', 'Core'],
    assignees: [INITIAL_USERS[0], INITIAL_USERS[2]],
    dueDate: '2026-10-06',
    estimatedHours: 18,
    subtasks: [
      { id: 'sub_7', title: 'Add draggable and onDragStart listeners', completed: true },
      { id: 'sub_8', title: 'Render drop target hover highlight line', completed: true },
      { id: 'sub_9', title: 'Sync state change to backend API', completed: true }
    ],
    comments: [
      {
        id: 'comm_1',
        author: INITIAL_USERS[1],
        content: 'Looks ultra-smooth! Make sure mobile touch events also fallback gracefully.',
        createdAt: '2024-03-03T16:00:00Z'
      }
    ],
    attachmentsCount: 4,
    order: 0,
    createdAt: '2024-03-03T10:00:00Z',
    updatedAt: '2024-03-03T16:00:00Z'
  },
  {
    _id: 'tsk_06',
    boardId: 'board_01',
    columnId: 'col_progress',
    title: 'Implement Granular Role-Based Access Control (RBAC) Matrix',
    description: 'Define permissions for Admin, Manager, Developer, and Guest roles with visual badges.',
    priority: 'high',
    labels: ['Security', 'Backend'],
    assignees: [INITIAL_USERS[0]],
    dueDate: '2026-10-08',
    estimatedHours: 14,
    subtasks: [
      { id: 'sub_10', title: 'Create Permission enum and middleware', completed: true },
      { id: 'sub_11', title: 'Add header persona switcher for demo testing', completed: true }
    ],
    comments: [],
    attachmentsCount: 1,
    order: 1,
    createdAt: '2024-03-03T11:00:00Z',
    updatedAt: '2024-03-03T11:00:00Z'
  },
  {
    _id: 'tsk_07',
    boardId: 'board_01',
    columnId: 'col_review',
    title: 'Refactor REST API Endpoints to Next.js App Router Serverless Route Handlers',
    description: 'Ensure standardized response envelope `{ success: true, data: ... }` across all endpoints.',
    priority: 'high',
    labels: ['Backend', 'Refactor'],
    assignees: [INITIAL_USERS[2]],
    dueDate: '2026-10-05',
    estimatedHours: 10,
    subtasks: [
      { id: 'sub_12', title: 'Standardize error codes 400, 401, 404', completed: true },
      { id: 'sub_13', title: 'Add automated payload schema validation', completed: true }
    ],
    comments: [
      {
        id: 'comm_2',
        author: INITIAL_USERS[0],
        content: 'Code looks clean. Ready for final merge after CI passes.',
        createdAt: '2024-03-04T09:30:00Z'
      }
    ],
    attachmentsCount: 2,
    order: 0,
    createdAt: '2024-03-02T09:00:00Z',
    updatedAt: '2024-03-04T09:30:00Z'
  },
  {
    _id: 'tsk_08',
    boardId: 'board_01',
    columnId: 'col_done',
    title: 'Design System Typography & Elevation Hierarchy in Tailwind CSS',
    description: 'Standardized modern color palette, slate dark mode, and sleek rounded-2xl geometry.',
    priority: 'medium',
    labels: ['Design', 'UI/UX'],
    assignees: [INITIAL_USERS[2]],
    dueDate: '2026-10-02',
    estimatedHours: 12,
    subtasks: [
      { id: 'sub_14', title: 'Define custom tailwind palette', completed: true },
      { id: 'sub_15', title: 'Create reusable glass-panel utility classes', completed: true }
    ],
    comments: [],
    attachmentsCount: 5,
    order: 0,
    createdAt: '2024-02-28T10:00:00Z',
    updatedAt: '2024-03-01T17:00:00Z'
  },
  {
    _id: 'tsk_09',
    boardId: 'board_01',
    columnId: 'col_done',
    title: 'Initialize Hybrid Zero-Config Data Persistence Layer',
    description: 'In-memory hot cache with seamless automatic MongoDB Atlas connectivity when URI is provided.',
    priority: 'urgent',
    labels: ['Architecture', 'Database'],
    assignees: [INITIAL_USERS[0]],
    dueDate: '2026-10-01',
    estimatedHours: 16,
    subtasks: [
      { id: 'sub_16', title: 'Implement global hot-cache store', completed: true },
      { id: 'sub_17', title: 'Add reset seed endpoint', completed: true }
    ],
    comments: [],
    attachmentsCount: 1,
    order: 1,
    createdAt: '2024-02-27T08:00:00Z',
    updatedAt: '2024-02-28T18:00:00Z'
  },
  {
    _id: 'tsk_10',
    boardId: 'board_02',
    columnId: 'col_backlog_2',
    title: 'Enterprise Single Sign-On (SAML / Okta / Azure AD) Integration',
    description: 'Support enterprise workforce federated identity logins.',
    priority: 'high',
    labels: ['Enterprise', 'Security'],
    assignees: [INITIAL_USERS[1], INITIAL_USERS[3]],
    dueDate: '2026-11-15',
    estimatedHours: 40,
    subtasks: [],
    comments: [],
    attachmentsCount: 0,
    order: 0,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  }
];
