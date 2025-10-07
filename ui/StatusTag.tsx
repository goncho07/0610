import React from 'react';
import { UserStatus } from '@/types';
import { CheckCircle, PowerOff, AlertTriangle, UserMinus, Clock } from 'lucide-react';

interface StatusTagProps {
  status: UserStatus;
}

const statusConfig: Record<UserStatus, { label: string; icon: React.ElementType; colorClasses: string }> = {
  Activo: { label: 'Activo', icon: CheckCircle, colorClasses: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' },
  Inactivo: { label: 'Inactivo', icon: PowerOff, colorClasses: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' },
  Suspendido: { label: 'Suspendido', icon: AlertTriangle, colorClasses: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' },
  Egresado: { label: 'Egresado', icon: UserMinus, colorClasses: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300' },
  Pendiente: { label: 'Pendiente', icon: Clock, colorClasses: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300' },
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const { label, icon: Icon, colorClasses } = statusConfig[status] || statusConfig.Inactivo;

  return (
    <div
      role="status"
      aria-label={`Estado: ${label}`}
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${colorClasses}`}
    >
      <Icon size={12} />
      {label}
    </div>
  );
};

export default StatusTag;