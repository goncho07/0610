import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Clock, XCircle, MoreHorizontal, BarChart2,
  AlertTriangle, Info as InfoIcon, Download, File, X, Loader2
} from 'lucide-react';
import Button from '@/ui/Button';
import BarChart from '@/ui/BarChart';
import { useAppDataStore } from '@/store/appDataStore';
import Skeleton from '@/ui/Skeleton';
import Drawer from '@/ui/Drawer';
import { PopulationFocus, TimeRange, Level } from '@/types';
import { ModuleHeader } from '@/components/asistencia/ModuleHeader';
import { ControlBar } from '@/components/asistencia/ControlBar';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};


const KpiSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-4 w-40" />
    </div>
);

const AttendanceKpiCard: React.FC<{ title: string; value: string | number; change: number; icon: React.ElementType; color: string; }> = ({ title, value, change, icon: Icon, color }) => {
  const isNegative = change < 0;
  const changeColor = isNegative ? 'text-emerald-500' : 'text-rose-500';
  const changeSymbol = isNegative ? '↘' : '↗';
  
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Icon className={color} size={20} />
          <h3 className="font-semibold text-slate-600 dark:text-slate-300">{title}</h3>
        </div>
        <button className="text-slate-500 hover:text-slate-800 dark:hover:text-white"><MoreHorizontal size={20} /></button>
      </div>
      <p className="text-5xl font-bold mt-3 text-slate-800 dark:text-slate-100">{value}</p>
      <p className={`text-sm font-semibold mt-1 flex items-center gap-1 ${changeColor}`}>
        {changeSymbol} {Math.abs(change)} vs periodo anterior
      </p>
    </div>
  );
};


const ReportModal: React.FC<{ isOpen: boolean, onClose: () => void, filters: any }> = ({ isOpen, onClose, filters }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            onClose();
        }, 1500);
    };
    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg" onClick={e=>e.stopPropagation()}>
                    <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center"><h2 className="text-lg font-bold">Generar Reporte</h2><button onClick={onClose}><X size={20}/></button></header>
                    <main className="p-6 space-y-4">
                        <p>Se generará un reporte con los siguientes filtros:</p>
                        <ul className="text-sm list-disc list-inside bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                            <li>Población: <span className="font-semibold capitalize">{filters.populationFocus}</span></li>
                            <li>Periodo: <span className="font-semibold capitalize">{filters.timeRange}</span></li>
                        </ul>
                        <div>
                            <label className="text-sm font-semibold">Formato</label>
                            <select className="w-full mt-1 p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"><option>PDF</option><option>XLSX</option></select>
                        </div>
                    </main>
                    <footer className="p-4 flex justify-end gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
                        <Button variant="tonal" onClick={onClose} aria-label="Cancelar">Cancelar</Button>
                        <Button variant="filled" onClick={handleGenerate} disabled={isGenerating} icon={isGenerating ? () => <Loader2 className="animate-spin" /> : Download} aria-label="Generar Reporte">{isGenerating ? 'Generando...' : 'Generar'}</Button>
                    </footer>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

const AlertDetailDrawer: React.FC<{ isOpen: boolean, onClose: () => void, alert: any }> = ({ isOpen, onClose, alert }) => (
    <Drawer isOpen={isOpen} onClose={onClose} title={alert?.title || 'Detalle de Alerta'}>
        {alert && (
            <div className="space-y-4">
                <p>{alert.description}</p>
                <p className="text-sm text-slate-500"><strong>Sección:</strong> 5to Grado B</p>
                <h4 className="font-semibold pt-4 border-t border-slate-200 dark:border-slate-700">Estudiantes Involucrados:</h4>
                <ul className="text-sm list-disc list-inside">
                    <li>Mendoza Castillo, Luis Fernando</li>
                    <li>Quispe Rojas, Ana Sofía</li>
                </ul>
                <div className="pt-4 flex gap-2">
                    <Button variant="tonal" aria-label="Contactar / Notificar">Contactar / Notificar</Button>
                    <Button variant="filled" aria-label="Registrar Seguimiento">Registrar Seguimiento</Button>
                </div>
            </div>
        )}
    </Drawer>
);


