'use client';

import React, { useState } from 'react';
import { useBoard } from '@/context/BoardContext';
import { Priority, Role } from '@/types';
import {
  X,
  Trash2,
  CheckSquare,
  Plus,
  MessageSquare,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

export default function TaskModal() {
  const {
    selectedTask,
    setSelectedTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addComment,
    activeBoard,
    currentUser,
    allUsers
  } = useBoard();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  if (!selectedTask) return null;

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const nextSubtasks = [
      ...(selectedTask.subtasks || []),
      { id: `sub_${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ];
    await updateTask(selectedTask._id, { subtasks: nextSubtasks });
    setNewSubtaskTitle('');
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await addComment(selectedTask._id, commentInput.trim());
    setCommentInput('');
  };

  const handleDelete = async () => {
    if (confirm(`Permanently delete task "${selectedTask.title}"?`)) {
      await deleteTask(selectedTask._id);
    }
  };

  const canDelete = currentUser.role === 'admin' || currentUser.role === 'manager';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-indigo-400">
              Task #{selectedTask._id.slice(-4)}
            </span>
            <span className="text-slate-600">•</span>
            <select
              value={selectedTask.columnId}
              onChange={(e) => updateTask(selectedTask._id, { columnId: e.target.value })}
              disabled={currentUser.role === 'viewer'}
              className="bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-indigo-500"
            >
              {activeBoard?.columns?.map((col) => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {canDelete && (
              <button
                onClick={handleDelete}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSelectedTask(null)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            {selectedTask.title}
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed whitespace-pre-line">
            {selectedTask.description || 'No detailed description provided.'}
          </p>
        </div>

        {/* Priority and Assignees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Priority Level:</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedTask.priority}
                onChange={(e) => updateTask(selectedTask._id, { priority: e.target.value as Priority })}
                disabled={currentUser.role === 'viewer'}
                className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 rounded-lg px-2.5 py-1"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase text-[10px]">Due Date:</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{selectedTask.dueDate || 'No due date set'}</span>
            </div>
          </div>
        </div>

        {/* Checklist Subtasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              Checklist ({selectedTask.subtasks?.filter(s => s.completed).length || 0}/{selectedTask.subtasks?.length || 0})
            </h3>
          </div>

          <div className="space-y-2">
            {selectedTask.subtasks?.map((sub) => (
              <label
                key={sub.id}
                className="flex items-center gap-3 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition text-xs"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => toggleSubtask(selectedTask._id, sub.id)}
                  disabled={currentUser.role === 'viewer'}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
                <span className={`flex-1 ${sub.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {sub.title}
                </span>
              </label>
            ))}
          </div>

          {currentUser.role !== 'viewer' && (
            <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
              >
                Add
              </button>
            </form>
          )}
        </div>

        {/* Discussion / Comments Section */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            Activity & Discussion ({selectedTask.comments?.length || 0})
          </h3>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {selectedTask.comments?.map((comm) => (
              <div key={comm.id} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={comm.author.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-white">{comm.author.name}</span>
                    <span className="text-[10px] text-indigo-400 font-semibold uppercase">{comm.author.role}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 pl-7">{comm.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a status update or feedback..."
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-40 flex items-center gap-1.5"
            >
              Post <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
