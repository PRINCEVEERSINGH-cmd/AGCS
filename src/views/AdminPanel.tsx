import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  MessageSquare,
  AlertTriangle,
  User,
  BookOpen,
  Star,
  Send,
  PhoneCall,
  Search,
  Filter,
  Check,
  X,
  Lock,
  Unlock,
  Server,
  Database,
  Wifi,
  RefreshCw,
  Radio,
  Cpu,
  ExternalLink,
  Key
} from 'lucide-react';
import { AttendanceStatus, FeeStatus, LeaveType } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    student,
    attendance,
    leaves,
    fees,
    homework,
    comments,
    whatsappAlerts,
    reviewLeave,
    markAttendance,
    deleteAttendanceRecord,
    updateFeeStatus,
    addFeeRecord,
    deleteFeeRecord,
    addTeacherComment,
    deleteTeacherComment,
    addHomework,
    updateHomework,
    deleteHomework,
    sendWhatsAppAlert,
    simulateToast,
    setIsWhatsAppModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leaves' | 'fees' | 'attendance' | 'comments' | 'homework' | 'alerts'>('leaves');

  // Backend Gateway status state
  const [gatewayStatus, setGatewayStatus] = useState<any>(null);
  const [isRefreshingGateway, setIsRefreshingGateway] = useState(false);
  const [testCustomAlertMsg, setTestCustomAlertMsg] = useState('⚠️ Test Security Broadcast from AGCS Central Administration Desk');
  const [testOtpPhone, setTestOtpPhone] = useState('+919876543210');
  const [testOtpResult, setTestOtpResult] = useState<string | null>(null);

  // Fetch gateway status
  const fetchGatewayStatus = async () => {
    setIsRefreshingGateway(true);
    try {
      const res = await fetch('/api/gateway/status');
      if (res.ok) {
        const data = await res.json();
        setGatewayStatus(data);
      }
    } catch {
      // offline fallback
    } finally {
      setIsRefreshingGateway(false);
    }
  };

  React.useEffect(() => {
    fetchGatewayStatus();
  }, []);

  // Leave review modal state
  const [reviewingLeaveId, setReviewingLeaveId] = useState<string | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'rejected'>('approved');
  const [adminNotes, setAdminNotes] = useState('');

  // Add Fee modal state
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [newFee, setNewFee] = useState({
    title: 'Computer Lab & STEM Activity Fee',
    term: 'Term 2 (2026)',
    amount: 2500,
    dueDate: '2026-11-20',
    status: 'pending' as FeeStatus,
    tuition: 0,
    activity: 2500,
    transport: 0,
    examination: 0
  });

  // Mark/Add Attendance modal state
  const [showMarkAttModal, setShowMarkAttModal] = useState(false);
  const [attForm, setAttForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'present' as AttendanceStatus,
    reason: '',
    punchIn: '08:05 AM'
  });

  // Add Teacher Remark state
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [newComment, setNewComment] = useState({
    teacherName: 'Mrs. Ravinder Kaur',
    subjectOrRole: 'Class Teacher (8-A)',
    category: 'academic' as 'academic' | 'discipline' | 'achievement' | 'sports',
    comment: 'Participated actively in the class science discussion and solved problems on board.',
    rating: 5
  });

  // Add & Edit Homework state
  const [showAddHwModal, setShowAddHwModal] = useState(false);
  const [editingHw, setEditingHw] = useState<any | null>(null);
  const [adminClassFilter, setAdminClassFilter] = useState('All Classes');
  const [adminHwSubjectFilter, setAdminHwSubjectFilter] = useState('All Subjects');

  const [newHw, setNewHw] = useState({
    grade: '8th',
    section: 'A',
    subject: 'Science',
    chapterOrTopic: 'Chapter 9: Light & Reflection Lab Activity',
    title: 'Concave & Convex Mirror Ray Diagrams',
    description: 'Draw ray diagrams of concave mirror focal length in the practical record book. Calculate focal distances.',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-10-31',
    teacherName: 'Dr. Anita Roy',
    estimatedMinutes: 30,
    materialsNeeded: 'Science Lab Manual, Geometry Box'
  });

  // Handle Leave Review submission
  const handleConfirmLeaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingLeaveId) return;
    reviewLeave(reviewingLeaveId, reviewDecision, adminNotes);
    setReviewingLeaveId(null);
    setAdminNotes('');
  };

  // Handle Add Fee
  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    addFeeRecord({
      title: newFee.title,
      term: newFee.term,
      amount: Number(newFee.amount),
      dueDate: newFee.dueDate,
      status: newFee.status,
      breakdown: {
        tuition: Number(newFee.tuition),
        activity: Number(newFee.activity),
        transport: Number(newFee.transport),
        examination: Number(newFee.examination)
      }
    });
    setShowAddFeeModal(false);
  };

  // Handle Mark Attendance
  const handleMarkAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    markAttendance(attForm.date, attForm.status, attForm.reason, attForm.punchIn);
    setShowMarkAttModal(false);
  };

  // Handle Add Teacher Comment
  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacherComment(newComment);
    setShowAddCommentModal(false);
  };

  // Handle Add Homework
  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    addHomework(newHw);
    setShowAddHwModal(false);
  };

  // Handle Update Homework
  const handleUpdateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHw) return;
    updateHomework(editingHw.id, {
      grade: editingHw.grade,
      section: editingHw.section,
      subject: editingHw.subject,
      chapterOrTopic: editingHw.chapterOrTopic,
      title: editingHw.title,
      description: editingHw.description,
      dueDate: editingHw.dueDate,
      teacherName: editingHw.teacherName,
      estimatedMinutes: Number(editingHw.estimatedMinutes) || 30,
      materialsNeeded: editingHw.materialsNeeded,
      teacherRemarks: editingHw.teacherRemarks,
      status: editingHw.status
    });
    setEditingHw(null);
  };

  const pendingLeavesCount = leaves.filter(l => l.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Security Badge */}
      <div className="mb-6 p-4 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                AGCS Administrator &amp; Teacher Desk
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Authorized
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Managing records for <strong>{student.fullName}</strong> • Adm #{student.admissionNo} • Roll #{student.rollNo} • Class {student.grade}-{student.section}
            </p>
          </div>
        </div>

        {/* WhatsApp security target pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Security WhatsApp: <strong>+917719445029</strong></span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'leaves'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Leave Approval Desk</span>
          {pendingLeavesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
              {pendingLeavesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Attendance Register</span>
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
          <span>Fee Records [₹ INR]</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'comments'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Teacher Remarks</span>
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'homework'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Homework Desk</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('alerts');
            fetchGatewayStatus();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
            activeTab === 'alerts'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Server className="w-4 h-4 text-emerald-400" />
          <span>Gateways &amp; Backend Desk</span>
        </button>
      </div>

      {/* TAB 1: LEAVE APPROVAL DESK (CRITICAL USER REQUIREMENT) */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Student Leave Application &amp; Approval System
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Admin decision directly reflects in attendance tracking and triggers instant push notifications to parents.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {pendingLeavesCount} Pending Verification
              </span>
            </div>
          </div>

          {/* List of Leave Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaves.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-extrabold text-blue-900 dark:text-blue-400">
                      Request #{item.id}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                        item.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                          : item.status === 'rejected'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 animate-pulse'
                      }`}
                    >
                      {item.status === 'pending' ? 'Pending Admin Action' : item.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Student:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.studentName} (Class {item.grade})
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Dates Requested:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.startDate} {item.startDate !== item.endDate ? `to ${item.endDate}` : '(Single Day)'}
                        {item.isHalfDay && ' [Half-Day Request]'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Leave Category:</span>
                      <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                        {item.leaveType} Leave
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block mb-1">Reason Stated:</span>
                      <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 italic">
                        "{item.reason}"
                      </p>
                    </div>

                    {item.adminNotes && (
                      <div className="pt-2">
                        <span className="text-slate-500 dark:text-slate-400 block mb-1">Admin Feedback:</span>
                        <p className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 font-medium">
                          {item.adminNotes} (Reviewed by: {item.reviewedBy || 'Admin Desk'})
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons for Pending or Re-decision */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setReviewingLeaveId(item.id);
                      setReviewDecision('approved');
                      setAdminNotes('Leave verified and granted. Student attendance updated accordingly.');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Leave</span>
                  </button>

                  <button
                    onClick={() => {
                      setReviewingLeaveId(item.id);
                      setReviewDecision('rejected');
                      setAdminNotes('Denied due to upcoming scheduled unit test examinations.');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Deny Leave</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE REGISTER */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Daily Attendance Register &amp; RFID Logs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Clearly distinguishes whether a student is Present during school hours, on Approved Leave, Half-Day, or Absent.
              </p>
            </div>
            <button
              onClick={() => setShowMarkAttModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Mark Today / New Date</span>
            </button>
          </div>

          {/* Attendance Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Timing (Punch In/Out)</th>
                    <th className="p-4">Official Remarks / Category</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attendance.map((record) => (
                    <tr key={record.date} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {record.date}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            record.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : record.status === 'approved_leave'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : record.status === 'half_day'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {record.status === 'present' && <Check className="w-3 h-3" />}
                          {record.status === 'approved_leave' && <Calendar className="w-3 h-3" />}
                          {record.status === 'half_day' && <Clock className="w-3 h-3" />}
                          {record.status === 'absent' && <X className="w-3 h-3" />}
                          <span className="capitalize">{record.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {record.checkInTime ? `${record.checkInTime} — ${record.checkOutTime || 'Present'}` : '—'}
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {record.reason || 'Regular scheduled school day'}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick change status toggles */}
                          <button
                            onClick={() => markAttendance(record.date, 'present')}
                            title="Set Present"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => markAttendance(record.date, 'half_day', 'Half-day dismissal')}
                            title="Set Half-Day"
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => markAttendance(record.date, 'approved_leave', 'Approved leave by school')}
                            title="Set Approved Leave"
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => markAttendance(record.date, 'absent', 'Uninformed absence')}
                            title="Set Absent"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAttendanceRecord(record.date)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEES MANAGEMENT (IN ₹ INR) */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Student Fee Management [₹ INR]
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Update payment statuses (Paid, Pending, Overdue) and issue new fee invoices with GST breakdown.
              </p>
            </div>
            <button
              onClick={() => setShowAddFeeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Fee Invoice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fees.map((fee) => (
              <div
                key={fee.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
                      {fee.term}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
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

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span className="font-bold">{fee.dueDate}</span>
                    </div>
                    {fee.paidDate && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Paid on:</span>
                        <span className="font-bold">{fee.paidDate} ({fee.paymentMethod})</span>
                      </div>
                    )}
                    {fee.invoiceNumber && (
                      <div className="flex justify-between">
                        <span>Receipt / Invoice:</span>
                        <span className="font-mono font-bold">{fee.invoiceNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fee Status Edit Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateFeeStatus(fee.id, 'paid')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100"
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => updateFeeStatus(fee.id, 'pending')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100"
                    >
                      Mark Pending
                    </button>
                    <button
                      onClick={() => updateFeeStatus(fee.id, 'overdue')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100"
                    >
                      Mark Overdue
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        sendWhatsAppAlert(
                          'fee_due',
                          `🔔 AGCS Fee Reminder: ₹${fee.amount.toLocaleString('en-IN')} for ${fee.title} is due on ${fee.dueDate}. Please pay via parent portal.`
                        );
                        simulateToast('WhatsApp Alert Dispatched', `Reminder sent to +917719445029 for ${fee.title}`, 'success');
                      }}
                      title="Send WhatsApp Reminder to +917719445029"
                      className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFeeRecord(fee.id)}
                      title="Delete Fee Record"
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TEACHER COMMENTS */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Teacher Comments &amp; Behavior Rating
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter observations on student academics, co-curriculars, and school discipline.
              </p>
            </div>
            <button
              onClick={() => setShowAddCommentModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Teacher Remark</span>
            </button>
          </div>

          <div className="space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{c.teacherName}</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">({c.subjectOrRole})</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                      {c.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-1">
                    "{c.comment}"
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(c.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span>• {c.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTeacherComment(c.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Delete Remark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CLASS-SPECIFIC HOMEWORK MANAGEMENT DESK */}
      {activeTab === 'homework' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                  School Academics &amp; Syllabus
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300">
                  Class-Wise Assignment Desk
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading mt-0.5">
                Manage Class Homework &amp; Tasks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Assign and update subject homework for specific classes, manage deadlines, and evaluate student submissions.
              </p>
            </div>
            <button
              onClick={() => setShowAddHwModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Homework</span>
            </button>
          </div>

          {/* Class and Subject Filters */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Class:</label>
                <select
                  value={adminClassFilter}
                  onChange={(e) => setAdminClassFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="All Classes">All Classes</option>
                  <option value="8th-A">Class 8th-A</option>
                  <option value="8th-B">Class 8th-B</option>
                  <option value="7th-A">Class 7th-A</option>
                  <option value="9th-A">Class 9th-A</option>
                  <option value="10th-A">Class 10th-A</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Subject:</label>
                <select
                  value={adminHwSubjectFilter}
                  onChange={(e) => setAdminHwSubjectFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="All Subjects">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Social Science">Social Science</option>
                </select>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {homework.length} Active Assignments in Database
            </span>
          </div>

          {/* Homework Cards */}
          {(() => {
            const filtered = homework.filter((hw) => {
              const classStr = `${hw.grade || '8th'}-${hw.section || 'A'}`;
              const matchesClass = adminClassFilter === 'All Classes' || classStr.toLowerCase() === adminClassFilter.toLowerCase();
              const matchesSub = adminHwSubjectFilter === 'All Subjects' || hw.subject.toLowerCase() === adminHwSubjectFilter.toLowerCase();
              return matchesClass && matchesSub;
            });

            if (filtered.length === 0) {
              return (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                  No homework assignments found for the selected filter.
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((hw) => (
                  <div
                    key={hw.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300">
                            {hw.subject}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                            Class {hw.grade || '8th'}-{hw.section || 'A'}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            hw.status === 'checked'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : hw.completed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {hw.status === 'checked' ? 'Evaluated' : hw.completed ? 'Submitted' : 'Pending'}
                        </span>
                      </div>

                      {hw.chapterOrTopic && (
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                          {hw.chapterOrTopic}
                        </p>
                      )}

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {hw.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {hw.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                        {hw.estimatedMinutes && (
                          <span>⏱️ {hw.estimatedMinutes} mins</span>
                        )}
                        {hw.materialsNeeded && (
                          <span>• 🎒 {hw.materialsNeeded}</span>
                        )}
                      </div>

                      {hw.teacherRemarks && (
                        <div className="mt-2.5 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-xs text-purple-900 dark:text-purple-300">
                          <strong>Teacher Feedback:</strong> {hw.teacherRemarks}
                        </div>
                      )}

                      {hw.parentAcknowledged && (
                        <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Signed by Parent: {hw.parentSignature}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Due: <strong>{hw.dueDate}</strong></span>

                      <div className="flex items-center gap-1.5">
                        {/* Quick Mark Evaluated / Checked */}
                        <button
                          onClick={() => {
                            updateHomework(hw.id, {
                              status: hw.status === 'checked' ? 'pending' : 'checked',
                              teacherRemarks: hw.teacherRemarks || 'Work checked by subject teacher. Well done!'
                            });
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            hw.status === 'checked'
                              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                          title="Toggle Teacher Checked Status"
                        >
                          {hw.status === 'checked' ? '✓ Evaluated' : 'Mark Evaluated'}
                        </button>

                        {/* Edit Homework Button */}
                        <button
                          onClick={() => setEditingHw({ ...hw })}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold transition flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Update Task</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteHomework(hw.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete Homework"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 6: GATEWAYS & BACKEND CONTROL CENTER */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Top Status & Refresh Header */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  Node.js Express + Gateways
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300">
                  Port 3000 Active
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading mt-0.5">
                Central Gateway &amp; Backend Telemetry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time control over SMS OTP Gateway, WhatsApp Alert Gateway (+917719445029), Disk Store, and AI Proxy.
              </p>
            </div>
            <button
              onClick={fetchGatewayStatus}
              disabled={isRefreshingGateway}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingGateway ? 'animate-spin' : ''}`} />
              <span>Ping Gateway</span>
            </button>
          </div>

          {/* 4 Gateway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* WhatsApp Gateway */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  WhatsApp Gateway
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                +917719445029
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Designated security recipient for login alerts and emergency school notices.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Dispatches: {whatsappAlerts.length}</span>
                <span className="text-emerald-600 font-bold">Connected</span>
              </div>
            </div>

            {/* SMS OTP Gateway */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">
                  SMS OTP Carrier
                </span>
                <Radio className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                4-Digit OTP
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Indian Mobile (+91) OTP carrier routing with 5-minute security TTL.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Demo Code: 1234</span>
                <span className="text-blue-600 font-bold">Ready</span>
              </div>
            </div>

            {/* Persistent Database */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-purple-600 dark:text-purple-400">
                  Storage Backend
                </span>
                <Database className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                JSON Disk DB
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                server/data_store.json persistent state store per parent mobile number.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Persistence: Synced</span>
                <span className="text-purple-600 font-bold">Online</span>
              </div>
            </div>

            {/* Gemini AI Proxy */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">
                  AI Proxy Model
                </span>
                <Cpu className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                gemini-2.5-flash
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Server-side proxy for formal leave applications and academic study coaching.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Route: /api/ai/coach</span>
                <span className="text-amber-600 font-bold">Enabled</span>
              </div>
            </div>
          </div>

          {/* Interactive Gateway Dispatch Tool */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Direct WhatsApp Gateway Dispatcher */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Dispatch Desk (+917719445029)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppModalOpen(true)}
                    className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 transition"
                  >
                    <Key className="w-3 h-3" />
                    <span>Auto-Push Setup</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 mb-3 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <span>Target Phone:</span>
                    <span className="font-mono underline">+917719445029</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Tap <strong>"Open in WhatsApp"</strong> below to send or view instantly in WhatsApp, or click <strong>"Auto-Push Setup"</strong> to enable background push via free CallMeBot key.
                  </p>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={testCustomAlertMsg}
                    onChange={(e) => setTestCustomAlertMsg(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Type alert message to dispatch..."
                  />

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTestCustomAlertMsg(`🚨 AGCS Security Alert: New login detected from unauthorized device at ${new Date().toLocaleTimeString('en-IN')}`)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    >
                      + Security Alert
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestCustomAlertMsg(`🚌 AGCS Transport Notice: Bus Route #7 running 15 mins behind schedule due to rain.`)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    >
                      + Bus Notice
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestCustomAlertMsg(`🔔 AGCS Fee Notice: ₹3,200 due for Term 2 for Guransh Singh. Pay via portal.`)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    >
                      + Fee Reminder
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={async () => {
                    if (!testCustomAlertMsg.trim()) return;
                    await sendWhatsAppAlert('admin_broadcast', testCustomAlertMsg);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Server</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = `https://wa.me/917719445029?text=${encodeURIComponent(testCustomAlertMsg || 'AGCS School Notification')}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Test SMS OTP Gateway */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-600" />
                    <span>Test SMS OTP Dispatch &amp; Alert Rule</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                    Carrier Sandbox
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Trigger an OTP request. If a non-standard number is tested, the WhatsApp alert to <strong>+917719445029</strong> fires automatically.
                </p>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={testOtpPhone}
                      onChange={(e) => setTestOtpPhone(e.target.value)}
                      placeholder="+919876543210"
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/auth/send-otp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ phone: testOtpPhone })
                          });
                          const data = await res.json();
                          setTestOtpResult(data.demoCode ? `OTP Sent! Demo Code: ${data.demoCode}` : data.message);
                          simulateToast('SMS Dispatched', `OTP sent to ${testOtpPhone}. Code: ${data.demoCode || '1234'}`, 'info');
                        } catch (err: any) {
                          setTestOtpResult(`Error: ${err.message}`);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shrink-0"
                    >
                      Send OTP
                    </button>
                  </div>

                  {testOtpResult && (
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-900 dark:text-blue-200">
                      {testOtpResult}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p><strong>Configured Alert Rule:</strong></p>
                    <p>Any login/OTP request from a number other than +919876543210 will immediately dispatch a security notification to <strong>+917719445029</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>WhatsApp Gateway Dispatch History (+917719445029)</span>
                  <span className="text-xs font-normal text-slate-400">({whatsappAlerts.length} entries)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click &quot;Open in WhatsApp&quot; on any alert to launch WhatsApp with that message pre-filled.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open WhatsApp Hub</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {whatsappAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                          Target: {alert.recipient}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                          {alert.status}
                        </span>
                        {alert.automatedSent && (
                          <span className="text-[10px] text-emerald-600 font-bold">
                            • Auto Pushed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-mono break-words">
                        {alert.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(alert.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const url = alert.waMeUrl || `https://wa.me/917719445029?text=${encodeURIComponent(alert.message)}`;
                      window.open(url, '_blank');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: REVIEW LEAVE (APPROVE / DENY) */}
      {reviewingLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              {reviewDecision === 'approved' ? 'Approve Student Leave' : 'Deny Student Leave'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {reviewDecision === 'approved'
                ? 'Attendance will be set to Approved Leave and parent will receive an instant push notification.'
                : 'Student will be notified that leave was rejected.'}
            </p>

            <form onSubmit={handleConfirmLeaveReview} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Admin Remarks / Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Leave granted. Please catch up on chapter 8 notes."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingLeaveId(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition ${
                    reviewDecision === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {reviewDecision === 'approved' ? 'Approval' : 'Denial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / MARK ATTENDANCE */}
      {showMarkAttModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Mark Student Attendance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Record daily presence, half-day, or approved leave.
            </p>

            <form onSubmit={handleMarkAttendance} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={attForm.date}
                  onChange={(e) => setAttForm({ ...attForm, date: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={attForm.status}
                  onChange={(e) => setAttForm({ ...attForm, status: e.target.value as AttendanceStatus })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="present">Present during school hours</option>
                  <option value="half_day">Half-Day (Early dismissal)</option>
                  <option value="approved_leave">Approved Leave</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Punch In Time</label>
                <input
                  type="text"
                  value={attForm.punchIn}
                  onChange={(e) => setAttForm({ ...attForm, punchIn: e.target.value })}
                  placeholder="08:08 AM"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={attForm.reason}
                  onChange={(e) => setAttForm({ ...attForm, reason: e.target.value })}
                  placeholder="e.g. Attending class regularly"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMarkAttModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD FEE INVOICE */}
      {showAddFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Issue New Fee Record [₹ INR]
            </h3>

            <form onSubmit={handleCreateFee} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fee Title</label>
                <input
                  type="text"
                  value={newFee.title}
                  onChange={(e) => setNewFee({ ...newFee, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={newFee.amount}
                    onChange={(e) => setNewFee({ ...newFee, amount: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={newFee.status}
                    onChange={(e) => setNewFee({ ...newFee, status: e.target.value as FeeStatus })}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newFee.dueDate}
                  onChange={(e) => setNewFee({ ...newFee, dueDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFeeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  Add Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TEACHER REMARK */}
      {showAddCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Add Teacher Observation / Remark
            </h3>

            <form onSubmit={handleCreateComment} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teacher Name</label>
                <input
                  type="text"
                  value={newComment.teacherName}
                  onChange={(e) => setNewComment({ ...newComment, teacherName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newComment.category}
                    onChange={(e) => setNewComment({ ...newComment, category: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="academic">Academic</option>
                    <option value="achievement">Achievement</option>
                    <option value="discipline">Discipline</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Rating (1 - 5 Stars)</label>
                  <select
                    value={newComment.rating}
                    onChange={(e) => setNewComment({ ...newComment, rating: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Comment</label>
                <textarea
                  rows={3}
                  value={newComment.comment}
                  onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCommentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
                >
                  Post Remark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ASSIGN NEW CLASS HOMEWORK */}
      {showAddHwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Assign Class Homework Task
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specify subject, target class, topic, instructions, and materials.
            </p>

            <form onSubmit={handleCreateHomework} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Class</label>
                  <select
                    value={newHw.grade}
                    onChange={(e) => setNewHw({ ...newHw, grade: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {['6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((g) => (
                      <option key={g} value={g}>Class {g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section</label>
                  <select
                    value={newHw.section}
                    onChange={(e) => setNewHw({ ...newHw, section: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="All">All Sections</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={newHw.subject}
                    onChange={(e) => setNewHw({ ...newHw, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teacher Name</label>
                  <input
                    type="text"
                    value={newHw.teacherName}
                    onChange={(e) => setNewHw({ ...newHw, teacherName: e.target.value })}
                    placeholder="e.g. Dr. Anita Roy"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Chapter / Unit Topic</label>
                <input
                  type="text"
                  value={newHw.chapterOrTopic}
                  onChange={(e) => setNewHw({ ...newHw, chapterOrTopic: e.target.value })}
                  placeholder="e.g. Chapter 9: Light & Reflection"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={newHw.title}
                  onChange={(e) => setNewHw({ ...newHw, title: e.target.value })}
                  placeholder="e.g. Ray Diagrams & Practical Manual Exercise"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Instructions for Student</label>
                <textarea
                  rows={3}
                  value={newHw.description}
                  onChange={(e) => setNewHw({ ...newHw, description: e.target.value })}
                  placeholder="Clear instructions on questions, notebooks, and diagrams to draw..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newHw.dueDate}
                    onChange={(e) => setNewHw({ ...newHw, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Est. Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newHw.estimatedMinutes}
                    onChange={(e) => setNewHw({ ...newHw, estimatedMinutes: Number(e.target.value) })}
                    placeholder="30"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Required Materials / Books</label>
                <input
                  type="text"
                  value={newHw.materialsNeeded}
                  onChange={(e) => setNewHw({ ...newHw, materialsNeeded: e.target.value })}
                  placeholder="e.g. Science Lab Manual, Geometry Box"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddHwModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
                >
                  Assign to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: UPDATE EXISTING HOMEWORK TASK FOR CLASS */}
      {editingHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Update Homework Assignment
              </h3>
              <button
                onClick={() => setEditingHw(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Modify topic, instructions, deadline, or provide teacher evaluation remarks.
            </p>

            <form onSubmit={handleUpdateHomework} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Class</label>
                  <select
                    value={editingHw.grade || '8th'}
                    onChange={(e) => setEditingHw({ ...editingHw, grade: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {['6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((g) => (
                      <option key={g} value={g}>Class {g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section</label>
                  <select
                    value={editingHw.section || 'A'}
                    onChange={(e) => setEditingHw({ ...editingHw, section: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="All">All Sections</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingHw.subject}
                    onChange={(e) => setEditingHw({ ...editingHw, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teacher</label>
                  <input
                    type="text"
                    value={editingHw.teacherName}
                    onChange={(e) => setEditingHw({ ...editingHw, teacherName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Topic / Chapter</label>
                <input
                  type="text"
                  value={editingHw.chapterOrTopic || ''}
                  onChange={(e) => setEditingHw({ ...editingHw, chapterOrTopic: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={editingHw.title}
                  onChange={(e) => setEditingHw({ ...editingHw, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={editingHw.description}
                  onChange={(e) => setEditingHw({ ...editingHw, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editingHw.dueDate}
                    onChange={(e) => setEditingHw({ ...editingHw, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={editingHw.status}
                    onChange={(e) => setEditingHw({ ...editingHw, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="checked">Checked by Teacher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teacher Evaluation Feedback</label>
                <input
                  type="text"
                  value={editingHw.teacherRemarks || ''}
                  onChange={(e) => setEditingHw({ ...editingHw, teacherRemarks: e.target.value })}
                  placeholder="e.g. Work checked. Diagrams neat and accurately labelled."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingHw(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
