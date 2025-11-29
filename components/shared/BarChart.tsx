

import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="flex-grow flex items-end justify-around space-x-4">
        {data.map(item => (
          <div key={item.label} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-emerald-400 hover:bg-emerald-500 rounded-t-md"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.label}: ${item.value}`}
            >
            </div>
            <span className="text-xs text-gray-500 mt-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
