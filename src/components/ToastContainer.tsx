import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLibrary();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border text-xs leading-snug animate-in slide-in-from-bottom duration-200 ${
            toast.type === 'warning'
              ? 'bg-[#381616] text-[#FFEEEE] border-red-800'
              : toast.type === 'info'
              ? 'bg-[#152238] text-[#EDF2F7] border-blue-900'
              : 'bg-[#2C1E14] text-[#FAF8F5] border-[#D4AF37]/40'
          }`}
        >
          {toast.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          )}

          <div className="flex-1 font-medium">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/60 hover:text-white p-0.5"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
