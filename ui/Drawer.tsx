import React, { useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  const trapRef = useFocusTrap<HTMLDivElement>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50"
          onClick={onClose}
        >
          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-slate-50 dark:bg-slate-900 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-6 border-b border-slate-200 dark:border-slate-700 shrink-0 flex justify-between items-center">
              <h2 id="drawer-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Cerrar panel"
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X size={20} />
              </button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950">
              {children}
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;