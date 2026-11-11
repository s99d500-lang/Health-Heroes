import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { NabdhMascot } from '../NabdhMascot.tsx';
import { Activity, CheckCircle2, ArrowLeft, Award, Sparkles, Flame, Zap, HeartPulse, RefreshCw } from 'lucide-react';
import { sound, toArabicNumerals } from '../../utils/numerals.ts';
import { DataService } from '../../services/dataService.ts';
import type { Student, Question, Attempt } from '../../types/index.ts';

interface Station4ActivityProps {
  student: Student;
  questions: Question[];
  onComplete: (attempt: Attempt, updatedStudent: Student, newBadge?: string) => void;
  onBackToMap: () => void;
}

export const Station4Activity: React.FC<Station4ActivityProps> = ({
  student,
  questions,
  onComplete,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'challenge' | 'quiz'>('challenge');
  const [energyScore, setEnergyScore] = useState(20);
  const [collectedItems, setCollectedItems] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Active items mini-game
  const energyItems = [
    { id: 'shoes', name: 'حذاء رياضي مريح', icon: '👟', points: 20, desc: 'حماية القدمين أثناء الجري' },
    { id: 'water', name: 'زجاجة ماء للترطيب', icon: '💧', points: 20, desc: 'تعويض السوائل والانتعاش' },
    { id: 'rope', name: 'حبل قفز نشيط', icon: '🪢', points: 20, desc: 'تقوية عضلة القلب والرشاقة' },
    { id: 'bike', name: 'دراجة هوائية آمنة', icon: '🚲', points: 20, desc: 'حركة ممتعة في الهواء الطلق' },
    { id: 'ball', name: 'كرة لعب جماعية', icon: '⚽', points: 20, desc: 'لعب نشيط مع الصديقات' },
  ];

  const handleCollectItem = (item: (typeof energyItems)[0]) => {
    if (collectedItems.includes(item.id)) return;
    sound.playCorrect();
    setCollectedItems((prev) => [...prev, item.id]);
    setEnergyScore((prev) => Math.min(100, prev + item.points));
  };

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    sound.playClick();
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
        4,
        answersPayload,
        energyScore >= 80
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
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-teal-950 flex items-center justify-center font-black">
            ٤
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800">محطة بطلة النشاط</h2>
            <span className="text-xs text-amber-600 font-bold">الشارة: بطلة النشاط 🏃‍♀️</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('challenge')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm border transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'challenge'
              ? 'bg-amber-500 text-teal-950 border-amber-500 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-600" />
          <span>١. تحدي طاقة النشاط البدني</span>
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
          <span>٢. أسئلة بطلة النشاط والنقاط</span>
        </button>
      </div>

      {/* Tab 1: Interactive Energy Challenge */}
      {activeTab === 'challenge' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-lg space-y-6 text-right">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-amber-950">تحدي بطلة النشاط الافتراضي</h3>
              <p className="text-slate-600 text-xs md:text-sm mt-1">
                اجمعي عناصر النشاط الرياضي لترفعي مؤشر الطاقة إلى ١٠٠٪ وتهزمي الخمول!
              </p>
            </div>

            {/* Energy Meter */}
            <div className="bg-amber-50 border-2 border-amber-300 px-5 py-3 rounded-2xl text-center shrink-0 min-w-[140px]">
              <div className="flex items-center justify-center gap-1.5 text-amber-700 font-extrabold text-xs mb-1">
                <Flame className="w-4 h-4 animate-bounce text-orange-500" />
                <span>مؤشر الحيوية</span>
              </div>
              <div className="text-2xl font-black text-amber-900">
                {toArabicNumerals(energyScore)}٪
              </div>
              <div className="w-full h-2.5 bg-amber-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${energyScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Golden Rules of Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-center">
              <span className="text-xl">👟</span>
              <div className="text-xs font-black text-teal-900 mt-1">١. السلامة أولاً</div>
              <div className="text-[10px] text-slate-600">ارتداء حذاء مناسب ومكان آمن</div>
            </div>
            <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-center">
              <span className="text-xl">💧</span>
              <div className="text-xs font-black text-cyan-900 mt-1">٢. شرب الماء</div>
              <div className="text-[10px] text-slate-600">الترطيب المستمر أثناء الحركة</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-xl">🛑</span>
              <div className="text-xs font-black text-emerald-900 mt-1">٣. الراحة عند التعب</div>
              <div className="text-[10px] text-slate-600">التوقف فورًا وإبلاغ المسؤول</div>
            </div>
          </div>

          {/* Interactive Energy Clickers */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-800">
              انقري على أدوات النشاط لإضافتها لحقيبة بطلة الصحة:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {energyItems.map((item) => {
                const isCollected = collectedItems.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCollectItem(item)}
                    disabled={isCollected}
                    className={`p-4 rounded-2xl border-2 text-right transition cursor-pointer flex items-center justify-between ${
                      isCollected
                        ? 'bg-emerald-50 border-emerald-400 opacity-90'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <div className="font-extrabold text-sm text-slate-800">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>

                    <div>
                      {isCollected ? (
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                          تم الجمع ✓
                        </span>
                      ) : (
                        <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                          +٢٠٪ طاقة
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-amber-800">
              {energyScore >= 100
                ? '🔥 رائع! بلغتِ الطاقة القصوى لبطلات الصحة (+١٠ نقاط)'
                : 'اجمعي الأدوات لتكتمل طاقتكِ'}
            </span>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('quiz');
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-teal-950 font-black text-sm md:text-base rounded-2xl shadow-md flex items-center gap-2 hover:shadow-lg transition cursor-pointer"
            >
              <span>المتابعة إلى أسئلة النشاط</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Graded Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-lg space-y-6 text-right">
          <div>
            <h3 className="text-xl font-black text-amber-950">أسئلة بطلة النشاط البدني</h3>
            <p className="text-slate-600 text-xs md:text-sm mt-1">
              أجيبي عن الأسئلة لتوثيق فهمكِ للنشاط الرياضي الآمن وحصد الشارة!
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const currentSelected = userAnswers[q.id];

              return (
                <div key={q.id} className="p-4 md:p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-amber-500 text-teal-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
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
                              ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'bg-amber-500 text-teal-950 border-amber-500'
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
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-teal-950 shadow-lg shadow-amber-500/20 active:scale-95'
              }`}
            >
              <Award className="w-5 h-5 text-teal-900" />
              <span>{submitting ? 'جاري الاعتماد...' : 'اعتماد الإجابات واستلام شارة بطلة النشاط ✨'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
