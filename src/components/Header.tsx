import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { NotificationModal } from './NotificationModal';
import {
  Sun,
  Moon,
  Bell,
  Shield,
  User,
  LogOut,
  Sparkles,
  School,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    user,
    activeRole,
    setActiveRole,
    currentView,
    setCurrentView,
    logout,
    unreadNotificationCount,
    student,
    setIsWhatsAppModalOpen,
    whatsappAlerts
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Brand & Crest Logo */}
          <div
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none"
            onClick={() => {
              if (user) setCurrentView('app');
              else setCurrentView('landing');
            }}
          >
            <div className="relative group">
              <img
                src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
                alt="Akal Galaxy Convent School Logo"
                className="w-10 h-10 sm:w-13 sm:h-13 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-blue-900 dark:text-blue-400 font-heading">
                  AGCS
                </span>
                <span className="hidden xs:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-700/50">
                  SPL
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
                Akal Galaxy Convent School • <span className="text-amber-600 dark:text-amber-400 font-semibold">Treasure of Virtues</span>
              </p>
            </div>
          </div>

          {/* Center Actions / Role Badge */}
          {user && currentView === 'app' && (
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveRole('parent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeRole === 'parent'
                    ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Parent Portal</span>
              </button>

              <button
                onClick={() => setActiveRole('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeRole === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin / Leave Desk</span>
              </button>
            </div>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Install PWA Button */}
            <div className="hidden md:block">
              <PWAInstallButton compact />
            </div>

            {/* Notification Bell (for logged in parents/admin) */}
            {user && (
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black border-2 border-white dark:border-slate-900 animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {/* WhatsApp Gateway Quick Button */}
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="relative p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
              aria-label="Open WhatsApp alerts (+917719445029)"
              title="WhatsApp Alerts (+917719445029)"
            >
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              {whatsappAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-black border border-white dark:border-slate-900">
                  {whatsappAlerts.length}
                </span>
              )}
            </button>

            {/* Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* User Profile or Login CTA */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                    {activeRole === 'admin' ? 'AD' : student.fullName.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {activeRole === 'admin' ? 'Admin Desk' : student.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {activeRole === 'admin' ? 'Principal / Office' : `Class ${student.grade}-${student.section}`}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.parentName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.phoneNumber}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {activeRole === 'admin' ? 'Role: School Admin' : `Student: ${student.fullName}`}
                      </span>
                    </div>

                    <div className="p-1">
                      <button
                        onClick={() => {
                          setActiveRole(activeRole === 'parent' ? 'admin' : 'parent');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span>Switch to {activeRole === 'parent' ? 'Admin Panel' : 'Parent Portal'}</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('auth')}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition"
              >
                Parent Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile quick role switcher */}
        {user && currentView === 'app' && (
          <div className="sm:hidden px-3 pb-2 pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Viewing as:
            </span>
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => setActiveRole('parent')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  activeRole === 'parent' ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Parent
              </button>
              <button
                onClick={() => setActiveRole('admin')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                  activeRole === 'admin' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notification Center Modal */}
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
