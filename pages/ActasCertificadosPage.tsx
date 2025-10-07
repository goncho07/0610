import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, AlertTriangle, Download } from 'lucide-react';
import { track } from '@/analytics/track';

import { ModulePage } from '@/layouts/ModulePage';
import Card from '@/ui/Card';

const mockActas = [
  { id: 'ACT-001', grade: 'Quinto Grado "A"', status: 'Pendiente de Aprobación', requestedBy: 'A. Barreto', date: '2025-07-28' },
  { id: 'ACT-002', grade: 'Sexto Grado "B"', status: 'Aprobado', requestedBy: 'F. Sotelo', date: '2025-07-25' },
  { id: 'ACT-003', grade: 'Quinto Grado "B"', status: 'Requiere Corrección', requestedBy: 'M. Gomez', date: '2025-07-22' },
];

const ActasCertificadosPage: React.FC = () => {
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'Aprobado': return { icon: Check, color: 'text-emerald-600 bg-emerald-100' };
            case 'Pendiente de Aprobación': return { icon: AlertTriangle, color: 'text-amber-600 bg-amber-100' };
            case 'Requiere Corrección': return { icon: AlertTriangle, color: 'text-rose-600 bg-rose-100' };
            default: return { icon: FileText, color: 'text-slate-600 bg-slate-100' };
        }
    };

  return (
    <ModulePage
        title="Actas y Certificados"
        description="Gestione las actas de notas, apruebe documentos y genere certificados de estudios."
        icon={FileText}
        filters={<></>}
        content={
             <Card>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Actas de Notas Pendientes</h2>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {mockActas.map(acta => {
                        const status = getStatusInfo(acta.status);
                        const Icon = status.icon;
                        return (
                            <div key={acta.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-lg ${status.color}`}><Icon size={20} /></div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-100">{acta.grade}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Solicitado por: {acta.requestedBy} - {acta.date}</p>
                                        <p className={`text-sm font-semibold ${status.color.split(' ')[0]}`}>{acta.status}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 md:mt-0">
                                    <button onClick={() => track('acta_opened', { actaId: acta.id })} className="px-3 py-1.5 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">Ver</button>
                                    {acta.status === 'Pendiente de Aprobación' && (
                                        <button onClick={() => track('acta_approved', { actaId: acta.id })} className="px-3 py-1.5 text-sm rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Aprobar</button>
                                    )}
                                    <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><Download size={16} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
           </Card>
        }
    />
  );
};

export default ActasCertificadosPage;