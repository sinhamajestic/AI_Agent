
import React from 'react';
import KpiCard from './KpiCard';
import TaskList from './TaskList';
import { Task, TaskPriority, TaskStatus } from '../types';
import { BellIcon, InboxIcon } from './Icons';

const overdueTasks: Task[] = [
  { id: '1', title: 'Finalize Q4 Deck for All-Hands', description: '', status: TaskStatus.Todo, priority: TaskPriority.Critical, dueAt: '2024-07-20T17:00:00Z', source: { type: 'email', origin: 'support@example.com' } },
  { id: '2', title: 'Review legal docs from acquisitions', description: '', status: TaskStatus.Todo, priority: TaskPriority.High, dueAt: '2024-07-21T10:00:00Z', source: { type: 'document', origin: 'Legal_Brief.pdf' } },
];

const dueTodayTasks: Task[] = [
  { id: '3', title: 'Draft release notes for v2.1', description: '', status: TaskStatus.InProgress, priority: TaskPriority.High, dueAt: '2024-07-22T23:59:00Z', source: { type: 'meeting', origin: 'Weekly Sync' } },
  { id: '4', title: 'Onboard new hire - Aditya', description: '', status: TaskStatus.Todo, priority: TaskPriority.Medium, dueAt: '2024-07-22T15:00:00Z', source: { type: 'slack', origin: '#general' } },
  { id: '5', title: 'Send weekly report to stakeholders', description: '', status: TaskStatus.Todo, priority: TaskPriority.Medium, dueAt: '2024-07-22T18:00:00Z', source: { type: 'email', origin: 'ceo@example.com' } },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Overdue" value="2" icon={<BellIcon className="w-6 h-6 text-red-600" />} colorClass="bg-red-100" />
        <KpiCard title="Due Today" value="3" icon={<BellIcon className="w-6 h-6 text-amber-600" />} colorClass="bg-amber-100" />
        <KpiCard title="Incoming" value="8" icon={<InboxIcon className="w-6 h-6 text-sky-600" />} colorClass="bg-sky-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TaskList title="Overdue" tasks={overdueTasks} />
        <TaskList title="Due Today" tasks={dueTodayTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
