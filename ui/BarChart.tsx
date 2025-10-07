import React from 'react';

interface BarChartData {
    name: string;
    asistencia: number;
    tardanzas: number;
    faltas: number;
}

interface BarChartProps {
  data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxPrimary = 100;
  const minPrimary = 60;
  const rangePrimary = maxPrimary - minPrimary;

  const maxSecondary = 15;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow relative pl-8 pr-10">
        {/* Y-Axes Labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 font-semibold -translate-y-2">
          <span>100%</span>
          <span>90%</span>
          <span>80%</span>
          <span>70%</span>
          <span>60%</span>
        </div>
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 font-semibold -translate-y-2">
          <span>15%</span>
          <span>12%</span>
          <span>8%</span>
          <span>4%</span>
          <span>0%</span>
        </div>
        
        {/* Chart Bars Area */}
        <div className="h-full flex justify-around items-end gap-2 border-l border-b border-slate-700">
          {data.map(day => {
            const asistenciaHeight = Math.max(0, ((day.asistencia - minPrimary) / rangePrimary) * 100);
            const tardanzasHeight = Math.max(0, (day.tardanzas / maxSecondary) * 100);
            const faltasHeight = Math.max(0, (day.faltas / maxSecondary) * 100);
            
            return (
              <div key={day.name} className="h-full w-full flex items-end justify-center gap-1.5" title={day.name}>
                <div style={{ height: `${asistenciaHeight}%` }} className="w-1/3 bg-emerald-500 rounded-t-sm hover:opacity-80 transition-opacity" title={`Asistencia: ${day.asistencia}%`}></div>
                <div style={{ height: `${tardanzasHeight}%` }} className="w-1/3 bg-amber-500 rounded-t-sm hover:opacity-80 transition-opacity" title={`Tardanzas: ${day.tardanzas}%`}></div>
                <div style={{ height: `${faltasHeight}%` }} className="w-1/3 bg-rose-500 rounded-t-sm hover:opacity-80 transition-opacity" title={`Faltas: ${day.faltas}%`}></div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* X-Axis Labels */}
      <div className="h-6 flex justify-around pl-8 pr-10 pt-2">
        {data.map(day => (
          <span key={day.name} className="flex-1 text-center text-sm text-slate-400 font-semibold">{day.name}</span>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
