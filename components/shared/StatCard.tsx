

import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon: Icon }) => {
  const isIncrease = changeType === 'increase';
  
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center">
        <div className="p-3 bg-emerald-50 rounded-full">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
      {change && (
        <div className="flex items-center mt-4 text-xs">
          <span className={`flex items-center font-semibold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
            {isIncrease ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7"/></svg>
            ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
            )}
            {change}
          </span>
          <span className="text-slate-500 ml-2">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
