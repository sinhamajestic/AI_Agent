import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types';

const API_URL = 'http://localhost:8080/api';

type TabName = 'Action Required' | 'Waiting On' | 'FYI';

const TABS: TabName[] = ['Action Required', 'Waiting On', 'FYI'];

// Map tab names to API filters
const tabFilterMap: Record<TabName, string> = {
  'Action Required': 'action_required',
  'Waiting On': 'waiting_on',
  'FYI': 'fyi',
};

// Create a new component for the tab panel
const TabPanel: React.FC<{ filter: string, isActive: boolean }> = ({ filter, isActive }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isActive) return; // Don't fetch data for inactive tabs

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/tasks?filter=${filter}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data: Task[] = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(`Error fetching tasks for filter ${filter}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [filter, isActive]); // Re-fetch when this tab becomes active

  if (!isActive) return null;

  if (isLoading) {
    return <p className="text-center text-gray-500 py-8">Loading...</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.length > 0 ? (
        tasks.map(task => <TaskItem key={task.id} task={task} />)
      ) : (
        <p className="text-center text-gray-500 py-8">Inbox zero! ✨</p>
      )}
    </div>
  );
};

const Inbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>(TABS[0]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-base-bg rounded-2xl shadow-sm border border-border">
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
            {TABS.map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tabName
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tabName}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 sm:p-6">
          {TABS.map(tabName => (
            <TabPanel
              key={tabName}
              filter={tabFilterMap[tabName]}
              isActive={activeTab === tabName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inbox;