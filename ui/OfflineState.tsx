import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineStateProps {
  message?: string;
}

const OfflineState: React.FC<OfflineStateProps> = ({ message }) => {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        <WifiOff size={48} className="mx-auto text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100">Sin Conexión a Internet</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {message || 'No se pudo cargar el contenido. Por favor, revise su conexión a internet.'}
        </p>
      </div>
    </div>
  );
};

export default OfflineState;
