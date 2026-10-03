'use client';

import React from 'react';
import { useBoard } from '@/context/BoardContext';
import KanbanColumn from '@/components/KanbanColumn';
import { Task } from '@/types';
import { Layers, Plus } from 'lucide-react';

export default function KanbanBoardPage() {
  const { activeBoard, tasks, loading, searchQuery, filterPriority, setIsCreateModalOpen, currentUser } = useBoard();

  if (loading || !activeBoard) {
    return (
      <div className="p-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-bold">Synchronizing board telemetry...</p>
      </div>
    );
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch =
      !searchQuery.trim() ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="p-6 h-[calc(100vh-120px)] flex gap-6 overflow-x-auto select-none items-start">
      {activeBoard.columns.map((column) => {
        const columnTasks = filteredTasks.filter((t) => t.columnId === column.id);
        return (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={columnTasks}
          />
        );
      })}
    </div>
  );
}
