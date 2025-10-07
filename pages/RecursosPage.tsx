import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Warehouse, Plus, Library, ArrowRight, Calendar, Laptop } from 'lucide-react';
import { track } from '@/analytics/track';

// New Architecture Components
import { ModulePage } from '@/layouts/ModulePage';
import FilterBar from '@/ui/FilterBar';
import Table from '@/ui/Table';
import Button from '@/ui/Button';
import BulkBar from '@/ui/BulkBar';
import IconButton from '@/ui/IconButton';

type ResourceTab = 'inventario' | 'prestamos' | 'reservas';

const inventoryItems = [ { id: 'LIB-001', name: 'El Caballero Carmelo', category: 'Biblioteca', stock: 15, available: 10, status: 'Disponible' }, { id: 'LAB-001', name: 'Microscopio', category: 'Laboratorio', stock: 10, available: 8, status: 'Disponible' } ];
const loans = [ { id: 'L-001', item: 'El Caballero Carmelo', borrower: 'QUISPE ROJAS, ANA SOFÍA', dueDate: '2025-08-05', status: 'Activo' }, { id: 'L-002', item: 'Microscopio', borrower: 'SOTELO RODRÍGUEZ, FELIX', dueDate: '2025-07-25', status: 'Vencido' } ];

const RecursosPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ResourceTab>('inventario');
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

    const tabs: { id: ResourceTab, label: string, icon: React.ElementType }[] = [
        { id: 'inventario', label: 'Inventario', icon: Library },
        { id: 'prestamos', label: 'Préstamos', icon: ArrowRight },
        { id: 'reservas', label: 'Reservas', icon: Calendar },
    ];
    
    const inventoryColumns = [
        { key: 'name', header: 'Item', render: (i: any) => i.name },
        { key: 'category', header: 'Categoría', render: (i: any) => i.category },
        { key: 'stock', header: 'Stock', render: (i: any) => i.stock },
        { key: 'available', header: 'Disponibles', render: (i: any) => i.available },
    ];

    const loansColumns = [
        { key: 'item', header: 'Item', render: (l: any) => l.item },
        { key: 'borrower', header: 'Prestatario', render: (l: any) => l.borrower },
        { key: 'dueDate', header: 'Fecha Devolución', render: (l: any) => l.dueDate },
        { key: 'status', header: 'Estado', render: (l: any) => l.status },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'inventario': return <Table columns={inventoryColumns as any} rows={inventoryItems} getRowId={(i: any) => i.id} onSort={()=>{}} sortConfig={null} selectable onSelect={(id) => handleSelect(id as string)} onSelectAll={handleSelectAll} selectedRowIds={selectedRowIds} />;
            case 'prestamos': return <Table columns={loansColumns as any} rows={loans} getRowId={(l: any) => l.id} onSort={()=>{}} sortConfig={null} selectable onSelect={(id) => handleSelect(id as string)} onSelectAll={handleSelectAll} selectedRowIds={selectedRowIds} />;
            case 'reservas': return <p>Vista de Reservas</p>;
            default: return null;
        }
    };
    
    const handleSelect = (id: string) => {
        setSelectedRowIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = (isSelected: boolean) => {
        const currentData = activeTab === 'inventario' ? inventoryItems : loans;
        setSelectedRowIds(isSelected ? new Set(currentData.map(item => item.id)) : new Set());
    };

    return (
        <ModulePage
            title="Módulo de Recursos"
            description="Gestión de inventarios, préstamos, devoluciones y reservas de infraestructura."
            icon={Warehouse}
            actionsRight={<Button variant="filled" aria-label="Nuevo Registro" icon={Plus}>Nuevo Registro</Button>}
            filters={<FilterBar activeFilters={[]} onRemoveFilter={()=>{}} onClearAll={()=>{}} />}
            content={
                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 space-y-6">
                    <nav className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedRowIds(new Set()); }} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                                <tab.icon size={16} />{tab.label}
                            </button>
                        ))}
                    </nav>
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div>
                </div>
            }
            bulkBar={
                <BulkBar selectedCount={selectedRowIds.size} onClear={() => setSelectedRowIds(new Set())}>
                    <IconButton aria-label="Prestar" icon={ArrowRight} onClick={() => track('resource_loan_created')} />
                </BulkBar>
            }
        />
    );
};

export default RecursosPage;