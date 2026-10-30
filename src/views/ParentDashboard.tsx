import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentIDCardModal } from '../components/StudentIDCardModal';
import {
  CalendarCheck,
  CreditCard,
  BookOpen,
  Award,
  MessageSquare,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  Send,
  Printer,
  ChevronRight,
  Info,
  Check,
  X,
  FileText,
  Star,
  ShieldCheck,
  HelpCircle,
  IdCard,
  RotateCw,
  Copy
} from 'lucide-react';
import { LeaveType } from '../types';

export const ParentDashboard: React.FC = () => {
  const {
    student,
    attendance,
    leaves,
    fees,
    homework,
    exams,
    comments,
    applyLeave,
    payFee,
    toggleHomework,
    parentAcknowledgeHomework,
    simulateToast,
    setIsWhatsAppModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves' | 'fees' | 'homework' | 'exams' | 'remarks' | 'ai' | 'idcard'>('attendance');
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [inlineCardFlipped, setInlineCardFlipped] = useState(false);
  const [copiedAdm, setCopiedAdm] = useState(false);

  // Homework filters & sign-off state
  const [hwSubjectFilter, setHwSubjectFilter] = useState<string>('all');
  const [hwStatusFilter, setHwStatusFilter] = useState<'all' | 'pending' | 'completed' | 'checked'>('all');
  const [signingHwId, setSigningHwId] = useState<string | null>(null);
  const [parentSignNote, setParentSignNote] = useState('');
  const [showPrintChecklist, setShowPrintChecklist] = useState(false);

  // Apply Leave Modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'sick' as LeaveType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    isHalfDay: false
  });

  // Pay Fee Modal state
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI (Google Pay / PhonePe)' | 'Credit / Debit Card' | 'NetBanking'>('UPI (Google Pay / PhonePe)');
  const [showReceiptFeeId, setShowReceiptFeeId] = useState<string | null>(null);

  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  // Today's attendance status calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(a => a.date === todayStr);

  // Total statistics for attendance
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'present').length;
  const leaveDays = attendance.filter(a => a.status === 'approved_leave').length;
  const halfDays = attendance.filter(a => a.status === 'half_day').length;
  const absentDays = attendance.filter(a => a.status === 'absent').length;
  const attendanceRate = totalDays > 0 ? Math.round(((presentDays + leaveDays * 0.9 + halfDays * 0.5) / totalDays) * 1000) / 10 : 94.2;

  // Handle Apply Leave submit
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.reason.trim()) {
      simulateToast('Reason Required', 'Please enter a brief explanation for the leave request.', 'warning');
      return;
    }
    applyLeave(leaveForm);
    setShowLeaveModal(false);
    setLeaveForm({
      leaveType: 'sick',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: '',
      isHalfDay: false
    });
  };

  // Handle Pay Fee submit
  const handleConfirmPayment = () => {
    if (!payingFeeId) return;
    payFee(payingFeeId, paymentMethod);
    setShowReceiptFeeId(payingFeeId);
    setPayingFeeId(null);
  };

  // Handle AI Leave letter or revision plan
  const handleAskAI = async (type: 'leave_letter' | 'revision') => {
    setAiLoading(true);
    setAiOutput(null);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          studentName: student.fullName,
          reason: leaveForm.reason || 'seasonal flu and fever',
          dates: `${leaveForm.startDate} to ${leaveForm.endDate}`
        })
      });
      const data = await res.json();
      setAiOutput(data.content);
    } catch {
      setAiOutput('Could not load AI response. Please check connection.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Student Profile & Live Status Hero Card */}
      <div className="mb-6 p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={student.avatarUrl || '/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png'}
                alt={student.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                  {student.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-extrabold text-xs">
                  Class {student.grade}-{student.section}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-extrabold text-xs font-mono">
                  Adm No: {student.admissionNo}
                </span>
                <span className="text-xs text-slate-400">
                  Roll #{student.rollNo}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Parent: <strong>{student.fatherName}</strong> • Phone: {student.parentPhone} • Locality: {student.address.split(',')[1] || 'Punjab'}
              </p>
            </div>
          </div>

          {/* Today's Real-time Attendance Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Today's School Status:</span>
                <span
                  className={`font-black px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wide ${
                    todayRecord?.status === 'present'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : todayRecord?.status === 'approved_leave'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                      : todayRecord?.status === 'half_day'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {todayRecord ? todayRecord.status.replace('_', ' ') : 'Present (08:08 AM)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Punch In: <strong>{todayRecord?.checkInTime || '08:08 AM'}</strong> (Biometric RFID Gate 1)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowIdCardModal(true)}
                className="px-3.5 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/70 text-blue-900 dark:text-blue-300 font-extrabold text-xs border border-blue-200 dark:border-blue-800 transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                title="View Student Digital ID Card (Photo, Name, Adm No, Class)"
              >
                <IdCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Digital ID Card</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="px-3.5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300 dark:border-emerald-800 transition flex items-center gap-2 cursor-pointer"
                title="View WhatsApp Alerts & Direct Chat (+917719445029)"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">WhatsApp Alerts</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('leaves');
                  setShowLeaveModal(true);
                }}
                className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Apply for Leave</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4 text-emerald-400" />
          <span>Attendance Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'leaves'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Leave Applications</span>
          {leaves.some(l => l.status === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'fees'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>Fees [₹ INR]</span>
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'homework'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Homework Diary</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'exams'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Exam Results</span>
        </button>

        <button
          onClick={() => setActiveTab('remarks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'remarks'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Teacher Remarks</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Study Coach</span>
        </button>

        <button
          onClick={() => setActiveTab('idcard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'idcard'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <IdCard className="w-4 h-4 text-amber-400" />
          <span>Digital ID Card</span>
        </button>
      </div>

      {/* TAB 1: ATTENDANCE TRACKING */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Attendance Rate
              </span>
              <p className="text-2xl font-black text-blue-900 dark:text-blue-400 mt-1">
                {attendanceRate}%
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                Target: &gt;75% CBSE
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Present
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {presentDays} Days
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Regular hours</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                Approved Leave
              </span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {leaveDays} Days
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Sanctioned by School</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Half-Day
              </span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {halfDays} Day
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Early dismissal</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                Absent
              </span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {absentDays} Day
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Unexcused absence</p>
            </div>
          </div>

          {/* Detailed Daily Logs Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-heading">
                  Biometric Attendance History (October 2026)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time entry &amp; exit records via RFID Smart ID
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                School Hours: 08:00 AM - 02:30 PM
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Attendance Status</th>
                    <th className="p-4">Punch In Time</th>
                    <th className="p-4">Punch Out Time</th>
                    <th className="p-4">Log Details / Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attendance.map((rec) => (
                    <tr key={rec.date} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {rec.date}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] ${
                            rec.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : rec.status === 'approved_leave'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : rec.status === 'half_day'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {rec.status === 'present' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          {rec.status === 'approved_leave' && <Calendar className="w-3.5 h-3.5 text-purple-600" />}
                          {rec.status === 'half_day' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {rec.status === 'absent' && <X className="w-3.5 h-3.5 text-rose-600" />}
                          <span className="capitalize">{rec.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium">
                        {rec.checkInTime || '—'}
                      </td>

                      <td className="p-4 text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium">
                        {rec.checkOutTime || '—'}
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {rec.reason || 'Biometric Gate Sensor 1 (Verified)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEAVE APPLICATIONS & TRACKER */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Student Leave Application &amp; Live Status
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Submit requests for medical or family leave. When reviewed by the school admin, you will receive an instant push notification!
              </p>
            </div>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-5 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Leave Application</span>
            </button>
          </div>

          <div className="space-y-4">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-900 dark:text-blue-400">
                      Application #{leave.id}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide ${
                        leave.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : leave.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                      }`}
                    >
                      {leave.status === 'pending' ? 'Pending Admin Verification' : `Leave ${leave.status}`}
                    </span>
                    {leave.isHalfDay && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Half-Day Leave
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Period: {leave.startDate} {leave.startDate !== leave.endDate ? `to ${leave.endDate}` : ''} ({leave.leaveType.toUpperCase()} LEAVE)
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    Reason: "{leave.reason}"
                  </p>

                  {leave.adminNotes && (
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs">
                      <span className="font-bold text-blue-900 dark:text-blue-300">
                        School Principal / Admin Decision:
                      </span>{' '}
                      <span className="text-slate-700 dark:text-slate-200">{leave.adminNotes}</span>
                    </div>
                  )}
                </div>

                <div className="text-right text-xs text-slate-400 shrink-0">
                  <p>Applied on: {new Date(leave.appliedAt).toLocaleDateString('en-IN')}</p>
                  {leave.reviewedBy && (
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      Verified by: {leave.reviewedBy}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEES & ONLINE PAYMENTS (IN ₹ INR) */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Fee Balance Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Fee Account Summary [₹ INR]
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
                Outstanding Balance: ₹
                {fees
                  .filter(f => f.status !== 'paid')
                  .reduce((acc, curr) => acc + curr.amount, 0)
                  .toLocaleString('en-IN')}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official Tuition, Transportation, &amp; Smart Learning Services
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                GST Compliant Invoicing
              </span>
            </div>
          </div>

          {/* Fee Invoices Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fees.map((fee) => (
              <div
                key={fee.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {fee.term}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wide ${
                        fee.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : fee.status === 'overdue'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {fee.title}
                  </h3>
                  <p className="text-2xl font-black text-blue-900 dark:text-blue-400 my-2">
                    ₹{fee.amount.toLocaleString('en-IN')}
                  </p>

                  {/* Breakdown */}
                  <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {fee.breakdown.tuition > 0 && (
                      <div className="flex justify-between">
                        <span>Tuition &amp; Smart Class:</span>
                        <span>₹{fee.breakdown.tuition.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {fee.breakdown.activity > 0 && (
                      <div className="flex justify-between">
                        <span>Lab &amp; Sports Activities:</span>
                        <span>₹{fee.breakdown.activity.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {fee.breakdown.transport > 0 && (
                      <div className="flex justify-between">
                        <span>Transport Route Service:</span>
                        <span>₹{fee.breakdown.transport.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {fee.breakdown.examination > 0 && (
                      <div className="flex justify-between">
                        <span>CBSE Examination &amp; Papers:</span>
                        <span>₹{fee.breakdown.examination.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">Due: {fee.dueDate}</span>
                  {fee.status === 'paid' ? (
                    <button
                      onClick={() => setShowReceiptFeeId(fee.id)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setPayingFeeId(fee.id)}
                      className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pay Online [₹ INR]</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NEW COMPREHENSIVE HOMEWORK SECTION */}
      {activeTab === 'homework' && (
        <div className="space-y-6">
          {/* Header & Completion Progress Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Daily Homework Diary
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300">
                    Class {student.grade}-{student.section}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading mt-1">
                  Daily Assignments Per Subject
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Track homework assigned by class teachers, mark student completion, and digitally sign off for school records.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrintChecklist(true)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Print Daily Checklist</span>
                </button>
              </div>
            </div>

            {/* Daily Completion Progress Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              {(() => {
                const totalHw = homework.length;
                const completedHw = homework.filter(h => h.completed || h.status === 'checked').length;
                const percent = totalHw > 0 ? Math.round((completedHw / totalHw) * 100) : 0;

                return (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span>Today's Completion Progress:</span>
                        <strong className="text-blue-900 dark:text-blue-400">{completedHw} of {totalHw} Subjects Finished</strong>
                      </span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {percent}% Completed
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-900 via-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Subject Filter Pills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Subject:</span>
                </span>
                {['all', 'Mathematics', 'Science', 'English Literature', 'Punjabi', 'Social Science'].map((sub) => {
                  const count = sub === 'all' ? homework.length : homework.filter(h => h.subject.toLowerCase() === sub.toLowerCase()).length;
                  return (
                    <button
                      key={sub}
                      onClick={() => setHwSubjectFilter(sub)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        hwSubjectFilter === sub
                          ? 'bg-blue-900 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{sub === 'all' ? 'All Subjects' : sub}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        hwSubjectFilter === sub
                          ? 'bg-blue-800 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-400 mr-1">Status:</span>
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'pending', label: 'Due / Pending' },
                { id: 'completed', label: 'Completed by Student' },
                { id: 'checked', label: 'Checked by Teacher' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setHwStatusFilter(st.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    hwStatusFilter === st.id
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtered Homework Cards Grid */}
          {(() => {
            const filtered = homework.filter((item) => {
              const matchesSubject = hwSubjectFilter === 'all' || item.subject.toLowerCase() === hwSubjectFilter.toLowerCase();
              let matchesStatus = true;
              if (hwStatusFilter === 'pending') matchesStatus = !item.completed && item.status !== 'checked';
              if (hwStatusFilter === 'completed') matchesStatus = item.completed && item.status !== 'checked';
              if (hwStatusFilter === 'checked') matchesStatus = item.status === 'checked';
              return matchesSubject && matchesStatus;
            });

            if (filtered.length === 0) {
              return (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    All caught up!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    No homework matching the selected filters. Great job!
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((hw) => {
                  // Subject specific color styling
                  const getSubjectTheme = (sub: string) => {
                    const s = sub.toLowerCase();
                    if (s.includes('math')) return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-900 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800/60' };
                    if (s.includes('sci')) return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-900 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/60' };
                    if (s.includes('eng')) return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-900 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/60' };
                    if (s.includes('pun')) return { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-900 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800/60' };
                    return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-900 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800/60' };
                  };

                  const theme = getSubjectTheme(hw.subject);

                  return (
                    <div
                      key={hw.id}
                      className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border transition shadow-xs hover:shadow-md flex flex-col justify-between ${
                        hw.completed
                          ? 'border-emerald-300 dark:border-emerald-800/60'
                          : 'border-slate-200/90 dark:border-slate-800'
                      }`}
                    >
                      <div>
                        {/* Top bar with Subject, Target Class and Status Badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${theme.bg} ${theme.text} ${theme.border}`}>
                              {hw.subject}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">
                              Class {hw.grade || student.grade}-{hw.section || student.section}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              hw.status === 'checked'
                                ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200'
                                : hw.completed
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                                : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 animate-pulse'
                            }`}
                          >
                            {hw.status === 'checked' ? 'Checked by Teacher' : hw.completed ? 'Finished by Student' : 'Due / Pending'}
                          </span>
                        </div>

                        {/* Chapter / Topic Heading */}
                        {hw.chapterOrTopic && (
                          <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            {hw.chapterOrTopic}
                          </p>
                        )}

                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5 leading-snug">
                          {hw.title}
                        </h3>

                        {/* Instructions */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {hw.description}
                        </p>

                        {/* Metadata pills: Estimated Time & Required Materials */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
                          {hw.estimatedMinutes && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              <span>Est: ~{hw.estimatedMinutes} mins</span>
                            </span>
                          )}

                          {hw.materialsNeeded && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                              <span>🎒 {hw.materialsNeeded}</span>
                            </span>
                          )}
                        </div>

                        {/* Teacher Evaluation Remarks */}
                        {hw.teacherRemarks && (
                          <div className="mt-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-xs">
                            <span className="font-bold text-purple-900 dark:text-purple-300 block">
                              Teacher Feedback ({hw.teacherName}):
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 italic mt-0.5 block">
                              "{hw.teacherRemarks}"
                            </span>
                          </div>
                        )}

                        {/* Parent Digital Sign-off Stamped Badge */}
                        {hw.parentAcknowledged ? (
                          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <div>
                                <p className="font-extrabold text-emerald-900 dark:text-emerald-300 leading-tight">
                                  Parent Verified &amp; Signed
                                </p>
                                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                                  {hw.parentSignature || `Jasbir Singh (Father)`}
                                  {hw.parentNote ? ` • Note: "${hw.parentNote}"` : ''}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                              Stamped
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {/* Action buttons at bottom */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-400">
                          <span>Assigned: <strong>{hw.assignedDate}</strong></span> • <span className="text-amber-600 dark:text-amber-400 font-bold">Due: {hw.dueDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Parent Sign-off button */}
                          {!hw.parentAcknowledged && (
                            <button
                              onClick={() => {
                                setSigningHwId(hw.id);
                                setParentSignNote('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1"
                              title="Digitally sign off on this homework assignment"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Parent Sign-off</span>
                            </button>
                          )}

                          {/* Student completion toggle */}
                          <button
                            onClick={() => toggleHomework(hw.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              hw.completed
                                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{hw.completed ? 'Mark Incomplete' : 'Done by Student'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* MODAL: PARENT DIGITAL SIGN-OFF */}
      {signingHwId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-heading">
                  Parent Homework Verification
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Akal Galaxy Convent School Digital Diary Sign-off
                </p>
              </div>
            </div>

            <div className="my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <p className="text-slate-500">Subject: <strong className="text-slate-900 dark:text-white">{homework.find(h => h.id === signingHwId)?.subject}</strong></p>
              <p className="text-slate-500 mt-1">Topic: <strong className="text-slate-900 dark:text-white">{homework.find(h => h.id === signingHwId)?.title}</strong></p>
              <p className="text-slate-500 mt-1">Signing as: <strong className="text-blue-900 dark:text-blue-400">{student.fatherName} (Father of {student.fullName})</strong></p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Note for Subject Teacher (Optional)
              </label>
              <input
                type="text"
                value={parentSignNote}
                onChange={(e) => setParentSignNote(e.target.value)}
                placeholder="e.g. Verified notebook work. Guransh finished all questions neatly."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSigningHwId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  parentAcknowledgeHomework(signingHwId, parentSignNote);
                  setSigningHwId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Stamp Signature</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRINT DAILY CHECKLIST */}
      {showPrintChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <img
                src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
                alt="AGCS Logo"
                className="w-12 h-12 mx-auto object-contain mb-1.5"
              />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-heading">
                Akal Galaxy Convent School
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Daily Student Homework Checklist • Class {student.grade}-{student.section}
              </p>
              <p className="text-[11px] text-slate-400">Date: {todayStr} • Student: {student.fullName}</p>
            </div>

            {/* Printable Table */}
            <div className="py-4 space-y-2.5 max-h-80 overflow-y-auto">
              {homework.map((hw, idx) => (
                <div key={hw.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-blue-900 dark:text-blue-400">
                      {idx + 1}. {hw.subject}:
                    </span>{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">{hw.title}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{hw.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Due: {hw.dueDate} • Teacher: {hw.teacherName}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-block w-5 h-5 border-2 border-slate-400 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  window.print();
                  simulateToast('Printing', 'Print dialog opened for homework checklist.', 'info');
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Checklist</span>
              </button>

              <button
                onClick={() => setShowPrintChecklist(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXAM RESULTS */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    Official Report Card
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                    {exam.examTitle}
                  </h2>
                  <p className="text-xs text-slate-500">{exam.examDate} • Affiliated to CBSE Board</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-900 dark:text-blue-400 leading-none">
                      {exam.overallPercentage}%
                    </p>
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      Rank {exam.rankInClass} in Class (Grade {exam.grade})
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold">
                    <tr>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Marks (Out of 100)</th>
                      <th className="p-3">CBSE Grade</th>
                      <th className="p-3">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {exam.subjects.map((sub) => (
                      <tr key={sub.subject}>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{sub.subject}</td>
                        <td className="p-3 font-extrabold text-blue-900 dark:text-blue-400">{sub.marksObtained} / {sub.totalMarks}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                            {sub.grade}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{sub.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Principal Remarks */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
                <p className="font-bold text-amber-900 dark:text-amber-300">Principal Office Remark:</p>
                <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">"{exam.principalRemarks}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: TEACHER REMARKS */}
      {activeTab === 'remarks' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Teacher Feedback &amp; Student Conduct
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct communication from subject and class teachers.
            </p>
          </div>

          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{c.teacherName}</h3>
                    <span className="text-xs text-slate-500">({c.subjectOrRole})</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
                    {c.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{c.comment}"
                </p>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(c.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span>{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AI STUDY COACH & LEAVE ASSISTANT */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-black font-heading">AGCS AI Academic Coach &amp; Assistant</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Powered by the school learning intelligence. Generate formal leave letters for the principal in English, or get personalized revision plans based on term marks.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => handleAskAI('leave_letter')}
                disabled={aiLoading}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Draft Formal Leave Application</span>
              </button>

              <button
                onClick={() => handleAskAI('revision')}
                disabled={aiLoading}
                className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm transition flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Analyze Marks &amp; Study Schedule</span>
              </button>
            </div>
          </div>

          {aiLoading && (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Generating recommendations for {student.fullName}...</p>
            </div>
          )}

          {aiOutput && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-400">
                  Generated Result
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiOutput);
                    simulateToast('Copied to Clipboard', 'You can paste this directly into your leave application!', 'success');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold"
                >
                  Copy Text
                </button>
              </div>
              <pre className="text-xs font-sans whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                {aiOutput}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: DIGITAL ID CARD */}
      {activeTab === 'idcard' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                    Official Credential
                  </span>
                  <span className="text-xs text-blue-200">
                    Akal Galaxy Convent School
                  </span>
                </div>
                <h2 className="text-2xl font-black mt-1 font-heading text-white">
                  Student Digital Identity Card
                </h2>
                <p className="text-xs text-blue-200 max-w-xl mt-1">
                  Official school credential for <strong>{student.fullName}</strong>. Valid for campus security check-in, library borrowing, bus attendance, and CBSE examination halls.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowIdCardModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <IdCard className="w-4 h-4" />
                  <span>Open Fullscreen Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Card</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Card Presentation & Verification Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* The Visual Card */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="flex items-center justify-between w-full max-w-sm mb-2 px-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {inlineCardFlipped ? 'Showing Back Side (Emergency)' : 'Showing Front Side'}
                </span>
                <button
                  onClick={() => setInlineCardFlipped(!inlineCardFlipped)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Flip to {inlineCardFlipped ? 'Front' : 'Back'}</span>
                </button>
              </div>

              {/* Physical Card Mockup */}
              <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 shadow-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden relative select-none">
                {/* Lanyard punch hole cut-out */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-200/90 rounded-full border border-slate-300 shadow-inner z-20" />

                {!inlineCardFlipped ? (
                  /* FRONT */
                  <div>
                    <div className="pt-4 pb-3 px-3 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white relative overflow-hidden">
                      <div className="flex items-center gap-2.5 relative z-10">
                        <img
                          src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
                          alt="AGCS Crest"
                          className="w-12 h-12 object-contain drop-shadow-md shrink-0 bg-white/10 rounded-xl p-1"
                        />
                        <div className="min-w-0">
                          <span className="text-[13px] font-black tracking-tight uppercase leading-tight text-amber-400 block">
                            Akal Galaxy Convent School
                          </span>
                          <p className="text-[9px] text-blue-200 font-semibold tracking-wide uppercase">
                            Treasure of Virtues • Affiliated to CBSE
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                              CBSE CODE: 20491
                            </span>
                            <span className="text-[8px] text-slate-300 font-bold">
                              SESSION 2026–2027
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-500 px-3 py-1 flex items-center justify-between text-[10px] font-black text-slate-950 tracking-wider uppercase">
                      <span>Student Identity Card</span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-slate-950" />
                        RFID GATE ACCESS
                      </span>
                    </div>

                    <div className="p-4 bg-gradient-to-b from-white via-slate-50/50 to-white">
                      <div className="flex gap-3.5 items-start">
                        <div className="relative shrink-0">
                          <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-amber-500/80 shadow-md bg-white p-0.5">
                            <img
                              src={student.avatarUrl || '/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png'}
                              alt={student.fullName}
                              className="w-full h-full object-contain rounded-lg bg-slate-50"
                            />
                          </div>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-blue-900 text-amber-300 text-[8px] font-black border border-amber-400/60 shadow-xs whitespace-nowrap flex items-center gap-0.5">
                            <Sparkles className="w-2 h-2 text-amber-300" />
                            <span>AGCS SECURE</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-black text-slate-900 leading-tight tracking-tight uppercase">
                            {student.fullName}
                          </h3>

                          <div className="mt-1.5 space-y-1 text-xs">
                            <div className="flex items-center justify-between bg-blue-50 px-2 py-0.8 rounded-lg border border-blue-200/80">
                              <span className="text-[10px] font-extrabold text-blue-900 uppercase">Adm No:</span>
                              <span className="text-[11px] font-mono font-black text-blue-950">{student.admissionNo}</span>
                            </div>

                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Class:</span>
                              <span className="text-xs font-black text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                                Class {student.grade} - Section {student.section}
                              </span>
                            </div>

                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Roll No:</span>
                              <span className="text-xs font-black text-slate-800 font-mono">#{student.rollNo}</span>
                            </div>

                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Blood Grp:</span>
                              <span className="text-xs font-black text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                {student.bloodGroup || 'B+'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">DOB:</span>
                              <span className="text-[11px] font-semibold text-slate-700">{student.dob || '12-04-2013'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3.5 py-1 px-2 rounded-md bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border border-amber-300 text-[8px] font-mono text-slate-700 text-center tracking-widest uppercase overflow-hidden shadow-inner">
                        AKAL GALAXY CONVENT SCHOOL • AUTHENTIC STUDENT CREDENTIAL • CBSE 2026-27
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-end justify-between h-7 px-1 bg-white rounded border border-slate-200 py-1">
                            {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 3, 4, 1, 2, 3, 1, 2].map((w, i) => (
                              <div key={i} className="bg-slate-900 rounded-2xs" style={{ width: `${w}px`, height: i % 3 === 0 ? '100%' : '80%' }} />
                            ))}
                          </div>
                          <p className="text-[9px] font-mono text-center text-slate-500 font-bold tracking-wider mt-0.5">
                            {student.admissionNo}
                          </p>
                        </div>

                        <div className="w-13 h-13 p-1 rounded-lg bg-white border border-slate-300 shrink-0 flex items-center justify-center shadow-xs">
                          <svg viewBox="0 0 29 29" className="w-full h-full text-slate-900 fill-current">
                            <path d="M0 0h7v7H0zM1 1h5v5H1zM2 2h3v3H2z" />
                            <path d="M22 0h7v7h-7zM23 1h5v5h-5zM24 2h3v3h-3z" />
                            <path d="M0 22h7v7H0zM1 23h5v5H1zM2 24h3v3H2z" />
                            <rect x="9" y="1" width="2" height="2" />
                            <rect x="13" y="1" width="2" height="2" />
                            <rect x="17" y="1" width="2" height="2" />
                            <rect x="9" y="5" width="2" height="2" />
                            <rect x="15" y="4" width="3" height="2" />
                            <rect x="1" y="9" width="3" height="2" />
                            <rect x="5" y="11" width="2" height="3" />
                            <rect x="9" y="9" width="4" height="4" />
                            <rect x="15" y="9" width="2" height="2" />
                            <rect x="19" y="9" width="3" height="3" />
                            <rect x="24" y="10" width="3" height="2" />
                            <rect x="10" y="15" width="2" height="4" />
                            <rect x="14" y="14" width="3" height="3" />
                            <rect x="19" y="14" width="2" height="2" />
                            <rect x="23" y="15" width="4" height="2" />
                            <rect x="9" y="21" width="3" height="2" />
                            <rect x="14" y="20" width="2" height="3" />
                            <rect x="18" y="21" width="3" height="2" />
                            <rect x="9" y="25" width="2" height="3" />
                            <rect x="13" y="25" width="3" height="2" />
                            <rect x="18" y="25" width="2" height="3" />
                            <rect x="23" y="24" width="3" height="3" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 text-slate-300 px-3 py-1 text-[8px] flex items-center justify-between font-mono">
                      <span>RFID: #8420-AGCS-PB</span>
                      <span className="text-amber-400 font-bold">VALID TILL: 31-03-2027</span>
                    </div>
                  </div>
                ) : (
                  /* BACK */
                  <div>
                    <div className="pt-4 pb-2 px-3 bg-gradient-to-r from-blue-950 to-slate-900 text-white text-center">
                      <h4 className="text-[11px] font-black tracking-wide uppercase text-amber-400">
                        Akal Galaxy Convent School
                      </h4>
                      <p className="text-[8px] text-blue-200">
                        Emergency & Medical Verification
                      </p>
                    </div>

                    <div className="p-3.5 space-y-2.5 text-xs text-slate-800">
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">Father's Name</span>
                          <strong className="text-[11px] text-slate-900">{student.fatherName}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase block">Mother's Name</span>
                          <strong className="text-[11px] text-slate-900">{student.motherName}</strong>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80">
                          <span className="text-[10px] font-bold text-emerald-900">Parent Mobile:</span>
                          <strong className="text-xs font-mono text-emerald-950">{student.parentPhone}</strong>
                        </div>

                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-50 border border-rose-200/80">
                          <span className="text-[10px] font-bold text-rose-900">Emergency SOS:</span>
                          <strong className="text-xs font-mono text-rose-950">{student.emergencyContact || '+91 98140 12345'}</strong>
                        </div>

                        <div className="flex items-center justify-between p-1.5 rounded-lg bg-blue-50 border border-blue-200/80">
                          <span className="text-[10px] font-bold text-blue-900">Transport:</span>
                          <strong className="text-[11px] text-blue-950">Bus #04 (Route: Model Town)</strong>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">Address</span>
                        <p className="text-[10px] text-slate-700 font-medium leading-relaxed">{student.address}</p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                        <div className="text-[8px] text-slate-500 space-y-0.5">
                          <p>Helpline: +91 181 2456789</p>
                          <p>WhatsApp: +91 77194 45029</p>
                        </div>
                        <div className="text-right">
                          <div className="w-20 border-b border-dashed border-slate-400 pb-0.5 text-center">
                            <span className="font-serif italic font-bold text-blue-900 text-xs">S. Kaur</span>
                          </div>
                          <span className="text-[8px] font-black uppercase text-slate-800 tracking-wider">Principal's Seal</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 text-slate-400 px-3 py-1 text-[8px] text-center font-mono">
                      PROPERTY OF AKAL GALAXY CONVENT SCHOOL • JALANDHAR
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Verification & Features Panel */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                      Verification Credentials
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                    ACTIVE &amp; ENROLLED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Student Name
                    </span>
                    <strong className="text-sm text-slate-900 dark:text-white block mt-0.5">
                      {student.fullName}
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase block">
                      Admission Number
                    </span>
                    <div className="flex items-center justify-between mt-0.5">
                      <strong className="text-sm font-mono text-blue-950 dark:text-blue-200">
                        {student.admissionNo}
                      </strong>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(student.admissionNo);
                          setCopiedAdm(true);
                          setTimeout(() => setCopiedAdm(false), 2000);
                        }}
                        className="p-1 rounded hover:bg-blue-100 text-blue-600 cursor-pointer"
                        title="Copy Admission No"
                      >
                        {copiedAdm ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Grade &amp; Section
                    </span>
                    <strong className="text-sm text-slate-900 dark:text-white block mt-0.5">
                      Class {student.grade}-{student.section} (Roll #{student.rollNo})
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      School Affiliation
                    </span>
                    <strong className="text-sm text-slate-900 dark:text-white block mt-0.5">
                      CBSE Affiliation #1630982
                    </strong>
                  </div>
                </div>

                {/* Verification points */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-2">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    How to use this Digital ID:
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                    <li>Show this digital ID screen directly to school security guards at main gates.</li>
                    <li>The scannable QR code &amp; barcode automatically register entry at biometric RFID terminals.</li>
                    <li>Accepted as proof of identity during school bus pickup, inter-school competitions, and CBSE sports meets.</li>
                  </ul>
                </div>

                <div className="pt-1 flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowIdCardModal(true)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <IdCard className="w-4 h-4 text-amber-400" />
                    <span>View in Fullscreen &amp; Download</span>
                  </button>

                  <button
                    onClick={() => {
                      window.print();
                      simulateToast('Print Dialog Opened', 'Physical ID card printing triggered.', 'info');
                    }}
                    className="py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APPLY FOR LEAVE */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Submit Student Leave Request
              </h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Leave requests are verified by the school principal before being marked in attendance.
            </p>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Leave Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sick', label: 'Sick Leave' },
                    { id: 'family', label: 'Family Event' },
                    { id: 'medical', label: 'Medical Appointment' },
                    { id: 'planned', label: 'Planned Travel' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setLeaveForm({ ...leaveForm, leaveType: t.id as LeaveType })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        leaveForm.leaveType === t.id
                          ? 'bg-blue-900 text-white border-blue-900 dark:bg-blue-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="half-day-check"
                  type="checkbox"
                  checked={leaveForm.isHalfDay}
                  onChange={(e) => setLeaveForm({ ...leaveForm, isHalfDay: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-amber-500"
                />
                <label htmlFor="half-day-check" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Request as a Half-Day Leave (Morning or Afternoon)
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Absence
                </label>
                <textarea
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="e.g. Guransh is unwell with seasonal viral fever. Doctor advised rest."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAY ONLINE */}
      {payingFeeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Secure Fee Payment [₹ INR]
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Official payment gateway simulation for Akal Galaxy Convent School
            </p>

            <div className="my-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
              <span className="text-xs text-blue-900 dark:text-blue-300 block">Amount to Pay:</span>
              <span className="text-3xl font-black text-blue-900 dark:text-blue-300">
                ₹{fees.find(f => f.id === payingFeeId)?.amount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                Invoice: {fees.find(f => f.id === payingFeeId)?.title}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Payment Mode
              </label>
              {[
                'UPI (Google Pay / PhonePe)',
                'Credit / Debit Card',
                'NetBanking'
              ].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m as any)}
                  className={`w-full p-3 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition ${
                    paymentMethod === m
                      ? 'border-blue-900 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{m}</span>
                  {paymentMethod === m && <Check className="w-4 h-4 text-blue-900 dark:text-blue-400" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPayingFeeId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
              >
                Confirm &amp; Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: OFFICIAL RECEIPT VIEW */}
      {showReceiptFeeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800">
            {/* School Crest Receipt Header */}
            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <img
                src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
                alt="AGCS Logo"
                className="w-14 h-14 mx-auto object-contain mb-2"
              />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-heading">
                Akal Galaxy Convent School
              </h3>
              <p className="text-[11px] text-slate-500">Official Fee Payment Receipt</p>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {fees.find(f => f.id === showReceiptFeeId)?.invoiceNumber || 'AGCS-REC-8924'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {student.fullName} (Class {student.grade}-{student.section})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  ₹{fees.find(f => f.id === showReceiptFeeId)?.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span>{fees.find(f => f.id === showReceiptFeeId)?.paymentMethod || 'UPI'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span>{fees.find(f => f.id === showReceiptFeeId)?.paidDate || new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-center text-slate-500">
              This is an electronically generated official receipt. Verified with Accounts Department.
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  window.print();
                  simulateToast('Printing', 'Print dialog launched for receipt.', 'info');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => setShowReceiptFeeId(null)}
                className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DIGITAL STUDENT ID CARD */}
      <StudentIDCardModal
        isOpen={showIdCardModal}
        onClose={() => setShowIdCardModal(false)}
        student={student}
      />
    </div>
  );
};
