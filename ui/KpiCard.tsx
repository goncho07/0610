import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<LucideProps>;
  variant?: 'simple' | 'gradient';
  color?: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, variant = 'simple', color, className = '', active = false, onClick }) => {
  
  const simpleContent = (
    <>
      <div className="flex items-start justify-between">
        <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-xl">
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <h3 className="font-semibold text-base text-slate-500 dark:text-slate-400 mt-1">{title}</h3>
      </div>
    </>
  );

  const gradientContent = (
    <>
      <div className="flex items-center justify-between text-white/80">
          <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="flex items-end justify-between mt-2">
          <p className="text-5xl font-extrabold text-white">{value}</p>
          <Icon size={48} className="text-white/30" />
      </div>
    </>
  );

  if (onClick) {
    const activeClasses = active ? 'ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-indigo-500 dark:ring-indigo-400 shadow-lg' : 'hover:shadow-md hover:-translate-y-0.5';
    return (
        <button onClick={onClick} className={`w-full text-left p-4 bg-white dark:bg-slate-800 rounded-2xl transition-all duration-200 border border-slate-200/80 dark:border-slate-700/80 ${activeClasses} ${className}`}>
            {simpleContent}
        </button>
    );
  }
  
  if (variant === 'gradient' && color) {
       return (
        <div className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-br ${color} ${className}`}>
            {gradientContent}
        </div>
       );
  }

  return (
    <div className={`p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 ${className}`}>
      {simpleContent}
    </div>
  );
};

export default KpiCard;
