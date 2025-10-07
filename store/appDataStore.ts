import { create } from 'zustand';
import { Student, Staff, ParentTutor, GenericUser, ActivityLog, CalendarEvent } from '@/types';
// Import data sources
import { students as initialStudents } from '@/data/students';
import { staff as initialStaff } from '@/data/users';
import { parents as initialParents } from '@/data/parents';
import { activityLogs as initialActivityLogs } from '@/data/activityLogs';
import { mockEvents as initialEvents } from '@/data/events';
import { gradesAndSections } from '@/data/grades';
import { CheckCircle, Clock, XCircle, AlertTriangle, Info } from 'lucide-react';

// Data generation for attendance, moved from the old hook
const generateRandomData = (filters: any, totalStudents: number, totalTeachers: number) => {
    const isStudents = filters.populationFocus === 'estudiantes';
    const basePopulation = isStudents ? totalStudents : totalTeachers;

    const asistencias = Math.floor(basePopulation * (0.85 + Math.random() * 0.14)); // 85% - 99%
    const tardanzas = Math.floor(basePopulation * (0.01 + Math.random() * 0.08)); // 1% - 9%
    const faltas = Math.max(0, basePopulation - asistencias - tardanzas);
    
    const kpis = [
        { title: 'Asistencias', value: asistencias, change: Math.floor(Math.random() * 21) - 10, icon: CheckCircle, color: 'text-emerald-500' },
        { title: 'Tardanzas', value: tardanzas, change: Math.floor(Math.random() * 7) - 3, icon: Clock, color: 'text-amber-500' },
        { title: 'Faltas Injustificadas', value: faltas, change: Math.floor(Math.random() * 5) - 2, icon: XCircle, color: 'text-rose-500' },
    ];
    
    const chartData = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(name => {
        const asistencia = 90 + Math.random() * 9;
        const tardanzas = 1 + Math.random() * 7;
        const faltas = Math.max(0, 100 - asistencia - tardanzas);
        return { name, asistencia: parseFloat(asistencia.toFixed(1)), tardanzas: parseFloat(tardanzas.toFixed(1)), faltas: parseFloat(faltas.toFixed(1)) };
    });

    const alerts = [
      { type: 'critical', icon: AlertTriangle, title: 'Asistencia Crítica: 5to B', description: 'La sección tiene una asistencia por debajo del umbral del 80% esta semana.', time: 'hace 2 horas' },
      { type: 'warning', icon: AlertTriangle, title: 'Tardanzas recurrentes: J. Perez', description: 'El docente Juan Perez ha acumulado 3 tardanzas esta semana.', time: 'ayer' },
      { type: 'info', icon: Info, title: 'Reporte Mensual Disponible', description: 'El reporte consolidado del mes anterior ya puede ser generado.', time: 'hace 3 dias' },
    ].filter(() => Math.random() > 0.3); // Randomly show/hide alerts

    return { kpis, chartData, alerts };
};

interface AppDataState {
    students: Student[];
    staff: Staff[];
    parents: ParentTutor[];
    allUsers: GenericUser[];
    activityLogs: ActivityLog[];
    events: CalendarEvent[];
    gradesAndSections: typeof gradesAndSections;
    setAllUsers: (users: GenericUser[]) => void;

    // Attendance Module Data
    attendanceData: {
        kpis: any[];
        chartData: any[];
        alerts: any[];
    };
    isAttendanceLoading: boolean;
    fetchAttendanceData: (filters: any) => void;
}

export const useAppDataStore = create<AppDataState>((set, get) => ({
    students: initialStudents,
    staff: initialStaff,
    parents: initialParents,
    allUsers: [...initialStudents, ...initialStaff, ...initialParents],
    activityLogs: initialActivityLogs,
    events: initialEvents,
    gradesAndSections: gradesAndSections,

    setAllUsers: (newUsers) => {
        set({
            allUsers: newUsers,
            students: newUsers.filter((u): u is Student => 'studentCode' in u),
            staff: newUsers.filter((u): u is Staff => 'category' in u),
            parents: newUsers.filter((u): u is ParentTutor => 'relation' in u),
        });
    },

    // Attendance state and action
    attendanceData: { kpis: [], chartData: [], alerts: [] },
    isAttendanceLoading: true,
    fetchAttendanceData: (filters) => {
        set({ isAttendanceLoading: true });
        setTimeout(() => {
            const data = generateRandomData(filters, get().students.length, get().staff.length);
            set({ attendanceData: data, isAttendanceLoading: false });
        }, 500);
    },
}));
