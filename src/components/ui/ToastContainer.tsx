import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-coal/95 border border-smoke backdrop-blur-xl shadow-2xl text-cream"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'error' ? (
                <div className="w-5 h-5 rounded-full bg-brand/20 text-brand flex items-center justify-center">
                  <X className="w-3.5 h-3.5" />
                </div>
              ) : toast.type === 'info' ? (
                <div className="w-5 h-5 rounded-full bg-saffron/20 text-saffron flex items-center justify-center">
                  <Info className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-cream tracking-wide">{toast.title}</h4>
              {toast.description && (
                <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{toast.description}</p>
              )}
              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-[11px] font-semibold text-brand hover:text-ember underline transition-colors"
                >
                  {toast.actionLabel}
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-muted hover:text-cream transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