const AsistenciaPage: React.FC = () => {
  const [filters, setFilters] = useState({
      populationFocus: 'Estudiantes' as PopulationFocus,
      timeRange: 'Semana' as TimeRange,
      level: 'Todos' as Level,
      grade: 'all',
      section: 'all',
  });
  
  const { 
    attendanceData: data, 
    isAttendanceLoading: isLoading, 
    fetchAttendanceData,
    gradesAndSections 
  } = useAppDataStore();

  useEffect(() => {
    fetchAttendanceData({
        ...filters,
        populationFocus: filters.populationFocus.toLowerCase(),
        timeRange: filters.timeRange.toLowerCase(),
        level: filters.level.toLowerCase(),
    });
  }, [filters, fetchAttendanceData]);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [alertDetail, setAlertDetail] = useState<{isOpen: boolean, alert: any}>({isOpen: false, alert: null});
  
  const setPopulationFocus = (p: PopulationFocus) => setFilters(f => ({ ...f, populationFocus: p }));
  const setTimeRange = (t: TimeRange) => setFilters(f => ({ ...f, timeRange: t }));
  const setLevel = (l: Level) => setFilters(f => ({ ...f, level: l, grade: 'all', section: 'all' }));
  const setGrade = (g: string) => setFilters(f => ({ ...f, grade: g, section: 'all' }));
  const setSection = (s: string) => setFilters(f => ({ ...f, section: s }));


  return (
    <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      <motion.div variants={itemVariants}>
        <ModuleHeader onGenerateReport={() => setIsReportModalOpen(true)} />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <ControlBar
          populationFocus={filters.populationFocus}
          setPopulationFocus={setPopulationFocus}
          timeRange={filters.timeRange}
          setTimeRange={setTimeRange}
          level={filters.level}
          setLevel={setLevel}
          grade={filters.grade}
          setGrade={setGrade}
          section={filters.section}
          setSection={setSection}
          gradesAndSections={gradesAndSections}
        />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {isLoading ? Array.from({length: 3}).map((_, i) => <KpiSkeleton key={i} />) : data.kpis.map((kpi, index) => (
             <AttendanceKpiCard key={index} {...kpi} />
        ))}
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={itemVariants}>
        <div 
            className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col min-h-[400px]">
          <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">Tendencia de Asistencia: Semana del 29 de Septiembre al 3 de Octubre, 2025</h2>
          <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 rounded-full">Asistencia (%)</span>
              <span className="px-3 py-1 text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 rounded-full">Tardanzas (%)</span>
              <span className="px-3 py-1 text-sm font-semibold bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 rounded-full">Faltas (%)</span>
          </div>
          <div className="flex-grow mt-4">
             {isLoading ? <Skeleton className="w-full h-full min-h-[250px]" /> : <BarChart data={data.chartData} />}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-xl mb-4 text-slate-800 dark:text-slate-100">Alertas de Asistencia</h2>
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
            ) : data.alerts.length > 0 ? (
                <div className="space-y-4">
                {data.alerts.map((alert, i) => {
                  const colors = {
                    critical: 'border-rose-200 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300',
                    warning: 'border-amber-200 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300',
                    info: 'border-sky-200 dark:border-sky-500/50 bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-300',
                  };
                  const Icon = alert.icon;
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${colors[alert.type as keyof typeof colors]}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          <h4 className="font-bold">{alert.title}</h4>
                        </div>
                         <button className="text-slate-500 hover:text-slate-800 dark:hover:text-white"><MoreHorizontal size={20} /></button>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{alert.description}</p>
                      <div className="flex justify-between items-end mt-3">
                        <p className="text-xs text-slate-400 dark:text-slate-500">{alert.time}</p>
                        <button onClick={() => setAlertDetail({isOpen: true, alert: alert})} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Ver detalle</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
                <div className="text-center py-10">
                    <CheckCircle size={40} className="mx-auto text-emerald-500" />
                    <h4 className="font-semibold mt-2">Todo en orden</h4>
                    <p className="text-sm text-slate-500">No hay alertas de asistencia activas.</p>
                </div>
            )}
        </motion.div>
      </motion.div>
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} filters={filters} />
      <AlertDetailDrawer isOpen={alertDetail.isOpen} onClose={() => setAlertDetail({isOpen: false, alert: null})} alert={alertDetail.alert} />
    </motion.div>
  );
};

export default AsistenciaPage;