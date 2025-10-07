import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Bell, Download } from 'lucide-react';
import { useAppDataStore } from '@/store/appDataStore';
import { Staff } from '@/types';
import { track } from '@/analytics/track';

import { ModulePage } from '@/layouts/ModulePage';
import FilterBar from '@/ui/FilterBar';
import Table from '@/ui/Table';
import Button from '@/ui/Button';

interface TeacherProgress extends Staff {
  progress: number;
  lastUpdate: string;
  progressStatus: 'al-dia' | 'en-riesgo' | 'atrasado';
}

const AvanceDocentesPage: React.FC = () => {
  const staff = useAppDataStore(state => state.staff);
  const [searchQuery, setSearchQuery] = useState('');

  const teacherProgressData: TeacherProgress[] = useMemo(() => {
    return staff.filter(s => s.category === 'Docente').map((user) => {
      const progress = user.notesProgress || Math.floor(Math.random() * 101);
      let progressStatus: 'al-dia' | 'en-riesgo' | 'atrasado';
      if (progress >= 90) progressStatus = 'al-dia';
      else if (progress >= 60) progressStatus = 'en-riesgo';
      else progressStatus = 'atrasado';
      
      const lastUpdate = user.lastLogin ? new Date(user.lastLogin) : new Date();
      return { ...user, progress, progressStatus, lastUpdate: lastUpdate.toLocaleDateString('es-PE') };
    }).sort((a,b) => a.progress - b.progress);
  }, [staff]);

  const filteredData = useMemo(() =>
    teacherProgressData.filter(teacher =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery, teacherProgressData]);

  const getStatusInfo = (status: TeacherProgress['progressStatus']) => {
    switch (status) {
      case 'al-dia': return { text: 'Al día', color: 'bg-emerald-100 text-emerald-800', barColor: 'bg-emerald-500' };
      case 'en-riesgo': return { text: 'En riesgo', color: 'bg-amber-100 text-amber-800', barColor: 'bg-amber-500' };
      case 'atrasado': return { text: 'Atrasado', color: 'bg-rose-100 text-rose-800', barColor: 'bg-rose-500' };
    }
  };
  
  const columns = [
      { key: 'name', header: 'Docente', sortable: true, render: (t: TeacherProgress) => (
            <div className="flex items-center gap-3">
                <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100 capitalize">{t.name.toLowerCase()}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.area}</p>
                </div>
            </div>
      )},
      { key: 'progress', header: 'Progreso', sortable: true, render: (t: TeacherProgress) => {
          const statusInfo = getStatusInfo(t.progressStatus);
          return (
              <div className="w-full">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className={`${statusInfo.barColor} h-2.5 rounded-full`} style={{ width: `${t.progress}%` }}></div>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.progress}%</span>
              </div>
          )
      }},
      { key: 'progressStatus', header: 'Estado', sortable: true, render: (t: TeacherProgress) => {
          const statusInfo = getStatusInfo(t.progressStatus);
          return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
      }},
      { key: 'lastUpdate', header: 'Última Actualización', sortable: true, render: (t: TeacherProgress) => t.lastUpdate},
      { key: 'actions', header: 'Acciones', render: (t: TeacherProgress) => <Button variant="outlined" icon={Bell} aria-label="Enviar Recordatorio">Recordar</Button>}
  ];

  return (
    <ModulePage 
        title="Avance de Carga por Docente"
        description="Monitoree el porcentaje de avance, identifique cuellos de botella y envíe recordatorios."
        icon={UserCheck}
        actionsRight={<Button variant="tonal" aria-label="Exportar Vista" icon={Download}>Exportar Vista</Button>}
        filters={
            <FilterBar
                activeFilters={[]}
                onRemoveFilter={() => {}}
                onClearAll={() => {}}
            />
        }
        content={
            <Table
                columns={columns}
                rows={filteredData}
                getRowId={(t) => t.dni}
                sortConfig={null}
                onSort={() => {}}
                selectable={false}
                selectedRowIds={new Set()}
                onSelect={() => {}}
                onSelectAll={() => {}}
            />
        }
    />
  );
};

export default AvanceDocentesPage;