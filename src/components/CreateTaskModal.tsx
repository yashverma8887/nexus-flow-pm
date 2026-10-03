'use client';

import React, { useState } from 'react';
import { useBoard } from '@/context/BoardContext';
import { Priority } from '@/types';
import { X, Plus, Sparkles } from 'lucide-react';

export default function CreateTaskModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, createTask, activeBoard, allUsers } = useBoard();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [columnId, setColumnId] = useState(activeBoard?.columns[0]?.id || 'col_backlog');
  const [labels, setLabels] = useState('Frontend, Core');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [subtasksInput, setSubtasksInput] = useState('Setup unit tests\nDeploy staging environment');
  const [submitting, setSubmitting] = useState(false);

  if (!isCreateModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const parsedSubtasks = subtasksInput
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .map(t => ({ id: `sub_${Math.random()}`, title: t, completed: false }));

      const success = await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        columnId,
        labels: labels.split(',').map(l => l.trim()).filter(Boolean),
        dueDate,
        subtasks: parsedSubtasks,
        assignees: [allUsers[0]]
      });

      if (success) {
        setTitle('');
        setDescription('');
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            Create New Task
          </h2>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement WebSocket state synchronization"
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Column</label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold"
              >
                {activeBoard?.columns?.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-semibold"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Tags / Labels (comma-separated)</label>
              <input
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="Frontend, API, Refactor"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline technical requirements, user stories, and acceptance criteria..."
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Checklist Subtasks (1 per line)</label>
            <textarea
              rows={2}
              value={subtasksInput}
              onChange={(e) => setSubtasksInput(e.target.value)}
              placeholder="Checklist items..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-[11px]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
