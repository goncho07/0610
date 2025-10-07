

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2 } from 'lucide-react';
import IconButton from '@/ui/IconButton';

interface BulkActionBarProps {
    count: number;
    onClear: () => void;
    onAction: (action: string) => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ count, onClear, onAction }) => (
    <AnimatePresence>
        {count > 0 &&
            <motion.div
                initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 w-auto bg-slate-800/90 dark:bg-slate-900/90 backdrop-blur-sm text-white rounded-xl shadow-2xl z-40 flex items-center gap-6 px-4 py-3 border border-slate-700"
            >
                <div className="flex items-center gap-2">
                    <span className="bg-indigo-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">{count}</span>
                    <span className="font-semibold text-base">Seleccionados</span>
                    <IconButton 
                        icon={X} 
                        aria-label="Limpiar selección" 
                        onClick={onClear} 
                        variant="text" 
                        className="ml-2 text-slate-300 hover:text-white !w-8 !h-8"
                    />
                </div>
                <div className="h-6 w-px bg-slate-600"></div>
                <div className="flex items-center gap-2">
                    <IconButton variant="text" icon={Trash2} aria-label="Eliminar" onClick={() => onAction('delete-users')} className="text-slate-300 hover:text-rose-400" />
                    <IconButton variant="text" icon={Download} aria-label="Generar Carnets" onClick={() => onAction('generate-carnets')} className="text-slate-300 hover:text-indigo-400" />
                </div>
            </motion.div>
        }
    </AnimatePresence>
);

export default BulkActionBar;