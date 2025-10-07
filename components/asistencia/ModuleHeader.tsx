import React from 'react';
import Button from '@/ui/Button';
import { Download } from 'lucide-react';

interface ModuleHeaderProps {
    onGenerateReport: () => void;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ onGenerateReport }) => {
    return (
        <header>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Panel de Asistencia</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Datos actualizados: domingo, 5 de octubre de 2025, 03:44 p. m.
                    </p>
                </div>
                <Button variant="filled" icon={Download} onClick={onGenerateReport} aria-label="Generar Reporte de Asistencia">Generar Reporte</Button>
            </div>
        </header>
    );
};