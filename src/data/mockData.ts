import { StudentProfile, AttendanceRecord, FeeItem, LeaveRequest, HomeworkItem, ExamResult, TeacherComment, PushNotification } from '../types';

export const INITIAL_STUDENT: StudentProfile = {
  id: 'student-agcs-801',
  admissionNo: 'AGCS/2021/842',
  rollNo: '14',
  fullName: 'Guransh Singh',
  grade: '8th',
  section: 'A',
  gender: 'Male',
  dob: '2012-08-15',
  bloodGroup: 'B+',
  fatherName: 'Jasbir Singh',
  motherName: 'Manpreet Kaur',
  parentPhone: '+919876543210',
  emergencyContact: '+919812345678',
  address: 'H.No. 42, Model Town, Near Gurdwara Sahib, Punjab, India',
  avatarUrl: '/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png',
  attendanceStreak: 12
};

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    date: '2026-10-27', // Today
    status: 'present',
    checkInTime: '08:08 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Biometric RFID Gate 1'
  },
  {
    date: '2026-10-26',
    status: 'present',
    checkInTime: '08:12 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-24',
    status: 'present',
    checkInTime: '08:04 AM',
    checkOutTime: '01:00 PM',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-23',
    status: 'half_day',
    checkInTime: '08:10 AM',
    checkOutTime: '11:45 AM',
    reason: 'Dental appointment with parent slip',
    markedBy: 'Vice Principal Office'
  },
  {
    date: '2026-10-22',
    status: 'present',
    checkInTime: '08:14 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-21',
    status: 'present',
    checkInTime: '08:02 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Biometric RFID Gate 1'
  },
  {
    date: '2026-10-20',
    status: 'present',
    checkInTime: '08:09 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-19',
    status: 'present',
    checkInTime: '08:15 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-16',
    status: 'approved_leave',
    reason: 'Family wedding in Amritsar (Leave request #LR-1014 approved)',
    leaveRequestId: 'leave-1014',
    markedBy: 'Admin Office'
  },
  {
    date: '2026-10-15',
    status: 'approved_leave',
    reason: 'Family wedding in Amritsar (Leave request #LR-1014 approved)',
    leaveRequestId: 'leave-1014',
    markedBy: 'Admin Office'
  },
  {
    date: '2026-10-14',
    status: 'present',
    checkInTime: '08:05 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-13',
    status: 'present',
    checkInTime: '08:06 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-12',
    status: 'present',
    checkInTime: '08:00 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Biometric RFID Gate 1'
  },
  {
    date: '2026-10-09',
    status: 'absent',
    reason: 'Uninformed absence - follow-up SMS sent to parent',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-08',
    status: 'present',
    checkInTime: '08:11 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Class Teacher'
  },
  {
    date: '2026-10-07',
    status: 'present',
    checkInTime: '08:07 AM',
    checkOutTime: '02:30 PM',
    markedBy: 'Biometric RFID Gate 1'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-1092',
    studentId: 'student-agcs-801',
    studentName: 'Guransh Singh',
    rollNo: '14',
    grade: '8th-A',
    parentName: 'Jasbir Singh',
    parentPhone: '+919876543210',
    leaveType: 'sick',
    startDate: '2026-10-28',
    endDate: '2026-10-29',
    reason: 'Suffering from mild seasonal flu and fever. Doctor advised 2 days of complete rest and hydration.',
    status: 'pending',
    appliedAt: '2026-10-27T08:15:00Z',
    isHalfDay: false
  },
  {
    id: 'leave-1014',
    studentId: 'student-agcs-801',
    studentName: 'Guransh Singh',
    rollNo: '14',
    grade: '8th-A',
    parentName: 'Jasbir Singh',
    parentPhone: '+919876543210',
    leaveType: 'family',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    reason: 'Attending cousin elder sister marriage ceremony in Amritsar. Prior notice given.',
    status: 'approved',
    appliedAt: '2026-10-10T14:20:00Z',
    reviewedAt: '2026-10-11T09:30:00Z',
    reviewedBy: 'Admin Principal Desk',
    adminNotes: 'Leave granted. Please ensure pending math homework is completed upon return.',
    isHalfDay: false
  }
];

