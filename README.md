# NexusFlow — Enterprise Project Management & Kanban Dashboard

> **Skill-Nexus Capstone Project (Serial No. 3: Project Management Dashboard)**  
> Built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Serverless Route Handlers, Drag-and-Drop Task Orchestration, Multi-Board Workspaces, and Granular Role-Based Access Control (RBAC).

---

## 🌟 Key Features & Capabilities

### 📋 1. Interactive Kanban Boards & Drag-and-Drop
- **Multi-Board Workspace**: Switch between *Core Engineering Sprint 42*, *Product Strategy & Roadmap*, or create custom team boards dynamically.
- **Drag-and-Drop Column Shifting**: Seamlessly drag task cards between workflow stages (`Backlog` ➔ `To Do` ➔ `In Progress` ➔ `Code Review` ➔ `Done / Shipped`) with drop-target highlights.
- **Rich Task Metadata**: Priority indicators (Urgent, High, Medium, Low), multi-assignee avatar stacks, category labels (Frontend, Backend, DevOps, Security, Design), due dates with overdue warnings, and attachments counters.
- **Interactive Checklists**: Multi-item subtask manager with live progress bars and completion percentages.
- **Task Discussion Threads**: Real-time comment stream on individual task cards with timestamped author logs.

### 🛡️ 2. Role-Based Access Control (RBAC) Matrix
- **Admin**: Full permissions (board creation, task deletion, column configuration, team assignment).
- **Product Manager**: Sprint planning, moving tasks, assigning teammates, managing roadmap deliverables.
- **Engineer / Developer**: Task status updating, checklist management, comment collaboration.
- **Viewer / Guest**: Safe read-only mode.
- **1-Click Evaluator Switcher**: Switch roles on the fly directly from the navigation bar.

### 📊 3. Sprint Velocity & Team Analytics
- **Sprint Completion Percentage**: Real-time gauge of finished vs in-progress tasks.
- **Velocity Points Tracker**: Aggregated sprint output.
- **Priority Distribution Breakdown**: Visual bars reflecting workload urgency.
- **Team Workload Allocation**: Active task distribution across team members.

---

## 🚀 Quick Start (Local Run)

```bash
cd project-management-dashboard
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the interactive dashboard.

---

## 🌐 Deploy to GitHub & Vercel Guide

```bash
# Push to GitHub
git init
git add .
git commit -m "feat: complete project management dashboard capstone project"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/nexus-flow-pm.git
git branch -M main
git push -u origin main
```

Deploy on [Vercel](https://vercel.com): Import the repository, select Next.js, and click **Deploy**.
