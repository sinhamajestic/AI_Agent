import React, { useState, useEffect } from 'react';
import KpiCard from './KpiCard';
import TaskList from './TaskList';
import { Task } from '../types';
import { BellIcon, InboxIcon } from './Icons';

// Define the API URL
const API_URL = 'http://localhost:8080/api';

interface KpiData {
  overdue: number;
  dueToday: number;
  incoming: number;
}

const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KpiData>({ overdue: 0, dueToday: 0, incoming: 0 });
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [dueTodayTasks, setDueTodayTasks] = useState<Task[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh

  useEffect(() => {
    // Fetch all data
    const fetchData = async () => {
      try {
        // Fetch KPIs
        const kpiResponse = await fetch(`${API_URL}/kpis`);
        if (!kpiResponse.ok) throw new Error('Failed to fetch KPIs');
        const kpiData: KpiData = await kpiResponse.json();
        setKpis(kpiData);

        // Fetch Overdue Tasks
        const overdueResponse = await fetch(`${API_URL}/tasks?filter=overdue`);
        if (!overdueResponse.ok) throw new Error('Failed to fetch overdue tasks');
        const overdueData: Task[] = await overdueResponse.json();
        setOverdueTasks(overdueData);

        // Fetch Due Today Tasks
        const dueTodayResponse = await fetch(`${API_URL}/tasks?filter=due_today`);
        if (!dueTodayResponse.ok) throw new Error('Failed to fetch due today tasks');
        const dueTodayData: Task[] = await dueTodayResponse.json();
        setDueTodayTasks(dueTodayData);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
    
    // This is a simple way to auto-refresh the dashboard data every 10 seconds
    const intervalId = setInterval(() => {
        console.log('Refreshing dashboard data...');
        fetchData();
    }, 10000); // 10 seconds

    // Clear interval on cleanup
    return () => clearInterval(intervalId);

  }, [refreshKey]); // Re-run effect if refreshKey changes (or on mount)

  // You can also add a manual refresh button if you want
  // const handleRefresh = () => setRefreshKey(prevKey => prevKey + 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Overdue" value={String(kpis.overdue)} icon={<BellIcon className="w-6 h-6 text-red-600" />} colorClass="bg-red-100" />
        <KpiCard title="Due Today" value={String(kpis.dueToday)} icon={<BellIcon className="w-6 h-6 text-amber-600" />} colorClass="bg-amber-100" />
        <KpiCard title="Incoming" value={String(kpis.incoming)} icon={<InboxIcon className="w-6 h-6 text-sky-600" />} colorClass="bg-sky-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TaskList title="Overdue" tasks={overdueTasks} />
        <TaskList title="Due Today" tasks={dueTodayTasks} />
      </div>
    </div>
  );
};

export default Dashboard;