export const INITIAL_FEES: FeeItem[] = [
  {
    id: 'fee-term-2-2026',
    term: 'Quarter 3 / Term 2 (Oct - Dec 2026)',
    title: 'School Tuition & Smart Class Fee',
    amount: 14800,
    dueDate: '2026-11-15',
    status: 'pending',
    breakdown: {
      tuition: 11000,
      activity: 1800,
      transport: 1200,
      examination: 800
    }
  },
  {
    id: 'fee-transport-q3',
    term: 'Bus Transport - Route 4 (Model Town)',
    title: 'School Transport Service',
    amount: 3600,
    dueDate: '2026-11-10',
    status: 'pending',
    breakdown: {
      tuition: 0,
      activity: 0,
      transport: 3600,
      examination: 0
    }
  },
  {
    id: 'fee-term-1-2026',
    term: 'Quarter 2 / Term 1 (Jul - Sep 2026)',
    title: 'Term 1 Tuition & Annual Sports',
    amount: 17500,
    dueDate: '2026-08-10',
    status: 'paid',
    paidDate: '2026-08-04',
    paymentMethod: 'UPI (Google Pay)',
    invoiceNumber: 'AGCS-INV-2026-894',
    breakdown: {
      tuition: 11000,
      activity: 2500,
      transport: 3200,
      examination: 800
    }
  },
  {
    id: 'fee-admission-annual',
    term: 'Session 2026-2027 Annual Maintenance',
    title: 'Annual Library, Lab & Digital Portal Charge',
    amount: 4200,
    dueDate: '2026-04-15',
    status: 'paid',
    paidDate: '2026-04-12',
    paymentMethod: 'NetBanking (HDFC Bank)',
    invoiceNumber: 'AGCS-INV-2026-012',
    breakdown: {
      tuition: 0,
      activity: 4200,
      transport: 0,
      examination: 0
    }
  }
];

export const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw-math-01',
    grade: '8th',
    section: 'A',
    subject: 'Mathematics',
    chapterOrTopic: 'Chapter 8: Linear Equations in One Variable',
    title: 'Exercise 8.2 Questions 1 to 12 & Word Problems',
    description: 'Solve Exercise 8.2 Questions 1 to 12 in the fair notebook. Draw neat algebraic verification steps and underline final values of variables.',
    assignedDate: '2026-10-27',
    dueDate: '2026-10-28',
    teacherName: 'Er. Sandeep Verma',
    completed: false,
    status: 'pending',
    estimatedMinutes: 35,
    materialsNeeded: 'Math Fair Register & Geometry Ruler',
    parentAcknowledged: false
  },
  {
    id: 'hw-sci-02',
    grade: '8th',
    section: 'A',
    subject: 'Science',
    chapterOrTopic: 'Chapter 2: Microorganisms: Friend and Foe',
    title: 'Food Preservation Flowchart & Fermentation Activity',
    description: 'Complete the activity chart on bacteria in food preservation. Write short notes on pasteurization discovered by Louis Pasteur.',
    assignedDate: '2026-10-26',
    dueDate: '2026-10-27',
    teacherName: 'Dr. Anita Roy',
    completed: true,
    status: 'checked',
    estimatedMinutes: 25,
    materialsNeeded: 'Science Lab Manual & Color Pencils',
    teacherRemarks: 'Diagrams neatly labelled. Very clear handwriting!',
    parentAcknowledged: true,
    parentSignature: 'Jasbir Singh (Father)',
    parentNote: 'Checked and signed after child completed diagram.'
  },
  {
    id: 'hw-eng-03',
    grade: '8th',
    section: 'A',
    subject: 'English Literature',
    chapterOrTopic: 'Honeydew Poem 2: The Road Not Taken by Robert Frost',
    title: 'Critical Appreciation & Moral Choice Reflection',
    description: 'Write a 200-word critical appreciation highlighting how everyday choices impact character and future virtues.',
    assignedDate: '2026-10-25',
    dueDate: '2026-10-29',
    teacherName: 'Mrs. Simranjit Kaur',
    completed: false,
    status: 'pending',
    estimatedMinutes: 30,
    materialsNeeded: 'English Fair Notebook',
    parentAcknowledged: false
  },
  {
    id: 'hw-pun-04',
    grade: '8th',
    section: 'A',
    subject: 'Punjabi',
    chapterOrTopic: 'Vyakaran Chapter 4: Karak ate Bhed',
    title: 'Karak Identification & 10 Original Sentences',
    description: 'Read Chapter 4 carefully and write down 10 practice sentences in Gurmukhi script identifying Karta and Karam Karaks.',
    assignedDate: '2026-10-24',
    dueDate: '2026-10-26',
    teacherName: 'S. Harpreet Singh',
    completed: true,
    status: 'checked',
    estimatedMinutes: 20,
    materialsNeeded: 'Punjabi Vyakaran Pustak',
    teacherRemarks: 'Excellent calligraphy and zero spelling mistakes.',
    parentAcknowledged: true,
    parentSignature: 'Jasbir Singh (Father)'
  },
  {
    id: 'hw-sst-05',
    grade: '8th',
    section: 'A',
    subject: 'Social Science',
    chapterOrTopic: 'Geography: Resources and Development',
    title: 'Map Work: Major Soil Types of India',
    description: 'Locate Alluvial, Black, and Laterite soils on an outline map of India and paste neatly in the Social Studies notebook.',
    assignedDate: '2026-10-27',
    dueDate: '2026-10-30',
    teacherName: 'Mr. Rajesh Sharma',
    completed: false,
    status: 'pending',
    estimatedMinutes: 25,
    materialsNeeded: 'India Outline Political Map & Crayons',
    parentAcknowledged: false
  }
];

