'use client';

import React from 'react';
import { useBoard } from '@/context/BoardContext';
import { X, BarChart3, TrendingUp, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

export default function AnalyticsModal() {
  const { isAnalyticsOpen, setIsAnalyticsOpen, boardStats, activeBoard } = useBoard();

  if (!isAnalyticsOpen || !boardStats) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Sprint Velocity & Team Telemetry
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeBoard?.title}</p>
          </div>
          <button
            onClick={() => setIsAnalyticsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 3 KPI metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Completion Rate</span>
            <div className="text-2xl font-black text-emerald-400">{boardStats.completionRate}%</div>
            <span className="text-[10px] text-slate-500">{boardStats.completedTasks}/{boardStats.totalTasks} Tasks</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sprint Velocity</span>
            <div className="text-2xl font-black text-indigo-400">{boardStats.velocityPoints} pts</div>
            <span className="text-[10px] text-slate-500">Delivered value</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Urgent Blockers</span>
            <div className="text-2xl font-black text-rose-400">{boardStats.urgentTasks}</div>
            <span className="text-[10px] text-slate-500">Requires focus</span>
          </div>
        </div>

        {/* Priority Allocation Breakdown */}
        <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Priority Distribution</h3>
          <div className="space-y-2">
            {boardStats.priorityBreakdown.map((p) => (
              <div key={p.priority} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-semibold">{p.priority}</span>
                  <span className="text-slate-400 font-mono font-bold">{p.count} tasks</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${boardStats.totalTasks > 0 ? (p.count / boardStats.totalTasks) * 100 : 0}%`,
                      backgroundColor: p.color
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workload Allocation per Member */}
        <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Active Team Workload Allocation
          </h3>
          <div className="space-y-2">
            {boardStats.workloadByUser.map((w) => (
              <div key={w.user} className="flex items-center justify-between p-2 bg-slate-900 rounded-xl text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={w.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-bold text-white">{w.user}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-mono font-bold rounded-md">
                  {w.taskCount} active task(s)
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
