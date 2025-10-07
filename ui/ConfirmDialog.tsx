
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    const trapRef = useFocusTrap<HTMLDivElement>();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        ref={trapRef}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 flex items-start gap-4">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-500/20 sm:mx-0 sm:h-10 sm:w-10">
                                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                                <h3 id="dialog-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                                <p id="dialog-description" className="text-sm text-slate-500 dark:text-slate-400 mt-2">{message}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
                            <Button variant="tonal" aria-label="Cancelar" onClick={onClose}>Cancelar</Button>
                            <Button variant="filled" aria-label="Confirmar" onClick={onConfirm}>Confirmar</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
