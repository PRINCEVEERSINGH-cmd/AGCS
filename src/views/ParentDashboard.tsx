import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  HelpCircle
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
    simulateToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves' | 'fees' | 'homework' | 'exams' | 'remarks' | 'ai'>('attendance');

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
                <span className="text-xs text-slate-400">
                  Roll #{student.rollNo} • Adm: {student.admissionNo}
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

            <button
              onClick={() => {
                setActiveTab('leaves');
                setShowLeaveModal(true);
              }}
              className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Leave</span>
            </button>
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

      {/* TAB 4: HOMEWORK DIARY */}
      {activeTab === 'homework' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Daily Class Homework Diary
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mark homework as submitted and view teacher evaluation remarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homework.map((hw) => (
              <div
                key={hw.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300">
                      {hw.subject}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hw.completed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {hw.completed ? 'Submitted' : 'Pending'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {hw.description}
                  </p>

                  {hw.teacherRemarks && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs">
                      <span className="font-bold text-amber-900 dark:text-amber-300">Teacher Remarks:</span>{' '}
                      <span className="text-slate-700 dark:text-slate-300">{hw.teacherRemarks}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Due: <strong>{hw.dueDate}</strong></span>
                  <button
                    onClick={() => toggleHomework(hw.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      hw.completed
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{hw.completed ? 'Mark Incomplete' : 'Mark Completed'}</span>
                  </button>
                </div>
              </div>
            ))}
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
    </div>
  );
};
