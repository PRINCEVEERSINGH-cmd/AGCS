import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, ShieldAlert, X, ExternalLink } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useApp();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, toast.action ? 8000 : 5000);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    alert: <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-50/95 dark:bg-emerald-950/90',
    info: 'border-blue-500/30 bg-blue-50/95 dark:bg-blue-950/90',
    warning: 'border-amber-500/30 bg-amber-50/95 dark:bg-amber-950/90',
    alert: 'border-rose-500/30 bg-rose-50/95 dark:bg-rose-950/90'
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] animate-bounce-short">
      <div className={`p-4 rounded-2xl shadow-xl border backdrop-blur-md flex flex-col gap-2.5 ${borderColors[toast.type]}`}>
        <div className="flex items-start gap-3">
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{toast.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={clearToast}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {toast.action && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-end">
            <button
              onClick={() => {
                toast.action?.onClick();
                clearToast();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <span>{toast.action.label}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
