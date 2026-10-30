export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'approved_leave';

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  reason?: string;
  leaveRequestId?: string;
  markedBy?: string;
}

export type LeaveType = 'sick' | 'family' | 'medical' | 'planned';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  appliedAt: string; // ISO
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  isHalfDay?: boolean;
}

export type FeeStatus = 'paid' | 'pending' | 'overdue';

export interface FeeItem {
  id: string;
  term: string; // e.g., 'Term 2 (Oct - Dec 2026)'
  title: string;
  amount: number; // in INR
  dueDate: string;
  status: FeeStatus;
  paidDate?: string;
  paymentMethod?: string;
  invoiceNumber?: string;
  breakdown: {
    tuition: number;
    activity: number;
    transport: number;
    examination: number;
  };
}

export interface HomeworkItem {
  id: string;
  grade: string; // e.g. "8th"
  section: string; // e.g. "A" or "All"
  subject: string;
  title: string;
  description: string;
  chapterOrTopic?: string;
  assignedDate: string;
  dueDate: string;
  teacherName: string;
  completed: boolean;
  status: 'pending' | 'submitted' | 'checked';
  estimatedMinutes?: number;
  materialsNeeded?: string;
  teacherRemarks?: string;
  parentAcknowledged?: boolean;
  parentSignature?: string;
  parentNote?: string;
}

export interface ExamSubjectMark {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks: string;
}

export interface ExamResult {
  id: string;
  examTitle: string; // e.g. "Term 1 Half-Yearly Examinations 2026"
  examDate: string;
  overallPercentage: number;
  rankInClass: number;
  totalStudents: number;
  grade: string;
  subjects: ExamSubjectMark[];
  teacherRemarks: string;
  principalRemarks: string;
}

export interface TeacherComment {
  id: string;
  teacherName: string;
  subjectOrRole: string;
  date: string;
  category: 'academic' | 'discipline' | 'achievement' | 'sports';
  comment: string;
  rating: number; // 1 to 5 stars
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'leave_status' | 'attendance' | 'fee' | 'homework' | 'alert';
  read: boolean;
  actionUrl?: string;
}

export interface StudentProfile {
  id: string;
  admissionNo: string;
  rollNo: string;
  fullName: string;
  grade: string; // e.g. "8th"
  section: string; // e.g. "A"
  gender: string;
  dob: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
  emergencyContact: string;
  address: string;
  avatarUrl?: string;
  attendanceStreak: number;
}

export interface UserAccount {
  phoneNumber: string;
  parentName: string;
  studentName: string;
  admissionNo?: string;
  grade: string;
  section: string;
  role: 'parent' | 'admin';
  onboardingCompleted: boolean;
  lastLogin: string;
}

export interface WhatsAppAlert {
  id: string;
  recipient: string; // e.g. "+917719445029"
  event: 'new_device_login' | 'fee_due' | 'leave_update' | 'critical_alert' | 'admin_broadcast' | 'homework_reminder' | 'gateway_connected';
  message: string;
  timestamp: string;
  status: 'delivered' | 'sent';
  waMeUrl?: string;
  automatedSent?: boolean;
  deliveryMethod?: string;
  deliveryNote?: string;
}

export interface WhatsAppConfig {
  targetPhone: string;
  callmebotApiKey?: string;
  customWebhookUrl?: string;
  autoDispatchEnabled: boolean;
  lastDispatchStatus?: string;
  lastDispatchTimestamp?: string;
  lastDispatchError?: string;
}
