
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserStatus } from '../../types';
import Button from '../../ui/Button';

const USER_ROLES = ['Todos', 'Director', 'Administrativo', 'Docente', 'Apoyo', 'Estudiante', 'Apoderado'];
const USER_LEVELS = ['Todos', 'Inicial', 'Primaria', 'Secundaria'];
const USER_STATUSES: (UserStatus | 'Todos')[] = ['Todos', 'Activo', 'Inactivo', 'Suspendido', 'Pendiente', 'Egresado'];

interface Filters {
    searchTerm: string;
    tagFilter: string;
    status: UserStatus | 'Todos';
    level: string;
    role: string;
}

interface AdvancedSearchPopoverProps {
    trigger: React.ReactElement;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    activeTab: string;
}

const AdvancedSearchPopover: React.FC<AdvancedSearchPopoverProps> = ({ trigger, filters, setFilters, activeTab }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleApply = () => {
        setFilters(localFilters);
        setIsOpen(false);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const contextualUserRoles = React.useMemo(() => {
        if (activeTab === 'Administrativos' || activeTab === 'Docentes') {
            return ['Todos', 'Director', 'Administrativo', 'Docente', 'Apoyo'];
        }
        if (activeTab === 'Estudiantes' || activeTab === 'Apoderados') {
            return [];
        }
        return USER_ROLES;
    }, [activeTab]);


    return (
        <div className="relative">
            <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={popoverRef}
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 10, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-40"
                    >
                        <div className="p-4 space-y-4">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Filtros Avanzados</h4>
                            {contextualUserRoles.length > 0 && (
                                <div>
                                    <label htmlFor="role-filter-popover" className="text-sm font-medium text-slate-500 dark:text-slate-400">Rol de Usuario</label>
                                    <select id="role-filter-popover" value={localFilters.role} onChange={e => setLocalFilters(f => ({...f, role: e.target.value}))} className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                                        {contextualUserRoles.map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </div>
                            )}
                            {activeTab !== 'Apoderados' && (
                                <div>
                                    <label htmlFor="level-filter-popover" className="text-sm font-medium text-slate-500 dark:text-slate-400">Nivel</label>
                                    <select id="level-filter-popover" value={localFilters.level} onChange={e => setLocalFilters(f => ({...f, level: e.target.value}))} className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                                        {USER_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                                    </select>
                                </div>
                            )}
                             <div>
                                <label htmlFor="status-filter-popover" className="text-sm font-medium text-slate-500 dark:text-slate-400">Estado</label>
                                <select id="status-filter-popover" value={localFilters.status} onChange={e => setLocalFilters(f => ({...f, status: e.target.value as any}))} className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                                    {USER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="tag-filter-popover" className="text-sm font-medium text-slate-500 dark:text-slate-400">Etiquetas</label>
                                <input id="tag-filter-popover" type="text" value={localFilters.tagFilter} onChange={e => setLocalFilters(f => ({...f, tagFilter: e.target.value}))} placeholder="Ej: beca, refuerzo..." className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"/>
                            </div>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl flex justify-end">
                            <Button variant="filled" onClick={handleApply} aria-label="Aplicar filtros">Aplicar Filtros</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdvancedSearchPopover;
