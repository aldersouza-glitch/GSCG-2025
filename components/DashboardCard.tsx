
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-700/50 p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="bg-custom-accent/20 text-custom-accent p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-custom-text-secondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
