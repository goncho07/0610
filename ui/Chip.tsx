
import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  color?: 'indigo' | 'amber' | 'rose' | 'gray' | 'sky' | 'slate';
}

const Chip: React.FC<ChipProps> = ({ children, color = 'gray' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
    gray: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    sky: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
    slate: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-sm font-semibold rounded-full ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
};

export default Chip;
