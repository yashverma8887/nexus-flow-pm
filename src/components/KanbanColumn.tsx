'use client';

import React, { useState } from 'react';
import { Column, Task } from '@/types';
import { useBoard } from '@/context/BoardContext';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export default function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { moveTask, draggedTaskId, setIsCreateModalOpen, currentUser } = useBoard();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      await moveTask(taskId, column.id);
    }
  };

  const getColumnDotColor = (color: string) => {
    switch (color) {
      case 'sky': return 'bg-sky-400';
      case 'amber': return 'bg-amber-400';
      case 'purple': return 'bg-purple-400';
      case 'emerald': return 'bg-emerald-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-80 flex-shrink-0 bg-slate-950/60 rounded-3xl border p-4 flex flex-col max-h-[calc(100vh-140px)] transition-all ${
        isDragOver
          ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/20'
          : 'border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${getColumnDotColor(column.color)}`} />
          <h3 className="font-bold text-sm text-white tracking-tight">{column.title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
            {tasks.length}
          </span>
        </div>

        {currentUser.role !== 'viewer' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition"
            title="Add task in this column"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Task Cards List (Scrollable) */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-1 min-h-[150px]">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="h-28 border-2 border-dashed border-slate-800/80 rounded-2xl flex items-center justify-center text-[11px] text-slate-500 font-medium">
            Drop tasks here
          </div>
        )}
      </div>

      {/* Quick Add Button */}
      {currentUser.role !== 'viewer' && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full mt-3 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Task
        </button>
      )}
    </div>
  );
}
