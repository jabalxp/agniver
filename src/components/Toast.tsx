'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastItem, useToastStore } from '@/store/useToastStore';

interface ToastProps {
  toast: ToastItem;
}

export function Toast({ toast }: ToastProps) {
  const { removeToast } = useToastStore();

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-950/40 text-emerald-100 shadow-emerald-500/10';
      case 'error':
        return 'border-rose-500/30 bg-rose-950/40 text-rose-100 shadow-rose-500/10';
      case 'warning':
        return 'border-amber-500/30 bg-amber-950/40 text-amber-100 shadow-amber-500/10';
      default:
        return 'border-sky-500/30 bg-sky-950/40 text-sky-100 shadow-sky-500/10';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-xl min-w-[280px] max-w-md pointer-events-auto overflow-hidden relative ${getBorderColor()}`}
    >
      {getIcon()}
      <p className="text-sm font-medium flex-1 text-foreground">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 text-foreground/40 hover:text-foreground rounded-lg hover:bg-foreground/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30"
        />
      )}
    </motion.div>
  );
}

