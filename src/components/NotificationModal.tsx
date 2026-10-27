import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, X, Calendar, CreditCard, BookOpen, AlertTriangle } from 'lucide-react';

export const NotificationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave_status':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'fee':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'homework':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">School Notifications</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time alerts for parents</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 p-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Read all</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2 opacity-50" />
              <p>No notifications right now.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  notif.read
                    ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    : 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs shrink-0">
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold truncate">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
