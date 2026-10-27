import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StudentProfile,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  LeaveType,
  FeeItem,
  FeeStatus,
  HomeworkItem,
  ExamResult,
  TeacherComment,
  PushNotification,
  UserAccount,
  WhatsAppAlert
} from '../types';
import {
  INITIAL_STUDENT,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_FEES,
  INITIAL_HOMEWORK,
  INITIAL_EXAMS,
  INITIAL_TEACHER_COMMENTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const WHATSAPP_TARGET = '+917719445029';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: UserAccount | null;
  activeRole: 'parent' | 'admin';
  setActiveRole: (role: 'parent' | 'admin') => void;
  currentView: 'landing' | 'auth' | 'onboarding' | 'app';
  setCurrentView: (view: 'landing' | 'auth' | 'onboarding' | 'app') => void;
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  fees: FeeItem[];
  homework: HomeworkItem[];
  exams: ExamResult[];
  comments: TeacherComment[];
  notifications: PushNotification[];
  whatsappAlerts: WhatsAppAlert[];
  unreadNotificationCount: number;

  login: (phone: string, role?: 'parent' | 'admin', name?: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (data: { studentName: string; grade: string; section: string; parentName: string; emergencyContact: string }) => void;
  applyLeave: (leaveData: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    isHalfDay?: boolean;
  }) => void;
  reviewLeave: (leaveId: string, decision: 'approved' | 'rejected', adminNotes: string) => void;
  
  markAttendance: (date: string, status: AttendanceStatus, reason?: string, punchIn?: string) => void;
  deleteAttendanceRecord: (date: string) => void;

  payFee: (feeId: string, paymentMethod: string) => void;
  updateFeeStatus: (feeId: string, status: FeeStatus, dueDate?: string) => void;
  addFeeRecord: (newFee: Omit<FeeItem, 'id'>) => void;
  editFeeRecord: (id: string, updated: Partial<FeeItem>) => void;
  deleteFeeRecord: (id: string) => void;

  addTeacherComment: (comment: Omit<TeacherComment, 'id' | 'date'>) => void;
  deleteTeacherComment: (id: string) => void;

  addHomework: (hw: Omit<HomeworkItem, 'id' | 'completed' | 'status'>) => void;
  toggleHomework: (hwId: string) => void;
  deleteHomework: (id: string) => void;

  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  sendWhatsAppAlert: (event: string, message: string) => Promise<void>;
  simulateToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'alert') => void;
  toast: { title: string; message: string; type: 'success' | 'info' | 'warning' | 'alert' } | null;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('agcs_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('agcs_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('agcs_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRole, setActiveRole] = useState<'parent' | 'admin'>('parent');
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'onboarding' | 'app'>('landing');

  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('agcs_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('agcs_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('agcs_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [fees, setFees] = useState<FeeItem[]>(() => {
    const saved = localStorage.getItem('agcs_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [homework, setHomework] = useState<HomeworkItem[]>(() => {
    const saved = localStorage.getItem('agcs_homework');
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
  });

  const [exams] = useState<ExamResult[]>(INITIAL_EXAMS);

  const [comments, setComments] = useState<TeacherComment[]>(() => {
    const saved = localStorage.getItem('agcs_comments');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_COMMENTS;
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem('agcs_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [whatsappAlerts, setWhatsappAlerts] = useState<WhatsAppAlert[]>([
    {
      id: 'wa-init-01',
      recipient: WHATSAPP_TARGET,
      event: 'critical_alert',
      message: '✅ AGCS School Alert System connected to +917719445029 for admin broadcasts and login alerts.',
      timestamp: new Date().toISOString(),
      status: 'delivered'
    }
  ]);

  const [toast, setToast] = useState<{ title: string; message: string; type: 'success' | 'info' | 'warning' | 'alert' } | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agcs_user', JSON.stringify(user));
      localStorage.setItem(`agcs_data_${user.phoneNumber}`, JSON.stringify({
        student,
        attendance,
        leaves,
        fees,
        homework,
        comments,
        notifications
      }));
    } else {
      localStorage.removeItem('agcs_user');
    }
  }, [user, student, attendance, leaves, fees, homework, comments, notifications]);

  const simulateToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'alert' = 'info') => {
    setToast({ title, message, type });
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'alert' ? [100, 50, 100] : 80);
    }
  };

  const clearToast = () => setToast(null);

  const sendWhatsAppAlert = async (event: string, message: string) => {
    const newAlert: WhatsAppAlert = {
      id: 'wa-' + Date.now(),
      recipient: WHATSAPP_TARGET,
      event: event as any,
      message,
      timestamp: new Date().toISOString(),
      status: 'delivered'
    };
    setWhatsappAlerts(prev => [newAlert, ...prev]);

    try {
      await fetch('/api/alerts/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, message })
      });
    } catch {
      // Offline fallback
    }
  };

  const addNotification = (title: string, message: string, type: PushNotification['type']) => {
    const notif: PushNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      timestamp: new Date().toISOString(),
      type,
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
    simulateToast(title, message, type === 'alert' ? 'alert' : 'info');

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/pwa-192x192.png'
        });
      } catch {
        // Suppressed
      }
    }
  };

  const login = async (phone: string, role: 'parent' | 'admin' = 'parent', customName?: string): Promise<boolean> => {
    const cleanPhone = phone.trim();
    const isStandardPhone = cleanPhone === '+919876543210' || cleanPhone === '9876543210';

    if (!isStandardPhone && role === 'parent') {
      const alertText = `🚨 AGCS Security Alert: New login detected from mobile number ${cleanPhone} at ${new Date().toLocaleTimeString('en-IN')}. Verify if legitimate parent access.`;
      sendWhatsAppAlert('new_device_login', alertText);
      simulateToast('Security Alert Dispatched', `WhatsApp notification sent to ${WHATSAPP_TARGET} for new number ${cleanPhone}`, 'alert');
    }

    const savedForPhone = localStorage.getItem(`agcs_data_${cleanPhone}`);
    let onboarded = isStandardPhone;

    if (savedForPhone) {
      try {
        const parsed = JSON.parse(savedForPhone);
        if (parsed.student) setStudent(parsed.student);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.leaves) setLeaves(parsed.leaves);
        if (parsed.fees) setFees(parsed.fees);
        if (parsed.homework) setHomework(parsed.homework);
        if (parsed.comments) setComments(parsed.comments);
        if (parsed.notifications) setNotifications(parsed.notifications);
        onboarded = true;
      } catch (e) {
        console.error('Error restoring phone data:', e);
      }
    }

    const account: UserAccount = {
      phoneNumber: cleanPhone,
      parentName: customName || (role === 'admin' ? 'Principal Office' : 'Jasbir Singh'),
      studentName: student.fullName,
      grade: student.grade,
      section: student.section,
      role,
      onboardingCompleted: onboarded,
      lastLogin: new Date().toISOString()
    };

    setUser(account);
    setActiveRole(role);

    if (!onboarded) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('app');
      simulateToast('Welcome to AGCS', `Logged in as ${account.parentName} (${role === 'admin' ? 'Administrator' : 'Parent'})`, 'success');
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentView('landing');
    simulateToast('Logged Out', 'You have been signed out safely.', 'info');
  };

  const completeOnboarding = (data: { studentName: string; grade: string; section: string; parentName: string; emergencyContact: string }) => {
    if (!user) return;
    const updatedStudent: StudentProfile = {
      ...student,
      fullName: data.studentName,
      grade: data.grade,
      section: data.section,
      fatherName: data.parentName,
      emergencyContact: data.emergencyContact,
      parentPhone: user.phoneNumber
    };

    const updatedUser: UserAccount = {
      ...user,
      parentName: data.parentName,
      studentName: data.studentName,
      grade: data.grade,
      section: data.section,
      onboardingCompleted: true
    };

    setStudent(updatedStudent);
    setUser(updatedUser);
    setCurrentView('app');
    simulateToast('Profile Ready!', `Welcome to Akal Galaxy Convent School, ${data.studentName}!`, 'success');

    sendWhatsAppAlert(
      'new_device_login',
      `🎓 New Student Onboarding: ${data.studentName} (Class ${data.grade}-${data.section}) registered by ${data.parentName} (${user.phoneNumber}).`
    );
  };

  const applyLeave = (data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    isHalfDay?: boolean;
  }) => {
    const newLeave: LeaveRequest = {
      id: 'leave-' + Math.floor(1000 + Math.random() * 9000),
      studentId: student.id,
      studentName: student.fullName,
      rollNo: student.rollNo,
      grade: `${student.grade}-${student.section}`,
      parentName: student.fatherName,
      parentPhone: student.parentPhone,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      isHalfDay: !!data.isHalfDay
    };

    setLeaves(prev => [newLeave, ...prev]);

    addNotification(
      'Leave Application Submitted',
      `Your request for ${data.startDate === data.endDate ? data.startDate : `${data.startDate} to ${data.endDate}`} is submitted for Admin verification.`,
      'leave_status'
    );

    sendWhatsAppAlert(
      'leave_update',
      `📝 New Leave Request Submitted for ${student.fullName} (Class ${student.grade}-${student.section}) from ${data.startDate} to ${data.endDate}. Reason: ${data.reason}. Action required in Admin Panel.`
    );
  };

  const reviewLeave = (leaveId: string, decision: 'approved' | 'rejected', adminNotes: string) => {
    const targetLeave = leaves.find(l => l.id === leaveId);
    if (!targetLeave) return;

    const reviewedLeave: LeaveRequest = {
      ...targetLeave,
      status: decision,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'Admin Principal Desk',
      adminNotes: adminNotes || (decision === 'approved' ? 'Approved by Admin.' : 'Denied by Admin.')
    };

    setLeaves(prev => prev.map(l => (l.id === leaveId ? reviewedLeave : l)));

    if (decision === 'approved') {
      const statusToApply: AttendanceStatus = targetLeave.isHalfDay ? 'half_day' : 'approved_leave';

      setAttendance(prev => {
        const updated = [...prev];
        const recordIndex = updated.findIndex(r => r.date === targetLeave.startDate);

        const newRecord: AttendanceRecord = {
          date: targetLeave.startDate,
          status: statusToApply,
          reason: `Approved Leave (#${targetLeave.id}): ${targetLeave.reason}`,
          leaveRequestId: targetLeave.id,
          markedBy: 'Admin Leave Approval Desk',
          checkInTime: targetLeave.isHalfDay ? '08:00 AM' : undefined,
          checkOutTime: targetLeave.isHalfDay ? '11:45 AM' : undefined
        };

        if (recordIndex >= 0) {
          updated[recordIndex] = newRecord;
        } else {
          updated.unshift(newRecord);
        }
        return updated;
      });

      addNotification(
        '🎉 Leave Application Approved!',
        `Good news! Leave request for ${targetLeave.studentName} (${targetLeave.startDate}) has been APPROVED by the school. ${adminNotes ? `Note: "${adminNotes}"` : ''}`,
        'leave_status'
      );

      sendWhatsAppAlert(
        'leave_update',
        `✅ AGCS Update: Leave request #${targetLeave.id} for ${targetLeave.studentName} APPROVED by Admin. Attendance record set to Approved Leave.`
      );
    } else {
      addNotification(
        '⚠️ Leave Request Denied',
        `Leave request for ${targetLeave.startDate} was DENIED by the school. Remarks: "${adminNotes || 'Unexcused period'}". Please contact the school office.`,
        'leave_status'
      );

      sendWhatsAppAlert(
        'leave_update',
        `❌ AGCS Update: Leave request #${targetLeave.id} for ${targetLeave.studentName} was DENIED by Admin. Parent notified via instant push notification.`
      );
    }
  };

  const markAttendance = (date: string, status: AttendanceStatus, reason?: string, punchIn?: string) => {
    setAttendance(prev => {
      const updated = [...prev];
      const index = updated.findIndex(r => r.date === date);
      const newRecord: AttendanceRecord = {
        date,
        status,
        reason: reason || (status === 'present' ? 'Regular school attendance' : status === 'half_day' ? 'Half-day dismissal' : status === 'approved_leave' ? 'Approved school leave' : 'Uninformed absent'),
        checkInTime: punchIn || (status === 'present' || status === 'half_day' ? '08:05 AM' : undefined),
        checkOutTime: status === 'half_day' ? '11:45 AM' : status === 'present' ? '02:30 PM' : undefined,
        markedBy: 'Class Teacher & Principal Office'
      };

      if (index >= 0) {
        updated[index] = newRecord;
      } else {
        updated.unshift(newRecord);
      }
      return updated;
    });

    const statusLabel = status === 'present' ? 'Present' : status === 'half_day' ? 'Half-Day' : status === 'approved_leave' ? 'Approved Leave' : 'Absent';
    addNotification(
      'Attendance Update',
      `Attendance for ${student.fullName} on ${date} marked as "${statusLabel}".`,
      'attendance'
    );
  };

  const deleteAttendanceRecord = (date: string) => {
    setAttendance(prev => prev.filter(a => a.date !== date));
    simulateToast('Attendance Removed', `Record for ${date} was removed from the register.`, 'info');
  };

  const payFee = (feeId: string, paymentMethod: string) => {
    const invNo = 'AGCS-REC-' + Math.floor(10000 + Math.random() * 90000);
    setFees(prev =>
      prev.map(f =>
        f.id === feeId
          ? {
              ...f,
              status: 'paid',
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod,
              invoiceNumber: invNo
            }
          : f
      )
    );

    const paidItem = fees.find(f => f.id === feeId);
    const amount = paidItem ? `₹${paidItem.amount.toLocaleString('en-IN')}` : 'fee';

    addNotification(
      'Payment Received (Receipt Generated)',
      `Payment of ${amount} for ${paidItem?.title || 'tuition'} received successfully! Receipt #${invNo} is available for download.`,
      'fee'
    );

    sendWhatsAppAlert(
      'fee_due',
      `💳 AGCS Fee Payment Confirmation: Received ${amount} for ${student.fullName} (Roll #${student.rollNo}) via ${paymentMethod}. Receipt: ${invNo}.`
    );
  };

  const updateFeeStatus = (feeId: string, status: FeeStatus, dueDate?: string) => {
    setFees(prev =>
      prev.map(f =>
        f.id === feeId
          ? {
              ...f,
              status,
              ...(dueDate ? { dueDate } : {})
            }
          : f
      )
    );

    const target = fees.find(f => f.id === feeId);
    if (target) {
      addNotification(
        'Fee Record Updated',
        `${target.title} status changed to ${status.toUpperCase()} by the Accounts Department.`,
        'fee'
      );
    }
  };

  const addFeeRecord = (newFee: Omit<FeeItem, 'id'>) => {
    const feeItem: FeeItem = {
      ...newFee,
      id: 'fee-' + Date.now()
    };
    setFees(prev => [feeItem, ...prev]);
    simulateToast('Fee Created', `New fee bill for ₹${newFee.amount.toLocaleString('en-IN')} added.`, 'success');
    addNotification('New Fee Issued', `New fee invoice issued: ${newFee.title} for ₹${newFee.amount.toLocaleString('en-IN')}. Due date: ${newFee.dueDate}`, 'fee');
  };

  const editFeeRecord = (id: string, updated: Partial<FeeItem>) => {
    setFees(prev => prev.map(f => (f.id === id ? { ...f, ...updated } : f)));
    simulateToast('Fee Updated', 'Fee record successfully modified.', 'success');
  };

  const deleteFeeRecord = (id: string) => {
    setFees(prev => prev.filter(f => f.id !== id));
    simulateToast('Fee Deleted', 'Fee invoice removed from record.', 'info');
  };

  const addTeacherComment = (newComment: Omit<TeacherComment, 'id' | 'date'>) => {
    const commentItem: TeacherComment = {
      ...newComment,
      id: 'tc-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setComments(prev => [commentItem, ...prev]);
    simulateToast('Remark Posted', `New remark added by ${newComment.teacherName}`, 'success');
    addNotification('Teacher Remark Added', `${newComment.teacherName} added a remark: "${newComment.comment}"`, 'homework');
  };

  const deleteTeacherComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
    simulateToast('Remark Deleted', 'Teacher feedback removed.', 'info');
  };

  const addHomework = (hw: Omit<HomeworkItem, 'id' | 'completed' | 'status'>) => {
    const newHw: HomeworkItem = {
      ...hw,
      id: 'hw-' + Date.now(),
      completed: false,
      status: 'pending'
    };
    setHomework(prev => [newHw, ...prev]);
    simulateToast('Homework Assigned', `${hw.subject} homework assigned to class.`, 'success');
    addNotification('New Homework Assigned', `${hw.subject}: ${hw.title}. Due date: ${hw.dueDate}`, 'homework');
  };

  const toggleHomework = (hwId: string) => {
    setHomework(prev =>
      prev.map(hw =>
        hw.id === hwId
          ? {
              ...hw,
              completed: !hw.completed,
              status: !hw.completed ? 'submitted' : 'pending'
            }
          : hw
      )
    );
  };

  const deleteHomework = (id: string) => {
    setHomework(prev => prev.filter(h => h.id !== id));
    simulateToast('Homework Deleted', 'Assignment removed from diary.', 'info');
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        activeRole,
        setActiveRole,
        currentView,
        setCurrentView,
        student,
        setStudent,
        attendance,
        leaves,
        fees,
        homework,
        exams,
        comments,
        notifications,
        whatsappAlerts,
        unreadNotificationCount,
        login,
        logout,
        completeOnboarding,
        applyLeave,
        reviewLeave,
        markAttendance,
        deleteAttendanceRecord,
        payFee,
        updateFeeStatus,
        addFeeRecord,
        editFeeRecord,
        deleteFeeRecord,
        addTeacherComment,
        deleteTeacherComment,
        addHomework,
        toggleHomework,
        deleteHomework,
        markNotificationRead,
        markAllNotificationsRead,
        sendWhatsAppAlert,
        simulateToast,
        toast,
        clearToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
