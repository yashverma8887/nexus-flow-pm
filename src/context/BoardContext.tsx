'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Board, Task, Role, Priority, ProjectStats } from '@/types';
import { INITIAL_USERS } from '@/lib/mockData';

interface BoardContextType {
  currentUser: User;
  allUsers: User[];
  switchUserRole: (role: Role) => void;
  boards: Board[];
  activeBoard: Board | null;
  setActiveBoard: (board: Board) => void;
  tasks: Task[];
  loading: boolean;
  createTask: (data: Partial<Task>) => Promise<boolean>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  moveTask: (taskId: string, targetColumnId: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  createBoard: (title: string, description?: string) => Promise<void>;
  refreshBoard: () => Promise<void>;
  // Drag and Drop state
  draggedTaskId: string | null;
  setDraggedTaskId: (id: string | null) => void;
  // Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterPriority: string;
  setFilterPriority: (p: string) => void;
  filterAssignee: string;
  setFilterAssignee: (a: string) => void;
  // Modals
  selectedTask: Task | null;
  setSelectedTask: (t: Task | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isAnalyticsOpen: boolean;
  setIsAnalyticsOpen: (open: boolean) => void;
  boardStats: ProjectStats | null;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [allUsers] = useState<User[]>(INITIAL_USERS);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');

  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [boardStats, setBoardStats] = useState<ProjectStats | null>(null);

  const refreshBoard = async () => {
    try {
      const bRes = await fetch('/api/boards');
      const bData = await bRes.json();
      if (bData.success && bData.boards) {
        setBoards(bData.boards);
        const current = activeBoard ? bData.boards.find((b: Board) => b._id === activeBoard._id) || bData.boards[0] : bData.boards[0];
        setActiveBoard(current);

        if (current) {
          const tRes = await fetch(`/api/tasks?boardId=${current._id}`);
          const tData = await tRes.json();
          if (tData.success && tData.tasks) {
            setTasks(tData.tasks);
          }

          const sRes = await fetch(`/api/analytics/${current._id}`);
          const sData = await sRes.json();
          if (sData.success && sData.stats) {
            setBoardStats(sData.stats);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBoard();
  }, []);

  const switchUserRole = (role: Role) => {
    const userForRole = allUsers.find(u => u.role === role) || {
      ...currentUser,
      role
    };
    setCurrentUser(userForRole);
  };

  const createTaskHandler = async (data: Partial<Task>): Promise<boolean> => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          boardId: activeBoard?._id || 'board_01'
        })
      });
      const resData = await res.json();
      if (resData.success && resData.task) {
        setTasks(prev => [...prev, resData.task]);
        refreshBoard();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateTaskHandler = async (id: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks(prev => prev.map(t => (t._id === id ? data.task : t)));
        if (selectedTask && selectedTask._id === id) setSelectedTask(data.task);
        refreshBoard();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteTaskHandler = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => prev.filter(t => t._id !== id));
        if (selectedTask && selectedTask._id === id) setSelectedTask(null);
        refreshBoard();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const moveTaskHandler = async (taskId: string, targetColumnId: string) => {
    // Optimistic UI update
    setTasks(prev =>
      prev.map(t => (t._id === taskId ? { ...t, columnId: targetColumnId } : t))
    );

    try {
      await fetch(`/api/tasks/${taskId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetColumnId })
      });
      refreshBoard();
    } catch (err) {
      console.error(err);
      refreshBoard();
    }
  };

  const toggleSubtaskHandler = async (taskId: string, subtaskId: string) => {
    // Optimistic
    setTasks(prev =>
      prev.map(t => {
        if (t._id !== taskId) return t;
        const nextSubs = t.subtasks.map(s => (s.id === subtaskId ? { ...s, completed: !s.completed } : s));
        const updated = { ...t, subtasks: nextSubs };
        if (selectedTask && selectedTask._id === taskId) setSelectedTask(updated);
        return updated;
      })
    );

    try {
      await fetch(`/api/tasks/${taskId}/subtask`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtaskId })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addCommentHandler = async (taskId: string, content: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: currentUser, content })
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks(prev => prev.map(t => (t._id === taskId ? data.task : t)));
        if (selectedTask && selectedTask._id === taskId) setSelectedTask(data.task);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createBoardHandler = async (title: string, description?: string) => {
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const data = await res.json();
      if (data.success && data.board) {
        setBoards(prev => [...prev, data.board]);
        setActiveBoard(data.board);
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BoardContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUserRole,
        boards,
        activeBoard,
        setActiveBoard: (b) => {
          setActiveBoard(b);
          setLoading(true);
          fetch(`/api/tasks?boardId=${b._id}`).then(r => r.json()).then(d => {
            if (d.success) setTasks(d.tasks);
            setLoading(false);
          });
        },
        tasks,
        loading,
        createTask: createTaskHandler,
        updateTask: updateTaskHandler,
        deleteTask: deleteTaskHandler,
        moveTask: moveTaskHandler,
        toggleSubtask: toggleSubtaskHandler,
        addComment: addCommentHandler,
        createBoard: createBoardHandler,
        refreshBoard,
        draggedTaskId,
        setDraggedTaskId,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        filterAssignee,
        setFilterAssignee,
        selectedTask,
        setSelectedTask,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isAnalyticsOpen,
        setIsAnalyticsOpen,
        boardStats
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
