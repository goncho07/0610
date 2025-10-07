
import { CalendarEvent } from '../types';
import { format } from 'date-fns';

const getNthWeekdayOfMonth = (year: number, month: number, dayOfWeek: number, n: number): Date => {
    const d = new Date(year, month, 1);
    let count = 0;
    // Adjust for week start if needed, but getDay() is consistent (0=Sun, 1=Mon...)
    while (d.getMonth() === month) {
        if (d.getDay() === dayOfWeek) {
            count++;
            if (count === n) {
                return d;
            }
        }
        d.setDate(d.getDate() + 1);
    }
    // Fallback, should not happen if n is valid (e.g., not 5th Sunday in a month with 4)
    return new Date(year, month, 1);
};


export const mockEvents: CalendarEvent[] = [
  // --- Gestión Escolar 2025 ---
  { id: 'gest-1', title: 'Inicio: 1er Bloque de Gestión', date: '2025-03-03', category: 'Gestión'},
  { id: 'gest-2', title: 'Fin: 1er Bloque de Gestión', date: '2025-03-14', category: 'Gestión'},
  { id: 'lect-1', title: 'Inicio: 1er Bloque Lectivo', date: '2025-03-17', category: 'Actividad'},
  { id: 'lect-2', title: 'Fin: 1er Bloque Lectivo', date: '2025-05-16', category: 'Actividad'},
  { id: 'gest-3', title: 'Inicio: 2do Bloque de Gestión', date: '2025-05-19', category: 'Gestión'},
  { id: 'gest-4', title: 'Fin: 2do Bloque de Gestión', date: '2025-05-23', category: 'Gestión'},
  { id: 'lect-3', title: 'Inicio: 2do Bloque Lectivo', date: '2025-05-26', category: 'Actividad'},
  { id: 'lect-4', title: 'Fin: 2do Bloque Lectivo', date: '2025-07-25', category: 'Actividad'},
  { id: 'gest-5', title: 'Inicio: 3er Bloque de Gestión', date: '2025-07-28', category: 'Gestión'},
  { id: 'gest-6', title: 'Fin: 3er Bloque de Gestión', date: '2025-08-08', category: 'Gestión'},
  { id: 'lect-5', title: 'Inicio: 3er Bloque Lectivo', date: '2025-08-11', category: 'Actividad'},
  { id: 'lect-6', title: 'Fin: 3er Bloque Lectivo', date: '2025-10-10', category: 'Actividad'},
  { id: 'gest-7', title: 'Inicio: 4to Bloque de Gestión', date: '2025-10-13', category: 'Gestión'},
  { id: 'gest-8', title: 'Fin: 4to Bloque de Gestión', date: '2025-10-17', category: 'Gestión'},
  { id: 'lect-7', title: 'Inicio: 4to Bloque Lectivo', date: '2025-10-20', category: 'Actividad'},
  { id: 'lect-8', title: 'Fin: 4to Bloque Lectivo', date: '2025-12-19', category: 'Actividad'},
  { id: 'gest-9', title: 'Inicio: 5to Bloque de Gestión', date: '2025-12-22', category: 'Gestión'},
  { id: 'gest-10', title: 'Fin: 5to Bloque de Gestión', date: '2025-12-31', category: 'Gestión'},

  // --- Feriados y Eventos Anteriores ---
  { id: '1', title: 'Año Nuevo', date: '2025-01-01', category: 'Feriado', description: 'Feriado nacional por Año Nuevo.' },
  { id: '2', title: 'Reunión de Planificación Anual', date: '2025-01-06', category: 'Reunión' },
  { id: '3', title: 'Publicación de Vacantes 2025', date: '2025-01-10', category: 'UGEL' },
  { id: '4', title: 'Inicio de Matrícula Regular', date: '2025-01-15', category: 'Actividad' },
  { id: '5', title: 'Exámenes de Recuperación', date: '2025-01-20', category: 'Examen'},
  
  // --- Calendario Cívico 2025 ---
  // Marzo
  { id: 'civ-mar-1', title: 'Día Intl. Síndrome de Down', date: '2025-03-21', category: 'Cívico' },
  { id: 'civ-mar-2', title: 'Día Mundial del Agua', date: '2025-03-22', category: 'Cívico' },
  { id: 'civ-mar-3', title: 'La Hora del Planeta', date: '2025-03-26', category: 'Cívico' },
  { id: 'civ-mar-4', title: 'Nacimiento de Mario Vargas Llosa', date: '2025-03-28', category: 'Cívico' },
  // Abril
  { id: 'civ-abr-1', title: 'Día de la Educación', date: '2025-04-01', category: 'Cívico' },
  { id: 'civ-abr-2', title: 'Día Mundial del Libro Infantil', date: '2025-04-02', category: 'Cívico' },
  { id: 'civ-abr-3', title: 'Día Mundial del Autismo', date: '2025-04-02', category: 'Cívico' },
  { id: 'civ-abr-4', title: 'Día Mundial de la Salud', date: '2025-04-07', category: 'Cívico' },
  { id: 'civ-abr-5', title: 'Día del Niño Peruano', date: format(getNthWeekdayOfMonth(2025, 3, 0, 2), 'yyyy-MM-dd'), category: 'Cívico' },
  { id: 'civ-abr-6', title: 'Nacimiento del Inca Garcilaso', date: '2025-04-12', category: 'Cívico' },
  { id: 'civ-abr-7', title: 'Día de las Américas', date: '2025-04-14', category: 'Cívico' },
  { id: 'civ-abr-8', title: 'Fallecimiento de César Vallejo', date: '2025-04-15', category: 'Cívico' },
  { id: 'civ-abr-9', title: 'Día de la Tierra', date: '2025-04-22', category: 'Cívico' },
  // Mayo
  { id: 'civ-may-1', title: 'Día Mundial del Trabajo', date: '2025-05-01', category: 'Feriado' },
  { id: 'civ-may-2', title: 'Combate del Dos de Mayo', date: '2025-05-02', category: 'Cívico' },
  { id: 'civ-may-3', title: 'Día de la Madre', date: format(getNthWeekdayOfMonth(2025, 4, 0, 2), 'yyyy-MM-dd'), category: 'Cívico' },
  { id: 'civ-may-4', title: 'Aniv. María Parado de Bellido', date: '2025-05-11', category: 'Cívico' },
  { id: 'civ-may-5', title: 'Día Escolar de las Matemáticas', date: '2025-05-12', category: 'Cívico' },
  { id: 'civ-may-6', title: 'Día Mundial del Internet', date: '2025-05-17', category: 'Cívico' },
  { id: 'civ-may-7', title: 'Sacrificio Túpac Amaru II', date: '2025-05-18', category: 'Cívico' },
  { id: 'civ-may-8', title: 'Día de la Educación Inicial', date: '2025-05-25', category: 'Cívico' },
  { id: 'civ-may-9', title: 'Día de la Integración Andina', date: '2025-05-26', category: 'Cívico' },
  { id: 'civ-may-10', title: 'Día Nacional de la Papa', date: '2025-05-30', category: 'Cívico' },
  { id: 'civ-may-11', title: 'Día del no Fumador', date: '2025-05-31', category: 'Cívico' },
  // Junio
  { id: 'civ-jun-1', title: 'Día Mundial del Medio Ambiente', date: '2025-06-05', category: 'Cívico' },
  { id: 'civ-jun-2', title: 'Batalla de Arica y Día del Héroe', date: '2025-06-07', category: 'Cívico' },
  { id: 'civ-jun-3', title: 'Día Mundial de los Océanos', date: '2025-06-08', category: 'Cívico' },
  { id: 'civ-jun-4', title: 'Día contra el Trabajo Infantil', date: '2025-06-12', category: 'Cívico' },
  { id: 'civ-jun-5', title: 'Día del Padre', date: format(getNthWeekdayOfMonth(2025, 5, 0, 3), 'yyyy-MM-dd'), category: 'Cívico' },
  { id: 'civ-jun-6', title: 'Fiesta del Sol (Inti Raymi)', date: '2025-06-24', category: 'Cívico' },
  { id: 'civ-jun-7', title: 'Día del Campesino', date: '2025-06-24', category: 'Cívico' },
  { id: 'civ-jun-8', title: 'Día de San Pedro y San Pablo', date: '2025-06-29', category: 'Feriado' },
  // Julio
  { id: 'civ-jul-1', title: 'Día del Maestro', date: '2025-07-06', category: 'Cívico' },
  { id: 'civ-jul-2', title: 'Descubrimiento de Machu Picchu', date: '2025-07-07', category: 'Cívico' },
  { id: 'civ-jul-3', title: 'Día del Héroe José A. Quiñones', date: '2025-07-23', category: 'Cívico' },
  { id: 'civ-jul-4', title: 'Fiestas Patrias', date: '2025-07-28', category: 'Feriado' },
  { id: 'civ-jul-5', title: 'Fiestas Patrias', date: '2025-07-29', category: 'Feriado' },
  // Agosto
  { id: 'civ-ago-1', title: 'Batalla de Junín', date: '2025-08-06', category: 'Cívico' },
  { id: 'civ-ago-2', title: 'Día del Adulto Mayor', date: '2025-08-26', category: 'Cívico' },
  { id: 'civ-ago-3', title: 'Reincorporación de Tacna', date: '2025-08-28', category: 'Cívico' },
  { id: 'civ-ago-4', title: 'Día de Santa Rosa de Lima', date: '2025-08-30', category: 'Feriado' },
  // Septiembre
  { id: 'civ-sep-1', title: 'Semana de la Educación Vial', date: '2025-09-01', category: 'Cívico' },
  { id: 'civ-sep-2', title: 'Día Intl. de la Alfabetización', date: '2025-09-08', category: 'Cívico' },
  { id: 'civ-sep-3', title: 'Día Internacional por la Paz', date: format(getNthWeekdayOfMonth(2025, 8, 2, 3), 'yyyy-MM-dd'), category: 'Cívico' },
  { id: 'civ-sep-4', title: 'Día de la Primavera', date: '2025-09-23', category: 'Cívico' },
  // Octubre
  { id: 'civ-oct-1', title: 'Día de Ricardo Palma', date: '2025-10-06', category: 'Cívico' },
  { id: 'civ-oct-2', title: 'Combate de Angamos', date: '2025-10-08', category: 'Feriado' },
  { id: 'civ-oct-3', title: 'Descubrimiento de América', date: '2025-10-12', category: 'Cívico' },
  { id: 'civ-oct-4', title: 'Día de la Canción Criolla', date: '2025-10-31', category: 'Cívico' },
  // Noviembre
  { id: 'civ-nov-1', title: 'Día de Todos los Santos', date: '2025-11-01', category: 'Feriado' },
  { id: 'civ-nov-2', title: 'Rebelión de Túpac Amaru II', date: '2025-11-04', category: 'Cívico' },
  { id: 'civ-nov-3', title: 'Semana de la Biblioteca Escolar', date: '2025-11-10', category: 'Cívico' },
  // Diciembre
  { id: 'civ-dec-1', title: 'Batalla de Ayacucho', date: '2025-12-09', category: 'Feriado' },
  { id: 'civ-dec-2', title: 'Declaración Universal de los DDHH', date: '2025-12-10', category: 'Cívico' },
  { id: 'civ-dec-3', title: 'Navidad', date: '2025-12-25', category: 'Feriado' },
];
