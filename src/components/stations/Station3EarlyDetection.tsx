import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { NabdhMascot } from '../NabdhMascot.tsx';
import { Heart, CheckCircle2, ArrowLeft, Award, Sparkles, AlertCircle, ShieldCheck, Stethoscope } from 'lucide-react';
import { sound, toArabicNumerals } from '../../utils/numerals.ts';
import { DataService } from '../../services/dataService.ts';
import type { Student, Question, Attempt } from '../../types/index.ts';

interface Station3EarlyDetectionProps {
  student: Student;
  questions: Question[];
  onComplete: (attempt: Attempt, updatedStudent: Student, newBadge?: string) => void;
  onBackToMap: () => void;
}

export const Station3EarlyDetection: React.FC<Station3EarlyDetectionProps> = ({
  student,
  questions,
  onComplete,
  onBackToMap,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [activeFeedback, setActiveFeedback] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSelectAnswer = (question: Question, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    const isCorrect = question.correctAnswer === optionId;
    setActiveFeedback((prev) => ({ ...prev, [question.id]: true }));

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const handleFinishStation = async () => {
    setSubmitting(true);
    try {
      const answersPayload = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: userAnswers[q.id] || '',
      }));

      const result = await DataService.submitAttempt(student, 3, answersPayload, true);

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
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black">
            ٣
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800">محطة سفيرة الكشف المبكر</h2>
            <span className="text-xs text-sky-600 font-bold">الشارة: سفيرة الوعي 🩺</span>
          </div>
        </div>
      </div>

      {/* Intro Card with Nabdh */}
      <div className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-3xl p-6 border-2 border-sky-200 shadow-md mb-8 flex flex-col md:flex-row items-center gap-6">
        <NabdhMascot size="sm" showShield={true} />
        <div className="text-right space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>رسالة سفيرة الوعي الصحي</span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-sky-950">
            «الاطمئنان المبكر.. وعي وأمان»
          </h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            تذكري دومًا: العطش الشديد المتكرر وكثرة التبول والشعور بالإرهاق تستدعي إخبار ولي الأمر ومراجعة الطبيب. المختص الصحي وحده المؤهل للتشخيص والفحوصات، ومصادرنا دائمًا رسمية وموثوقة!
          </p>
        </div>
      </div>

      {/* Situations & Interactive Questions */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sky-200 shadow-lg space-y-6 text-right">
        <div>
          <h3 className="text-xl font-black text-slate-900">مواقف وتحديات سفيرة الكشف المبكر</h3>
          <p className="text-slate-600 text-xs md:text-sm mt-1">
            اختاري التصرف الصحيح في كل موقف، واكتشفي توجيه شخصية نبض فورًا:
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const currentSelected = userAnswers[q.id];
            const hasChosen = activeFeedback[q.id];
            const isCorrect = currentSelected === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border-2 transition ${
                  hasChosen
                    ? isCorrect
                      ? 'bg-sky-50/60 border-sky-300'
                      : 'bg-rose-50/60 border-rose-300'
                    : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5 mb-3">
                  <span className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {toArabicNumerals(idx + 1)}
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                    {q.questionText}
                  </h4>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = currentSelected === opt.id;
                    const isThisCorrect = opt.id === q.correctAnswer;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectAnswer(q, opt.id)}
                        className={`p-3.5 rounded-xl border-2 text-xs md:text-sm font-bold text-right transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                              : 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs'
                            : hasChosen && isThisCorrect
                            ? 'bg-emerald-50/50 border-emerald-400 text-emerald-900 border-dashed'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                        }`}
                      >
                        <span>{opt.text}</span>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'border-slate-300 text-slate-400'
                          }`}
                        >
                          {opt.id}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {hasChosen && (
                  <div
                    className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit */}
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
                : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-600/20 active:scale-95'
            }`}
          >
            <Award className="w-5 h-5 text-amber-300" />
            <span>{submitting ? 'جاري الاعتماد...' : 'اعتماد الإجابات واستلام شارة سفيرة الوعي ✨'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
