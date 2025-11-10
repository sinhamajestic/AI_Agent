
import React from 'react';
import type { Summary } from '../types';

interface MeetingCardProps {
  summary: Summary;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ summary }) => {
  return (
    <div className="bg-base-bg p-6 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{summary.title}</h3>
        <span className="text-sm text-gray-500">
            {new Date(summary.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-600 line-clamp-3">
        {summary.content}
      </p>
      <div className="mt-4">
        <a href="#" className="font-medium text-accent-primary hover:text-sky-700 text-sm">
            View Details &rarr;
        </a>
      </div>
    </div>
  );
};

export default MeetingCard;
