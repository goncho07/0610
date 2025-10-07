
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        <AlertCircle size={48} className="mx-auto text-rose-500" />
        <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{message}</p>
        <div className="mt-6">
            <Button variant="filled" aria-label="Reintentar" onClick={onRetry} icon={RefreshCw}>Reintentar</Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
