import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { NabdhMascot } from '../NabdhMascot.tsx';
import { Home, CheckCircle2, ArrowLeft, Award, Sparkles, HeartHandshake, FileCheck, Check } from 'lucide-react';
import { sound, toArabicNumerals } from '../../utils/numerals.ts';
import { DataService } from '../../services/dataService.ts';
import type { Student, Question, Attempt } from '../../types/index.ts';

interface Station5HomeAmbassadorProps {
  student: Student;
  questions: Question[];
  onComplete: (attempt: Attempt, updatedStudent: Student, newBadge?: string) => void;
  onBackToMap: () => void;
}

export const Station5HomeAmbassador: React.FC<Station5HomeAmbassadorProps> = ({
  student,
  questions,
  onComplete,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'pledge' | 'quiz'>('pledge');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const defaultPledgeText =
    'أتعهد أن أكون سفيرة للوعي الصحي في منزلي ومدرستي، وأن أشارك أسرتي العادات الصحية والمعلومات الموثوقة، وأدعم زميلاتي بكل محبة واحترام.';

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    sound.playClick();
  };

  const handleAcceptPledge = () => {
    sound.playCorrect();
    setPledgeAccepted(true);
  };

  const handleFinishStation = async () => {
    setSubmitting(true);
    try {
      const answersPayload = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: userAnswers[q.id] || '',
      }));

      const result = await DataService.submitAttempt(
        student,
        5,
        answersPayload,
        pledgeAccepted
      );

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      sound.playBadge();
      onComplete(result.attempt, result.updatedStudent, result.newBadge);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-bold text-sm bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة للخريطة</span>
        </button>

        <div className="flex items-center gap-2 text-right">
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black">
            ٥
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800">محطة سفيرة الصحة في منزلي</h2>
            <span className="text-xs text-rose-600 font-bold">الشارة: سفيرة الأسرة 🏡</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('pledge')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm border transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'pledge'
              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>١. بطاقة التعهد الصحي لسفيرة الأسرة</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm border transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>٢. أسئلة سفيرة الأسرة والنقاط</span>
        </button>
      </div>

      {/* Tab 1: Health Pledge Card */}
      {activeTab === 'pledge' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-rose-200 shadow-lg space-y-6 text-right">
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-rose-100 pb-4">
            <NabdhMascot size="sm" showShield={true} />
            <div>
              <h3 className="text-xl font-black text-rose-950">التعهد الصحي لسفيرة المنزل والمجتمع</h3>
              <p className="text-slate-600 text-xs md:text-sm mt-1">
                سفيرة الصحة تنشر المحبة والعادات الجميلة في بيتها: شرب الماء، تقليل السكريات، الحركة الأسرية، ومساندة الزميلات المصابات بالسكري دون لوم أو تنمر.
              </p>
            </div>
          </div>

          {/* Decorative Pledge Certificate Preview */}
          <div className="relative bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 rounded-3xl p-6 md:p-8 border-3 border-rose-300 shadow-inner space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                <span>ميثاق شرف بطلة الوعي الصحي</span>
              </span>
              <span className="text-xs font-extrabold text-teal-800">
                المدرسة الابتدائية ٣١١
              </span>
            </div>

            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 bg-rose-100 border-2 border-rose-300 rounded-full mx-auto flex items-center justify-center text-2xl">
                🌸
              </div>
              <h4 className="text-lg md:text-xl font-black text-slate-800">
                أنا الطالبة البطلة: <span className="text-teal-800">{student.fullName}</span>
              </h4>
              <p className="text-base md:text-lg font-bold text-rose-950 max-w-xl mx-auto leading-relaxed bg-white/80 p-4 rounded-2xl border border-rose-200 shadow-2xs">
                «{defaultPledgeText}»
              </p>
            </div>

            {/* Accept Pledge Button */}
            <div className="pt-2 flex justify-center">
              {!pledgeAccepted ? (
                <button
                  onClick={handleAcceptPledge}
                  className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-base rounded-2xl shadow-md transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>أوافق وأتعهد بأن أكون سفيرة للصحة (+١٠ نقاط)</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-6 py-2.5 rounded-2xl font-black text-sm border border-emerald-300 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>تم اعتماد تعهدكِ الصحي بنجاح يا سفيرة الوعي!</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('quiz');
              }}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-extrabold text-sm md:text-base rounded-2xl shadow-md flex items-center gap-2 hover:shadow-lg transition cursor-pointer"
            >
              <span>المتابعة إلى أسئلة سفيرة الأسرة</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Graded Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-rose-200 shadow-lg space-y-6 text-right">
          <div>
            <h3 className="text-xl font-black text-rose-950">أسئلة سفيرة الصحة في منزلي</h3>
            <p className="text-slate-600 text-xs md:text-sm mt-1">
              أجيبي عن الأسئلة لتأكيد دوركِ الريادي في محيطكِ الأسري والمدرسي!
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const currentSelected = userAnswers[q.id];

              return (
                <div key={q.id} className="p-4 md:p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {toArabicNumerals(idx + 1)}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                      {q.questionText}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt) => {
                      const isSelected = currentSelected === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, opt.id)}
                          className={`p-3 rounded-xl border-2 text-xs md:text-sm font-bold text-right transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-rose-50 border-rose-600 text-rose-950 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300'
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'border-slate-300 text-slate-400'
                            }`}
                          >
                            {opt.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-bold">
              تم الإجابة عن: {toArabicNumerals(Object.keys(userAnswers).length)} من {toArabicNumerals(questions.length)} أسئلة
            </div>

            <button
              onClick={handleFinishStation}
              disabled={submitting || Object.keys(userAnswers).length === 0}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition cursor-pointer ${
                submitting || Object.keys(userAnswers).length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-600/20 active:scale-95'
              }`}
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>{submitting ? 'جاري الاعتماد...' : 'اعتماد الإجابات واستلام شارة سفيرة الأسرة ✨'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
