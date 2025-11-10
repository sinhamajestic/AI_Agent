import React from 'react';
import type { Page } from '../types';
import { HomeIcon, StreamIcon, InboxIcon, MeetingIcon, SettingsIcon, CloseIcon, BotIcon } from './Icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Today', icon: <HomeIcon /> },
    { id: 'stream', label: 'Task Stream', icon: <StreamIcon /> },
    { id: 'inbox', label: 'Smart Inbox', icon: <InboxIcon /> },
    { id: 'meetings', label: 'Meetings', icon: <MeetingIcon /> },
    { id: 'agent', label: 'Smart Agent', icon: <BotIcon /> },
  ];

  const NavLink: React.FC<{ id: Page, label: string, icon: React.ReactNode }> = ({ id, label, icon }) => {
    const isActive = currentPage === id;
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage(id);
          setIsOpen(false);
        }}
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-sky-100 text-accent-primary'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </a>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`fixed md:relative z-40 flex flex-col w-64 h-full bg-base-bg border-r border-border transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <span className="text-xl font-bold text-gray-800">TaskHive X</span>
          <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.id} id={item.id as Page} label={item.label} icon={item.icon} />
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <NavLink id="settings" label="Settings" icon={<SettingsIcon />} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;