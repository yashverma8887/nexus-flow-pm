export type Role = 'admin' | 'manager' | 'developer' | 'viewer';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  jobTitle: string;
  department: string;
}

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
    role: Role;
  };
  content: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  labels: string[];
  assignees: User[];
  dueDate?: string;
  estimatedHours?: number;
  subtasks: Subtask[];
  comments: TaskComment[];
  attachmentsCount?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
}

export interface Board {
  _id: string;
  title: string;
  description: string;
  icon: string;
  columns: Column[];
  members: User[];
  createdAt: string;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  urgentTasks: number;
  completionRate: number;
  velocityPoints: number;
  priorityBreakdown: { priority: string; count: number; color: string }[];
  workloadByUser: { user: string; avatar: string; taskCount: number }[];
}
