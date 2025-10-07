import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, Info } from 'lucide-react';

const TOTAL_STUDENTS = 1681;
const TOTAL_TEACHERS = 112;

const generateRandomData = (filters: any) => {
    const isStudents = filters.populationFocus === 'estudiantes';
    const basePopulation = isStudents ? TOTAL_STUDENTS : TOTAL_TEACHERS;

    const asistencias = Math.floor(basePopulation * (0.85 + Math.random() * 0.14)); // 85% - 99%
    const tardanzas = Math.floor(basePopulation * (0.01 + Math.random() * 0.08)); // 1% - 9%
    const faltas = basePopulation - asistencias - tardanzas;
    
    const kpis = [
        { title: 'Asistencias', value: asistencias, change: Math.floor(Math.random() * 21) - 10, icon: CheckCircle, color: 'text-emerald-500' },
        { title: 'Tardanzas', value: tardanzas, change: Math.floor(Math.random() * 7) - 3, icon: Clock, color: 'text-amber-500' },
        { title: 'Faltas Injustificadas', value: faltas, change: Math.floor(Math.random() * 5) - 2, icon: XCircle, color: 'text-rose-500' },
    ];
    
    const chartData = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(name => {
        const asistencia = 90 + Math.random() * 9;
        const tardanzas = 1 + Math.random() * 7;
        const faltas = 100 - asistencia - tardanzas;
        return { name, asistencia: parseFloat(asistencia.toFixed(1)), tardanzas: parseFloat(tardanzas.toFixed(1)), faltas: parseFloat(faltas.toFixed(1)) };
    });

    const alerts = [
      { type: 'critical', icon: AlertTriangle, title: 'Asistencia Crítica: 5to B', description: 'La sección tiene una asistencia por debajo del umbral del 80% esta semana.', time: 'hace 2 horas' },
      { type: 'warning', icon: AlertTriangle, title: 'Tardanzas recurrentes: J. Perez', description: 'El docente Juan Perez ha acumulado 3 tardanzas esta semana.', time: 'ayer' },
      { type: 'info', icon: Info, title: 'Reporte Mensual Disponible', description: 'El reporte consolidado del mes anterior ya puede ser generado.', time: 'hace 3 dias' },
    ].filter(() => Math.random() > 0.3); // Randomly show/hide alerts

    