import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-md"
      >
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-lg ${
            isSuccess
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40'
              : isError
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-950/40'
              : 'bg-slate-900/90 border-slate-700/60 text-slate-100 shadow-black/50'
          }`}
        >
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />}

          <div className="flex-1 text-sm">
            {toast.title && <p className="font-semibold">{toast.title}</p>}
            <p className="text-slate-200 text-xs sm:text-sm mt-0.5">{toast.message}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Dismiss toast"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
