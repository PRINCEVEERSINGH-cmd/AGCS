/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { OfflineBanner } from './components/PWAInstallButton';
import { LandingPage } from './views/LandingPage';
import { AuthView } from './views/AuthView';
import { OnboardingView } from './views/OnboardingView';
import { ParentDashboard } from './views/ParentDashboard';
import { AdminPanel } from './views/AdminPanel';
import { WhatsAppDispatchModal } from './components/WhatsAppDispatchModal';
import {
  CalendarCheck,
  CreditCard,
  Building,
  ShieldCheck,
  BookOpen,
  Home,
  UserCheck,
  MessageSquare
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    activeRole,
    setActiveRole,
    user,
    setCurrentView,
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    whatsappAlerts
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Offline Status Bar */}
      <OfflineBanner />

      {/* Persistent App Header */}
      <Header />

      {/* Toast Alert Notifications */}
      <Toast />

      {/* WhatsApp Dispatch & Diagnostics Modal */}
      <WhatsAppDispatchModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

      {/* Floating WhatsApp Quick Launcher */}
      <button
        type="button"
        onClick={() => setIsWhatsAppModalOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition-all border border-emerald-400/40 group cursor-pointer"
        aria-label="Open WhatsApp Alert Gateway (+917719445029)"
        title="Open WhatsApp Alert Gateway (+917719445029)"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
        </div>
        <span className="hidden xs:inline font-semibold">WhatsApp +917719445029</span>
        {whatsappAlerts.length > 0 && (
          <span className="bg-emerald-950/60 text-emerald-100 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
            {whatsappAlerts.length}
          </span>
        )}
      </button>

      {/* Main Content Router */}
      <main className="flex-1 pb-20 sm:pb-8">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'auth' && <AuthView />}
        {currentView === 'onboarding' && <OnboardingView />}
        {currentView === 'app' && (
          <>
            {activeRole === 'parent' ? <ParentDashboard /> : <AdminPanel />}
          </>
        )}
      </main>

      {/* Mobile Bottom Thumb Navigation (Active when logged in and inside portal) */}
      {user && currentView === 'app' && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-lg flex items-center justify-around">
          <button
            onClick={() => setActiveRole('parent')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeRole === 'parent'
                ? 'text-blue-900 dark:text-blue-400 font-black'
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`}
          >
            <UserCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Parent View</span>
          </button>

          <button
            onClick={() => setActiveRole('admin')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeRole === 'admin'
                ? 'text-amber-600 dark:text-amber-400 font-black'
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Admin Desk</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
