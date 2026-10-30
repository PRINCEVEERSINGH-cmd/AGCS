import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  IdCard,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const { user, student, completeOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    admissionNo: user?.admissionNo || student?.admissionNo || 'AGCS/2021/842',
    studentName: user?.studentName || student?.fullName || 'Guransh Singh',
    grade: user?.grade || student?.grade || '8th',
    section: user?.section || student?.section || 'A',
    parentName: user?.parentName || 'Jasbir Singh',
    relation: 'Father',
    emergencyContact: '+919812345678',
    city: 'Model Town, Punjab'
  });

  const [error, setError] = useState('');

  const nextStep = () => {
    setError('');

    // Step 1: Admission Number Demand Check
    if (step === 1) {
      const cleanAdm = formData.admissionNo.trim();
      if (!cleanAdm) {
        setError('Please enter your child’s official school Admission Number.');
        return;
      }
      if (cleanAdm.length < 3) {
        setError('Admission Number is too short. Please check your school fee booklet or ID card.');
        return;
      }
    }

    // Step 2: Student Name Check
    if (step === 2 && !formData.studentName.trim()) {
      setError('Please enter your child’s full name as per school records.');
      return;
    }

    // Step 4: Parent Name Check
    if (step === 4 && !formData.parentName.trim()) {
      setError('Please enter parent/guardian name.');
      return;
    }

    // Final Step 5: Completion
    if (step === 5) {
      completeOnboarding({
        admissionNo: formData.admissionNo.trim().toUpperCase(),
        studentName: formData.studentName.trim(),
        grade: formData.grade,
        section: formData.section,
        parentName: `${formData.parentName.trim()} (${formData.relation})`,
        emergencyContact: formData.emergencyContact.trim()
      });
      return;
    }

    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) {
      setError('');
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 py-10">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 relative overflow-hidden">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
            <span>Question {step} of {totalSteps}</span>
            <span className="text-blue-900 dark:text-blue-400 font-extrabold">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-900 to-amber-500 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Official Admission Number (DEMANDED ON REGISTRATION) */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <IdCard className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  Required School Credential
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                What is your child's official Admission Number?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Akal Galaxy Convent School requires the verified student Admission Number to link fee payments, attendance tracking, and school reports.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="admission-no" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                School Admission Number
              </label>
              <div className="relative">
                <input
                  id="admission-no"
                  type="text"
                  value={formData.admissionNo}
                  onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value.toUpperCase() })}
                  placeholder="e.g. AGCS/2021/842 or AGCS-2026-0814"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold tracking-wider focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Find this number printed on your child's school fee booklet, semester report card, or school identity card. (Demo default: <strong>AGCS/2021/842</strong>)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Child's Full Name */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                What is your child's full name?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Matches the official student registration for Admission No. <strong>{formData.admissionNo}</strong>.
              </p>
            </div>

            <div>
              <label htmlFor="student-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Child's Full Name (as per school admission register)
              </label>
              <input
                id="student-name"
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="e.g. Guransh Singh"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* STEP 3: Grade & Section */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Which class and section is {formData.studentName} in?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select from the active AGCS academic grades.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Grade / Class
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {['Nursery', 'KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(
                    (g) => (
                      <option key={g} value={g}>
                        Class {g}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Section
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {['A', 'B', 'C', 'D'].map((s) => (
                    <option key={s} value={s}>
                      Section {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Parent/Guardian Details */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                What is your name and relation?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Used on official leave applications and fee receipts.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Parent / Guardian Full Name
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="e.g. Jasbir Singh"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Relation to Student
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Father', 'Mother', 'Guardian'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, relation: r })}
                      className={`py-3 rounded-xl text-xs font-bold border transition ${
                        formData.relation === r
                          ? 'border-blue-900 bg-blue-900 text-white dark:border-blue-500 dark:bg-blue-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Emergency Contact & Locality */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Emergency contact and locality
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Required for school safety records and transport routing.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Secondary Emergency Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="+91 98123 45678"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Locality / City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Model Town, Punjab"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={nextStep}
            className="flex-1 max-w-[200px] py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            {step === totalSteps ? (
              <>
                <span>Complete Setup</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </>
            ) : (
              <>
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Persistence guarantee pill */}
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-4">
          🔒 Auto-saved to mobile <strong>{user?.phoneNumber}</strong> with Admission No. <strong>{formData.admissionNo}</strong>.
        </p>
      </div>
    </div>
  );
};
