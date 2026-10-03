import type { Metadata } from 'next';
import './globals.css';
import { BoardProvider } from '@/context/BoardContext';
import BoardNavbar from '@/components/BoardNavbar';
import TaskModal from '@/components/TaskModal';
import CreateTaskModal from '@/components/CreateTaskModal';
import AnalyticsModal from '@/components/AnalyticsModal';

export const metadata: Metadata = {
  title: 'NexusFlow | Enterprise Project Management & Kanban',
  description: 'Production-ready Project Management Kanban Dashboard with Drag-and-Drop, Multi-Board Workspaces, and RBAC Role-Based Access Control.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans">
        <BoardProvider>
          <BoardNavbar />
          <main className="flex-1 overflow-x-auto">
            {children}
          </main>
          <TaskModal />
          <CreateTaskModal />
          <AnalyticsModal />
        </BoardProvider>
      </body>
    </html>
  );
}
