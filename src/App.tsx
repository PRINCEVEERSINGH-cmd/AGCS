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
import {
  CalendarCheck,
  CreditCard,
  Building,
  ShieldCheck,
  BookOpen,
  Home,
  UserCheck
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, activeRole, setActiveRole, user, setCurrentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Offline Status Bar */}
      <OfflineBanner />

      {/* Persistent App Header */}
      <Header />

      {/* Toast Alert Notifications */}
      <Toast />

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
