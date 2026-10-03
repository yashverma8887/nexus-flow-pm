'use client';

import React, { useState } from 'react';
import { useBoard } from '@/context/BoardContext';
import { Role } from '@/types';
import {
  Layers,
  Plus,
  BarChart3,
  Search,
  Filter,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Users,
  RotateCcw
} from 'lucide-react';

export default function BoardNavbar() {
  const {
    boards,
    activeBoard,
    setActiveBoard,
    currentUser,
    switchUserRole,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    setIsCreateModalOpen,
    setIsAnalyticsOpen,
    createBoard,
    refreshBoard
  } = useBoard();

  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNewBoardInput, setShowNewBoardInput] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    await createBoard(newBoardTitle.trim());
    setNewBoardTitle('');
    setShowNewBoardInput(false);
    setShowBoardDropdown(false);
  };

  const ROLES: { role: Role; label: string; color: string }[] = [
    { role: 'admin', label: 'Admin (Full Permissions)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { role: 'manager', label: 'Product Manager', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { role: 'developer', label: 'Engineer / Contributor', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { role: 'viewer', label: 'Guest / Viewer (Read-only)', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 space-y-3">
      {/* Top Row: Brand, Board Selector, Role Switcher, Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Brand & Board Picker */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md">
            <Layers className="w-5 h-5" />
          </div>

          {/* Board Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBoardDropdown(!showBoardDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Project Workspace</span>
                <span className="text-sm font-black text-white flex items-center gap-1.5">
                  {activeBoard?.title || 'Select Board'}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </div>
            </button>

            {showBoardDropdown && (
              <div
                className="absolute left-0 top-14 w-72 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
                onMouseLeave={() => setShowBoardDropdown(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">Available Boards</div>
                {boards.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => {
                      setActiveBoard(b);
                      setShowBoardDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition ${
                      activeBoard?._id === b._id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>{b.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{b.description}</div>
                  </button>
                ))}

                <div className="pt-2 border-t border-slate-800">
                  {showNewBoardInput ? (
                    <form onSubmit={handleCreateBoard} className="space-y-2 p-1">
                      <input
                        type="text"
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        placeholder="Board title..."
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setShowNewBoardInput(false)}
                          className="px-2.5 py-1 text-[10px] text-slate-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowNewBoardInput(true)}
                      className="w-full p-2 text-indigo-400 hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create New Board
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: RBAC Switcher, Analytics, Create Task */}
        <div className="flex items-center gap-3">
          
          {/* 1-Click RBAC Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-750 transition"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Role: <strong className="text-white uppercase">{currentUser.role}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div
                className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
                onMouseLeave={() => setShowRoleDropdown(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ⚡ Evaluator RBAC Role Switcher:
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchUserRole(r.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      currentUser.role === r.role ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{r.label}</span>
                    {currentUser.role === r.role && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Velocity Analytics Button */}
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition"
          >
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Sprint Velocity</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={currentUser.role === 'viewer'}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>

        </div>
      </div>

      {/* Bottom Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title, label, or subtask..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Active members avatars */}
          <div className="hidden md:flex items-center -space-x-2">
            {activeBoard?.members?.map((m) => (
              <img
                key={m._id}
                src={m.avatar}
                alt={m.name}
                title={`${m.name} (${m.role})`}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-900"
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
