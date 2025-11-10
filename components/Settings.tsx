import React, { useState } from 'react';
import IntegrationCard from './IntegrationCard';
import type { Integration } from '../types';
import { SyncIcon } from './Icons';

const integrations: Integration[] = [
  { id: 'gmail', name: 'Gmail', enabled: true },
  { id: 'slack', name: 'Slack', enabled: true },
  { id: 'notion', name: 'Notion', enabled: true },
  { id: 'trello', name: 'Trello', enabled: false },
  { id: 'jira', name: 'Jira', enabled: true },
];

const Settings: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 2500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-base-bg p-6 sm:p-8 rounded-2xl shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connections</h2>
            <p className="text-gray-600">
              Manage your connected applications to automate your workflows.
              {lastSyncTime && <span className="block text-xs mt-1 text-gray-400">Last synced: {lastSyncTime}</span>}
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="mt-4 sm:mt-0 flex-shrink-0 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-accent-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:bg-sky-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <SyncIcon className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        <div className="space-y-4">
          {integrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;