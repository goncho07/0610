
import React from 'react';
import { format, isSameMonth, isToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import parseISO from 'date-fns/parseISO';
import es from 'date-fns/locale/es';
import { CalendarEvent } from '@/types';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: CalendarEvent[];
}

const eventCategoryColors: Record<string, { bg: string, text: string, dot: string }> = {
    Examen: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-800 dark:text-amber-300', dot: 'bg-amber-500' },
    Feriado: { bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-800 dark:text-rose-300', dot: 'bg-rose-500' },
    Reunión: { bg: 'bg-indigo-100 dark:bg-indigo-500/20', text: 'text-indigo-800 dark:text-indigo-300', dot: 'bg-indigo-500' },
    Actividad: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-800 dark:text-emerald-300', dot: 'bg-emerald-500' },
    UGEL: { bg: 'bg-violet-100 dark:bg-violet-500/20', text: 'text-violet-800 dark:text-violet-300', dot: 'bg-violet-500' },
    Cívico: { bg: 'bg-sky-100 dark:bg-sky-500/20', text: 'text-sky-800 dark:text-sky-300', dot: 'bg-sky-500' },
    Gestión: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-800 dark:text-slate-300', dot: 'bg-slate-500' },
};

const Calendar: React.FC<CalendarProps> = ({ currentDate, selectedDate, onSelectDate, events }) => {
    const monthStart = startOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startOfWeek(monthStart, { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }) });

    const eventsByDay = React.useMemo(() => {
        const eventMap = new Map<string, CalendarEvent[]>();
        events.forEach(event => {
            const dayKey = format(parseISO(event.date), 'yyyy-MM-dd');
            if (!eventMap.has(dayKey)) {
                eventMap.set(dayKey, []);
            }
            eventMap.get(dayKey)?.push(event);
        });
        return eventMap;
    }, [events]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-b-2xl shadow-sm border-x border-b border-slate-200/80 dark:border-slate-700/80 flex-grow flex flex-col min-h-[700px]">
            <div className="grid grid-cols-7 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => 
                    <div key={day} className="py-3 px-1">{day}</div>
                )}
            </div>
            <div className="grid grid-cols-7 grid-rows-6 flex-grow">
                {days.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isSelected = isSameDay(day, selectedDate);
                    const isTodaysDate = isToday(day);
                    const dayKey = format(day, 'yyyy-MM-dd');
                    const dayEvents = eventsByDay.get(dayKey) || [];

                    return (
                        <div 
                            key={day.toString()} 
                            className={`relative flex flex-col border-b border-r border-slate-100 dark:border-slate-700/50 ${isCurrentMonth ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/80 dark:bg-slate-800/50'}`}
                        >
                            <button 
                                onClick={() => onSelectDate(day)} 
                                className={`absolute inset-0 w-full h-full text-left p-2 transition-colors focus:outline-none focus:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${isCurrentMonth ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''}`}
                            >
                                <span className={`flex items-center justify-center h-7 w-7 text-sm rounded-full ${isSelected ? 'bg-indigo-600 text-white font-bold' : ''} ${isTodaysDate && !isSelected ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''} ${!isCurrentMonth ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {format(day, 'd')}
                                </span>
                            </button>
                            <div className="relative mt-10 w-full space-y-1 text-left px-1 pb-1 overflow-y-auto">
                                {dayEvents.slice(0, 3).map(event => {
                                    const colors = eventCategoryColors[event.category] || eventCategoryColors.Gestión;
                                    return (
                                        <div key={event.id} title={event.title} className={`flex items-center gap-1.5 text-xs font-semibold px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></div>
                                            <span className="truncate">{event.title}</span>
                                        </div>
                                    );
                                })}
                                {dayEvents.length > 3 && (
                                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1.5">+ {dayEvents.length - 3} más</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;