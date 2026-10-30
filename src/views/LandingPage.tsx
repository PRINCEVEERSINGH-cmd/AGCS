import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from '../components/PWAInstallButton';
import {
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  BookOpen,
  Award,
  Bell,
  Smartphone,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  GraduationCap,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setActiveRole } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does real-time attendance tracking work for parents?',
      a: 'When your child taps their RFID smart card at the school entrance gates (08:00 AM - 08:15 AM), the biometric gate logs the timestamp instantly. Parents receive a push notification and can view whether their child is Present, on a Half-Day, or marked on an Approved Leave.'
    },
    {
      q: 'How does the student leave application and admin verification work?',
      a: 'Parents or students submit a digital leave application specifying dates and reason (e.g. sick leave, family emergency). School administrators review the request on the Admin Desk and approve or deny it. Once decided, an instant push notification is delivered to the parent, and the student’s attendance record is automatically synchronized.'
    },
    {
      q: 'Can I pay school fees online in INR (₹) and get instant receipts?',
      a: 'Yes. The portal supports online payments in Indian Rupees (₹ INR) via UPI (Google Pay, PhonePe, Paytm), Debit/Credit cards, and NetBanking. Once paid, an official AGCS fee receipt with authorized invoice number is generated immediately for download.'
    },
    {
      q: 'Are my child records saved when I log out and log in again?',
      a: 'Absolutely. Everything is securely tied to your registered 10-digit Indian mobile number (+91) and verified Admission Number. When you log back in via OTP, your child’s attendance, fees, homework diary, and teacher remarks are restored automatically.'
    },
    {
      q: 'Why does new parent registration demand a School Admission Number?',
      a: 'To guarantee student safety and records integrity, new parent registration demands the child’s official school Admission Number (found on the school fee booklet or student ID card). This links the parent account exclusively to their authorized student.'
    },
    {
      q: 'What is the WhatsApp security alert rule?',
      a: 'For child safety, whenever a parent account is accessed from an unrecognized mobile number or new device, an instant security alert is triggered to the designated administration WhatsApp number (+917719445029).'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-amber-100/30 to-transparent dark:from-blue-950/30 dark:via-amber-950/10 pointer-events-none blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left Column: Headlines & CTA */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 text-xs font-bold mb-6 shadow-xs animate-fade-in">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Akal Galaxy Convent School • Treasure of Virtues</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-[1.15]">
                Smart School Portal for <span className="text-blue-900 dark:text-blue-400">Parents</span> &amp; <span className="text-amber-500">Students</span>
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Stay fully informed with live attendance tracking, instant leave approvals, transparent fee status in <strong>₹ INR</strong>, daily homework diary, and real-time push alerts from teachers.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={() => {
                    setActiveRole('parent');
                    setCurrentView('auth');
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2.5"
                >
                  <span>Open Parent Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    setActiveRole('admin');
                    setCurrentView('auth');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base border border-slate-300 dark:border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <span>Admin &amp; Teacher Desk</span>
                </button>
              </div>

              {/* App Store & Google Play install indicators */}
              <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M3.6 1.4L13.8 12 3.6 22.6c-.4-.3-.6-.8-.6-1.5V2.9c0-.7.2-1.2.6-1.5z" fill="#00D2FF" />
                    <path d="M17.1 8.7l-3.3 3.3 3.3 3.3 3.9-2.2c1.1-.6 1.1-1.6 0-2.2l-3.9-2.2z" fill="#FFCE00" />
                    <path d="M13.8 12L3.6 1.4C4.1 1 5 1.2 5.9 1.7l11.2 6.4-3.3 3.9z" fill="#00F076" />
                    <path d="M13.8 12l3.3 3.9-11.2 6.4c-.9.5-1.8.7-2.3.3L13.8 12z" fill="#FF3A44" />
                  </svg>
                  <span>Google Play (PWA Ready)</span>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.67 1.37-.57.65-1.06 1.71-.93 2.73 1.03.08 2.07-.5 2.68-1.25z" />
                  </svg>
                  <span>Apple App Store (iOS PWA)</span>
                </div>

                <PWAInstallButton />
              </div>
            </div>

            {/* Right Column: Interactive School Crest & Live Portal Preview Card */}
            <div className="w-full lg:w-5/12 max-w-md">
              <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />

                {/* Crest Display */}
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
                    alt="Akal Galaxy Convent School Crest"
                    className="w-16 h-16 object-contain drop-shadow-md"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Affiliated Institution
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight font-heading">
                      Akal Galaxy Convent School
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      SPL • Treasure of Virtues
                    </p>
                  </div>
                </div>

                {/* Live Student Status Pill */}
                <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Attendance Today
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                      Present (08:08 AM)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-2">
                    Student: <strong>Guransh Singh</strong> • Class 8th-A (Roll #14)
                  </p>
                </div>

                {/* Mini Stat row */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Attendance Rate</p>
                    <p className="text-lg font-black text-blue-900 dark:text-blue-400 mt-0.5">94.2%</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">12-Day Streak</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Fee Status</p>
                    <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">₹14,800</p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-300 font-bold">Due 15 Nov 2026</p>
                  </div>
                </div>

                {/* Instant Leave Status Alert Pill */}
                <div className="mt-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-purple-900 dark:text-purple-300 font-semibold">
                      Student Leave Verification Desk
                    </span>
                  </div>
                  <span className="font-bold text-purple-700 dark:text-purple-400">Admin Approved</span>
                </div>

                {/* Action button inside preview */}
                <button
                  onClick={() => setCurrentView('auth')}
                  className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Experience Interactive Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified User Counts & Metric Stats */}
      <section className="py-10 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-900 dark:text-blue-400 font-heading">
                1,250+
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Active Enrolled Students
              </p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-500 font-heading">
                98.6%
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Parent Portal Satisfaction
              </p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                100%
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                CBSE Board Examination Pass Rate
              </p>
            </div>

            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400 font-heading">
                48+
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Certified Expert Faculty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            Everything Parents Need to Know, in Real Time
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Designed specifically for school parents in India, with clear ₹ INR fees, instant Punjabi/English friendly diary, and RFID presence logging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Attendance */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 flex items-center justify-center mb-4">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-heading">
              Live Attendance &amp; RFID Tracking
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Real-time gate punch logs. See whether your child is Present during school hours, on an approved leave, half-day, or absent.
            </p>
          </div>

          {/* Feature 2: Leave Application & Approval */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-heading">
              Student Leave Application &amp; Approval
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Submit digital leave requests with reason and dates. School admin approves or denies with remarks, sending an instant push notification to parents.
            </p>
          </div>

          {/* Feature 3: Fee Management */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-heading">
              Transparent Fees in ₹ INR
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Check fees due, paid, or pending. Simulate instant online payments with authorized receipt downloads and GST breakdown.
            </p>
          </div>

          {/* Feature 4: Homework Diary */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-heading">
              Daily Homework &amp; Class Diary
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Subject-wise homework with submission deadlines, teacher instructions, and completion status toggles.
            </p>
          </div>

          {/* Feature 5: Exam Results */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-heading">
              Exam Results &amp; Report Cards
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              View Term &amp; Half-Yearly marks out of 100, class ranks, CBSE grade rubrics, and printable mark sheets with the school crest.
            </p>
          </div>

          {/* Feature 6: WhatsApp & Security Rule */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-heading">
              WhatsApp Security Alerts (+917719445029)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              When someone logs in from a different mobile number or changes emergency data, an automatic alert is dispatched immediately.
            </p>
          </div>
        </div>
      </section>

      {/* School Fee Structure / Transparent Pricing in [₹ INR] */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              Standardized Fee Structure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
              Transparent Tuition &amp; Academic Plans [₹ INR]
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Official quarterly fee brackets for Akal Galaxy Convent School students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Primary Wing */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Primary Wing (Classes 1 - 5)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Foundation learning &amp; activities</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹11,500</span>
                <span className="text-xs text-slate-500"> / quarter</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Smart classroom audio-visual access</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Activity kit &amp; foundational arts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> RFID attendance gate tracking</li>
              </ul>
              <button
                onClick={() => setCurrentView('auth')}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                View Fee Breakdown
              </button>
            </div>

            {/* Middle Wing (Featured) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-900 dark:border-blue-500 shadow-xl relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-900 text-white text-[10px] font-extrabold tracking-wide uppercase">
                Current Class 8-A Plan
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Middle Wing (Classes 6 - 8)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Comprehensive CBSE scholastic curriculum</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-blue-900 dark:text-blue-400">₹14,800</span>
                <span className="text-xs text-slate-500"> / quarter</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Science &amp; Computer laboratory practicals</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Term exam papers &amp; grading analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Digital homework diary &amp; teacher remarks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Sports &amp; athletics coaching</li>
              </ul>
              <button
                onClick={() => setCurrentView('auth')}
                className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
              >
                Pay Online / Check Invoice
              </button>
            </div>

            {/* Senior Wing */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Senior Wing (Classes 9 - 12)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Board preparations &amp; career guidance</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹18,500</span>
                <span className="text-xs text-slate-500"> / quarter</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Advanced Physics, Chem &amp; Bio labs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Pre-board mock assessments</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Olympiad &amp; career mentorship</li>
              </ul>
              <button
                onClick={() => setCurrentView('auth')}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                View Fee Breakdown
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Parent Questions &amp; Answers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Learn more about biometric attendance, leave approvals, and digital security.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base flex items-center justify-between text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
              alt="AGCS Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <p className="font-bold text-white">Akal Galaxy Convent School (AGCS)</p>
              <p className="text-[11px] text-slate-500">Motto: Treasure of Virtues • Currency: ₹ INR</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <button onClick={() => setCurrentView('auth')} className="hover:text-white transition">
              Parent Portal
            </button>
            <button
              onClick={() => {
                setActiveRole('admin');
                setCurrentView('auth');
              }}
              className="hover:text-white transition text-amber-400 font-bold"
            >
              Admin Desk
            </button>
            <span>Alerts: +917719445029</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
