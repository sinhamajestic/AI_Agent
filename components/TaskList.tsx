
import React from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  title: string;
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ title, tasks }) => {
  return (
    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 px-2 mb-4">{title}</h3>
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map(task => <TaskItem key={task.id} task={task} />)
        ) : (
          <p className="text-center text-gray-500 py-4">No tasks here. Well done!</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
