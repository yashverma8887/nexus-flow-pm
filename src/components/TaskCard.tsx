'use client';

import React from 'react';
import { Task, Priority } from '@/types';
import { useBoard } from '@/context/BoardContext';
import {
  CheckSquare,
  MessageSquare,
  Paperclip,
  Calendar,
  AlertCircle,
  Clock
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { setDraggedTaskId, setSelectedTask, currentUser } = useBoard();

  const handleDragStart = (e: React.DragEvent) => {
    if (currentUser.role === 'viewer') return;
    setDraggedTaskId(task._id);
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const getPriorityStyle = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate).getTime() < Date.now();

  return (
    <div
      draggable={currentUser.role !== 'viewer'}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => setSelectedTask(task)}
      className="bg-slate-900 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer group select-none space-y-3"
    >
      {/* Top Meta: Priority Badge & Labels */}
      <div className="flex items-center justify-between gap-2">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityStyle(task.priority)}`}>
          {task.priority}
        </span>

        {task.labels && task.labels.length > 0 && (
          <div className="flex gap-1 overflow-hidden">
            {task.labels.slice(0, 2).map((label) => (
              <span key={label} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-semibold border border-slate-700">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-400 transition leading-snug">
        {task.title}
      </h4>

      {/* Checklist Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-indigo-400" />
              Checklist
            </span>
            <span>{completedSubtasks}/{totalSubtasks} ({subtasksPercent}%)</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${subtasksPercent}%` }}
              className={`h-full transition-all duration-300 ${
                subtasksPercent === 100 ? 'bg-emerald-400' : 'bg-indigo-500'
              }`}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Dates, Counters, Assignees */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-slate-400 text-xs">
        
        {/* Left indicators */}
        <div className="flex items-center gap-3 text-[11px]">
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}

          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}

          {task.attachmentsCount && task.attachmentsCount > 0 ? (
            <span className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {task.attachmentsCount}
            </span>
          ) : null}
        </div>

        {/* Assignee Avatar Stack */}
        <div className="flex items-center -space-x-1.5">
          {task.assignees?.map((user) => (
            <img
              key={user._id}
              src={user.avatar}
              alt={user.name}
              title={user.name}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-slate-900"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
