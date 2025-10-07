import React from 'react';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { tokens } from '@/design/tokens';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        success: {
          iconTheme: {
            primary: tokens.color.success,
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: tokens.color.danger,
            secondary: 'white',
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 20 }}
              role="status"
              aria-live="polite"
              className={`flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1f2937] text-slate-800 dark:text-[#E5E7EB] rounded-[${tokens.radius.lg}px] shadow-lg border border-slate-200 dark:border-[#334155] max-w-sm`}
            >
              <div className="shrink-0">
                {t.type === 'success' && <CheckCircle className={`text-[${tokens.color.success}]`} />}
                {t.type === 'error' && <AlertCircle className={`text-[${tokens.color.danger}]`} />}
                {t.type === 'loading' && icon}
                {t.type !== 'success' && t.type !== 'error' && t.type !== 'loading' && <Info className={`text-[${tokens.color.info}]`} />}
              </div>
              <div className="flex-1 text-sm font-semibold">{message}</div>
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Cerrar notificación"
                  className={`p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0b1220] focus:outline-none focus-visible:ring-2 focus-visible:ring-[${tokens.color.focus}]`}
                >
                  <X size={16} />
                </button>
              )}
            </motion.div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default ToastProvider;