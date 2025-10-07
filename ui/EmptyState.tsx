import React from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  actions?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, actions }) => {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        <Search size={48} className="mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{message}</p>
        {actions && <div className="mt-6 flex items-center justify-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
