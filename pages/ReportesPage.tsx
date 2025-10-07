import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, Download, Printer, BarChart2, Users, BookOpen } from 'lucide-react';
import { track } from '@/analytics/track';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import KpiCard from '@/ui/KpiCard';
import DynamicChart from '@/ui/DynamicChart';
import Button from '@/ui/Button';

type ReportTab = 'asistencia' | 'matricula' | 'academico';

const MOCK_DATA = {
  asistencia: { overallPercentage: 92, trend: [88, 91, 93, 90, 95, 94, 92] },
  matricula: { totalStudents: 1681, byGrade: [{ name: 'Inicial', value: 252 }, { name: 'Primaria', value: 756 }, { name: 'Secundaria', value: 673 }] },
  academico: { overallAverage: 15.8, byCourse: [{ name: 'Matemática', value: 14.5 }, { name: 'Comunicación', value: 16.2 }] },
};
const attendanceTrendData = MOCK_DATA.asistencia.trend.map((val, i) => ({ name: ['L', 'M', 'X', 'J', 'V', 'S', 'D'][i], Asistencia: val }));

const ReportesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('asistencia');

  const tabs: { id: ReportTab; label: string; icon: React.ElementType }[] = [
    { id: 'asistencia', label: 'Asistencia', icon: BarChart2 },
    { id: 'matricula', label: 'Matrícula', icon: Users },
    { id: 'academico', label: 'Académico', icon: BookOpen },
  ];

  return (
    <ModulePage
      title="Generador de Reportes"
      description="Visualice datos consolidados y genere reportes para UGEL y uso interno."
      icon={FileSpreadsheet}
      actionsRight={
          <>
            <Button variant="tonal" aria-label="Imprimir Reporte" icon={Printer}>Imprimir</Button>
            <Button variant="filled" aria-label="Descargar Reporte" icon={Download} onClick={() => track('report_downloaded', { reportType: activeTab })}>Descargar</Button>
          </>
      }
      filters={<></>}
      content={
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <nav className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                  <tab.icon size={16}/>{tab.label}
                </button>
              ))}
            </nav>
            <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'asistencia' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <KpiCard title="Asistencia General" value={`${MOCK_DATA.asistencia.overallPercentage}%`} icon={BarChart2} />
                  <DynamicChart title="Tendencia Semanal" data={attendanceTrendData} dataKeys={['Asistencia']} />
                </div>
              )}
               {activeTab === 'matricula' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <KpiCard title="Total Matriculados" value={MOCK_DATA.matricula.totalStudents} icon={Users} />
                   <DynamicChart title="Distribución por Nivel" data={MOCK_DATA.matricula.byGrade} dataKeys={['value']} nameKey="name" />
                </div>
              )}
               {activeTab === 'academico' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <KpiCard title="Promedio General" value={MOCK_DATA.academico.overallAverage} icon={BookOpen} />
                  <DynamicChart title="Promedio por Curso" data={MOCK_DATA.academico.byCourse} dataKeys={['value']} nameKey="name" />
                </div>
              )}
            </motion.div>
            </AnimatePresence>
        </div>
      }
    />
  );
};

export default ReportesPage;