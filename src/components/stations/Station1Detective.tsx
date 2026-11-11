import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { NabdhMascot } from '../NabdhMascot.tsx';
import { Search, CheckCircle2, XCircle, ArrowLeft, Award, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';
import { sound, toArabicNumerals } from '../../utils/numerals.ts';
import { DataService } from '../../services/dataService.ts';
import type { Student, Question, Attempt } from '../../types/index.ts';

interface Station1DetectiveProps {
  student: Student;
  questions: Question[];
  onComplete: (attempt: Attempt, updatedStudent: Student, newBadge?: string) => void;
  onBackToMap: () => void;
}

export const Station1Detective: React.FC<Station1DetectiveProps> = ({
  student,
  questions,
  onComplete,
  onBackToMap,
}) => {
  // 1. Fact Sorting Mini-Activity items
  const [factCards, setFactCards] = useState([
    {
      id: 'f1',
      text: 'البنكرياس هو العضو الذي يفرز هرمون الإنسولين في الجسم.',
      isCorrect: true,
      userAnswer: null as boolean | null,
      explanation: 'صحيح! البنكرياس يفرز الإنسولين لمساعدة الخلايا على امتصاص السكر.',
    },
    {
      id: 'f2',
      text: 'مرض السكري من النوع الأول ينتج فقط بسبب تناول الكثير من الحلوى.',
      isCorrect: false,
      userAnswer: null as boolean | null,
      explanation: 'غير صحيح! النوع الأول حالة مناعية ولا يحدث بسبب تناول الحلويات.',
    },
    {
      id: 'f3',
      text: 'يمكن لنمط الحياة الصحي والنشاط البدني تقليل مخاطر النوع الثاني.',
      isCorrect: true,
      userAnswer: null as boolean | null,
      explanation: 'صحيح! الغذاء المتوازن والحركة يساعدان بشكل كبير في الوقاية.',
    },
    {
      id: 'f4',
      text: 'مرض السكري مرض معدٍ ينتقل باللمس أو المصافحة.',
      isCorrect: false,
      userAnswer: null as boolean | null,
      explanation: 'غير صحيح! السكري غير معدٍ على الإطلاق.',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'learn' | 'activity' | 'quiz'>('learn');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const allFactsAnswered = factCards.every((f) => f.userAnswer !== null);

  const handleFactChoice = (cardId: string, choice: boolean) => {
    setFactCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const isRight = card.isCorrect === choice;
          if (isRight) {
            sound.playCorrect();
          } else {
            sound.playWrong();
          }
          return { ...card, userAnswer: choice };
        }
        return card;
      })
    );
  };

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    if (submittedAnswers[questionId]) return;
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

      const result = await DataService.submitAttempt(student, 1, answersPayload, allFactsAnswered);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      sound.playBadge();
      setIsCompleted(true);
      onComplete(result.attempt, result.updatedStudent, result.newBadge);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
      {/* Station Navigation Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-bold text-sm bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة لخريطة المغامرة</span>
        </button>

        <div className="flex items-center gap-2 text-right">
          <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-black">
            ١
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800">محطة محققة الصحة</h2>
            <span className="text-xs text-teal-600 font-bold">الشارة: محققة الصحة 🔍</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm border transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'learn'
              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>١. الدليل التعليمي للمحققة</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm border transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'activity'
              ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-cyan-50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>٢. فرز الحقائق والخرافات</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs md:text-sm border transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-teal-950 border-amber-500 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>٣. اختبار التحدي والنقاط</span>
        </button>
      </div>

      {/* Tab 1: Educational Dossier */}
      {activeTab === 'learn' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-teal-200 shadow-lg space-y-6 text-right">
          <div className="flex items-center gap-3 border-b border-teal-100 pb-4">
            <NabdhMascot size="sm" showShield={true} />
            <div>
              <h3 className="text-xl font-black text-teal-900">أهلاً بكِ في مختبر محققة الصحة!</h3>
              <p className="text-slate-600 text-xs md:text-sm">
                اقرئي هذه الحقائق العلمية لتكوني جاهزة لحل التحديات وكسب الشارة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200">
              <span className="text-2xl mb-1 block">🩺</span>
              <h4 className="font-extrabold text-teal-900 text-sm mb-1">ما هو السكري؟</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                السكري حالة صحية تؤثر في تنظيم مستوى السكر (الجلوكوز) في الدم نتيجة نقص في إفراز هرمون الإنسولين أو استجابة الجسم له.
              </p>
            </div>

            <div className="bg-cyan-50/70 p-4 rounded-2xl border border-cyan-200">
              <span className="text-2xl mb-1 block">🔑</span>
              <h4 className="font-extrabold text-cyan-900 text-sm mb-1">دور البنكرياس والإنسولين</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                البنكرياس عضو حيوي يفرز «الإنسولين»، وهو مثل المفتاح السحري الذي يسمح للسكر بدخول الخلايا ليمدنا بالطاقة للتعلم واللعب.
              </p>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
              <span className="text-2xl mb-1 block">🛡️</span>
              <h4 className="font-extrabold text-emerald-900 text-sm mb-1">النوع الأول والنوع الثاني</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                النوع الأول حالة مناعية ذاتية لا تحدث بسبب الحلويات، بينما النوع الثاني يمكن تقليل مخاطره باتباع نمط حياة صحي وغذاء متوازن وحركة دائمة.
              </p>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <span className="text-2xl mb-1 block">🏥</span>
              <h4 className="font-extrabold text-amber-900 text-sm mb-1">الرعاية الطبية والاطمئنان</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                المتابعة مع الطبيب المختص تمكّن بطلات السكري من عيش حياة طبيعية مليئة بالحيوية والنجاح المدرسي.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('activity');
              }}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-extrabold text-sm md:text-base rounded-2xl shadow-md flex items-center gap-2 hover:shadow-lg transition cursor-pointer"
            >
              <span>انتقلي إلى تحدي فرز الحقائق</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Fact / Myth Sorting */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-teal-200 shadow-lg space-y-6 text-right">
          <div>
            <h3 className="text-xl font-black text-teal-900">تحدي المحققة الذكية: حقائق أم خرافات؟</h3>
            <p className="text-slate-600 text-xs md:text-sm mt-1">
              صنفي كل بطاقة باختيار «معلومة صحيحة» أو «معلومة غير صحيحة» لاكتشاف التفسير العلمي.
            </p>
          </div>

          <div className="space-y-4">
            {factCards.map((card, idx) => {
              const isAnswered = card.userAnswer !== null;
              const isCorrectSelection = card.userAnswer === card.isCorrect;

              return (
                <div
                  key={card.id}
                  className={`p-4 rounded-2xl border-2 transition ${
                    !isAnswered
                      ? 'bg-slate-50 border-slate-200'
                      : isCorrectSelection
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-rose-50/70 border-rose-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {toArabicNumerals(idx + 1)}
                    </span>
                    <p className="font-extrabold text-slate-800 text-sm md:text-base flex-1">
                      {card.text}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 mt-3 justify-end">
                    <button
                      onClick={() => handleFactChoice(card.id, true)}
                      className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black border transition cursor-pointer flex items-center gap-1.5 ${
                        card.userAnswer === true
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>معلومة صحيحة</span>
                    </button>

                    <button
                      onClick={() => handleFactChoice(card.id, false)}
                      className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black border transition cursor-pointer flex items-center gap-1.5 ${
                        card.userAnswer === false
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-rose-300'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>معلومة غير صحيحة</span>
                    </button>
                  </div>

                  {/* Feedback Explanation */}
                  {isAnswered && (
                    <div
                      className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        isCorrectSelection
                          ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-100/70 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {isCorrectSelection ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{card.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-teal-700 font-bold">
              {allFactsAnswered ? '✨ أحسنتِ! تم إكمال فحص جميع البطاقات (+١٠ نقاط)' : 'صنفي جميع البطاقات للتقدم'}
            </span>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('quiz');
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-teal-950 font-black text-sm md:text-base rounded-2xl shadow-md flex items-center gap-2 hover:shadow-lg transition cursor-pointer"
            >
              <span>المتابعة إلى أسئلة الاختبار</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Graded Questions */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-teal-200 shadow-lg space-y-6 text-right">
          <div>
            <h3 className="text-xl font-black text-teal-900">أسئلة تحدي محققة الصحة</h3>
            <p className="text-slate-600 text-xs md:text-sm mt-1">
              أجيبي عن الأسئلة التالية للحصول على ٥ نقاط لكل إجابة صحيحة وشارة المحطة الرسمية!
            </p>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const currentSelected = userAnswers[q.id];

              return (
                <div key={q.id} className="p-4 md:p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {toArabicNumerals(idx + 1)}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base">
                      {q.questionText}
                    </h4>
                  </div>

                  {/* Options */}
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
                              ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300'
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'bg-teal-600 text-white border-teal-600'
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

          {/* Complete Button */}
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
                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-600/20 active:scale-95'
              }`}
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>{submitting ? 'جاري اعتماد النتيجة...' : 'اعتماد الإجابات واستلام الشارة ✨'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
