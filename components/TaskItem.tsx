
import React from 'react';
import type { Task } from '../types';
import { TaskPriority } from '../types';
import { CheckCircleIcon, SnoozeIcon, BlockIcon, EmailIcon, MeetingIcon } from './Icons';

interface TaskItemProps {
  task: Task;
}

const priorityStyles: Record<TaskPriority, { bg: string; text: string; dot: string }> = {
  [TaskPriority.Critical]: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  [TaskPriority.High]: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  [TaskPriority.Medium]: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  [TaskPriority.Low]: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' },
};

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { bg, text, dot } = priorityStyles[task.priority];
  
  const SourceIcon = () => {
    switch (task.source.type) {
      case 'email':
        return <EmailIcon className="w-4 h-4 text-gray-400" />;
      case 'meeting':
        return <MeetingIcon className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-base-bg p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-200 group">
      <div className="flex justify-between items-start">
        <p className="font-semibold text-gray-800 pr-2">{task.title}</p>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="p-1 text-green-500 hover:bg-green-100 rounded-full"><CheckCircleIcon /></button>
          <button className="p-1 text-yellow-500 hover:bg-yellow-100 rounded-full"><SnoozeIcon /></button>
          <button className="p-1 text-red-500 hover:bg-red-100 rounded-full"><BlockIcon /></button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
             <span className={`w-2 h-2 rounded-full ${dot}`}></span>
             <span className="capitalize">{task.priority}</span>
          </div>
          <div className="flex items-center space-x-1">
             <SourceIcon/>
             <span>{task.source.origin}</span>
          </div>
        </div>
        <span>{new Date(task.dueAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
};

export default TaskItem;
