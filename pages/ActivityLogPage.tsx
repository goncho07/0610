import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Download } from 'lucide-react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import es from 'date-fns/locale/es';
import { activityLogs as initialActivityLogs } from '@/data/activityLogs';
import { ActivityLog } from '@/types';
import { track } from '@/analytics/track';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import Button from '@/ui/Button';
import Card from '@/ui/Card';

const ActivityLogPage: React.FC = () => {
    const [logs] = useState<ActivityLog[]>(initialActivityLogs);
    const [actionFilter, setActionFilter] = useState('all');
    const [actorFilter, setActorFilter] = useState('all');

    const filteredLogs = useMemo(() => {
        track('audit_viewed');
        return logs.filter(log => {
            const actionMatch = actionFilter === 'all' || log.action === actionFilter;
            const actorMatch = actorFilter === 'all' || log.user === actorFilter;
            return actionMatch && actorMatch;
        });
    }, [logs, actionFilter, actorFilter]);

    const uniqueActions = useMemo(() => [...new Set(logs.map(log => log.action))], [logs]);
    const uniqueActors = useMemo(() => [...new Set(logs.map(log => log.user))], [logs]);
    
    const handleExport = () => {
        track('audit_log_exported');
        // CSV export logic here...
        alert('Exportando a CSV...');
    };

    return (
        <ModulePage
            title="Registro de Actividad Global"
            description="Audite todas las acciones importantes realizadas por los usuarios en el sistema."
            icon={Activity}
            actionsRight={<Button variant="tonal" aria-label="Exportar a CSV" icon={Download} onClick={handleExport}>Exportar a CSV</Button>}
            filters={
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row gap-4">
                     <div className="flex-1">
                         <label htmlFor="action-filter" className="text-sm font-semibold text-slate-500 dark:text-slate-400">Acción</label>
                        <select id="action-filter" value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="w-full p-2 mt-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                            <option value="all">Todas las Acciones</option>
                            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="actor-filter" className="text-sm font-semibold text-slate-500 dark:text-slate-400">Actor</label>
                        <select id="actor-filter" value={actorFilter} onChange={e => setActorFilter(e.target.value)} className="w-full p-2 mt-1 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                            <option value="all">Todos los Actores</option>
                            {uniqueActors.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            }
            content={
                <Card className="!p-6 max-h-[65vh] overflow-y-auto">
                    <div className="space-y-4">
                    {filteredLogs.map(log => (
                         <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                         >
                            <img src={log.userAvatar} className="w-10 h-10 rounded-full mt-1 shrink-0" alt={log.user}/>
                            <div>
                                <p className="text-sm">
                                    <strong className="font-semibold text-slate-800 dark:text-slate-100 capitalize">{log.user.toLowerCase()}</strong> realizó la acción <strong className="font-semibold">{log.action}</strong>
                                    {log.targetUser && log.targetUser !== 'N/A' && <> sobre <strong className="font-semibold capitalize">{log.targetUser.toLowerCase()}</strong></>}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">"{log.details}"</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: es })} {log.ipAddress && `(IP: ${log.ipAddress})`}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                    </div>
                </Card>
            }
        />
    );
};

export default ActivityLogPage;