import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const breadcrumbNameMap: { [key: string]: string } = {
  '/usuarios': 'Usuarios',
  '/matricula': 'Matrícula',
  '/academico': 'Académico',
  '/academico/avance-docentes': 'Avance por Docente',
  '/academico/monitoreo-cursos': 'Monitoreo por Cursos',
  '/academico/monitoreo-estudiantes': 'Monitoreo por Estudiantes',
  '/academico/actas-certificados': 'Actas y Certificados',
  '/academico/reportes-descargas': 'Reportes y Descargas',
  '/academico/configuracion': 'Configuración Académica',
  '/asistencia': 'Asistencia',
  '/asistencia/scan': 'Escanear QR',
  '/comunicaciones': 'Comunicaciones',
  '/reportes': 'Reportes',
  '/recursos': 'Recursos',
  '/admin': 'Administración',
  '/settings': 'Configuración',
  '/settings/roles': 'Roles y Permisos',
  '/settings/activity-log': 'Registro de Actividad',
  '/ayuda': 'Ayuda',
  '/convivencia': 'Convivencia',
  '/registrar-notas': 'Registrar Notas',
  '/libro-calificaciones': 'Libro de Calificaciones'
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/' || location.pathname.startsWith('/login') || location.pathname.startsWith('/access-type')) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 hidden sm:block">
      <ol className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
        <li>
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <Home size={16} />
            <span>Inicio</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
          
          return (
            <li key={to} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-slate-400 mx-1" />
              {isLast ? (
                <span className="font-semibold text-slate-700 dark:text-slate-200" aria-current="page">
                  {name}
                </span>
              ) : (
                <Link to={to} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;