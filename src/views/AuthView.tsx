import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  ArrowLeft,
  IdCard,
  FileCheck2
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, setCurrentView } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [admissionNo, setAdmissionNo] = useState('AGCS/2021/842');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4']);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'signup') {
      const cleanAdm = admissionNo.trim();
      if (!cleanAdm) {
        setErrorMsg('Official Student Admission Number is strictly demanded to register a parent account.');
        return;
      }
      if (cleanAdm.length < 3) {
        setErrorMsg('Please enter a valid school Admission Number (e.g., AGCS/2021/842).');
        return;
      }
    }

    const rawDigits = phoneNumber.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    const fullPhone = '+91' + rawDigits.slice(-10);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedDemoOtp(data.demoCode || '1234');
        setOtpStep(true);
      } else {
        setErrorMsg(data.error || 'Failed to send OTP');
      }
    } catch {
      // Offline fallback
      setGeneratedDemoOtp('1234');
      setOtpStep(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const enteredCode = otpCode.join('');
    if (enteredCode.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code');
      return;
    }

    setIsLoading(true);
    const fullPhone = '+91' + phoneNumber.replace(/\D/g, '').slice(-10);

    try {
      await login(
        fullPhone,
        'parent',
        undefined,
        authMode === 'signup' ? admissionNo.trim().toUpperCase() : undefined
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'Apple' | 'Facebook') => {
    if (authMode === 'signup' && !admissionNo.trim()) {
      setErrorMsg('Official Admission Number is required before linking with ' + provider);
      return;
    }
    setIsLoading(true);
    setTimeout(async () => {
      await login(
        '+919876543210',
        'parent',
        `Demo Parent (${provider})`,
        authMode === 'signup' ? admissionNo.trim().toUpperCase() : undefined
      );
      setIsLoading(false);
    }, 600);
  };

  const handleQuickParentDemo = async () => {
    setIsLoading(true);
    await login('+919876543210', 'parent', 'Jasbir Singh');
    setIsLoading(false);
  };

  const handleQuickNewPhoneAlert = async () => {
    // Triggers WhatsApp Alert to +917719445029
    setIsLoading(true);
    await login('+917719445029', 'parent', 'Manjinder Singh');
    setIsLoading(false);
  };

  const handleQuickAdminDemo = async () => {
    setIsLoading(true);
    await login('+919800000001', 'admin', 'Principal Dr. H.S. Gill');
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 py-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back to landing button */}
        <button
          onClick={() => setCurrentView('landing')}
          className="mb-4 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* School Crest & Header */}
        <div className="text-center mb-6">
          <img
            src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
            alt="Akal Galaxy Convent School"
            className="w-16 h-16 mx-auto object-contain drop-shadow-md mb-2"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900 dark:text-blue-400 font-heading tracking-tight">
            Akal Galaxy Convent School
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Parent & Student Digital Portal
          </p>

          {/* Login / Sign Up Tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => {
                setAuthMode('login');
                setOtpStep(false);
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition ${
                authMode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setOtpStep(false);
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition ${
                authMode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              New Parent Registration
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Phone & Admission Number Input */}
        {!otpStep ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Demanded Admission Number on Parent Registration */}
            {authMode === 'signup' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admission-input"
                    className="block text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5"
                  >
                    <IdCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Student Admission Number</span>
                  </label>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200">
                    Mandatory
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="admission-input"
                    type="text"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value.toUpperCase())}
                    placeholder="e.g. AGCS/2021/842"
                    className="w-full px-3.5 py-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-sm font-mono font-bold tracking-wider text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-amber-900/80 dark:text-amber-300/80">
                  <span>Demanded from student ID card or school fee book.</span>
                  <button
                    type="button"
                    onClick={() => setAdmissionNo('AGCS/2021/842')}
                    className="font-bold underline hover:text-amber-950 dark:hover:text-amber-100"
                  >
                    Demo No
                  </button>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="mobile-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Mobile Number (India)
              </label>
              <div className="relative flex rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition overflow-hidden">
                <span className="inline-flex items-center px-3.5 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 select-none">
                  🇮🇳 +91
                </span>
                <input
                  id="mobile-input"
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-3.5 py-3 text-sm font-semibold text-slate-900 dark:text-white bg-transparent outline-none"
                  autoFocus={authMode === 'login'}
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                All school data and child updates are safely keyed to this mobile number.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-98 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Sending OTP...</span>
              ) : (
                <>
                  <span>Get Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: 4-Digit OTP Input */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-xs text-amber-900 dark:text-amber-200 font-medium block">
                Verification code sent to <strong>+91 {phoneNumber}</strong>
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block mt-1">
                Demo Quick Code: <span className="underline decoration-wavy">{generatedDemoOtp || '1234'}</span>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center">
                Enter 4-Digit OTP Code
              </label>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={otpCode[index] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const nextCode = [...otpCode];
                      nextCode[index] = val;
                      setOtpCode(nextCode);
                      if (val && index < 3) {
                        const nextInput = document.getElementById(`otp-${index + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-xl font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
              >
                Change mobile number
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpCode(['1', '2', '3', '4']);
                  setGeneratedDemoOtp('1234');
                }}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Resend Code
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying...' : 'Verify & Enter Portal'}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-6 relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 shrink-0">
            Or continue with
          </span>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-3 gap-2">
          {/* Google */}
          <button
            onClick={() => handleSocialLogin('Google')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
            aria-label="Sign in with Google"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden xs:inline">Google</span>
          </button>

          {/* Apple ID */}
          <button
            onClick={() => handleSocialLogin('Apple')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
            aria-label="Sign in with Apple"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.67 1.37-.57.65-1.06 1.71-.93 2.73 1.03.08 2.07-.5 2.68-1.25z" />
            </svg>
            <span className="hidden xs:inline">Apple ID</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
            aria-label="Sign in with Facebook"
          >
            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="hidden xs:inline">Facebook</span>
          </button>
        </div>

        {/* Quick Demo Credentials Box for Instant Testing */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Demo Profiles
          </p>
          <div className="space-y-2">
            <button
              onClick={handleQuickParentDemo}
              className="w-full p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-left transition flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-blue-950 dark:text-blue-300">
                  Demo Parent: Guransh's Father
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  +91 98765 43210 (Has fees, attendance, pending leave)
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Instant &rarr;</span>
            </button>

            <button
              onClick={handleQuickNewPhoneAlert}
              className="w-full p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-left transition flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                  <span>New Number Login (+91 77194 45029)</span>
                </p>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Triggers WhatsApp alert to +917719445029
                </p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Test Alert &rarr;</span>
            </button>

            <button
              onClick={handleQuickAdminDemo}
              className="w-full p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-left transition flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  School Admin / Principal Desk
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Verify leaves, mark attendance, update fees
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Admin &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
