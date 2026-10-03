import { User, Board, Task, Column, ProjectStats, TaskComment } from '@/types';
import { INITIAL_USERS, INITIAL_BOARDS, INITIAL_TASKS } from './mockData';

declare global {
  var __NEXUS_PM_STORE__: {
    users: User[];
    boards: Board[];
    tasks: Task[];
  } | undefined;
}

if (!global.__NEXUS_PM_STORE__) {
  global.__NEXUS_PM_STORE__ = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    boards: JSON.parse(JSON.stringify(INITIAL_BOARDS)),
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS))
  };
}

export const getStore = () => global.__NEXUS_PM_STORE__!;

export const resetStore = () => {
  global.__NEXUS_PM_STORE__ = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    boards: JSON.parse(JSON.stringify(INITIAL_BOARDS)),
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS))
  };
  return global.__NEXUS_PM_STORE__;
};

// ================= BOARDS =================
export const getBoards = () => getStore().boards;

export const getBoardById = (id: string) => {
  const store = getStore();
  return store.boards.find(b => b._id === id) || store.boards[0];
};

export const createBoard = (data: Partial<Board>) => {
  const store = getStore();
  const newBoard: Board = {
    _id: `board_${Date.now()}`,
    title: data.title || 'New Project Board',
    description: data.description || 'Sprint and tasks management workspace.',
    icon: data.icon || 'Layers',
    members: store.users,
    columns: [
      { id: `col_backlog_${Date.now()}`, title: 'Backlog', color: 'slate', taskIds: [] },
      { id: `col_todo_${Date.now()}`, title: 'To Do', color: 'sky', taskIds: [] },
      { id: `col_progress_${Date.now()}`, title: 'In Progress', color: 'amber', taskIds: [] },
      { id: `col_review_${Date.now()}`, title: 'Code Review', color: 'purple', taskIds: [] },
      { id: `col_done_${Date.now()}`, title: 'Done / Shipped', color: 'emerald', taskIds: [] }
    ],
    createdAt: new Date().toISOString()
  };

  store.boards.push(newBoard);
  return newBoard;
};

// ================= TASKS =================
export const getTasksByBoard = (boardId: string) => {
  const store = getStore();
  return store.tasks.filter(t => t.boardId === boardId);
};

export const getTaskById = (id: string) => {
  return getStore().tasks.find(t => t._id === id);
};

export const createTask = (data: Partial<Task>) => {
  const store = getStore();
  const boardId = data.boardId || store.boards[0]._id;
  const board = store.boards.find(b => b._id === boardId) || store.boards[0];
  const columnId = data.columnId || board.columns[0].id;

  const newTask: Task = {
    _id: `tsk_${Date.now()}`,
    boardId,
    columnId,
    title: data.title || 'New Task',
    description: data.description || '',
    priority: data.priority || 'medium',
    labels: data.labels || ['Feature'],
    assignees: data.assignees?.length ? data.assignees : [store.users[0]],
    dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    estimatedHours: data.estimatedHours || 8,
    subtasks: data.subtasks || [],
    comments: [],
    attachmentsCount: 0,
    order: store.tasks.filter(t => t.columnId === columnId).length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.tasks.push(newTask);

  // Add to column taskIds
  const col = board.columns.find(c => c.id === columnId);
  if (col) {
    col.taskIds.push(newTask._id);
  }

  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>) => {
  const store = getStore();
  const task = store.tasks.find(t => t._id === id);
  if (!task) return null;

  Object.assign(task, updates, { updatedAt: new Date().toISOString() });
  return task;
};

export const deleteTask = (id: string) => {
  const store = getStore();
  const index = store.tasks.findIndex(t => t._id === id);
  if (index === -1) return false;

  const [task] = store.tasks.splice(index, 1);

  // Remove from board column
  const board = store.boards.find(b => b._id === task.boardId);
  if (board) {
    board.columns.forEach(c => {
      c.taskIds = c.taskIds.filter(tId => tId !== id);
    });
  }

  return true;
};

export const moveTask = (taskId: string, targetColumnId: string, targetIndex?: number) => {
  const store = getStore();
  const task = store.tasks.find(t => t._id === taskId);
  if (!task) return null;

  const oldColumnId = task.columnId;
  task.columnId = targetColumnId;
  task.updatedAt = new Date().toISOString();

  // Update board column arrays
  const board = store.boards.find(b => b._id === task.boardId);
  if (board) {
    const oldCol = board.columns.find(c => c.id === oldColumnId);
    if (oldCol) {
      oldCol.taskIds = oldCol.taskIds.filter(id => id !== taskId);
    }
    const targetCol = board.columns.find(c => c.id === targetColumnId);
    if (targetCol) {
      if (typeof targetIndex === 'number') {
        targetCol.taskIds.splice(targetIndex, 0, taskId);
      } else {
        targetCol.taskIds.push(taskId);
      }
    }
  }

  return task;
};

export const toggleSubtask = (taskId: string, subtaskId: string) => {
  const store = getStore();
  const task = store.tasks.find(t => t._id === taskId);
  if (!task) return null;

  const sub = task.subtasks.find(s => s.id === subtaskId);
  if (sub) {
    sub.completed = !sub.completed;
    task.updatedAt = new Date().toISOString();
  }
  return task;
};

export const addCommentToTask = (taskId: string, author: User, content: string) => {
  const store = getStore();
  const task = store.tasks.find(t => t._id === taskId);
  if (!task) return null;

  const newComment: TaskComment = {
    id: `comm_${Date.now()}`,
    author: {
      _id: author._id,
      name: author.name,
      avatar: author.avatar,
      role: author.role
    },
    content,
    createdAt: new Date().toISOString()
  };

  task.comments.push(newComment);
  task.updatedAt = new Date().toISOString();
  return task;
};

// ================= ANALYTICS =================
export const getBoardStats = (boardId: string): ProjectStats => {
  const store = getStore();
  const boardTasks = store.tasks.filter(t => t.boardId === boardId);

  const totalTasks = boardTasks.length;
  const completedTasks = boardTasks.filter(t => t.columnId.includes('done')).length;
  const inProgressTasks = boardTasks.filter(t => t.columnId.includes('progress') || t.columnId.includes('review')).length;
  const urgentTasks = boardTasks.filter(t => t.priority === 'urgent').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityBreakdown = [
    { priority: 'Urgent', count: boardTasks.filter(t => t.priority === 'urgent').length, color: '#ef4444' },
    { priority: 'High', count: boardTasks.filter(t => t.priority === 'high').length, color: '#f97316' },
    { priority: 'Medium', count: boardTasks.filter(t => t.priority === 'medium').length, color: '#eab308' },
    { priority: 'Low', count: boardTasks.filter(t => t.priority === 'low').length, color: '#3b82f6' }
  ];

  const userMap: Record<string, { user: string; avatar: string; taskCount: number }> = {};
  boardTasks.forEach(task => {
    task.assignees.forEach(user => {
      if (!userMap[user._id]) {
        userMap[user._id] = { user: user.name, avatar: user.avatar, taskCount: 0 };
      }
      userMap[user._id].taskCount += 1;
    });
  });

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    urgentTasks,
    completionRate,
    velocityPoints: completedTasks * 5,
    priorityBreakdown,
    workloadByUser: Object.values(userMap)
  };
};
