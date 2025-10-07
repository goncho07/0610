import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, BarChart, FileText, Settings, Plus, Download, ArrowUpRight, ArrowDownLeft, Banknote } from 'lucide-react';
import { track } from '@/analytics/track';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import Button from '@/ui/Button';
import KpiCard from '@/ui/KpiCard';
import Table from '@/ui/Table';
import Drawer from '@/ui/Drawer';

type FinanceTab = 'resumen' | 'transacciones' | 'pagos';
const transactions = [ { id: 'T-001', date: '2025-07-28', description: 'Donación APAFA', category: 'Donaciones', type: 'Ingreso', amount: 500.00 }, { id: 'T-002', date: '2025-07-27', description: 'Material de limpieza', category: 'Mantenimiento', type: 'Gasto', amount: -150.70 } ];
const studentPayments = [ { id: 'P-001', student: 'QUISPE ROJAS, ANA SOFÍA', concept: 'Cuota APAFA 2025', amount: 100.00, status: 'Pagado' }, { id: 'P-002', student: 'MENDOZA CASTILLO, LUIS FERNANDO', concept: 'Cuota APAFA 2025', amount: 100.00, status: 'Pendiente' } ];

const AdminFinanzasPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FinanceTab>('resumen');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const tabs: { id: FinanceTab; label: string; icon: React.ElementType; }[] = [ { id: 'resumen', label: 'Resumen', icon: BarChart }, { id: 'transacciones', label: 'Ingresos y Gastos', icon: FileText }, { id: 'pagos', label: 'Pagos de Alumnos', icon: Banknote }];
    
    const transactionColumns = [
        { key: 'date', header: 'Fecha', render: (t: any) => t.date },
        { key: 'description', header: 'Descripción', render: (t: any) => t.description },
        { key: 'type', header: 'Tipo', render: (t: any) => t.type },
        { key: 'amount', header: 'Monto (S/)', render: (t: any) => Math.abs(t.amount).toFixed(2) },
    ];
    
    const paymentColumns = [
        { key: 'student', header: 'Estudiante', render: (p: any) => p.student },
        { key: 'concept', header: 'Concepto', render: (p: any) => p.concept },
        { key: 'amount', header: 'Monto (S/)', render: (p: any) => p.amount.toFixed(2) },
        { key: 'status', header: 'Estado', render: (p: any) => p.status },
    ];

    return (
        <>
        <ModulePage
            title="Administración y Finanzas"
            description="Gestión de ingresos, gastos, pagos y configuración de parámetros institucionales."
            icon={Briefcase}
            actionsRight={
                <>
                  <Button variant="tonal" aria-label="Exportar Reporte" icon={Download} onClick={() => track('report_exported', { type: 'finance' })}>Exportar Reporte</Button>
                  <Button variant="filled" aria-label="Nuevo Registro" icon={Plus} onClick={() => {
                      track('finance_entry_created_start');
                      setIsDrawerOpen(true);
                  }}>Nuevo Registro</Button>
                </>
            }
            filters={<></>}
            content={
                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-6">
                    <nav className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                                <tab.icon size={16} />{tab.label}
                            </button>
                        ))}
                    </nav>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {activeTab === 'resumen' && <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><KpiCard title="Ingresos del Mes" value="S/ 1,300.00" icon={ArrowUpRight} /><KpiCard title="Gastos del Mes" value="S/ 400.70" icon={ArrowDownLeft} /><KpiCard title="Balance del Mes" value="S/ 899.30" icon={Banknote} /></div>}
                        {activeTab === 'transacciones' && <Table columns={transactionColumns} rows={transactions} getRowId={(t:any)=>t.id} onSort={()=>{}} sortConfig={null} selectable={false} selectedRowIds={new Set()} onSelect={()=>{}} onSelectAll={()=>{}} />}
                        {activeTab === 'pagos' && <Table columns={paymentColumns} rows={studentPayments} getRowId={(p:any)=>p.id} onSort={()=>{}} sortConfig={null} selectable={false} selectedRowIds={new Set()} onSelect={()=>{}} onSelectAll={()=>{}} />}
                    </motion.div>
                 </div>
            }
        />
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Nuevo Registro Financiero">
            <p>Formulario para nuevo registro de ingreso/gasto...</p>
        </Drawer>
        </>
    );
};

export default AdminFinanzasPage;