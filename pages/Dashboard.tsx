

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, MessageSquare, FileSpreadsheet, QrCode, TrendingUp, AlertTriangle, FileText, Calendar, Expand, ChevronLeft, ChevronRight, X, Plus, Circle, CircleDot, CheckCircle2, Building, Flag } from 'lucide-react';
import KpiCard from '@/ui/KpiCard';
import { useAppDataStore } from '@/store/appDataStore';
import { format, isFuture, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, endOfWeek } from 'date-fns';
import parseISO from 'date-fns/parseISO';
import startOfToday from 'date-fns/startOfToday';
import startOfWeek from 'date-fns/startOfWeek';
import subMonths from 'date-fns/subMonths';
import es from 'date-fns/locale/es';
import FullCalendar from '@/ui/Calendar';
import { CalendarEvent } from '@/types';
import Button from '@/ui/Button';

const kpiData = [
  { title: 'Matrícula Activa', value: 1681, icon: Users, color: 'from-sky-600 to-blue-800' },
  { title: 'Asistencia Hoy', value: '94%', icon: TrendingUp, color: 'from-emerald-600 to-teal-800' },
  { title: 'Incidencias Diarias', value: 3, icon: AlertTriangle, color: 'from-rose-600 to-red-800' },
  { title: 'Actas Pendientes', value: 4, icon: FileText, color: 'from-amber-600 to-orange-800' },
];

const quickActions = [
  { text: 'Tomar Asistencia QR', icon: QrCode, path: '/asistencia/scan' },
  { text: 'Revisar Carga de Notas', icon: BookOpen, path: '/academico/avance-docentes' },
  { text: 'Enviar Comunicado', icon: MessageSquare, path: '/comunicaciones' },
  { text: 'Generar Reporte UGEL', icon: FileSpreadsheet, path: '/reportes' },
];

const taskItems = [
  { text: 'Aprobar acta de 5to Grado "A"', status: 'Pendiente', priority: 'high' },
  { text: 'Revisar solicitud de traslado de L. Mendoza', status: 'Pendiente', priority: 'medium' },
  { text: 'Preparar informe de asistencia mensual', status: 'En progreso', priority: 'medium' },
  { text: 'Planificar reunión de personal para el 05/08', status: 'Completo', priority: 'low' },
];

const eventCategoryColors: Record<string, string> = {
    Examen: 'bg-amber-500',
    Feriado: 'bg-rose-500',
    Reunión: 'bg-indigo-500',
    Actividad: 'bg-emerald-500',
    UGEL: 'bg-violet-500',
    Cívico: 'bg-sky-500',
    Gestión: 'bg-slate-500',
};

const fullEventCategoryColors: Record<string, string> = {
    Examen: 'border-amber-500',
    Feriado: 'border-rose-500',
    Reunión: 'border-indigo-500',
    Actividad: 'border-emerald-500',
    UGEL: 'border-violet-500',
    Cívico: 'border-sky-500',
    Gestión: 'border-slate-500',
};

