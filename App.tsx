import React, { useState } from 'react';
import type { Page } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskStream from './components/TaskStream';
import Inbox from './components/Inbox';
import Meetings from './components/Meetings';
import Settings from './components/Settings';
import SmartAgent from './components/SmartAgent';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const pages: { id: Page, title: string }[] = [
    { id: 'dashboard', title: 'Today' },
    { id: 'stream', title: 'Task Stream' },
    { id: 'inbox', title: 'Smart Inbox' },
    { id: 'meetings', title: 'Meeting Summaries' },
    { id: 'agent', title: 'Smart Agent' },
    { id: 'settings', title: 'Settings' },
  ];

  const currentPageTitle = pages.find(p => p.id === currentPage)?.title || 'Dashboard';

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'stream':
        return <TaskStream />;
      case 'inbox':
        return <Inbox />;
      case 'meetings':
        return <Meetings />;
      case 'agent':
        return <SmartAgent />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          pageTitle={currentPageTitle} 
          onMenuClick={() => setSidebarOpen(true)} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;