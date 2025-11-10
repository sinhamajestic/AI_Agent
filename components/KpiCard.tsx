
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-base-bg p-6 rounded-2xl shadow-sm border border-border flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default KpiCard;