export const INITIAL_EXAMS: ExamResult[] = [
  {
    id: 'exam-term1-2026',
    examTitle: 'Term 1 Mid-Year Board Pattern Examination',
    examDate: 'September 2026',
    overallPercentage: 93.6,
    rankInClass: 3,
    totalStudents: 38,
    grade: 'A1',
    subjects: [
      { subject: 'Mathematics', marksObtained: 98, totalMarks: 100, grade: 'A1', remarks: 'Exceptional problem solving' },
      { subject: 'Science', marksObtained: 94, totalMarks: 100, grade: 'A1', remarks: 'Strong theoretical grasp' },
      { subject: 'English', marksObtained: 91, totalMarks: 100, grade: 'A1', remarks: 'Fluent expression and vocabulary' },
      { subject: 'Punjabi', marksObtained: 96, totalMarks: 100, grade: 'A1', remarks: 'Flawless grammar and spelling' },
      { subject: 'Social Science', marksObtained: 89, totalMarks: 100, grade: 'A2', remarks: 'Good analytical skills in history' }
    ],
    teacherRemarks: 'Guransh exhibits great dedication, exemplary classroom manners, and active curiosity.',
    principalRemarks: 'Outstanding scholastic performance. Keep shining and upholding Akal Galaxy virtues!'
  }
];

export const INITIAL_TEACHER_COMMENTS: TeacherComment[] = [
  {
    id: 'tc-01',
    teacherName: 'Mrs. Ravinder Kaur',
    subjectOrRole: 'Class Teacher (8-A)',
    date: '2026-10-25',
    category: 'achievement',
    comment: 'Guransh represented our school in the Inter-School Science Quiz and secured 2nd position for AGCS!',
    rating: 5
  },
  {
    id: 'tc-02',
    teacherName: 'Er. Sandeep Verma',
    subjectOrRole: 'Mathematics Teacher',
    date: '2026-10-18',
    category: 'academic',
    comment: 'Scored full marks in the weekly speed-maths Olympiad test. Very quick calculation technique.',
    rating: 5
  },
  {
    id: 'tc-03',
    teacherName: 'Coach Manmohan Singh',
    subjectOrRole: 'Physical Education / Sports',
    date: '2026-10-12',
    category: 'sports',
    comment: 'Selected as the vice-captain for Junior Athletics Relay. Displays high sportsmanship and discipline.',
    rating: 4
  }
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-01',
    title: 'Biometric Attendance: Present',
    message: 'Guransh Singh checked in at 08:08 AM today at Main Gate 1.',
    timestamp: '2026-10-27T08:08:12Z',
    type: 'attendance',
    read: false
  },
  {
    id: 'notif-02',
    title: 'Fee Reminder: Term 2 Fees Due',
    message: 'Term 2 tuition fee of ₹14,800 is due on 15 Nov 2026. Pay online to avoid late fees.',
    timestamp: '2026-10-26T10:00:00Z',
    type: 'fee',
    read: false
  },
  {
    id: 'notif-03',
    title: 'Leave Request Approved',
    message: 'Your leave application #LR-1014 for 15-16 Oct was approved by Admin Principal Desk.',
    timestamp: '2026-10-11T09:30:00Z',
    type: 'leave_status',
    read: true
  }
];
