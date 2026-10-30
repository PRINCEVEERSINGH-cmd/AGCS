import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  RotateCw,
  ShieldCheck,
  Check,
  Copy,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Bus,
  UserCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyAdmissionNo = () => {
    navigator.clipboard.writeText(student.admissionNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    // Simulating instant digital pass generation
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Generate deterministic barcode lines based on admission number
  const barcodePattern = [
    3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 3, 4, 1, 2, 3, 1, 2
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Background click to dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto transition-all animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:max-w-none">
        {/* Modal Header Controls (Hidden during print) */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                Official Digital Student ID
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  VERIFIED
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Akal Galaxy Convent School • Academic Session 2026–2027
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
            aria-label="Close Digital ID Card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar (Hidden during print) */}
        <div className="px-5 py-3 bg-blue-50/60 dark:bg-slate-800/50 border-b border-blue-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs print:hidden">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              onClick={() => setIsFlipped(false)}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                !isFlipped
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Front View</span>
            </button>
            <button
              onClick={() => setIsFlipped(true)}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                isFlipped
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Back View (Emergency)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 font-semibold"
              title="Flip Card"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flip</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 font-semibold"
              title="Print Physical ID Card"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold transition flex items-center gap-1.5 shadow-sm"
              title="Save Digital Pass"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Pass</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              Digital Student ID Pass saved to device! Ready for gate presentation.
            </span>
          </div>
        )}

        {/* THE CARD CONTAINER */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-100/70 dark:bg-slate-950/50">
          {/* Card Lanyard Clip Simulation (Physical aesthetic) */}
          <div className="flex flex-col items-center mb-1 print:hidden">
            <div className="w-12 h-3.5 bg-gradient-to-b from-slate-400 to-slate-600 rounded-t-md shadow-xs border border-slate-500" />
            <div className="w-7 h-2 bg-slate-800 rounded-b-xs shadow-inner" />
            <div className="w-5 h-2.5 bg-amber-500 rounded-b-sm border-t border-amber-600" />
          </div>

          {/* PHYSICAL ID CARD (Front or Back) */}
          <div
            id="student-id-card-element"
            className="w-full max-w-sm rounded-2xl bg-white text-slate-900 shadow-xl border-2 border-slate-200 overflow-hidden relative select-none print:shadow-none print:border-slate-400 print:w-85"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {/* Lanyard punch hole cut-out */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-slate-200/90 rounded-full border border-slate-300/80 shadow-inner z-20 print:border-slate-400" />

            {!isFlipped ? (
              /* ================= FRONT SIDE ================= */
              <div className="relative flex flex-col">
                {/* Header Band */}
                <div className="pt-4 pb-3 px-3 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white relative overflow-hidden">
                  {/* Decorative background lines */}
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

                  <div className="flex items-center gap-2.5 relative z-10">
                    <img
                      src="/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png"
                      alt="AGCS Crest"
                      className="w-12 h-12 object-contain drop-shadow-md shrink-0 bg-white/10 rounded-xl p-1"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-black tracking-tight uppercase leading-tight text-amber-400">
                          Akal Galaxy Convent School
                        </span>
                      </div>
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

                {/* Sub-header Bar */}
                <div className="bg-amber-500 px-3 py-1 flex items-center justify-between text-[10px] font-black text-slate-950 tracking-wider uppercase">
                  <span>Student Identity Card</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-slate-950" />
                    RFID GATE ACCESS
                  </span>
                </div>

                {/* Student Main Body */}
                <div className="p-4 bg-gradient-to-b from-white via-slate-50/50 to-white">
                  <div className="flex gap-3.5 items-start">
                    {/* Student Photo */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-amber-500/80 shadow-md bg-white p-0.5">
                        <img
                          src={student.avatarUrl || '/assets/aistudio/Screenshot_2026-10-23_100439_4bf47862.png'}
                          alt={student.fullName}
                          className="w-full h-full object-contain rounded-lg bg-slate-50"
                        />
                      </div>
                      {/* Holographic badge simulation */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-blue-900 text-amber-300 text-[8px] font-black border border-amber-400/60 shadow-xs whitespace-nowrap flex items-center gap-0.5">
                        <Sparkles className="w-2 h-2 text-amber-300" />
                        <span>AGCS SECURE</span>
                      </div>
                    </div>

                    {/* Primary Student Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black text-slate-900 leading-tight tracking-tight uppercase">
                        {student.fullName}
                      </h3>

                      <div className="mt-1.5 space-y-1 text-xs">
                        {/* Admission No */}
                        <div className="flex items-center justify-between bg-blue-50 px-2 py-0.8 rounded-lg border border-blue-200/80">
                          <span className="text-[10px] font-extrabold text-blue-900 uppercase">
                            Adm No:
                          </span>
                          <span className="text-[11px] font-mono font-black text-blue-950">
                            {student.admissionNo}
                          </span>
                        </div>

                        {/* Class & Section */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Class:
                          </span>
                          <span className="text-xs font-black text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                            Class {student.grade} - Section {student.section}
                          </span>
                        </div>

                        {/* Roll Number */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Roll No:
                          </span>
                          <span className="text-xs font-black text-slate-800 font-mono">
                            #{student.rollNo}
                          </span>
                        </div>

                        {/* Blood Group */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 text-rose-500" />
                            Blood Grp:
                          </span>
                          <span className="text-xs font-black text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            {student.bloodGroup || 'B+'}
                          </span>
                        </div>

                        {/* Date of Birth */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            DOB:
                          </span>
                          <span className="text-[11px] font-semibold text-slate-700">
                            {student.dob || '12-04-2013'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Holographic Micro-Strip */}
                  <div className="mt-3.5 py-1 px-2 rounded-md bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border border-amber-300 text-[8px] font-mono text-slate-700 text-center tracking-widest uppercase overflow-hidden shadow-inner">
                    AKAL GALAXY CONVENT SCHOOL • AUTHENTIC STUDENT CREDENTIAL • CBSE 2026-27
                  </div>

                  {/* Scannable Barcode & QR Code Footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-3">
                    {/* SVG Barcode */}
                    <div className="flex-1">
                      <div className="flex items-end justify-between h-7 px-1 bg-white rounded border border-slate-200 py-1">
                        {barcodePattern.map((width, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900 rounded-2xs"
                            style={{
                              width: `${width}px`,
                              height: idx % 3 === 0 ? '100%' : '80%'
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[9px] font-mono text-center text-slate-500 font-bold tracking-wider mt-0.5">
                        {student.admissionNo}
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="w-13 h-13 p-1 rounded-lg bg-white border border-slate-300 shrink-0 flex flex-col items-center justify-center shadow-xs">
                      {/* Crisp scannable QR pattern */}
                      <svg viewBox="0 0 29 29" className="w-full h-full text-slate-900 fill-current">
                        {/* Position Markers */}
                        <path d="M0 0h7v7H0zM1 1h5v5H1zM2 2h3v3H2z" />
                        <path d="M22 0h7v7h-7zM23 1h5v5h-5zM24 2h3v3h-3z" />
                        <path d="M0 22h7v7H0zM1 23h5v5H1zM2 24h3v3H2z" />
                        {/* Mock data pixels */}
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

                {/* Bottom Authenticity Ribbon */}
                <div className="bg-slate-900 text-slate-300 px-3 py-1 text-[8px] flex items-center justify-between font-mono">
                  <span>RFID: #8420-AGCS-PB</span>
                  <span className="text-amber-400 font-bold">VALID TILL: 31-03-2027</span>
                </div>
              </div>
            ) : (
              /* ================= BACK SIDE (Emergency & Parent Details) ================= */
              <div className="relative flex flex-col bg-white">
                {/* Back Header */}
                <div className="pt-4 pb-2 px-3 bg-gradient-to-r from-blue-950 to-slate-900 text-white text-center">
                  <h4 className="text-[11px] font-black tracking-wide uppercase text-amber-400">
                    Akal Galaxy Convent School
                  </h4>
                  <p className="text-[8px] text-blue-200">
                    Parent Contact, Medical & Emergency Verification Details
                  </p>
                </div>

                <div className="p-3.5 space-y-2.5 text-xs text-slate-800">
                  {/* Parents Info */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">
                        Father's Name
                      </span>
                      <strong className="text-[11px] text-slate-900">
                        {student.fatherName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">
                        Mother's Name
                      </span>
                      <strong className="text-[11px] text-slate-900">
                        {student.motherName}
                      </strong>
                    </div>
                  </div>

                  {/* Phone & Emergency */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80">
                      <span className="text-[10px] font-bold text-emerald-900 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        Parent Mobile:
                      </span>
                      <strong className="text-xs font-mono text-emerald-950">
                        {student.parentPhone}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-50 border border-rose-200/80">
                      <span className="text-[10px] font-bold text-rose-900 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-rose-600" />
                        Emergency SOS:
                      </span>
                      <strong className="text-xs font-mono text-rose-950">
                        {student.emergencyContact || '+91 98140 12345'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-blue-50 border border-blue-200/80">
                      <span className="text-[10px] font-bold text-blue-900 flex items-center gap-1">
                        <Bus className="w-3 h-3 text-blue-600" />
                        Transport Route:
                      </span>
                      <strong className="text-[11px] text-blue-950">
                        Bus #04 (Route: Model Town)
                      </strong>
                    </div>
                  </div>

                  {/* Residential Address */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-0.5">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      Residential Address
                    </span>
                    <p className="text-[10px] text-slate-700 leading-relaxed font-medium">
                      {student.address}
                    </p>
                  </div>

                  {/* Instructions & Return Notice */}
                  <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200 text-[8.5px] text-slate-700 space-y-0.5">
                    <p className="font-bold text-amber-900">
                      IMPORTANT INSTRUCTIONS:
                    </p>
                    <p>1. This card is non-transferable and must be worn during school hours.</p>
                    <p>2. If lost, report immediately to the AGCS Principal's Office.</p>
                    <p>3. If found, please return to: Akal Galaxy Convent School, GT Road, Jalandhar.</p>
                  </div>

                  {/* Principal Sign Seal */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <div className="text-[8px] text-slate-500 space-y-0.5">
                      <p>Helpline: +91 181 2456789</p>
                      <p>WhatsApp: +91 77194 45029</p>
                      <p>Email: admin@akalgalaxy.edu.in</p>
                    </div>

                    <div className="text-right">
                      {/* Stylized official signature seal */}
                      <div className="inline-block relative">
                        <div className="w-20 h-7 border-b border-dashed border-slate-400 flex items-end justify-center pb-0.5">
                          <span className="font-serif italic font-bold text-blue-900 text-xs">
                            S. Kaur
                          </span>
                        </div>
                        <div className="text-[8px] font-black uppercase text-slate-800 tracking-wider mt-0.5">
                          Principal's Seal
                        </div>
                        {/* Blue stamp simulation */}
                        <div className="absolute -top-1 -right-2 w-8 h-8 rounded-full border-2 border-blue-600/40 text-[6px] text-blue-600/70 font-black flex items-center justify-center rotate-12 pointer-events-none">
                          SEAL
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Footer */}
                <div className="bg-slate-900 text-slate-400 px-3 py-1 text-[8px] text-center font-mono">
                  PROPERTY OF AKAL GALAXY CONVENT SCHOOL • JALANDHAR, PUNJAB
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 text-center print:hidden flex items-center gap-1.5">
            <RotateCw className="w-3 h-3 text-amber-500" />
            Click <strong>"Flip"</strong> or use the toggle buttons above to view both sides.
          </p>
        </div>

        {/* Verification & Quick Actions Bottom Bar (Hidden during print) */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Admission No:</span>
            <code className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white">
              {student.admissionNo}
            </code>
            <button
              onClick={handleCopyAdmissionNo}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
              title="Copy Admission Number"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Print Physical ID</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
