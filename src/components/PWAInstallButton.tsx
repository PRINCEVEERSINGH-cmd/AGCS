import React, { useEffect, useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return { isInstallable: !!deferredPrompt, isInstalled, isIOS, install };
}

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md hover:shadow-lg transition active:scale-95 ${
          compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'
        }`}
        aria-label="Install AGCS App"
      >
        <Download className="w-4 h-4" />
        <span>Install AGCS App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className={`flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition ${
            compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'
          }`}
          aria-label="Install app on iPhone"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Install on iPhone</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
                  alt="AGCS Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Install AGCS on iOS</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add to home screen for full app experience</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs shrink-0">1</span>
                  <span>Tap the <strong className="text-slate-900 dark:text-white">Share</strong> icon <Share2 className="inline w-4 h-4 text-blue-500" /> at the bottom of Safari.</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs shrink-0">2</span>
                  <span>Scroll down and select <strong className="text-slate-900 dark:text-white">Add to Home Screen</strong> <PlusSquare className="inline w-4 h-4 text-blue-500" />.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-6 w-full rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 text-sm transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-inner">
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      <span>Offline Mode — Displaying cached student records. Changes will sync once internet restores.</span>
    </div>
  );
};