const CalendarModal: React.FC<{ isOpen: boolean, onClose: () => void, events: CalendarEvent[] }> = ({ isOpen, onClose, events: initialEvents }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const eventRefs = useRef(new Map<string, HTMLDivElement | null>());

    const { institutionalEvents, civicEvents } = useMemo(() => {
        const institutional: CalendarEvent[] = [];
        const civic: CalendarEvent[] = [];
        const monthEvents = events
            .filter(e => isSameMonth(parseISO(e.date), currentDate))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        monthEvents.forEach(event => {
            if (['Examen', 'Reunión', 'Actividad', 'Gestión', 'UGEL'].includes(event.category)) {
                institutional.push(event);
            } else {
                civic.push(event);
            }
        });
        return { institutionalEvents: institutional, civicEvents: civic };
    }, [events, currentDate]);

    useEffect(() => {
        if (!isOpen) return;

        const allMonthEvents = [...institutionalEvents, ...civicEvents];
        const firstSelectedEvent = allMonthEvents.find(e => isSameDay(parseISO(e.date), selectedDate));
        
        if (firstSelectedEvent) {
            const node = eventRefs.current.get(firstSelectedEvent.id);
            if (node) {
                node.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [selectedDate, isOpen, institutionalEvents, civicEvents]);

    const EventListSection: React.FC<{title: string, icon: React.ElementType, events: CalendarEvent[]}> = ({title, icon: Icon, events}) => (
        <div className="mb-8">
            <h4 className="text-xl font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3 mb-4">
                <Icon size={24} /> {title}
            </h4>
            <div className="space-y-3">
                {events.map(event => {
                    const isSelected = isSameDay(parseISO(event.date), selectedDate);
                    return (
                        <div key={event.id}
                            ref={el => { if (el) eventRefs.current.set(event.id, el); else eventRefs.current.delete(event.id); }}
                            className={`p-4 border-l-8 rounded-r-lg transition-all duration-300 ${fullEventCategoryColors[event.category] || 'border-slate-400'} ${isSelected ? 'bg-indigo-100 dark:bg-indigo-900/60 ring-2 ring-indigo-500 dark:ring-indigo-400' : 'bg-slate-50 dark:bg-slate-700/50'}`}
                        >
                            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">
                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-base capitalize">{format(parseISO(event.date), 'dd - EEEE', { locale: es })}:</span> {event.title}
                            </p>
                            {event.description && <p className="text-base text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
                         <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3"><Calendar size={28}/> Calendario Institucional Completo</h2>
                         <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><X size={20} /></button>
                    </header>
                    <div className="flex-grow flex p-4 gap-4 overflow-hidden">
                        <div className="w-2/3 flex flex-col">
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-t-xl border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                   <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeft size={20} /></button>
                                   <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRight size={20} /></button>
                                   <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 ml-2 capitalize">{format(currentDate, 'MMMM yyyy', { locale: es })}</h3>
                                </div>
                                <Button variant="tonal" aria-label="Ir al día de hoy" onClick={() => setCurrentDate(new Date())}>Hoy</Button>
                            </div>
                            <div className="flex-grow overflow-y-auto">
                               <FullCalendar currentDate={currentDate} selectedDate={selectedDate} onSelectDate={setSelectedDate} events={events} />
                            </div>
                        </div>
                        <div className="w-1/3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col">
                            <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-100 shrink-0 mb-4 capitalize">
                                Eventos de {format(currentDate, 'MMMM', { locale: es })}
                            </h3>
                            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                {(institutionalEvents.length === 0 && civicEvents.length === 0) ? (
                                    <div className="h-full flex items-center justify-center text-center"><p className="text-base text-slate-500 dark:text-slate-400">No hay eventos programados para este mes.</p></div>
                                ) : (
                                    <>
                                        {institutionalEvents.length > 0 && <EventListSection title="Eventos Institucionales" icon={Building} events={institutionalEvents} />}
                                        {civicEvents.length > 0 && <EventListSection title="Calendario Cívico y Feriados" icon={Flag} events={civicEvents} />}
                                    </>
                                )}
                            </div>
                            <Button variant="filled" aria-label="Añadir nuevo evento al calendario" icon={Plus} className="w-full !justify-center mt-4 shrink-0 !text-lg !py-3">Añadir Evento</Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};

const DashboardCalendar = () => {
    const navigate = useNavigate();
    const mockEvents = useAppDataStore(state => state.events);
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1));
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const eventRefs = useRef(new Map<string, HTMLLIElement | null>());

    const monthStart = startOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: startOfWeek(monthStart, { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }) });

    const monthEvents = useMemo(() => {
        return mockEvents
            .filter(e => isSameMonth(parseISO(e.date), currentMonth))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [currentMonth, mockEvents]);
    
    useEffect(() => {
        const firstSelectedEvent = monthEvents.find(e => isSameDay(parseISO(e.date), selectedDate));
        if (firstSelectedEvent) {
            const node = eventRefs.current.get(firstSelectedEvent.id);
            if (node) {
                node.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [selectedDate, monthEvents]);

    const eventsByDay = useMemo(() => {
        const eventMap = new Map<string, CalendarEvent[]>();
        mockEvents.forEach(event => {
            const dayKey = format(parseISO(event.date), 'yyyy-MM-dd');
            if (!eventMap.has(dayKey)) {
                eventMap.set(dayKey, []);
            }
            eventMap.get(dayKey)?.push(event);
        });
        return eventMap;
    }, [mockEvents]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 p-4 flex flex-col h-full">
            <header className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h2>
                <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeft size={18} /></button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRight size={18} /></button>
                    <button onClick={() => setIsModalOpen(true)} title="Expandir calendario" className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><Expand size={16} /></button>
                </div>
            </header>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 pb-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {days.map(day => {
                    const isCurrent = isSameMonth(day, currentMonth);
                    const isSelected = isSameDay(day, selectedDate);
                    const isTodaysDate = isToday(day);
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const dayEvents = eventsByDay.get(dayKey) || [];
                    
                    return (
                        <button key={day.toString()} onClick={() => setSelectedDate(day)} className={`relative flex justify-center items-center h-9 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-800 focus-visible:ring-indigo-500 ${isCurrent ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'} ${!isSelected && isCurrent ? 'hover:bg-slate-100 dark:hover:bg-slate-700/50' : ''}`}>
                            <span className={`flex items-center justify-center h-7 w-7 rounded-full text-sm ${isSelected ? 'bg-indigo-600 text-white font-bold' : ''} ${isTodaysDate && !isSelected ? 'text-indigo-600 font-bold' : ''}`}>{format(day, 'd')}</span>
                            {dayEvents.length > 0 && <div className="absolute bottom-1 h-1 w-1 rounded-full bg-rose-500"></div>}
                        </button>
                    )
                })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex-grow">
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-200 capitalize">Eventos de {format(currentMonth, 'MMMM', {locale: es})}</h3>
                <ul className="space-y-2 mt-2 max-h-40 overflow-y-auto pr-2">
                   {monthEvents.length > 0 ? monthEvents.map(event => {
                       const isSelected = isSameDay(parseISO(event.date), selectedDate);
                       return (
                           <li key={event.id}
                           ref={el => { if (el) eventRefs.current.set(event.id, el); else eventRefs.current.delete(event.id); }} className={`flex items-start gap-2 text-sm p-2 rounded-md transition-colors ${isSelected ? 'bg-indigo-100 dark:bg-indigo-500/20' : ''}`}>
                               <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${eventCategoryColors[event.category] || 'bg-slate-400'}`}></div>
                               <div className="flex-1">
                                   <span className={`font-medium text-slate-800 dark:text-slate-100 ${isSelected ? 'text-indigo-700 dark:text-indigo-300 font-bold' : ''}`}>{event.title}</span>
                                   <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{format(parseISO(event.date), 'EEEE d', {locale: es})}</p>
                               </div>
                           </li>
                       );
                   }) : <p className="text-sm text-slate-500 dark:text-slate-400 pt-4 text-center">No hay eventos este mes.</p>}
                </ul>
            </div>
             <CalendarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} events={mockEvents} />
        </div>
    );
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2 space-y-6">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Panel de Control del Director</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Bienvenido, aquí tiene un resumen del estado de la institución.</p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {kpiData.map((kpi, index) => (
            <motion.div key={index} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <KpiCard
                variant="gradient"
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                color={kpi.color}
                className="lg:col-span-1"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80">
                <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-4">Acciones Frecuentes</h2>
                <div className="grid grid-cols-2 gap-4">
                {quickActions.map(action => (
                    <button key={action.path} onClick={() => navigate(action.path)} className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group">
                        <action.icon size={28} className="mb-2"/>
                        <span className="font-semibold text-sm text-center">{action.text}</span>
                    </button>
                ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/80">
                 <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-4">Lista de Tareas</h2>
                 <ul className="space-y-3">
                     {taskItems.map(task => (
                        <li key={task.text} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                            <div className="flex items-center gap-3">
                                {task.status === 'Completo' && <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />}
                                {task.status === 'En progreso' && <CircleDot size={24} className="text-sky-500 animate-pulse shrink-0" />}
                                {task.status === 'Pendiente' && <Circle size={24} className="text-slate-400 dark:text-slate-500 shrink-0" />}
                                <span className={`text-sm font-medium ${task.status === 'Completo' ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{task.text}</span>
                            </div>
                             <div className={`w-2.5 h-2.5 rounded-full ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                        </li>
                     ))}
                 </ul>
            </div>
        </motion.div>
      </main>
      <aside className="lg:col-span-1">
        <DashboardCalendar />
      </aside>
    </div>
  );
};

export default Dashboard;