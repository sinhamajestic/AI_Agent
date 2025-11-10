import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types';

const API_URL = 'http://localhost:8080/api';

const TaskStream: React.FC = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks?filter=ingested`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data: Task[] = await response.json();
        setAllTasks(data);
      } catch (error) {
        console.error('Error fetching task stream:', error);
      }
    };
    
    fetchTasks();
     // Also auto-refresh
    const intervalId = setInterval(fetchTasks, 10000); // 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-base-bg p-4 sm:p-6 rounded-2xl shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">All Ingested Tasks</h2>
            <div className="space-y-3">
                {allTasks.length > 0 ? (
                  allTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No tasks ingested yet. Try the 'Sync Now' button in Settings!</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default TaskStream;