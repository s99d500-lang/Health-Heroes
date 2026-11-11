import React, { useState } from 'react';
import { NabdhMascot } from './NabdhMascot.tsx';
import { User, Sparkles, BookOpen, Layers, ArrowLeft, Check } from 'lucide-react';
import { sound, getGradeLabel } from '../utils/numerals.ts';
import { DataService } from '../services/dataService.ts';
import type { Student, GradeNumber } from '../types/index.ts';

interface RegistrationViewProps {
  onRegisterSuccess: (student: Student) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState<GradeNumber>(3);
  const [className, setClassName] = useState('١');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parts = fullName.trim().split(/\s+/);
    if (parts.length < 3) {
      setError('لطفًا يا بطلة، يرجى كتابة اسمكِ الثلاثي كاملاً (ثلاث كلمات على الأقل)');
      sound.playWrong();
      return;
    }

    if (!className.trim()) {
      setError('يرجى تحديد الفصل الدراسي (مثل: ١، أ، ب)');
      sound.playWrong();
      return;
    }

    setLoading(true);
    try {
      const student = await DataService.registerStudent(fullName, grade, className);
      sound.playCorrect();
      setRegisteredStudent(student);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ، يرجى المحاولة ثانية');
      sound.playWrong();
    } finally {
      setLoading(false);
    }
  };

  const handleStartAdventure = () => {
    if (registeredStudent) {
      sound.playClick();
      onRegisterSuccess(registeredStudent);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-1 rounded-full text-teal-800 text-xs md:text-sm font-bold mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>الخطوة الأولى للرحلة</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-teal-900">
          هيا نتعرف عليكِ يا بطلة الصحة
        </h2>
        <p className="text-slate-600 text-sm md:text-base mt-1">
          سجّلي بياناتكِ لتحصلي على شارات الإنجاز وبطاقة سفيرة الصحة المعتمدة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Mascot on Right (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center order-2 md:order-1">
          <NabdhMascot
            size="lg"
            message={
              registeredStudent
                ? `مرحبًا بكِ يا ${registeredStudent.fullName.split(' ')[0]} يا بطلة الصحة! استعدي لمغامرتكِ!`
                : 'اكتبي اسمكِ الجميل لنبدأ التحديات معًا!'
            }
            mood={registeredStudent ? 'excited' : 'happy'}
          />
        </div>

        {/* Registration Card (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 md:p-8 border-2 border-teal-200 shadow-xl order-1 md:order-2">
          {!registeredStudent ? (
            <form onSubmit={handleSubmit} className="space-y-5 text-right">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-black text-teal-900 mb-1.5 flex items-center justify-between">
                  <span>الاسم الثلاثي:</span>
                  <span className="text-xs text-slate-400 font-normal">(مثال: سارة محمد القحطاني)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="اكتبي اسمكِ الثلاثي هنا..."
                    required
                    className="w-full px-4 py-3 bg-teal-50/40 border-2 border-teal-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  />
                  <User className="absolute left-3.5 top-3.5 w-5 h-5 text-teal-500 pointer-events-none" />
                </div>
              </div>

              {/* Grade Selector (1 to 6) */}
              <div>
                <label className="block text-sm font-black text-teal-900 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span>الصف الدراسي:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGrade(g as GradeNumber)}
                      className={`p-2.5 rounded-xl border text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
                        grade === g
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-teal-600 shadow-sm scale-102'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/50'
                      }`}
                    >
                      {getGradeLabel(g)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class Selector */}
              <div>
                <label className="block text-sm font-black text-teal-900 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>الفصل:</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['١', '٢', '٣', '٤', 'أ', 'ب', 'ج', 'د'].map((cls) => (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => setClassName(cls)}
                      className={`w-11 h-11 rounded-xl font-black text-sm border transition cursor-pointer ${
                        className === cls
                          ? 'bg-amber-400 border-amber-500 text-teal-950 shadow-sm scale-105'
                          : 'bg-teal-50/60 border-teal-200 text-teal-800 hover:bg-teal-100'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="فصل آخر"
                    className="flex-1 min-w-[90px] px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-md transition transform hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                {loading ? 'جاري تسجيل بطلة الصحة...' : 'تأكيد التسجيل والمتابعة ✨'}
              </button>
            </form>
          ) : (
            // Success Confirmation Card
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-600 shadow-md">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-teal-900">
                  مرحبًا بكِ يا {registeredStudent.fullName}!
                </h3>
                <p className="text-teal-700 font-bold mt-1">
                  «مرحبًا بكِ يا بطلة الصحة، استعدي لمغامرتكِ!»
                </p>
                <div className="mt-3 inline-flex items-center gap-3 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-200 text-xs text-teal-800 font-bold">
                  <span>{getGradeLabel(registeredStudent.grade)}</span>
                  <span>•</span>
                  <span>فصل {registeredStudent.className}</span>
                </div>
              </div>

              <button
                onClick={handleStartAdventure}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-teal-950 font-black text-lg md:text-xl rounded-2xl shadow-lg shadow-amber-500/25 border-2 border-white flex items-center justify-center gap-2 transform transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>ابدئي المغامرة</span>
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
