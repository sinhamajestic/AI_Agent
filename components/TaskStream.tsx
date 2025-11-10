
import React from 'react';
import TaskItem from './TaskItem';
import { Task, TaskPriority, TaskStatus } from '../types';

const allTasks: Task[] = [
    { id: '1', title: 'Finalize Q4 Deck for All-Hands', description: '', status: TaskStatus.Todo, priority: TaskPriority.Critical, dueAt: '2024-07-20T17:00:00Z', source: { type: 'email', origin: 'support@example.com' } },
    { id: '2', title: 'Review legal docs from acquisitions', description: '', status: TaskStatus.Todo, priority: TaskPriority.High, dueAt: '2024-07-21T10:00:00Z', source: { type: 'document', origin: 'Legal_Brief.pdf' } },
    { id: '3', title: 'Draft release notes for v2.1', description: '', status: TaskStatus.InProgress, priority: TaskPriority.High, dueAt: '2024-07-22T23:59:00Z', source: { type: 'meeting', origin: 'Weekly Sync' } },
    { id: '4', title: 'Onboard new hire - Aditya', description: '', status: TaskStatus.Todo, priority: TaskPriority.Medium, dueAt: '2024-07-22T15:00:00Z', source: { type: 'slack', origin: '#general' } },
    { id: '5', title: 'Send weekly report to stakeholders', description: '', status: TaskStatus.Todo, priority: TaskPriority.Medium, dueAt: '2024-07-22T18:00:00Z', source: { type: 'email', origin: 'ceo@example.com' } },
    { id: '6', title: 'Book flight for conference', description: '', status: TaskStatus.Todo, priority: TaskPriority.Low, dueAt: '2024-07-25T18:00:00Z', source: { type: 'email', origin: 'travel@example.com' } },
    { id: '7', title: 'Prepare presentation for client pitch', description: '', status: TaskStatus.Todo, priority: TaskPriority.High, dueAt: '2024-07-24T18:00:00Z', source: { type: 'meeting', origin: 'Client Prep' } },
];


const TaskStream: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-base-bg p-4 sm:p-6 rounded-2xl shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">All Ingested Tasks</h2>
            <div className="space-y-3">
                {allTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default TaskStream;
