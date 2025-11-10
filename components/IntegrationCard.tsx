
import React from 'react';
import type { Integration } from '../types';

interface IntegrationCardProps {
  integration: Integration;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration }) => {
  return (
    <div className="bg-base-bg p-4 rounded-xl shadow-sm border border-border flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src={`https://logo.clearbit.com/${integration.id}.com`} alt={`${integration.name} logo`} className="w-10 h-10" />
        <div>
          <h4 className="font-semibold capitalize text-gray-800">{integration.name}</h4>
          <span className="text-sm text-green-600">Connected</span>
        </div>
      </div>
      <label htmlFor={`${integration.id}-toggle`} className="inline-flex relative items-center cursor-pointer">
        <input type="checkbox" value="" id={`${integration.id}-toggle`} className="sr-only peer" defaultChecked={integration.enabled} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
      </label>
    </div>
  );
};

export default IntegrationCard;
