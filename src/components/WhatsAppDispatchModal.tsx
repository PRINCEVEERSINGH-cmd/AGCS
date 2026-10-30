import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  ExternalLink,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Phone,
  RefreshCw,
  Bell,
  Smartphone,
  Info
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppDispatchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { whatsappAlerts, sendWhatsAppAlert, simulateToast } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [customMsg, setCustomMsg] = useState('🚨 AGCS Notification: Attendance and academic notice from Akal Galaxy Convent School for +917719445029.');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'launcher' | 'auto_setup' | 'history'>('launcher');

  const targetNumber = '+917719445029';
  const cleanPhone = '917719445029';

  // Load gateway config on mount
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/gateway/whatsapp/config')
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setApiKey(data.config.callmebotApiKey || '');
          setWebhookUrl(data.config.customWebhookUrl || '');
          setAutoDispatch(data.config.autoDispatchEnabled ?? true);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/gateway/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callmebotApiKey: apiKey,
          customWebhookUrl: webhookUrl,
          autoDispatchEnabled: autoDispatch
        })
      });
      const data = await res.json();
      if (data.success) {
        simulateToast('Gateway Config Saved', 'WhatsApp automated push preferences updated.', 'success');
        setTestResult('✅ Configuration saved successfully! Automated push is now active.');
      }
    } catch (err: any) {
      setTestResult(`❌ Error saving settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendLiveTest = async () => {
    if (!customMsg.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      await sendWhatsAppAlert('admin_broadcast', customMsg);
      const waMeUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMsg)}`;
      setTestResult(`✅ Dispatched! If automated carrier delivery is not configured with an API key, click below to open directly in WhatsApp.`);
    } catch (err: any) {
      setTestResult(`❌ Failed to send: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const openDirectWhatsApp = (messageText: string) => {
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight font-heading">
                  WhatsApp Alert Gateway Desk
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/25 text-white uppercase">
                  Live
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
                <span>Configured Recipient:</span>
                <strong className="underline underline-offset-2">{targetNumber}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 sm:px-6 pt-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('launcher')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === 'launcher'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>1-Tap WhatsApp Launcher</span>
          </button>

          <button
            onClick={() => setActiveTab('auto_setup')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === 'auto_setup'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Automated Background Push Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 shrink-0 ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alerts Sent ({whatsappAlerts.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-800 dark:text-slate-200">
          
          {/* TAB 1: 1-TAP WHATSAPP LAUNCHER */}
          {activeTab === 'launcher' && (
            <div className="space-y-4">
              {/* Explanation Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                      Why are WhatsApp messages not automatically ringing your phone?
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                      WhatsApp does not allow unverified web servers to push silent unsolicited messages into personal phone numbers without either:
                    </p>
                    <ul className="text-xs text-emerald-800 dark:text-emerald-300 mt-2 space-y-1 list-disc list-inside">
                      <li><strong>Instant 1-Tap Launch:</strong> Tap the big green button below to immediately open WhatsApp with the alert pre-filled directly to <strong>{targetNumber}</strong>!</li>
                      <li><strong>Automated Carrier Push:</strong> Activate the free CallMeBot gateway in the second tab to allow background automated push notifications.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Direct Open WhatsApp Button */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Direct Official WhatsApp Link
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {targetNumber}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Opens WhatsApp mobile app or WhatsApp Web directly to {targetNumber}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openDirectWhatsApp(customMsg)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open WhatsApp (+917719445029)</span>
                </button>
              </div>

              {/* Custom Message Dispatcher & Presets */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Custom Alert Message to Dispatch:
                </label>
                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1 self-center">Templates:</span>
                  <button
                    type="button"
                    onClick={() => setCustomMsg(`🚨 AGCS Security Alert: New login detected from mobile number on ${new Date().toLocaleTimeString('en-IN')}. Verify legitimate parent access.`)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    + Security Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomMsg(`💳 AGCS Fee Confirmation: Payment of ₹3,200 received for Guransh Singh (Adm #AGCS/2021/842). Receipt: AGCS-REC-${Math.floor(10000 + Math.random() * 90000)}.`)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    + Fee Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomMsg(`✅ AGCS Leave Update: Student leave request for Guransh Singh has been APPROVED by Principal Office.`)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    + Leave Approval
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomMsg(`📚 AGCS Homework Reminder: Mathematics Chapter 9 Exercises due tomorrow for Class 8-A.`)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    + Homework Notice
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSendLiveTest}
                    disabled={isTesting}
                    className="flex-1 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isTesting ? 'Dispatching...' : 'Dispatch to Gateway Server'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openDirectWhatsApp(customMsg)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Pre-filled WhatsApp Now</span>
                  </button>
                </div>

                {testResult && (
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white">
                    <p>{testResult}</p>
                    <button
                      type="button"
                      onClick={() => openDirectWhatsApp(customMsg)}
                      className="mt-2 text-emerald-600 dark:text-emerald-400 font-bold underline flex items-center gap-1"
                    >
                      <span>Click here to launch WhatsApp immediately with this alert</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AUTOMATED BACKGROUND PUSH SETUP (CallMeBot) */}
          {activeTab === 'auto_setup' && (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-950 dark:text-blue-200 text-sm">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>How to Get Free Automatic WhatsApp Push Notifications</span>
                </div>
                <p className="text-blue-900 dark:text-blue-300 leading-relaxed">
                  To receive background messages directly in WhatsApp on <strong>{targetNumber}</strong> without needing to click links, connect your personal free <strong>CallMeBot Gateway</strong> (takes 10 seconds):
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-blue-950 dark:text-blue-200 font-medium pl-1">
                  <li>
                    Open WhatsApp on your phone ({targetNumber}) and chat with <strong>+34 941 08 09 44</strong> or{' '}
                    <a
                      href="https://wa.me/34941080944?text=I%20allow%20callmebot%20to%20send%20me%20messages"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 font-bold underline"
                    >
                      click this quick link
                    </a>.
                  </li>
                  <li>
                    Send this message: <code>I allow callmebot to send me messages</code>
                  </li>
                  <li>
                    The bot will reply instantly with your free personal <strong>API Key</strong> (e.g. <code>928174</code>).
                  </li>
                  <li>
                    Paste that key into the box below and click <strong>Save &amp; Activate</strong>!
                  </li>
                </ol>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CallMeBot Personal API Key (for {targetNumber})
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="e.g. 948172"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Once set, all AGCS security alerts and notifications are pushed automatically to your WhatsApp.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Custom Webhook URL (Twilio, Zapier, Make, or Meta Cloud API)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-webhook-endpoint.com/agcs-alerts"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_dispatch_toggle"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <label htmlFor="auto_dispatch_toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Enable automated background dispatch on every security &amp; school event
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save & Activate Automated Push'}</span>
                </button>
              </div>

              {testResult && (
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white">
                  {testResult}
                </div>
              )}
            </form>
          )}

          {/* TAB 3: ALERT LOGS & DIRECT SEND */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Alerts logged for {targetNumber}</span>
                <span>Click any alert to launch directly in WhatsApp</span>
              </div>

              <div className="space-y-2">
                {whatsappAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 uppercase">
                          {alert.event.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {alert.automatedSent && (
                          <span className="text-[10px] text-emerald-600 font-bold">
                            • Auto Pushed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium break-words">
                        {alert.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openDirectWhatsApp(alert.message)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in WhatsApp</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Target: <strong>+917719445029</strong> (End-to-End Encrypted)</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
