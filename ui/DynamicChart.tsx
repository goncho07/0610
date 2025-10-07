import React from 'react';
import Card from './Card';

interface DynamicChartProps {
  title: string;
  data: any[];
  dataKeys: string[];
  nameKey?: string;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ title, data, dataKeys, nameKey }) => {
  return (
    <Card className="h-full">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>
      <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">
          [Visualización de Gráfico]
        </p>
      </div>
      <ul className="text-xs mt-2 text-slate-400 space-y-1">
        {data.slice(0, 3).map((item, index) => (
          <li key={index}>
            <span className="font-semibold">{nameKey ? `${item[nameKey]}: ` : ''}</span>
            <span>{dataKeys.map(key => item[key]).join(', ')}</span>
          </li>
        ))}
         {data.length > 3 && <li>...y {data.length-3} más.</li>}
      </ul>
    </Card>
  );
};

export default DynamicChart;
