
import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { Task, TaskPriority, TaskStatus } from '../types';

const actionRequiredTasks: Task[] = [
    { id: '3', title: 'Draft release notes for v2.1', description: '', status: TaskStatus.InProgress, priority: TaskPriority.High, dueAt: '2024-07-22T23:59:00Z', source: { type: 'meeting', origin: 'Weekly Sync' } },
];

const waitingOnTasks: Task[] = [
    { id: '8', title: 'Awaiting feedback on proposal', description: '', status: TaskStatus.Blocked, priority: TaskPriority.Medium, dueAt: '2024-07-26T18:00:00Z', source: { type: 'email', origin: 'client@example.com' } },
];

const fyiTasks: Task[] = [
    { id: '9', title: 'Project launch successful', description: '', status: TaskStatus.Done, priority: TaskPriority.Low, dueAt: '2024-07-20T18:00:00Z', source: { type: 'slack', origin: '#announcements' } },
];

const tabs = [
  { name: 'Action Required', tasks: actionRequiredTasks },
  { name: 'Waiting On', tasks: waitingOnTasks },
  { name: 'FYI', tasks: fyiTasks },
];

const Inbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-base-bg rounded-2xl shadow-sm border border-border">
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.name
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 sm:p-6">
            {tabs.map(tab => (
                <div key={tab.name} className={`${activeTab === tab.name ? 'block' : 'hidden'}`}>
                    <div className="space-y-3">
                        {tab.tasks.length > 0 ? (
                            tab.tasks.map(task => <TaskItem key={task.id} task={task} />)
                        ) : (
                           <p className="text-center text-gray-500 py-8">Inbox zero! ✨</p> 
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
